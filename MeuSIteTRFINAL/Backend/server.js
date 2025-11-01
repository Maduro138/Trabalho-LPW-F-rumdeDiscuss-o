const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./database.db');

app.use(bodyParser.json());
app.use(cors());

// Criar tabela de usuários se não existir
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    senha TEXT
)`);

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
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).send('Preencha todos os campos');

    db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).send('Erro no servidor');
        if (!user) return res.status(400).send('Usuário não encontrado');

        const senhaCorreta = await bcrypt.compare(senha, user.senha);
        if (!senhaCorreta) return res.status(400).send('Senha incorreta');

        res.send('Login realizado com sucesso!');
    });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
