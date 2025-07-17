const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();


app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', createProxyMiddleware({
  target: 'https://suitmedia-backend.suitdev.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', 
  },
}));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
