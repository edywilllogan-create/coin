require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); 

const token = process.env.TELEGRAM_TOKEN;
const adminId = process.env.ADMIN_CHAT_ID; 

let bot;

if (!token) {
    console.log("❌ ERRO: Token não configurado.");
} else {
    bot = new TelegramBot(token, { polling: true });
    console.log("🟢 Radar Stealth Online. Aguardando o Comandante.");

    bot.onText(/\/(.+)/, (msg) => {
        const chatId = msg.chat.id.toString();
        const command = msg.text;
        
        console.log(`[RADAR] Mensagem recebida de: ${chatId} | Comando: ${command}`);

        if (adminId && chatId === adminId.toString()) {
            if (command === '/status') {
                bot.sendMessage(chatId, "✅ Sistema operando em modo invisível. Eu te reconheço, Comandante.");
            }
            if (command === '/ca') {
                bot.sendMessage(chatId, "🔒 **SMART CONTRACT:** `Awaiting_Deploy` 🪖", { parse_mode: 'Markdown' });
            }
        } else {
            console.log(`[BLOQUEIO] Tentativa ignorada do ID: ${chatId}`);
        }
    });
}

// Intercepta o e-mail e manda pro seu Telegram
app.post('/api/save-email', async (req, res) => {
    const { email } = req.body;
    if (bot && adminId && email) {
        try {
            await bot.sendMessage(adminId, `🚨 **NOVO INVESTIDOR INTERCEPTADO:**\n📧 \`${email}\``, { parse_mode: 'Markdown' });
            res.status(200).json({ message: "Transmissão concluída." });
        } catch (e) {
            console.error("Erro no disparo:", e);
            res.status(500).send();
        }
    } else {
        res.status(400).json({ error: "Dados incompletos." });
    }
});

// Mantém o site online
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 [DOSS] Unificado e pronto na porta ${PORT}`);
});