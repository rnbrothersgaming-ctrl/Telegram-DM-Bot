// Message-reply pairs for auto-reply bot
// বাংলা এবং ইংরেজি মেসেজ এবং তাদের রিপ্লাই

const replies = {
    // English greetings
    'hi': 'Hello! 👋',
    'hello': 'Hi there! 😊',
    'hey': 'Hey! 👋',
    'good morning': 'Good morning! ☀️',
    'good afternoon': 'Good afternoon! 🌤️',
    'good evening': 'Good evening! 🌙',
    'good night': 'Good night! 😴',
    
    // Bengali greetings
    'হাই': 'হ্যালো! 👋',
    'হ্যালো': 'আসসালামু আলাইকুম! 🙏',
    'আসসালামু আলাইকুম': 'ওয়া আলাইকুমুসালাম! 🙏',
    'সালাম': 'ওয়া আলাইকুমুসালাম! 🙏',
    'কেমন আছ': 'আমি ভালো আছি, আপনি কেমন আছেন? 😊',
    'কেমন আছেন': 'আলহামদুলিল্লাহ, ভালো আছি। আপনি কেমন আছেন? 😊',
    'শুভ সকাল': 'শুভ সকাল! ☀️',
    'শুভ সন্ধ্যা': 'শুভ সন্ধ্যা! 🌙',
    'শুভ রাত্রি': 'শুভ রাত্রি! 😴',
    
    // Common responses
    'how are you': 'I am good, thanks for asking! 😊',
    'kemon acho': 'Bhalo achi, apni kemon achen? 😊',
    'what are you doing': 'Just busy with some work! 💼',
    'ki korchho': 'কিছু কাজে ব্যস্ত আছি! 💼',
    'where are you': 'I am online! 🌐',
    'kothay acho': 'আমি অনলাইনে আছি! 🌐',
    
    // Islamic greetings
    'assalamualaikum': 'Walaikumassalam! 🙏',
    'salam': 'Walaikumassalam! 🙏',
    
    // Default reply if no match found
    'default': 'আমি এখন ব্যস্ত আছি, পরে কথা বলব। ধন্যবাদ! 🙏'
};

module.exports = replies;
