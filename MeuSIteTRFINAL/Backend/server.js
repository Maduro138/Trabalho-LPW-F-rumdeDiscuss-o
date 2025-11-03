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



app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
