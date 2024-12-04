const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

// Dummy user data
const USERS = [
    { username: 'SuperAdmin30', password: 'SuP3ROv3rC0mpl1c4t3dp4SSWoRd', role: 'admin' },
    { username: 'user', password: 'password', role: 'user' }
];

// Routing untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Routing untuk dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Endpoint untuk login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Cari user
    const user = USERS.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials!' });
    }

    // Buat token JWT
    const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful!', token });
});

// Middleware untuk memverifikasi JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token required!' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({  message: err.message  });
        }
        req.user = user;
        next();
    });
}

// Endpoint untuk mendapatkan flag (hanya untuk admin)
app.get('/flag', authenticateToken, (req, res) => {
    const { role } = req.user;

    if (role !== 'admin') {
        return res.status(403).json({ message: 'Access denied! Only admins can access this!' });
    }

    res.json({ flag: process.env.FLAG });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});