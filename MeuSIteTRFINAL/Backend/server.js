const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./database.db');


// Cria tabela de usuários, se não existir
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    senha TEXT,
    role TEXT DEFAULT 'user'
)`, (err) => {
    if (err) {
        // Se der erro ao criar a tabela, o console vai avisar
        console.error("Erro ao criar tabela 'usuarios':", err.message);
    } else {
        // Se der certo, ele também avisa
        console.log("Tabela 'usuarios' verificada/criada com sucesso.");
    }
});
// Tabela de tópicos do fórum
db.run(`CREATE TABLE IF NOT EXISTS topicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    conteudo TEXT,
    autor TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Tabela de respostas dos tópicos
db.run(`CREATE TABLE IF NOT EXISTS respostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topico_id INTEGER,
    autor TEXT,
    conteudo TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topico_id) REFERENCES topicos(id)
)`);

//db.run("UPDATE usuarios SET role = 'admin' WHERE email = 'arthur11maduro@gmail.com'");


app.use(bodyParser.json());
app.use(cors());




// Rota de cadastro
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

// Rota de login
const jwt = require("jsonwebtoken");
const SECRET = "segredoSuperSeguro123"; 

app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    db.get("SELECT * FROM usuarios WHERE email = ?", [email], (err, row) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (!row) return res.status(401).json({ erro: "Usuário não encontrado" });
        console.log("ROLE DO USUARIO:", row.role);


        bcrypt.compare(senha, row.senha, (_err, resultado) => {
            if (!resultado) return res.status(401).json({ erro: "Senha inválida" });

            // aqui gera token
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
// Criar um tópico
app.post('/topicos', (req, res) => {
    const { titulo, conteudo, autor } = req.body;

    db.run(`INSERT INTO topicos (titulo, conteudo, autor) VALUES (?, ?, ?)`,
    [titulo, conteudo, autor],
    function(err){
        if(err){
            return res.json({erro: err.message});
        }
        res.json({status: "ok", id: this.lastID});
    });
});

// Listar todos tópicos
app.get('/topicos', (_req, res) => {
    db.all(`SELECT id, titulo, autor, data_criacao FROM topicos ORDER BY id DESC`, [], (err, rows)=>{
        if(err){
            return res.json({erro: err.message});
        }
        res.json(rows);
    });
});

// Pegar um tópico pelo ID e listar respostas dele msm
app.get('/topicos/:id', (req, res) => {
    const topico_id = req.params.id;

    db.get(`SELECT * FROM topicos WHERE id = ?`, [topico_id], (err, topico)=>{
        if(err){
            return res.json({erro: err.message});
        }
        if(!topico){
            return res.json({erro: "tópico não encontrado"});
        }

        db.all(`SELECT * FROM respostas WHERE topico_id = ? ORDER BY id DESC`, [topico_id], (err, respostas)=>{
            if(err){
                return res.json({erro: err.message});
            }
            res.json({topico, respostas});
        });
    });
});

// Criar respostas
app.post('/respostas', (req, res) => {
    const { topico_id, autor, conteudo } = req.body;

    db.run(`INSERT INTO respostas (topico_id, autor, conteudo) VALUES (?, ?, ?)`,
    [topico_id, autor, conteudo],
    function(err){
        if(err){
            return res.json({erro: err.message});
        }
        res.json({status: "ok", id: this.lastID});
    });
});

//Rota adm
function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // formato: Bearer token

    if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ erro: 'Token inválido' });
        req.user = user;
        next();
    });
}

function somenteAdmin(req, res, next) {
    if (req.user.role !== 'admin') return res.status(403).json({ erro: "Apenas administradores podem acessar" });
    next();
}



//Rota para ver os usuários
app.get('/usuarios', autenticarToken, somenteAdmin, (_req, res) => {
    db.all("SELECT id, nome, email, role FROM usuarios", (err, rows) => {
        if (err) return res.status(500).send("Erro ao buscar usuários");
        res.json(rows);
    });
});
//Rota para apagar usuarios
app.delete('/usuario/:id', autenticarToken, somenteAdmin, (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM usuarios WHERE id = ?", [id], function(err){
        if(err) return res.status(500).send("Erro ao deletar usuário");
        if(this.changes === 0) return res.status(404).send("Usuário não encontrado");

        res.send("Usuário apagado com sucesso!");
    });
});
  //INFERNOOOOOOOO
app.post("/run", async (req, res) => {
    const codigo = req.body.code;

    if (!codigo) {
        return res.status(400).json({ error: "Código vazio" });
    }

    const id = crypto.randomBytes(8).toString("hex");
    const arquivo = `temp_${id}.c`;
    fs.writeFileSync(arquivo, codigo);

    let caminhoWindows = path.resolve(arquivo);

    let caminhoDocker = caminhoWindows
    .replace(/\\/g, "/") // troca \ por /
    .replace(/^([A-Za-z]):/, function (_, letra) {
        return "/" + letra.toLowerCase();
    });

    const comando = `
        docker run --rm -i \
        -v "${caminhoDocker}":/codigo.c \
        gcc:latest sh -c "gcc /codigo.c -o /codigo.out && /codigo.out"
    `;

    exec(comando, { timeout: 8000 }, (err, stdout, stderr) => {
        fs.unlinkSync(arquivo);

        if (err) {
            return res.json({ output: stderr || "Erro ao compilar." });
        }

        res.json({ output: stdout });
    });
});



app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
