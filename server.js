require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const app = express();

// --- CONFIGURAÇÃO TÁTICA ---
app.use(express.json());
app.use(express.static(__dirname)); // Carrega suas imagens e CSS da raiz

const token = process.env.TELEGRAM_TOKEN;
const adminId = process.env.ADMIN_CHAT_ID; // Seu ID que você pegou no @userinfobot

let bot;

if (!token) {
    console.log("❌ ERRO: Token não configurado no Railway.");
} else {
    bot = new TelegramBot(token, { polling: true });
    console.log("🟢 Radar Stealth Online. Aguardando o Comandante.");

    // Firewall: Só você tem acesso aos comandos do bot
    const isOwner = (id) => adminId && id.toString() === adminId.toString();

    bot.onText(/\/status/, (msg) => {
        if (isOwner(msg.chat.id)) bot.sendMessage(msg.chat.id, "✅ Sistema operando em modo invisível.");
    });

    bot.onText(/\/ca/, (msg) => {
        if (isOwner(msg.chat.id)) {
            bot.sendMessage(msg.chat.id, "🔒 **SMART CONTRACT:** `Awaiting_Deploy` 🪖", { parse_mode: 'Markdown' });
        }
    });
}

// --- INTERCEPTAÇÃO DE LEADS (Manda pro seu Telegram) ---
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

// --- ROTA BAZUCA (Sempre entrega o site) ---
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 [DOSS] Unificado e pronto na porta ${PORT}`);
});