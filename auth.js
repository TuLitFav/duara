// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) return res.status(400).send('Faltan campos');
  try {
    const hashed = await bcrypt.hash(password, 10);
    db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, hashed], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).send('Email ya registrado');
        return res.status(500).send('Error en la base de datos');
      }
      res.send('Usuario registrado');
    });
  } catch (e) {
    res.status(500).send('Error servidor');
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Faltan campos');
  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).send('Error BD');
    if (results.length === 0) return res.status(401).send('Usuario no encontrado');
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (match) return res.send('Inicio de sesión correcto');
    else return res.status(401).send('Contraseña incorrecta');
  });
});

module.exports = router;
