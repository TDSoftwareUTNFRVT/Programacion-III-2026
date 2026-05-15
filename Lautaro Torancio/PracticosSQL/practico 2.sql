USE tienda_online;

-- primer filtro
SELECT nombre_producto, subtotal, cantidad
FROM vista_detalle_pedido 
ORDER BY subtotal DESC LIMIT 1;

-- segundo filtro
SELECT id_pedido, fecha, nombre_cliente, subtotal 
FROM vista_detalle_pedido
WHERE estado = 'pendiente';

-- tercer filtro
SELECT nombre_cliente, SUM(subtotal) AS subtotal_gastado
FROM vista_detalle_pedido
GROUP BY nombre_cliente
ORDER BY subtotal_gastado DESC;

-- cuarto filtro
SELECT id_pedido, nombre_cliente, ciudad_cliente, nombre_categoria
FROM vista_detalle_pedido
WHERE id_pedido IN(
SELECT id_pedido
FROM vista_detalle_pedido
GROUP BY nombre_cliente, id_pedido 
HAVING COUNT(id_pedido) > 1
);

-- quinto filtro 
SELECT DISTINCT nombre_cliente, ciudad_cliente, email_cliente
FROM vista_detalle_pedido
WHERE nombre_cliente NOT IN(
SELECT nombre_cliente
FROM vista_detalle_pedido
WHERE estado = 'enviado'
);