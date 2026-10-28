const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// HTML, CSS va JavaScript fayllarini brauzerga uzatadi.
app.use(express.static(path.join(__dirname)));

app.get('/api', (req, res) => {
  res.json({ name: 'UniLab 3D', status: 'online', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log(`UniLab 3D ishga tushdi: http://localhost:${PORT}`);
});