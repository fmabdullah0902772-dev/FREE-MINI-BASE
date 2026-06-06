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
            group: '👑',
            settings: '⚙️',
            owner: '🔥',
            tools: '⚔️',
            fun: '🎯',
            media: '📀',
            misc: '💀'
        };

        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        let menuText = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
        menuText += `┃      💀 𝙵𝙼 𝙰𝙱𝙳𝚄𝙻𝙻𝙰𝙷 𝙼𝙳 💀      ┃\n`;
        menuText += `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
        menuText += `┃ ╔══════════════════════════════╗ ┃\n`;
        menuText += `┃ ║ 👤  ${(m.pushName || 'USER').padEnd(28)}║ ┃\n`;
        menuText += `┃ ║ ⚡  PREFIX : ${config.PREFIX.padEnd(24)}║ ┃\n`;
        menuText += `┃ ║ 🕐  UPTIME : ${`${hours}H ${minutes}M ${seconds}S`.padEnd(24)}║ ┃\n`;
        menuText += `┃ ║ 🔥  MODE   : ${(config.WORK_TYPE || 'PUBLIC').toUpperCase().padEnd(24)}║ ┃\n`;
        menuText += `┃ ╚══════════════════════════════╝ ┃\n`;
        menuText += `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
        menuText += `┃          ▣ ⚙️ CONFIG ⚙️ ▣          ┃\n`;
        menuText += `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
        menuText += `┃ ┌──────────────────────────────┐ ┃\n`;
        menuText += `┃ │ 👁️ AUTO VIEW  : ${userConfig.AUTO_VIEW_STATUS === 'true' ? '✅ ACTIVE' : '❌ OFF'}${' '.repeat(13)}│ ┃\n`;
        menuText += `┃ │ 📵 ANTI CALL : ${userConfig.ANTI_CALL === 'true' ? '✅ ACTIVE' : '❌ OFF'}${' '.repeat(13)}│ ┃\n`;
        menuText += `┃ │ 🎙️ AUTO REC  : ${userConfig.AUTO_RECORDING === 'true' ? '✅ ACTIVE' : '❌ OFF'}${' '.repeat(13)}│ ┃\n`;
        menuText += `┃ │ ⌨️ AUTO TYPE : ${userConfig.AUTO_TYPING === 'true' ? '✅ ACTIVE' : '❌ OFF'}${' '.repeat(13)}│ ┃\n`;
        menuText += `┃ │ ✅ AUTO READ : ${userConfig.READ_MESSAGE === 'true' ? '✅ ACTIVE' : '❌ OFF'}${' '.repeat(13)}│ ┃\n`;
        menuText += `┃ └──────────────────────────────┘ ┃\n`;
        menuText += `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n\n`;

        // List commands per category
        const catOrder = ['general', 'group', 'settings', 'owner', 'tools', 'fun', 'media', 'misc'];
        const sortedCats = [...catOrder.filter(c => categories[c]), ...Object.keys(categories).filter(c => !catOrder.includes(c))];

        for (const cat of sortedCats) {
            if (!categories[cat] || !categories[cat].length) continue;
            const emoji = categoryEmojis[cat] || '💀';
            menuText += `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
            menuText += `┃  ${emoji} 〘 ${cat.toUpperCase()} COMMANDS 〙 ${emoji}  ┃\n`;
            menuText += `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
            for (const c of categories[cat]) {
                const cmdName = c.pattern;
                const desc = c.desc ? ` ⚡ ${c.desc}` : '';
                menuText += `┃  ${config.PREFIX}${cmdName.padEnd(20)}${desc.padEnd(30)}┃\n`;
            }
            menuText += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;
        }

        menuText += `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n`;
        menuText += `┃  💀 ${config.PREFIX}MENU = SHOW ALL COMMANDS 💀  ┃\n`;
        menuText += `┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫\n`;
        menuText += `┃     ▄︻デ══━  POWERED BY  ══━̸̸̸̸┻̿     ┃\n`;
        menuText += `┃     💀 𝙵𝙼 𝙰𝙱𝙳𝚄𝙻𝙻𝙰𝙷 𝙼𝙳 💀         ┃\n`;
        menuText += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n`;
        
        menuText += `\n┌────────────────────────────────────┐\n`;
        menuText += `│   ══━✪ 𝙵𝙾𝚁𝚆𝙰𝚁𝙳𝙴𝙳 𝙵𝚁𝙾𝙼 𝙲𝙷𝙰𝙽𝙽𝙴𝙻 ✪━══   │\n`;
        menuText += `└────────────────────────────────────┘`;

        await conn.sendMessage(from, {
            image: { url: config.IMAGE_PATH },
            caption: menuText
        }, { quoted: mek });

    } catch (e) {
        reply(`┏━━━━━━━━━━━━━━━━━━━━━━┓\n┃ ❌ ERROR DETECTED ❌ ┃\n┣━━━━━━━━━━━━━━━━━━━━━━┫\n┃ ${e.message.padEnd(20)} ┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛`);
    }
});
