// config.js
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',     // pon aquí la contraseña si tienes una en MySQL
  database: 'perfumeria'
});
db.connect(err => {
  if (err) {
    console.error('Error MySQL:', err);
    process.exit(1);
  }
  console.log('MySQL conectado');
});
module.exports = db;
