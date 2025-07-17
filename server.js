// server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// Serve file HTML/JS/CSS dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint untuk menghindari CORS
app.use('/api', createProxyMiddleware({
  target: 'https://suitmedia-backend.suitdev.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // jadi /api/ideas -> https://suitmedia-backend.suitdev.com/api/ideas
  },
}));

// Jalankan server di port 3000
app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});
