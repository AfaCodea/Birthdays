const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Sajikan file statis (index.html, styles.css, script.js, gambar, dll.)
app.use(express.static(__dirname, { extensions: ['html'] }));

// Fallback untuk SPA: semua rute selain file statis diarahkan ke index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}/`);
});