```js
const { cmd, commands } = require('../inconnuboy');
const { getUserConfigFromMongoDB } = require('../lib/database');
const config = require('../config');
const os = require('os');

cmd({
    pattern: 'menu',
    alias: ['help', 'cmds', 'commands'],
    desc: 'Show all commands by category',
    category: 'general',
    react: '📋'
}, async (conn, mek, m, { from, sender, isOwner, reply }) => {
    try {
        const number = sender.split('@')[0];
        const userConfig = await getUserConfigFromMongoDB(number);

        // Group commands by category
        const categories = {};
        for (const cmd of commands) {
            if (cmd.dontAddCommandList) continue;
            const cat = (cmd.category || 'misc').toLowerCase();
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd);
        }

        const categoryEmojis = {
            general: '🌐',
            group: '👥',
            settings: '⚙️',
            owner: '👑',
            tools: '🔧',
            fun: '🎭',
            media: '🎬',
            misc: '📦'
        };

        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        let menuText = `
╔══════════════════════════════╗
║      🤖 𝐅𝐌 𝐀𝐁𝐃𝐔𝐋𝐋𝐀𝐇 𝐌𝐃
║         𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐌𝐄𝐍𝐔
╚══════════════════════════════╝

╭───────────────❍
│ 👤 User : ${m.pushName || 'User'}
│ ⚡ Prefix : ${config.PREFIX}
│ 🕐 Uptime : ${hours}h ${minutes}m ${seconds}s
│ 🔌 Mode : ${config.WORK_TYPE || 'public'}
╰───────────────❍

╭───── ⚙️ SETTINGS STATUS ─────❍
│ 👁️ Auto View : ${userConfig.AUTO_VIEW_STATUS === 'true' ? 'ON ✅' : 'OFF ❌'}
│ 📵 Anti Call : ${userConfig.ANTI_CALL === 'true' ? 'ON ✅' : 'OFF ❌'}
│ 🎙️ Auto Record : ${userConfig.AUTO_RECORDING === 'true' ? 'ON ✅' : 'OFF ❌'}
│ ⌨️ Auto Typing : ${userConfig.AUTO_TYPING === 'true' ? 'ON ✅' : 'OFF ❌'}
│ ✅ Auto Read : ${userConfig.READ_MESSAGE === 'true' ? 'ON ✅' : 'OFF ❌'}
╰────────────────────────────❍

`;

        // List commands per category
        const catOrder = ['general', 'group', 'settings', 'owner', 'tools', 'fun', 'media', 'misc'];
        const sortedCats = [
            ...catOrder.filter(c => categories[c]),
            ...Object.keys(categories).filter(c => !catOrder.includes(c))
        ];

        for (const cat of sortedCats) {
            if (!categories[cat] || !categories[cat].length) continue;

            const emoji = categoryEmojis[cat] || '📦';

            menuText += `╭━━━ ${emoji} ${cat.toUpperCase()} ━━━⬣\n`;

            for (const c of categories[cat]) {
                menuText += `┃ ✦ ${config.PREFIX}${c.pattern}${c.desc ? `\n┃   ➥ ${c.desc}` : ''}\n`;
            }

            menuText += `╰━━━━━━━━━━━━━━━━━━━━━━⬣\n\n`;
        }

        menuText += `
╭────────────────────────────❍
│ 🤖 FM ABDULLAH MD
│ ⚡ Fast • Stable • Powerful
│ 🚀 Multi Device WhatsApp Bot
╰────────────────────────────❍

> © Powered By FM Abdullah MD
`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.IMAGE_PATH },
                caption: menuText,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363420369779430@newsletter",
                        newsletterName: "🤖 FM ABDULLAH MD",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        reply('*❌ Menu error: ' + e.message + '*');
    }
});
```
