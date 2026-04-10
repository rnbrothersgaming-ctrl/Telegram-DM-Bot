# Telegram Auto-Reply Bot

এটি একটি Node.js দিয়ে তৈরি টেলিগ্রাম অটো-রিপ্লাই বট যা আপনার ব্যক্তিগত অ্যাকাউন্ট থেকে কাজ করে। যখন কেউ আপনাকে ব্যক্তিগত মেসেজ দেবে, তখন অটোমেটিক রিপ্লাই যাবে।

**নতুন ফিচার:** এখন ডায়নামিক রিপ্লাই সিস্টেম! `replies.js` ফাইলে মেসেজ এবং রিপ্লাই সেট করুন। উদাহরণ: "hi" লিখলে "Hello!" রিপ্লাই যাবে, "assalamualaikum" লিখলে "Walaikumassalam" রিপ্লাই যাবে।

## Quick Start

### 1. API Credentials নিন

[my.telegram.org](https://my.telegram.org) থেকে API ID এবং API Hash নিন।

### 2. Install করুন

```bash
npm install
```

### 3. .env ফাইল তৈরি করুন

```bash
copy .env.example .env
```

`.env` ফাইলে API_ID এবং API_HASH দিন:
```
API_ID=33747218
API_HASH=d96c70e9eba1387bb2f0569c51678122
SESSION_STRING=
```

**গুরুত্বপূর্ণ:**
- `API_ID` এবং `API_HASH` my.telegram.org থেকে নিন
- `SESSION_STRING` প্রথমবার ফাঁকা রাখুন (প্রথম রানের পর এটি জেনারেট হবে)
- রিপ্লাই সেট করতে `replies.js` ফাইল এডিট করুন

### 4. Session String জেনারেট করুন (প্রথমবার)

```bash
npm run generate
```

ফোন নম্বর, কোড, এবং পাসওয়ার্ড দিয়ে লগইন করুন। Session String কপি করে `.env` ফাইলে `SESSION_STRING=` এর পরে দিন।

### 5. বট চালু করুন

```bash
npm start
```

**নোট:** এখন `npm start` দিলে বট এবং ড্যাশবোর্ড একসাথে চালু হবে।

ড্যাশবোর্ডে আপনি দেখতে পারবেন:
- বট স্ট্যাটাস (Online/Offline)
- অনলাইন সময়
- মেসেজ হিস্ট্রি (শেষ ২ দিন)
- কে কি মেসেজ দিয়েছে এবং কি রিপ্লাই দিয়েছে

ড্যাশবোর্ড URL: http://localhost:3000
ড্যাশবোর্ডে লগইন করতে পাসওয়ার্ড দিন (ডিফল্ট: `admin123`)

**আলাদা ভাবে চালাতে চাইলে:**
- শুধু বট: `npm run bot`
- শুধু ড্যাশবোর্ড: `npm run dashboard`

## Deployment (Render)

1. লোকাল মেশিনে `npm run generate` দিয়ে Session String জেনারেট করুন
2. GitHub এ কোড আপলোড করুন (`.env` ফাইল বাদ দিন)
3. Render এ Web Service তৈরি করুন
4. Environment Variables সেট করুন:
   - API_ID
   - API_HASH
   - SESSION_STRING (আপনার জেনারেট করা স্ট্রিং)
   - ADMIN_PASSWORD (ড্যাশবোর্ড পাসওয়ার্ড)
5. Start Command: `npm start`
6. Deploy করুন

**নোট:** Render এ `npm start` দিলে বট এবং ড্যাশবোর্ড একসাথে চালু হবে। ড্যাশবোর্ড অ্যাক্সেস করতে Render এর URL এর পরে পোর্ট নম্বর লাগবে না (ড্যাশবোর্ড পোর্ট 3000 এ চলে)।

## Project Structure

```
telegram_DM/
├── bot.js                  # মূল বট লজিক
├── replies.js              # মেসেজ এবং রিপ্লাই কনফিগারেশন
├── generate.js             # লোকাল Session String জেনারেটর
├── dashboard.js            # ড্যাশবোর্ড সার্ভার
├── views/
│   └── dashboard.ejs       # ড্যাশবোর্ড UI (EJS টেমপ্লেট)
├── message-history.json     # মেসেজ হিস্ট্রি
├── package.json            # প্রজেক্ট ডিপেনডেন্সি
├── .env.example            # Environment variables টেমপ্লেট
├── .env                    # আপনার environment variables
└── README.md               # এই ফাইল
```

## Customization

**মেসেজ এবং রিপ্লাই কাস্টমাইজ করতে:**

`replies.js` ফাইল খুলুন এবং নতুন মেসেজ এবং রিপ্লাই যোগ করুন:

```javascript
const replies = {
    'আপনার মেসেজ': 'আপনার রিপ্লাই',
    'default': 'ডিফল্ট রিপ্লাই'
};
```

উদাহরণ:
```javascript
'কি খবর': 'ভালো আছি! তুমি কেমন আছো? 😊',
'tom': 'কাল কথা হবে! 👋'
```

## Troubleshooting

- **SESSION_STRING নেই**: প্রথমে `npm run generate` দিয়ে জেনারেট করুন
- **লগইন সমস্যা**: API ID এবং API Hash সঠিক কিনা চেক করুন
- **কানেকশন সমস্যা**: ইন্টারনেট কানেকশন স্থিতিশীল কিনা চেক করুন

## Security Notes

- আপনার API ID, API Hash, এবং Session String কারো সাথে শেয়ার করবেন না
- ভার্সন কন্ট্রোল ব্যবহার করলে `.env` ফাইলটি `.gitignore` এ যোগ করুন

## License

ISC
