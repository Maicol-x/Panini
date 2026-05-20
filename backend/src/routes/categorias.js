const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET todas las categorías
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

module.exports = router;
