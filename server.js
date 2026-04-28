require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise'); // Usando a versão mais estável para evitar quedas
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const app = express();

// 1. MIDDLEWARES CRÍTICOS (Isto garante que o e-mail seja lido e não chegue vazio)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Garante que o seu CSS, vídeo e imagens carreguem

// 2. CONEXÃO COM O BANCO DE DADOS (Blindado para o Railway)
const db = mysql.createPool(process.env.DATABASE_URL);

// 3. ROTA DE CAPTURA DE RECRUTAS (API)
app.post('/api/save-email', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: "E-mail vazio." });
        }

        const sql = "INSERT INTO leads (email) VALUES (?)";
        await db.execute(sql, [email]);
        
        console.log(`✅ Novo recruta capturado: ${email}`);
        res.status(200).json({ message: "Infiltração concluída com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao salvar no banco:", error);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
});

// 4. INICIALIZANDO O BOT (Com proteção anti-crash)
const token = process.env.TELEGRAM_TOKEN;

if (!token) {
    console.log("❌ ERRO OPSEC: Token do Telegram não encontrado nas Variáveis do Railway!");
} else {
    const bot = new TelegramBot(token, { polling: true });
    console.log("🟢 Sigma Terminal Online. Monitoring the trenches...");

    bot.onText(/\/ca/, (msg) => {
        const chatId = msg.chat.id;
        const response = `🔒 **SMART CONTRACT (Zero Backdoors)**\n\n\`Awaiting_Official_Sigma_Deploy\`\n\nLiquidity will be 100% burned.\nPaper hands will be left behind.\n**Hold the line.** 🪖`;
        bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
    });

    bot.on('polling_error', (error) => {
        console.log("⚠️ Aviso do Bot (ignorado para não derrubar o site):", error.message);
    });
}

// 5. ROTA PRINCIPAL DA BAZUCA (Garante que a página carregue sempre)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 6. LIGANDO O MOTOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 [DOSS] Terminal Web ativo na porta ${PORT}`);
});