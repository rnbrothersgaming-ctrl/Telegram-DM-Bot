require('dotenv').config();
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const replies = require('./replies');
const fs = require('fs');
const path = require('path');

// Load environment variables
const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;
const sessionString = process.env.SESSION_STRING || '';

// Default reply if no match found
const DEFAULT_REPLY = process.env.AUTO_REPLY_MESSAGE || replies.default;

// Message history file
const HISTORY_FILE = path.join(__dirname, 'message-history.json');

// Track bot start time
const botStartTime = new Date();
const BOT_START_TIME_FILE = path.join(__dirname, 'bot-start-time.txt');
const BOT_HEARTBEAT_FILE = path.join(__dirname, 'bot-heartbeat.txt');

// Save bot start time to file for dashboard (never changes)
fs.writeFileSync(BOT_START_TIME_FILE, botStartTime.toISOString());

// Update heartbeat file every minute for status check
setInterval(() => {
    fs.writeFileSync(BOT_HEARTBEAT_FILE, new Date().toISOString());
}, 60000); // Every 60 seconds
// Initial heartbeat
fs.writeFileSync(BOT_HEARTBEAT_FILE, new Date().toISOString());

// Function to save message history
function saveMessageHistory(message, reply, senderInfo) {
    try {
        let history = [];
        if (fs.existsSync(HISTORY_FILE)) {
            history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        }
        
        history.push({
            timestamp: new Date().toISOString(),
            sender: senderInfo,
            message: message,
            reply: reply
        });
        
        // Keep only last 7 days of history
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        history = history.filter(item => new Date(item.timestamp) > sevenDaysAgo);
        
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    } catch (error) {
        console.error('হিস্ট্রি সেভ করতে সমস্যা:', error);
    }
}

// Create session
const session = new StringSession(sessionString);

// Create client
const client = new TelegramClient(session, apiId, apiHash, {
    connectionRetries: 5,
});

(async () => {
    console.log('Telegram Auto-Reply Bot শুরু হচ্ছে...');
    
    try {
        // Check if session string exists
        if (!sessionString) {
            console.error('❌ ERROR: SESSION_STRING পাওয়া যায়নি!');
            console.error('');
            console.error('সমাধান:');
            console.error('1. লোকাল মেশিনে একবার রান করুন:');
            console.error('   - .env ফাইলে SESSION_STRING ফাঁকা রাখুন');
            console.error('   - npm start দিন');
            console.error('   - লগইন করার পর Session String কপি করুন');
            console.error('   - .env ফাইলে SESSION_STRING হিসেবে সেভ করুন');
            console.error('');
            console.error('2. তারপর deploy করুন (SESSION_STRING সহ)');
            process.exit(1);
        }

        // Connect directly with session string
        await client.connect();
        console.log('সফলভাবে লগইন হয়েছে!');
        console.log('Auto-reply চালু আছে...');

        // Get own user ID
        const me = await client.getMe();
        
        // Get user info function
        async function getUserInfo(userId) {
            try {
                const user = await client.getEntity(userId);
                return {
                    id: user.id.toString(),
                    username: user.username || 'Unknown',
                    firstName: user.firstName || '',
                    lastName: user.lastName || ''
                };
            } catch (error) {
                return { id: userId.toString(), username: 'Unknown', firstName: '', lastName: '' };
            }
        }

        // Listen for new messages using NewMessage event
        client.addEventHandler(async (event) => {
            try {
                const message = event.message;
                
                // Only handle private messages (not groups or channels)
                if (message.peerId && message.peerId.className === 'PeerUser') {
                    // Ignore messages from yourself
                    if (message.senderId && message.senderId.toString() !== me.id.toString()) {
                        const incomingMessage = (message.message || '').toLowerCase().trim();
                        console.log(`নতুন মেসেজ পেয়েছেন: ${message.message || '(media)'}`);
                        
                        // Find matching reply
                        let replyMessage = DEFAULT_REPLY;
                        for (const [key, value] of Object.entries(replies)) {
                            if (key !== 'default' && incomingMessage.includes(key.toLowerCase())) {
                                replyMessage = value;
                                break;
                            }
                        }
                        
                        // Send auto-reply
                        await client.sendMessage(message.peerId, {
                            message: replyMessage,
                        });
                        console.log('Auto-reply পাঠানো হয়েছে:', replyMessage);
                        
                        // Save message history
                        const senderInfo = await getUserInfo(message.senderId);
                        saveMessageHistory(message.message || '(media)', replyMessage, senderInfo);
                    }
                }
            } catch (error) {
                console.error('Reply পাঠাতে সমস্যা হয়েছে:', error);
            }
        }, new NewMessage({}));

    } catch (error) {
        console.error('সমস্যা হয়েছে:', error);
        process.exit(1);
    }
})();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nবন্ধ হচ্ছে...');
    await client.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nবন্ধ হচ্ছে...');
    await client.disconnect();
    process.exit(0);
});
