-- ejercicio 1.a 
CREATE VIEW vista_resumen_pedidos AS
SELECT 
pedidos.id_pedido, 
clientes.razon_social, 
pedidos.fecha_pedido, 
pedidos.estado,
SUM(detalle_pedido.cantidad) AS unidades_pedidas,
SUM(detalle_pedido.cantidad * detalle_pedido.precio_venta) AS total_pedido
FROM pedidos 
INNER JOIN clientes ON pedidos.id_cliente = clientes.id_cliente
INNER JOIN detalle_pedido ON detalle_pedido.id_pedido = pedidos.id_pedido
  
-- ejercicio 1.b
CREATE VIEW vista_productos_limpieza AS 
SELECT 
productos.id_producto,
productos.nombre, 
productos.precio_unitario,
productos.stock_actual
FROM productos
WHERE categoria = 'limpieza'
ORDER BY precio_unitario DESC

-- ejercicio 1.c
SELECT id_pedido, total_pedido FROM vista_resumen_pedidos
WHERE total_pedido > 20000

-- ejercicio 2.a
DELIMITER $$
CREATE TRIGGER trg_validar_stock
BEFORE INSERT ON detalle_pedido 
FOR EACH ROW 
BEGIN
	DECLARE stock_actual INT;
    SELECT stock
    INTO stock_actual
    FROM productos
    WHERE id_producto = NEW.id_producto;
    IF NEW.cantidad > stock_actual THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No hay suficiente stock';
    END IF;
END$$
DELIMITER ; 

-- ejercicio 2.b
DELIMITER $$
CREATE TRIGGER trg_actualizar_saldo_cliente
AFTER INSERT ON detalle_pedido
FOR EACH ROW 
BEGIN
	UPDATE clientes
    INNER JOIN pedidos ON clientes.id_cliente = pedidos.id_cliente
    SET saldo_cuenta = saldo_cuenta + (NEW.cantidad * NEW.precio_venta)
    WHERE pedidos.id_producto = NEW.id_producto;
END$$
DELIMITER ;

-- ejercicio 2.c
START TRANSACTION;
	INSERT INTO pedidos(id_cliente, fecha_pedido, estado) VALUES
	(3, '2026-05-10', 'CONFIRMADO');
	INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_venta)VALUES
	(LAST_INSERT_ID(), 1, 30, 4600);
	INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_venta)VALUES
	(LAST_INSERT_ID(), 2, 100, 3300);
COMMIT;
ROLLBACK;

-- ejercicio 2.d
SELECT id_producto, nombre, stock_actual
FROM productos
WHERE id_producto IN(1,2);

SELECT *
FROM pedidos
WHERE id_cliente = 3
AND fecha_pedido = '2026-05-10';
