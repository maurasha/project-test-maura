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

const PORT = process.env.PORT || 8080;

app.listen(8080, () => {
  console.log('Server jalan di http://localhost:8080');
});


