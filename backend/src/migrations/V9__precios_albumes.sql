-- V9: Precios definitivos de los álbumes
UPDATE productos SET precio = 18000  WHERE nombre LIKE '%Tapa Blanda%';
UPDATE productos SET precio = 60000  WHERE nombre LIKE '%Tapa Dura%';
UPDATE productos SET precio = 110000 WHERE nombre LIKE '%Edición Oro%';
