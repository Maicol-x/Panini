-- V6: Corregir álbumes — imágenes, precios y agregar variante faltante

-- Tapa Blanda ($15.000): imagen correcta
UPDATE productos
SET imagen_url = '/images/album_2.png'
WHERE nombre = 'Álbum Panini Mundial 2026 — Tapa Blanda';

-- El producto "Tapa Dura" era en realidad la Edición Oro → corregir
UPDATE productos
SET nombre      = 'Álbum Panini Mundial 2026 — Edición Oro',
    precio      = 100000,
    descripcion = 'Álbum oficial Panini FIFA World Cup 2026. Edición especial Oro — tapa premium coleccionable.',
    imagen_url  = '/images/Album_oro.png'
WHERE nombre = 'Álbum Panini Mundial 2026 — Tapa Dura';

-- Insertar Tapa Dura ($50.000) que faltaba
INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id)
VALUES (
  'Álbum Panini Mundial 2026 — Tapa Dura',
  'Álbum oficial Panini FIFA World Cup 2026. Tapa dura resistente.',
  50000,
  30,
  '/images/Album.png',
  3
);
