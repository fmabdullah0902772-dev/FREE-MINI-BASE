const { cmd, commands } = require('../inconnuboy');
const { getUserConfigFromMongoDB } = require('../lib/database');
const config = require('../config');

cmd({
    pattern: 'menu',
    alias: ['help', 'cmds', 'commands'],
    desc: 'Show all commands by category',
    category: 'general',
    react: '📋'
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const number = sender.split('@')[0];
        const userConfig = await getUserConfigFromMongoDB(number);

        const categories = {};

        for (const command of commands) {
            if (command.dontAddCommandList) continue;

            const cat = (command.category || 'misc').toLowerCase();

            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(command);
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
╭━━━〔 🤖 𝙁𝙈 𝘼𝘽𝘿𝙐𝙇𝙇𝘼𝙃 𝙈𝘿 〕━━━⬣
┃ 👤 User    : ${m.pushName || 'User'}
┃ ⚡ Prefix  : ${config.PREFIX}
┃ 🌐 Mode    : ${config.WORK_TYPE || 'public'}
┃ ⏳ Uptime  : ${hours}h ${minutes}m ${seconds}s
╰━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 ⚙️ 𝙎𝙔𝙎𝙏𝙀𝙈 〕━━━⬣
┃ 👁️ Auto View   : ${userConfig.AUTO_VIEW_STATUS === 'true' ? '✅ ON' : '❌ OFF'}
┃ 📵 Anti Call   : ${userConfig.ANTI_CALL === 'true' ? '✅ ON' : '❌ OFF'}
┃ 🎙️ Recording   : ${userConfig.AUTO_RECORDING === 'true' ? '✅ ON' : '❌ OFF'}
┃ ⌨️ Typing      : ${userConfig.AUTO_TYPING === 'true' ? '✅ ON' : '❌ OFF'}
┃ 📖 Auto Read   : ${userConfig.READ_MESSAGE === 'true' ? '✅ ON' : '❌ OFF'}
╰━━━━━━━━━━━━━━━━━━⬣

`;

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

            const cmdList = categories[cat]
                .map(c => `⟪${config.PREFIX}${c.pattern}⟫`)
                .join(' • ');

            menuText += `┃ ${cmdList}\n`;
            menuText += `╰━━━━━━━━━━━━━━━━━━⬣\n\n`;
        }

        menuText += `
╭━━━━━━━━━━━━━━━━━━⬣
┃ 🚀 Fast • Stable • Powerful
┃ 🤍 Powered By FM ABDULLAH MD
╰━━━━━━━━━━━━━━━━━━⬣
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
        reply('*❌ Menu Error:* ' + e.message);
    }
});
