// server.js
const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
