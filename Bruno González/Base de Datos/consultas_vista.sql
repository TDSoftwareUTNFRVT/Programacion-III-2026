SELECT * FROM tienda_online.vista_detalle_pedidos;

-- SELECT DISTINCT id_pedido, cliente_nombre AS cliente FROM tienda_online.vista_detalle_pedidos ORDER BY id_pedido;

-- 1) Consulta para ver las ventas totales de cada producto
-- SELECT 
	-- producto_nombre AS producto, 
	-- SUM(cantidad) AS cantidad_total, 
	-- SUM(subtotal) AS subtotal_completo 
-- FROM tienda_online.vista_detalle_pedidos
-- WHERE estado = 'entregado'
-- GROUP BY producto_nombre
-- ORDER BY producto_nombre;

-- 2) Consulta para obtener la categoría que más vendió
-- SELECT 
	-- categoria, 
	-- SUM(subtotal) AS monto_total_vendido 
-- FROM tienda_online.vista_detalle_pedidos
-- WHERE estado = 'entregado'
-- GROUP BY categoria
-- ORDER BY monto_total_vendido DESC;

-- 3) Consulta para obtener la categoría que menos vendió
-- SELECT 
	-- categoria, 
	-- SUM(subtotal) AS monto_total_vendido 
-- FROM tienda_online.vista_detalle_pedidos
-- WHERE estado = 'entregado'
-- GROUP BY categoria 
-- ORDER BY monto_total_vendido ASC;

-- 4) Consulta para obtener los pedidos pendientes más antiguos
-- SELECT 
	-- id_pedido, 
	-- fecha, 
	-- estado, 
	-- cliente_nombre AS cliente, 
	-- ciudad, 
	-- producto_nombre AS producto, 
	-- cantidad FROM tienda_online.vista_detalle_pedidos 
-- WHERE estado = 'pendiente' 
-- ORDER BY fecha ASC, id_pedido ASC;

-- 5) Consulta para obtener a los clientes cuyo pedido ya fue entregado
-- SELECT 
	-- id_pedido, 
	-- cliente_nombre AS cliente, 
	-- producto_nombre AS pedido, 
	-- cantidad, 
	-- estado 
-- FROM tienda_online.vista_detalle_pedidos 
-- WHERE estado = 'entregado' 
-- ORDER BY 
	-- id_pedido ASC, 
	-- cliente ASC, 
	-- pedido ASC, 
	-- cantidad ASC;
    
-- 6) Consulta para obtener la ciudad con más pedidos, ya sean pendientes, enviados o entregados.
-- SELECT 
	-- ciudad, 
	-- COUNT(*) AS pedidos 
-- FROM tienda_online.vista_detalle_pedidos 
-- GROUP BY ciudad 
-- ORDER BY pedidos DESC;

-- 7) Consulta para obtener el pedido/s pendiente más retrasado.

-- SELECT 
	-- id_pedido, 
	-- fecha, 
	-- estado, 
	-- cliente_nombre AS cliente, 
	-- ciudad, 
	-- email, 
	-- producto_nombre AS producto, 
	-- cantidad 
-- FROM tienda_online.vista_detalle_pedidos 
-- WHERE estado = 'pendiente' 
-- ORDER BY fecha ASC 
-- LIMIT 1;


-- 8) Consulta para obtener los pedidos cuyas cantidades sean menores al promedio de cantidades general.

-- SELECT 
	-- id_pedido, 
	-- fecha, 
	-- estado, 
	-- cliente_nombre AS cliente, 
	-- ciudad, 
	-- email, 
	-- producto_nombre AS producto, 
	-- cantidad 
-- FROM tienda_online.vista_detalle_pedidos 
-- WHERE cantidad < (SELECT AVG(cantidad) 
-- FROM tienda_online.vista_detalle_pedidos)
-- ORDER BY id_pedido ASC, cliente ASC;