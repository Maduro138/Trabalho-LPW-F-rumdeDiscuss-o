// server.js (versão corrigida)
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require("jsonwebtoken");

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { exec } = require("child_process");

const app = express();
const db = new sqlite3.Database('./database.db');

// parse json
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// serve arquivos estáticos (coloque seu front em /public)
app.use(express.static("public"));

// ================= Banco (mesmo que antes) =================
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    senha TEXT,
    role TEXT DEFAULT 'user'
)`);

db.run(`CREATE TABLE IF NOT EXISTS topicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    conteudo TEXT,
    autor TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

db.run(`CREATE TABLE IF NOT EXISTS respostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topico_id INTEGER,
    autor TEXT,
    conteudo TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topico_id) REFERENCES topicos(id)
)`);

// ================= Rotas de usuário / auth =================
app.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).send('Preencha todos os campos');

    try {
        const hash = await bcrypt.hash(senha, 10);
        db.run('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hash], function(err) {
            if (err) return res.status(400).send('Usuário já existe');
            res.send('Cadastro feito com sucesso!');
        });
    } catch (err) {
        res.status(500).send('Erro no servidor');
    }
});

const SECRET = "segredoSuperSeguro123";

app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    db.get("SELECT * FROM usuarios WHERE email = ?", [email], (err, row) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (!row) return res.status(401).json({ erro: "Usuário não encontrado" });

        bcrypt.compare(senha, row.senha, (_err, resultado) => {
            if (!resultado) return res.status(401).json({ erro: "Senha inválida" });

            const token = jwt.sign({ id: row.id, email: row.email, role: row.role }, SECRET, {
                expiresIn: "2h"
            });

            res.json({
                mensagem: "Login OK",
                token: token,
                nome: row.nome,
                role: row.role
            });
        });
    });
});

// ================= Fórum (suas rotas) =================
app.post('/topicos', (req, res) => {
    const { titulo, conteudo, autor } = req.body;

    db.run(`INSERT INTO topicos (titulo, conteudo, autor) VALUES (?, ?, ?)`,
    [titulo, conteudo, autor],
    function(err){
        if(err) return res.json({erro: err.message});
        res.json({status: "ok", id: this.lastID});
    });
});

app.get('/topicos', (_req, res) => {
    db.all(`SELECT id, titulo, autor, data_criacao FROM topicos ORDER BY id DESC`, [], (err, rows)=>{
        if(err) return res.json({erro: err.message});
        res.json(rows);
    });
});

app.get('/topicos/:id', (req, res) => {
    const topico_id = req.params.id;

    db.get(`SELECT * FROM topicos WHERE id = ?`, [topico_id], (err, topico)=>{
        if(err) return res.json({erro: err.message});
        if(!topico) return res.json({erro: "tópico não encontrado"});

        db.all(`SELECT * FROM respostas WHERE topico_id = ? ORDER BY id DESC`, [topico_id], (err, respostas)=>{
            if(err) return res.json({erro: err.message});
            res.json({topico, respostas});
        });
    });
});

app.post('/respostas', (req, res) => {
    const { topico_id, autor, conteudo } = req.body;

    db.run(`INSERT INTO respostas (topico_id, autor, conteudo) VALUES (?, ?, ?)`,
    [topico_id, autor, conteudo],
    function(err){
        if(err) return res.json({erro: err.message});
        res.json({status: "ok", id: this.lastID});
    });
});

// ================ Admin helpers (mantive sua lógica) =================
function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ erro: 'Token inválido' });
        req.user = user;
        next();
    });
}

function somenteAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ erro: "Apenas administradores podem acessar" });
    next();
}

app.get('/usuarios', autenticarToken, somenteAdmin, (_req, res) => {
    db.all("SELECT id, nome, email, role FROM usuarios", (err, rows) => {
        if (err) return res.status(500).send("Erro ao buscar usuários");
        res.json(rows);
    });
});

