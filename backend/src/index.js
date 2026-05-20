const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const productosRouter = require('./routes/productos');
const categoriasRouter = require('./routes/categorias');
const authRouter = require('./routes/auth');
const pedidosRouter = require('./routes/pedidos');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Seguridad: headers HTTP ──────────────────────────────────────────
app.use(helmet());

// ── CORS: solo el frontend autorizado ───────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));

// ── Body parser con límite de tamaño ────────────────────────────────
app.use(express.json({ limit: '50kb' }));

// ── Rate limiting: login (brute-force) ──────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,                   // máx 10 intentos por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Intenta en 15 minutos.' },
});

// ── Rate limiting: pedidos (anti-spam) ──────────────────────────────
const pedidosLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 30,                   // máx 30 pedidos por IP por hora
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta más tarde.' },
});

// ── Rutas ────────────────────────────────────────────────────────────
app.use('/api/auth/login', loginLimiter);
app.use('/api/pedidos', pedidosLimiter);

app.use('/api/auth', authRouter);
app.use('/api/productos', productosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/pedidos', pedidosRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Ejecutar migraciones y crear admin antes de escuchar
async function start() {
  try {
    const migrate = require('./scripts/migrate');
    await migrate();
    const createAdmin = require('./scripts/createAdmin');
    await createAdmin();
  } catch (err) {
    console.error('Error en startup:', err.message);
  }
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

start();

