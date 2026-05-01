USE tienda_online; 

-- ejercicio 1

-- alter table clientes add column telefono varchar(20);
-- select nombre from clientes;
UPDATE clientes SET telefono = '+54 341 4000001' WHERE nombre = 'Ana García';

-- ejercicio 2
SELECT p.id_pedido, 
c.nombre AS nombre_cliente, 
c.ciudad AS ciudad_cliente, 
p.fecha AS fecha_pedido,
p.estado, SUM(dp.cantidad * dp.precio_unitario) AS total_pedido
FROM pedidos p
INNER JOIN clientes c ON p.id_cliente = c.id_cliente
INNER JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
GROUP BY p.id_pedido, c.nombre, c.ciudad, p.fecha, p.estado 
ORDER BY total_pedido DESC;

-- primera opcion
SELECT pr.id_producto, pr.nombre, dp.id_detalle
FROM productos pr 
LEFT JOIN detalle_pedido dp ON pr.id_producto = dp.id_producto;

-- segunda opcion
SELECT pr.id_producto, pr.nombre 
FROM productos pr 
WHERE pr.id_producto  
NOT IN
(
SELECT dp.id_producto
FROM detalle_pedido dp
);

-- ejercicio 4 

CREATE VIEW resumen_cliente AS
SELECT 
c.id_cliente,
c.nombre AS nombre_cliente,
c.ciudad AS ciudad_cliente,
COUNT(p.id_pedido) AS cantidad_pedidos,
SUM(dp.cantidad * dp.precio_unitario) AS monto_total
FROM clientes c
JOIN pedidos p 
ON c.id_cliente = p.id_cliente 
JOIN detalle_pedido dp 
ON p.id_pedido = dp.id_pedido
GROUP BY c.id_cliente, c.nombre, c.ciudad
ORDER BY monto_total DESC;

SELECT * FROM resumen_cliente