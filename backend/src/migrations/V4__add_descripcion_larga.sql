-- V4: Agregar descripción larga e imágenes a productos

ALTER TABLE productos ADD COLUMN IF NOT EXISTS descripcion_larga TEXT;

UPDATE productos SET
  imagen_url       = 'https://placehold.co/600x400/1565c0/ffffff?text=Sobre+x7',
  descripcion_larga = E'Cada sobre contiene 7 láminas sorpresa del álbum oficial Panini FIFA World Cup 2026™.\n\nLas láminas incluyen jugadores de las 48 selecciones participantes, estadios, escudos y láminas especiales brillantes (foil).\n\nIdeal para comenzar o completar tu colección. Las láminas miden 5,5 × 6,5 cm y son de alta calidad.\n\n⚽ 7 láminas por sobre\n✦ Láminas especiales foil incluidas\n🌍 48 selecciones del mundo'
WHERE nombre = 'Sobre x7 láminas';

UPDATE productos SET
  imagen_url       = 'https://placehold.co/600x400/0d47a1/ffffff?text=Caja+x104',
  descripcion_larga = E'La caja display oficial contiene 104 sobres sellados, equivalentes a 728 láminas sorpresa.\n\nEs la opción más económica por sobre y la preferida por coleccionistas y revendedores. Cada caja trae una distribución especial que maximiza la variedad de láminas.\n\nIncluye al menos 2 láminas foil brillantes por sobre en promedio.\n\n📦 104 sobres por caja\n🎯 728 láminas en total\n💰 Mejor precio por sobre\n🏆 Ideal para completar el álbum'
WHERE nombre = 'Caja x104 sobres';

UPDATE productos SET
  imagen_url       = 'https://placehold.co/600x400/1b5e20/ffffff?text=Album+Tapa+Blanda',
  descripcion_larga = E'El álbum oficial Panini FIFA World Cup 2026™ en su versión tapa blanda.\n\nCon espacios para todas las láminas de las 48 selecciones, incluye secciones para jugadores, estadios, escudos nacionales y láminas especiales.\n\nTapa blanda flexible de alta durabilidad, páginas en papel couché, y diseño oficial licenciado por FIFA.\n\n📖 Páginas en papel couché\n🗂️ Secciones por grupo y selección\n🎨 Diseño oficial FIFA\n⚽ Compatible con todos los sobres 2026'
WHERE nombre = 'Álbum Panini Mundial 2026 — Tapa Blanda';

UPDATE productos SET
  imagen_url       = 'https://placehold.co/600x400/b71c1c/ffffff?text=Album+Tapa+Dura',
  descripcion_larga = E'Edición especial del álbum oficial Panini FIFA World Cup 2026™ con tapa dura premium.\n\nPerfecto para coleccionistas que quieren preservar su colección en óptimas condiciones. La tapa dura protege las páginas interiores y da un acabado de lujo a la colección.\n\nMismo contenido que la versión tapa blanda pero con materiales de mayor calidad y lomo reforzado.\n\n🏅 Edición especial premium\n💎 Tapa dura resistente\n🔒 Lomo reforzado\n📐 Mismo formato que versión blanda'
WHERE nombre = 'Álbum Panini Mundial 2026 — Tapa Dura';
