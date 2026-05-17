--  EJERCICIO 4 - tienda_online
--  Vista RESUMEN_CLIENTES
--  Muestra por cada cliente:
--  nombre, ciudad, cantidad de pedidos y monto total acumulado
--  Ordenada por monto total DESC
USE tienda_online;

-- ALTER TABLE clientes
--  ADD COLUMN ciudad VARCHAR(60) NULL;

UPDATE clientes SET ciudad = 'Rosario'       WHERE id_cliente = 1;
UPDATE clientes SET ciudad = 'Buenos Aires'  WHERE id_cliente = 2;
UPDATE clientes SET ciudad = 'Córdoba'       WHERE id_cliente = 3;
UPDATE clientes SET ciudad = 'Mendoza'       WHERE id_cliente = 4;

CREATE OR REPLACE VIEW RESUMEN_CLIENTES AS
SELECT
    c.nombre                                           AS nombre_cliente,
    c.ciudad,
    COUNT(DISTINCT p.id_pedido)                        AS cantidad_pedidos,
    COALESCE(SUM(dp.cantidad * dp.precio_unitario), 0) AS monto_total
FROM       clientes        c
LEFT JOIN  pedidos         p  ON p.id_cliente = c.id_cliente
LEFT JOIN  detalle_pedido  dp ON dp.id_pedido = p.id_pedido
GROUP BY   c.id_cliente, c.nombre, c.ciudad
ORDER BY   monto_total DESC;

SELECT * FROM RESUMEN_CLIENTES;


