-- VISTA BASE: detalle completo de pedidos
CREATE VIEW vista_detalle_pedidos AS
SELECT
    p.id_pedido,
    p.fecha,
    p.estado,
    c.nombre        AS cliente,
    c.email,
    pr.nombre       AS producto,
    cat.nombre      AS categoria,
    dp.cantidad,
    dp.precio_unitario,
    (dp.cantidad * dp.precio_unitario) AS subtotal
FROM pedidos p
JOIN clientes c         ON p.id_cliente    = c.id_cliente
JOIN detalle_pedido dp  ON p.id_pedido     = dp.id_pedido
JOIN productos pr       ON dp.id_producto  = pr.id_producto
JOIN categorias cat     ON pr.id_categoria = cat.id_categoria;


-- FILTRO 1: Solo pedidos pendientes 
CREATE VIEW vista_pedidos_pendientes AS
SELECT * FROM vista_detalle_pedidos
WHERE estado = 'pendiente';


-- FILTRO 2: Solo pedidos entregados 
CREATE VIEW vista_pedidos_entregados AS
SELECT * FROM vista_detalle_pedidos
WHERE estado = 'entregado';


-- FILTRO 3: Total gastado por cliente 
CREATE VIEW vista_total_por_cliente AS
SELECT
    cliente,
    COUNT(DISTINCT id_pedido)       AS cantidad_pedidos,
    SUM(subtotal)                   AS total_gastado
FROM vista_detalle_pedidos
GROUP BY cliente
ORDER BY total_gastado DESC;