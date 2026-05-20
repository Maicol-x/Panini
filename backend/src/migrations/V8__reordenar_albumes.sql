-- V8: Reordenar álbumes — Edición Oro primero, luego Tapa Dura, luego Tapa Blanda

UPDATE productos SET sort_order = 3 WHERE nombre LIKE '%Edición Oro%';
UPDATE productos SET sort_order = 4 WHERE nombre LIKE '%Tapa Dura%';
UPDATE productos SET sort_order = 5 WHERE nombre LIKE '%Tapa Blanda%';
