const express = require('express');
const app = express();
const path = require('path');

// If your static files are in a 'public' directory:
app.use(express.static(path.join(__dirname, 'public')));

// If your static files are in the root directory of your project (less common for static assets):
// app.use(express.static(__dirname));

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});