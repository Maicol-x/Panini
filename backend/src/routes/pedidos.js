const express = require('express');
const pool = require('../db');
const { authMiddleware, soloAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/pedidos/stats — admin only
router.get('/stats', authMiddleware, soloAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*)::int                      AS total_pedidos,
        COALESCE(SUM(total), 0)::numeric   AS ingresos_totales,
        COUNT(DISTINCT cliente_id)::int    AS total_clientes
      FROM pedidos
    `);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error stats:', err.message);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// GET /api/pedidos — admin only, lista completa
router.get('/', authMiddleware, soloAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.id, p.items, p.total, p.created_at,
             c.nombre, c.telefono
      FROM pedidos p
      JOIN clientes c ON c.id = p.cliente_id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error pedidos:', err.message);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
});

// POST /api/pedidos — guarda cliente + pedido antes de abrir WhatsApp
router.post('/', async (req, res) => {
  const { nombre, telefono, items, total } = req.body;

  if (!nombre || !telefono || !Array.isArray(items) || items.length === 0 || total == null) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'INSERT INTO clientes (nombre, telefono) VALUES ($1, $2) RETURNING id',
      [nombre.trim(), telefono.trim()]
    );
    const clienteId = rows[0].id;

    await client.query(
      'INSERT INTO pedidos (cliente_id, items, total) VALUES ($1, $2, $3)',
      [clienteId, JSON.stringify(items), total]
    );

    await client.query('COMMIT');
    res.status(201).json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al guardar pedido:', err.message);
    res.status(500).json({ error: 'Error interno al guardar el pedido' });
  } finally {
    client.release();
  }
});

module.exports = router;