app.delete('/usuario/:id', autenticarToken, somenteAdmin, (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM usuarios WHERE id = ?", [id], function(err){
        if(err) return res.status(500).send("Erro ao deletar usuário");
        if(this.changes === 0) return res.status(404).send("Usuário não encontrado");
        res.send("Usuário apagado com sucesso!");
    });
});

// ================= COMPILADOR C (rota /run integrada) =================

// Observações:
// - Nós montamos a pasta temp/ e montamos ela como volume no docker.
// - Assim evitamos problemas de montar um único arquivo.
// - A resposta retorna stdout + mensagens de compilação/exec quando houver.
app.post("/run", (req, res) => {
    const codigo = req.body.code || req.body.codigo; // aceita 'code' ou 'codigo'
    if (!codigo) return res.status(400).json({ error: "Código vazio." });

    const id = crypto.randomBytes(8).toString("hex");
    const pastaTemp = path.join(process.cwd(), "temp");
    if (!fs.existsSync(pastaTemp)) fs.mkdirSync(pastaTemp, { recursive: true });

    const fileC = path.join(pastaTemp, `${id}.c`);
    const fileOut = path.join(pastaTemp, `${id}.out`);
    const fileCompile = path.join(pastaTemp, `${id}.compile.txt`);
    const fileRuntime = path.join(pastaTemp, `${id}.runtime.txt`);

    // escreve o código
    fs.writeFileSync(fileC, codigo);

    // comando: monta a pasta inteira e compila/executa dentro do container
    // redirecionamos saída de compilação e runtime para arquivos dentro da pasta montada
    const comando = [
        'docker run --rm',
        `-v "${pastaTemp}:/codigo"`,
        `gcc:latest sh -c "gcc /codigo/${id}.c -o /codigo/${id}.out 2> /codigo/${id}.compile.txt || true; `,
        // tenta executar somente se o binário existir
        `if [ -f /codigo/${id}.out ]; then /codigo/${id}.out > /codigo/${id}.runtime.txt 2>&1; fi"`
    ].join(' ');

    // exec com timeout (ms)
    exec(comando, { timeout: 10000, maxBuffer: 2000 * 1024 }, (err, stdout, stderr) => {
        // tenta ler arquivos (se existirem)
        let compileTxt = "";
        let runtimeTxt = "";
        try { if (fs.existsSync(fileCompile)) compileTxt = fs.readFileSync(fileCompile, "utf8"); } catch(e){}
        try { if (fs.existsSync(fileRuntime)) runtimeTxt = fs.readFileSync(fileRuntime, "utf8"); } catch(e){}

        // apaga os arquivos temporários (limpeza)
        try { if (fs.existsSync(fileC)) fs.unlinkSync(fileC); } catch(e){}
        try { if (fs.existsSync(fileOut)) fs.unlinkSync(fileOut); } catch(e){}
        try { if (fs.existsSync(fileCompile)) fs.unlinkSync(fileCompile); } catch(e){}
        try { if (fs.existsSync(fileRuntime)) fs.unlinkSync(fileRuntime); } catch(e){}

        // Se a execução do comando docker retornou erro (ex: timeout), encaminhe mensagem útil
        if (err && err.killed) {
            return res.json({ type: "error", output: "Execução interrompida (timeout)." });
        }
        if (err && !compileTxt && !runtimeTxt) {
            // se houve erro e não há texto de compilação/runtime, devolve stderr
            return res.json({ type: "error", output: stderr || err.message });
        }

        // Se houver mensagens de compilação, devolvemos como compile-error
        if (compileTxt && compileTxt.trim().length > 0) {
            return res.json({ type: "compile-error", output: compileTxt });
        }

        // Se houver text em runtime, devolve como runtime output
        if (runtimeTxt && runtimeTxt.trim().length > 0) {
            return res.json({ type: "success", output: runtimeTxt });
        }

        // Caso não haja nada (programa sem saída)
        return res.json({ type: "success", output: "" });
    });
});

// ================= Inicia servidor =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
