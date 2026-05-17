--  EJERCICIO 2 - tienda_online
--  Listado de todos los pedidos mostrando:
--  número de pedido, nombre de cliente, fecha, estado
--  y total del pedido (cantidad * precio_unitario)
--  Ordenado por total DESC

USE tienda_online;

SELECT
    p.id_pedido                                       AS numero_pedido,
    c.nombre                                          AS nombre_cliente,
    c.email                                           AS contacto,
    p.fecha_pedido,
    p.estado,
    SUM(dp.cantidad * dp.precio_unitario)             AS total_pedido
FROM       pedidos         p
INNER JOIN clientes        c  ON c.id_cliente = p.id_cliente
INNER JOIN detalle_pedido  dp ON dp.id_pedido = p.id_pedido
GROUP BY
    p.id_pedido,
    c.nombre,
    c.email,
    p.fecha_pedido,
    p.estado
ORDER BY total_pedido DESC;
