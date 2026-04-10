require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.DASHBOARD_PORT || 3000;

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Admin password (set in .env or use default)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Message history file
const HISTORY_FILE = path.join(__dirname, 'message-history.json');

// Bot start time (read from file or use current time)
const BOT_START_TIME_FILE = path.join(__dirname, 'bot-start-time.txt');
const BOT_HEARTBEAT_FILE = path.join(__dirname, 'bot-heartbeat.txt');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Check if bot is running
function isBotRunning() {
    try {
        if (fs.existsSync(BOT_HEARTBEAT_FILE)) {
            const heartbeatTime = new Date(fs.readFileSync(BOT_HEARTBEAT_FILE, 'utf8'));
            const now = new Date();
            // If heartbeat within last 1 minute, consider it running
            const diffMinutes = (now - heartbeatTime) / 1000 / 60;
            return diffMinutes < 1;
        }
        return false;
    } catch (error) {
        return false;
    }
}

// Get bot online time
function getBotOnlineTime() {
    try {
        if (fs.existsSync(BOT_START_TIME_FILE)) {
            const startTime = new Date(fs.readFileSync(BOT_START_TIME_FILE, 'utf8'));
            const now = new Date();
            const diffMs = now - startTime;
            const hours = Math.floor(diffMs / 3600000);
            const minutes = Math.floor((diffMs % 3600000) / 60000);
            const seconds = Math.floor((diffMs % 60000) / 1000);
            return `${hours}h ${minutes}m ${seconds}s`;
        }
        return '0h 0m 0s';
    } catch (error) {
        return 'Unknown';
    }
}

// Get message history for last 2 days
function getMessageHistory(days = 2) {
    try {
        if (!fs.existsSync(HISTORY_FILE)) {
            return [];
        }
        
        const history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return history.filter(item => new Date(item.timestamp) > cutoffDate);
    } catch (error) {
        console.error('Error reading history:', error);
        return [];
    }
}

// API: Check authentication
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.json({ success: false, error: 'Invalid password' });
    }
});

// API: Get bot status (real-time)
app.get('/api/status', (req, res) => {
    res.json({
        running: isBotRunning(),
        onlineTime: getBotOnlineTime(),
        timestamp: new Date().toISOString()
    });
});

// API: Get message history
app.get('/api/history', (req, res) => {
    const days = parseInt(req.query.days) || 2;
    res.json({
        history: getMessageHistory(days),
        count: getMessageHistory(days).length
    });
});

// Serve dashboard using EJS template
app.get('/', (req, res) => {
    res.render('dashboard');
});

app.listen(PORT, () => {
    console.log(`Dashboard running on http://localhost:${PORT}`);
    console.log(`Admin password: ${ADMIN_PASSWORD}`);
});
