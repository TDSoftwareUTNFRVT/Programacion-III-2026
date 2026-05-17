-- ============================================================
--  EJERCICIO 1 - tienda_online
--  Agregar columna teléfono a clientes
--  y actualizar el teléfono de Ana García
-- ============================================================
USE tienda_online;
-- ADD COLUMN telefono VARCHAR(20) NULL;

UPDATE clientes
SET    telefono = '+543414000001'
WHERE  nombre   = 'Ana García';

SELECT id_cliente, nombre, email, telefono
FROM   clientes
WHERE  nombre = 'Ana García';
