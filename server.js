const express = require('express');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();
require('./bot-doss/server.js');

const app = express();
app.use(express.json());

// 1. SERVIR ARQUIVOS ESTÁTICOS
// Isso garante que o site encontre a pasta /imagens, o CSS e o JS
app.use(express.static(path.join(__dirname, '/')));

// 2. CONEXÃO COM O BANCO (MYSQL DO RAILWAY)
// O Railway entrega a variável DATABASE_URL pronta para uso
const db = mysql.createPool({
    uri: process.env.DATABASE_URL
});

// 3. ROTA DE CAPTURA DE RECRUTAS (API)
app.post('/api/save-email', (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "E-mail vazio." });

    const sql = "INSERT INTO leads (email) VALUES (?)";
    db.execute(sql, [email], (err, result) => {
        if (err) {
            console.error("Erro no SQL:", err);
            return res.status(500).json({ error: "Erro ao salvar soldado." });
        }
        res.status(200).json({ message: "Infiltração concluída com sucesso!" });
    });
});


// 4. ROTA PRINCIPAL (INDEX) - A BAZUCA
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 5. INICIALIZAÇÃO
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[DOSS] Terminal Web ativo na porta ${PORT}`);
});