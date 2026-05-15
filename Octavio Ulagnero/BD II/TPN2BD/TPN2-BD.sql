-- CONSULTAS MAS UTILES PARA UN NEGOCIO SEGUN YO
-- 10 productos mas vendidos por cantidad
SELECT producto_nombre, categoria,
    SUM(cantidad) AS total_unidades_vendidas,
    SUM(subtotal) AS ingreso_total
FROM vista_detalle_pedidos
GROUP BY producto_nombre, categoria
ORDER BY total_unidades_vendidas DESC
LIMIT 10;
-- Seguimiento del estado de un pedido
SELECT estado,
    COUNT(*) AS cantidad_pedidos,
    SUM(subtotal) AS monto_total
FROM vista_detalle_pedidos
GROUP BY estado
ORDER BY cantidad_pedidos DESC;
-- Categorias de producto con mas de 5 ventas
SELECT categoria,
    SUM(cantidad) AS productos_vendidos,
    COUNT(DISTINCT id_pedido) AS pedidos_incluidos,
    SUM(subtotal) AS ingreso_total
FROM vista_detalle_pedidos
GROUP BY categoria
HAVING SUM(cantidad) > 5
ORDER BY productos_vendidos DESC;