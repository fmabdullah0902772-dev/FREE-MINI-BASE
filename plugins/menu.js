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
╭━━━〔 🤖 𝙵𝙼 𝙰𝙱𝙳𝚄𝙻𝙻𝙰𝙷 𝙼𝙳 〕━━━⬣
┃ 👤 𝚄𝚂𝙴𝚁 : ${m.pushName || 'User'}
┃ ⚡ 𝙿𝚁𝙴𝙵𝙸𝚇 : ${config.PREFIX}
┃ 🕒 𝚄𝙿𝚃𝙸𝙼𝙴 : ${hours}h ${minutes}m ${seconds}s
┃ 🌐 𝙼𝙾𝙳𝙴 : ${config.WORK_TYPE || 'public'}
╰━━━━━━━━━━━━━━━━⬣

╭━━━〔 ⚙️ 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 〕━━━⬣
┃ 👁️ Auto View    : ${userConfig.AUTO_VIEW_STATUS === 'true' ? '✅ ON' : '❌ OFF'}
┃ 📵 Anti Call    : ${userConfig.ANTI_CALL === 'true' ? '✅ ON' : '❌ OFF'}
┃ 🎙️ Auto Record  : ${userConfig.AUTO_RECORDING === 'true' ? '✅ ON' : '❌ OFF'}
┃ ⌨️ Auto Typing  : ${userConfig.AUTO_TYPING === 'true' ? '✅ ON' : '❌ OFF'}
┃ 📖 Auto Read    : ${userConfig.READ_MESSAGE === 'true' ? '✅ ON' : '❌ OFF'}
╰━━━━━━━━━━━━━━━━⬣

`;

        // List commands per category
        const catOrder = [
            'general',
            'group',
            'settings',
            'owner',
            'tools',
            'fun',
            'media',
            'misc'
        ];

        const sortedCats = [
            ...catOrder.filter(c => categories[c]),
            ...Object.keys(categories).filter(c => !catOrder.includes(c))
        ];

        for (const cat of sortedCats) {
            if (!categories[cat] || !categories[cat].length) continue;

            const emoji = categoryEmojis[cat] || '📦';

            menuText += `╭━━━〔 ${emoji} ${cat.toUpperCase()} 〕━━━⬣\n`;

            for (const c of categories[cat]) {
                menuText += `┃ ✦ ${config.PREFIX}${c.pattern}${c.desc ? `\n┃ ◦ ${c.desc}` : ''}\n`;
            }

            menuText += `╰━━━━━━━━━━━━━━━━⬣\n\n`;
        }

        menuText += `
╭━━━━━━━━━━━━━━━━⬣
┃ 🤍 𝙵𝙼 𝙰𝙱𝙳𝚄𝙻𝙻𝙰𝙷 𝙼𝙳
┃ 🚀 Fast • Stable • Powerful
╰━━━━━━━━━━━━━━━━⬣
`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.IMAGE_PATH },
                caption: menuText
            },
            { quoted: mek }
        );

    } catch (e) {
        reply('*❌ Menu error: ' + e.message + '*');
    }
});
