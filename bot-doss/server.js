
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Aqui está o comando exato puxando a variável do seu .env
const token = process.env.SECRET_telegram; 

if (!token) {
    console.log("❌ ERRO OPSEC: Token do Telegram não encontrado no .env");
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log("🟢 Sigma Terminal Online. Monitoring the trenches...");

// COMMAND: /ca (Contract Address)
bot.onText(/\/ca/, (msg) => {
    const chatId = msg.chat.id;
    const response = `
🔒 **SMART CONTRACT (Zero Backdoors)**
\`Awaiting_Official_Sigma_Deploy\`

Liquidity will be 100% burned.
Paper hands will be left behind.
**Hold the line.** 🪖
    `;
    bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
});

// COMMAND: /manifesto
bot.onText(/\/manifesto/, (msg) => {
    const chatId = msg.chat.id;
    const response = `
**THE 750K PROTOCOL - INITIALIZATION** 🟢

Mathematics dictates the value. 
10,000 units for every soul saved on the Ridge.
We do not sell for crumbs.

**Are you part of the 75?**
    `;
    bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
});

// COMMAND: /raid [link]
bot.onText(/\/raid (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const twitterLink = match[1];

    const raidMessage = `
🚨 **ALARM: RAID REQUIRED! TRENCHES OPEN.** 🚨

Commanders, the mission is active.
We need total force to dominate the algorithm.

👉 **TARGET:** ${twitterLink}

**Mission:** Like, RT and drop a 🪖.
Destroy the metrics.
    `;
    
    bot.sendMessage(chatId, raidMessage, { parse_mode: 'Markdown' })
        .then(sentMsg => {
            bot.pinChatMessage(chatId, sentMsg.message_id);
        });
});

// ANTI-FUD SHIELD (Auto-delete)
bot.on('message', (msg) => {
    if (!msg.text) return;
    
    const blackList = ['scam', 'rug', 'fake', 'golpe', 'airdrop'];
    const text = msg.text.toLowerCase();
    const containsBannedWord = blackList.some(word => text.includes(word));
    
    if (containsBannedWord) {
        bot.deleteMessage(msg.chat.id, msg.message_id).catch(err => console.log("Error deleting:", err));
        bot.sendMessage(msg.chat.id, `⚠️ Soldier @${msg.from.username}, maintain discipline in the trench. FUD is not tolerated.`);
    }
});