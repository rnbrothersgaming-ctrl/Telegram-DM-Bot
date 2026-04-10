require('dotenv').config();
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;

const session = new StringSession('');
const client = new TelegramClient(session, apiId, apiHash, {
    connectionRetries: 5,
});

(async () => {
    console.log('Session String Generator...\n');
    
    try {
        await client.start({
            phoneNumber: async () => await input.text('ফোন নম্বর: '),
            password: async () => await input.text('পাসওয়ার্ড (যদি থাকে): '),
            phoneCode: async () => await input.text('কোড: '),
            onError: (err) => console.error(err),
        });

        console.log('\n✅ সফল!');
        console.log('\nআপনার Session String:');
        console.log('================================');
        console.log(client.session.save());
        console.log('================================');
        console.log('\nএটি কপি করে .env ফাইলে SESSION_STRING= এর পরে দিন');
        
        await client.disconnect();
    } catch (error) {
        console.error('সমস্যা:', error);
        process.exit(1);
    }
})();
