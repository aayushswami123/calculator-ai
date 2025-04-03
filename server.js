const express = require('express');
const path = require('path');
const readline = require('readline');

const app = express();
const PORT = process.env.PORT || 3000;

console.log("Starting server.js...");

// Serve static files
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  
});



