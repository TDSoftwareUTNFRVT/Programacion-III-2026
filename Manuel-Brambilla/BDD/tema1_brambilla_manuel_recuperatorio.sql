-- Ejercicio 1-A ========================================
CREATE OR REPLACE VIEW vista_pedidos_detalle as
SELECT 
	dp.id_pedido,
    c.razon_social,
    pr.nombre,
    dp.cantidad,
    dp.precio_venta,
    SUM(dp.cantidad * dp.precio_venta) as Subtotal
FROM detalle_pedido pd
INNER JOIN pedidos pd ON pd.id_pedido = dp.id_pedido
INNER JOIN clientes c ON c.id_cliente = pd.id_cliente
INNER JOIN productos pr ON pr.id_producto = dp.id_producto;

-- Ejercicio 1-B ==============================================
CREATE OR REPLACE VIEW vista_stock_bajo as
SELECT
	pr.id_producto,
    pr.nombre,
    pr.categoria,
    pr.stock_actual
FROM productos pr
WHERE pr.stock_actual < 50;

-- Ejercicio 1-C ================================================
SELECT 
	razon_social,
    SUM(Subtotal)
FROM vista_pedidos_detalles
GROUP BY razon_social
ORDER BY total_facturado DESC;

-- Ejercicio 2-A ========================================
DELIMITER $$
CREATE TRIGGER trg_actualizar_stock
AFTER INSERT ON detalle_pedido
FOR EACH ROW
BEGIN
    UPDATE productos
    SET stock_actual = stock_actual - NEW.cantidad
    WHERE id_producto = NEW.id_producto;
END$$
DELIMITER ;

-- Ejercicio 2-B ========================================
DELIMITER $$
CREATE TRIGGER trg_auditoria_stock
AFTER UPDATE ON productos
FOR EACH ROW
BEGIN
    IF OLD.stock_actual <> NEW.stock_actual THEN
        INSERT INTO auditoria_stock (id_producto, stock_anterior, stock_nuevo)
        VALUES (NEW.id_producto, OLD.stock_actual, NEW.stock_actual);
    END IF;
END$$
DELIMITER ;

-- Ejercicio 2-C ========================================================
START TRANSACTION;

INSERT INTO pedidos (id_cliente, fecha_pedido, estado)
VALUES (4, '2026-06-10', 'CONFIRMADO');

SET @id_pedido = LAST_INSERT_ID();

INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_venta)
VALUES (@id_pedido, 1, 5, 1300.00);

INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_venta)
VALUES (@id_pedido, 5, 3, 850.00); 

COMMIT;
-- ROLLBACK;

-- Ejercicio 2-D ===============================================================

SELECT id_producto, nombre, stock_actual FROM productos WHERE id_producto = 1;

SELECT * FROM auditoria_stock ORDER BY id_auditoria DESC;
