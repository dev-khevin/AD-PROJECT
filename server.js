const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./ngilo.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the ngilo.db database.');
    }
});

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT
        )`,
        (err) => {
            if (err) console.error('Error creating users table:', err.message);
            else console.log('Users table ready.');
        }
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recipient_id TEXT NOT NULL,
            text TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (recipient_id) REFERENCES users(user_id)
        )`,
        (err) => {
            if (err) console.error('Error creating messages table:', err.message);
            else console.log('Messages table ready.');
        }
    );
});

// REGISTER
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username?.trim() || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    try {
        const cleanName = username.trim().toLowerCase();
        const hash = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        db.run(
            'INSERT INTO users (user_id, username, password) VALUES (?, ?, ?)',
            [userId, cleanName, hash],
            (err) => {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(409).json({ error: 'Username already taken' });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(201).json({ userId, username: cleanName });
            }
        );
    } catch {
        res.status(500).json({ error: 'Server error' });
    }
});

// LOGIN
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    db.get(
        'SELECT * FROM users WHERE username = ?',
        [username.trim().toLowerCase()],
        async (err, user) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (!user) return res.status(401).json({ error: 'Invalid username or password' });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).json({ error: 'Invalid username or password' });

            res.json({ userId: user.user_id, username: user.username });
        }
    );
});

// GET USER BY ID (used by Home.jsx)
app.get('/api/user/:id', (req, res) => {
    db.get('SELECT username FROM users WHERE user_id = ?', [req.params.id], (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ username: user.username });
    });
});

// SEND AN ANONYMOUS MESSAGE (by recipient username, used by Message.jsx)
app.post('/api/send-message', (req, res) => {
    const { recipient, message } = req.body;
    if (!recipient || !message?.trim()) {
        return res.status(400).json({ error: 'Recipient and message are required' });
    }
    if (message.length > 500) {
        return res.status(400).json({ error: 'Message is too long (max 500 characters)' });
    }
    db.get(
        'SELECT user_id FROM users WHERE username = ?',
        [recipient.toLowerCase()],
        (err, user) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (!user) return res.status(404).json({ error: 'User not found' });

            db.run(
                'INSERT INTO messages (recipient_id, text) VALUES (?, ?)',
                [user.user_id, message.trim()],
                (err) => {
                    if (err) return res.status(500).json({ error: 'Database error' });
                    res.status(201).json({ success: true });
                }
            );
        }
    );
});

// GET A USER'S INBOX, newest first (used by Inbox.jsx)
app.get('/api/inbox/:userId', (req, res) => {
    db.all(
        `SELECT id, text AS message, created_at AS createdAt
         FROM messages
         WHERE recipient_id = ?
         ORDER BY created_at DESC`,
        [req.params.userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(rows);
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});