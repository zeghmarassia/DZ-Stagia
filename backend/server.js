const express = require('express');
const app = express();
// Serveur de test pour DZ-Stagia
app.get('/', (req, res) => res.send('Backend DZ-Stagia Operational'));
app.listen(5000, () => console.log('Server running on port 5000'));