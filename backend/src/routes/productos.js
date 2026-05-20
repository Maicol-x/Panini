const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authMiddleware, soloAdmin } = require('../middleware/auth');

// GET todos los productos (con filtro opcional por categoría)
router.get('/', async (req, res) => {
  const { categoria_id } = req.query;
  try {
    let query = `
      SELECT p.*, c.nombre AS categoria
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = TRUE
    `;
    const params = [];
    if (categoria_id) {
      params.push(categoria_id);
      query += ` AND p.categoria_id = $${params.length}`;
    }
    query += ' ORDER BY p.sort_order ASC, p.id ASC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET un producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.*, c.nombre AS categoria
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = $1 AND p.activo = TRUE`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// POST crear producto — solo admin
router.post('/', authMiddleware, soloAdmin, async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url, categoria_id } = req.body;
  if (!nombre || precio == null) {
    return res.status(400).json({ error: 'nombre y precio son requeridos' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, descripcion, precio, stock ?? 0, imagen_url ?? '', categoria_id ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT actualizar producto — solo admin
router.put('/:id', authMiddleware, soloAdmin, async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, imagen_url, categoria_id, activo } = req.body;
  try {
    const result = await pool.query(
      `UPDATE productos SET
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        precio = COALESCE($3, precio),
        stock = COALESCE($4, stock),
        imagen_url = COALESCE($5, imagen_url),
        categoria_id = COALESCE($6, categoria_id),
        activo = COALESCE($7, activo)
       WHERE id = $8 RETURNING *`,
      [nombre, descripcion, precio, stock, imagen_url, categoria_id, activo, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE (soft delete) producto — solo admin
router.delete('/:id', authMiddleware, soloAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE productos SET activo = FALSE WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
