/**
 * Crea el usuario administrador en la base de datos.
 * Uso: node src/scripts/createAdmin.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../db');

const NOMBRE   = 'Admin Panini';
const EMAIL    = 'admin@panini.co';
const PASSWORD = 'CambiarEsta2026!'; // ← cambiar antes de ejecutar

async function main() {
  try {
    const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [EMAIL]);
    if (existe.rows.length > 0) {
      console.log('El usuario admin ya existe:', EMAIL);
      return;
    }

    const hash = await bcrypt.hash(PASSWORD, 12);
    await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol)
       VALUES ($1, $2, $3, 'admin')`,
      [NOMBRE, EMAIL, hash]
    );
    console.log('Admin creado exitosamente.');
    console.log('  Email:    ', EMAIL);
    console.log('  Password: ', PASSWORD);
    console.log('\n⚠  Cambia la contraseña en el Dashboard después del primer login.');
  } catch (err) {
    console.error('Error al crear admin:', err.message);
  } finally {
    if (require.main === module) {
      await pool.end();
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = main;
