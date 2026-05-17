--  EJERCICIO 3 - tienda_online
--  Productos que nunca fueron incluidos en ningún pedido
--  Resuelta de dos formas distintas
USE tienda_online;
-- Forma 1: LEFT JOIN
SELECT
    pr.id_producto,
    pr.nombre,
    pr.precio,
    cat.nombre AS categoria
FROM       productos       pr
LEFT  JOIN detalle_pedido  dp  ON dp.id_producto  = pr.id_producto
INNER JOIN categorias      cat ON cat.id_categoria = pr.id_categoria
WHERE dp.id_producto IS NULL;

-- Forma 2: subconsulta NOT IN
SELECT
    pr.id_producto,
    pr.nombre,
    pr.precio,
    cat.nombre AS categoria
FROM       productos   pr
INNER JOIN categorias  cat ON cat.id_categoria = pr.id_categoria
WHERE pr.id_producto NOT IN (
    SELECT DISTINCT id_producto
    FROM   detalle_pedido
    WHERE  id_producto IS NOT NULL
);
