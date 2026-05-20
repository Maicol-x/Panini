const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const DB_NAME = process.env.DB_NAME || 'panini_db';

// Soporta DATABASE_URL (Render) o env vars individuales (local)
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: DB_NAME,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
    });

async function crearBDSiNoExiste() {
  if (process.env.DATABASE_URL) return; // Render ya provee la BD
  const { Pool: P } = require('pg');
  const adminPool = new P({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: 'postgres',
  });
  try {
    const { rows } = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );
    if (rows.length === 0) {
      await adminPool.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`✔  Base de datos '${DB_NAME}' creada.`);
    } else {
      console.log(`✔  Base de datos '${DB_NAME}' ya existe.`);
    }
  } finally {
    await adminPool.end();
  }
}

const MIGRATIONS_DIR = path.join(__dirname, '../migrations');

async function migrate() {
  await crearBDSiNoExiste();
  const client = await pool.connect();

  try {
    // Crear tabla de control si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migraciones (
        id        SERIAL PRIMARY KEY,
        archivo   VARCHAR(255) UNIQUE NOT NULL,
        aplicada_en TIMESTAMP DEFAULT NOW()
      )
    `);

    // Leer archivos .sql ordenados por nombre (V1__, V2__, ...)
    const archivos = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    // Obtener las ya aplicadas
    const { rows } = await client.query('SELECT archivo FROM _migraciones');
    const aplicadas = new Set(rows.map((r) => r.archivo));

    const pendientes = archivos.filter((f) => !aplicadas.has(f));

    if (pendientes.length === 0) {
      console.log('✔  Sin migraciones pendientes.');
      return;
    }

    for (const archivo of pendientes) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, archivo), 'utf8');
      console.log(`⏳ Aplicando: ${archivo}`);

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO _migraciones (archivo) VALUES ($1)',
          [archivo]
        );
        await client.query('COMMIT');
        console.log(`✔  Aplicada:  ${archivo}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`✖  Error en ${archivo}:`, err.message);
        process.exit(1);
      }
    }

    console.log('\n✔  Migraciones completadas.');
  } finally {
    client.release();
    await pool.end();
  }
}

// Permite ejecutar directamente: node src/scripts/migrate.js
if (require.main === module) {
  migrate().catch((e) => { console.error(e); process.exit(1); });
}

module.exports = migrate;
