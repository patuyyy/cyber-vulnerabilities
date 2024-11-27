const express = require('express');
const { exec } = require('child_process');
const os = require('os');

const app = express();
const PORT = 3000;

// Middleware untuk parsing form data
app.use(express.urlencoded({ extended: true }));

// Halaman utama
app.get('/', (req, res) => {
    res.send(`
        <h1>Simulasi Command Injection</h1>
        <form method="POST" action="/ping">
            <label for="ip">Masukkan IP Address:</label>
            <input type="text" id="ip" name="ip" placeholder="Contoh: 127.0.0.1">
            <button type="submit">Ping</button>
        </form>
    `);
});

// Endpoint untuk menjalankan perintah ping
app.post('/ping', (req, res) => {
    const ip = req.body.ip.trim(); // Ambil input IP dari form dan hapus spasi di awal/akhir

    // Validasi input: hanya menerima format IP yang valid


    // Tentukan perintah berdasarkan OS
    const isWindows = os.platform() === 'win32';
    const pingCommand = isWindows ? `ping ${ip}` : `ping -c 4 ${ip}`;

    // Jalankan perintah ping
    exec(pingCommand, (error, stdout, stderr) => {
        if (error) {
            console.error('Error:', error.message);
            return res.send(`<pre>Ping failed: ${error.message}</pre>`);
        }
        if (stderr) {
            console.error('Stderr:', stderr);
            return res.send(`<pre>Ping stderr: ${stderr}</pre>`);
        }

        // Tampilkan output ping
        res.send(`<pre>${stdout}</pre>`);
    });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
