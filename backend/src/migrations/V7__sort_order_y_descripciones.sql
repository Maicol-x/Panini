-- V7: Columna sort_order para controlar el orden en catálogo + descripciones limpias

ALTER TABLE productos ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 99;

-- Orden deseado: Sobre, Caja, Tapa Dura, Tapa Blanda, Edición Oro
UPDATE productos SET sort_order = 1 WHERE nombre = 'Sobre x7 láminas';
UPDATE productos SET sort_order = 2 WHERE nombre = 'Caja x104 sobres';
UPDATE productos SET sort_order = 3 WHERE nombre LIKE '%Tapa Dura%';
UPDATE productos SET sort_order = 4 WHERE nombre LIKE '%Tapa Blanda%';
UPDATE productos SET sort_order = 5 WHERE nombre LIKE '%Edición Oro%';

-- Descripciones cortas
UPDATE productos SET descripcion = 'Sobre con 7 láminas sorpresa del FIFA World Cup 2026. ¡Completa tu álbum!'
WHERE nombre = 'Sobre x7 láminas';

UPDATE productos SET descripcion = 'Caja con 104 sobres (728 láminas). Ideal para coleccionistas y distribuidores.'
WHERE nombre = 'Caja x104 sobres';

UPDATE productos SET descripcion = 'Álbum oficial Panini FIFA World Cup 2026. Tapa dura resistente para toda la colección.'
WHERE nombre LIKE '%Tapa Dura%';

UPDATE productos SET descripcion = 'Álbum oficial Panini FIFA World Cup 2026. Versión tapa blanda, ligera y práctica.'
WHERE nombre LIKE '%Tapa Blanda%';

UPDATE productos SET descripcion = 'Álbum oficial Panini FIFA World Cup 2026. Edición Oro especial con tapa premium coleccionable.'
WHERE nombre LIKE '%Edición Oro%';

-- Descripciones largas
UPDATE productos SET descripcion_larga = 'Sobre oficial Panini con 7 láminas sorpresa para el álbum FIFA World Cup 2026. Cada sobre trae láminas aleatorias de jugadores, estadios y selecciones de los 48 países clasificados. El clásico formato de colección Panini.'
WHERE nombre = 'Sobre x7 láminas';

UPDATE productos SET descripcion_larga = 'Caja de display con 104 sobres sellados de fábrica (728 láminas en total). Perfecta para coleccionistas que quieren avanzar rápido o para distribuidores. Ahorra en comparación con sobres individuales.'
WHERE nombre = 'Caja x104 sobres';

UPDATE productos SET descripcion_larga = 'Álbum oficial Panini para la FIFA World Cup 2026. Versión tapa dura con cubierta resistente. Páginas de alta calidad para proteger tus láminas. Incluye secciones para todos los países participantes, jugadores estrella y estadios del mundial.'
WHERE nombre LIKE '%Tapa Dura%';

UPDATE productos SET descripcion_larga = 'Álbum oficial Panini para la FIFA World Cup 2026. Versión tapa blanda, ligera y fácil de llevar. Ideal para quienes empiezan la colección. Páginas de alta calidad con secciones para los 48 países del mundial.'
WHERE nombre LIKE '%Tapa Blanda%';

UPDATE productos SET descripcion_larga = 'Álbum oficial Panini para la FIFA World Cup 2026 en su Edición Especial Oro. Tapa premium dorada con acabado exclusivo. Edición limitada para el coleccionista más exigente. Las páginas interiores tienen un diseño especial con detalles dorados.'
WHERE nombre LIKE '%Edición Oro%';
