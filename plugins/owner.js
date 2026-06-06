const { cmd } = require('../inconnuboy');
const config = require('../config');

cmd({
    pattern: "owner",
    alias: ["developer", "popkid"],
    desc: "Get information about the bot owner",
    category: "main",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const ownerNumber = "923124001592"; // Your WhatsApp number
        const ownerName = "FM ABDULLAH";
        const ownerOrg = "ON TOP BRUH 💀";
        const githubProfile = "https://whatsapp.com/channel/0029VbBwUOZ6BIEaxmYl3m1Z";
        const profilePic = "https://i.ibb.co/cS2VkrJp/130fe387e387.jpg"; // Your preferred image

        // Define the vCard format
        const vcard = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n'
            + `FN:${ownerName}\n`
            + `ORG:${ownerOrg};\n`
            + `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}\n`
            + `URL;type=github:${githubProfile}\n`
            + 'END:VCARD';

        // Message body
        let ownerMsg = `👑 *FM-ABDULLAH OWNER INFO* 👑

👤 *Name:* ${ownerName}
🌍 *Location:* Pakistan 🇵🇰
💻 *Role:* Full-Stack Developer
🔗 *GitHub:* ${githubProfile}

> *Feel free to contact me for script updates or bot deployment!* ⚡`;

        // 1. Send the Contact Card first
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        }, { quoted: mek });

        // 2. Send the Image with the details
        await conn.sendMessage(from, {
            image: { url: profilePic },
            caption: ownerMsg,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.NEWSLETTER_JID || '120363423033116549@newsletter',
                    newsletterName: 'FM ABDULLAH UPDATES',
                    serverMessageId: 1
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Could not fetch owner information.");
    }
});
