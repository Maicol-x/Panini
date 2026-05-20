-- V1: Crear tablas base e insertar datos iniciales

CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  imagen_url TEXT,
  categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categorías iniciales
INSERT INTO categorias (nombre, descripcion) VALUES
  ('Sobres', 'Sobres con 7 láminas del Mundial 2026'),
  ('Cajas', 'Cajas con 104 sobres del Mundial 2026'),
  ('Álbumes', 'Álbumes oficiales Panini FIFA World Cup 2026');

-- Productos
INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id) VALUES
  ('Sobre x7 láminas',
   'Sobre sellado con 7 láminas sorpresa del álbum oficial Panini FIFA World Cup 2026.',
   5000.00, 500, '', 1),
  ('Caja x104 sobres',
   'Caja display con 104 sobres (728 láminas). Ideal para completar el álbum oficial.',
   470000.00, 20, '', 2),
  ('Álbum Panini Mundial 2026 — Tapa Blanda',
   'Álbum oficial Panini FIFA World Cup 2026. Tapa blanda.',
   15000.00, 50, '', 3),
  ('Álbum Panini Mundial 2026 — Tapa Dura',
   'Álbum oficial Panini FIFA World Cup 2026. Edición especial tapa dura.',
   50000.00, 30, '', 3);
