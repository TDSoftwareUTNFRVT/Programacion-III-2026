CREATE DATABASE almacen_mayorista;
USE almacen_mayorista;

CREATE TABLE productos (
id_producto INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(100) NOT NULL,
categoria VARCHAR(50) NOT NULL,
precio_unitario DECIMAL(10,2) NOT NULL,
stock_actual INT NOT NULL DEFAULT 0);

CREATE TABLE clientes (
id_cliente INT PRIMARY KEY AUTO_INCREMENT,
razon_social VARCHAR(100) NOT NULL,
cuit VARCHAR(15) NOT NULL UNIQUE,
saldo_cuenta DECIMAL(10,2) NOT NULL DEFAULT 0);

CREATE TABLE pedidos(
id_pedido INT PRIMARY KEY AUTO_INCREMENT,
id_cliente INT NOT NULL,
fecha_pedido DATE NOT NULL,
estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente));

CREATE TABLE detalle_pedido(
id_detalle INT PRIMARY KEY AUTO_INCREMENT,
id_pedido INT NOT NULL,
id_producto INT NOT NULL,
cantidad INT NOT NULL,
precio_venta DECIMAL(10,2) NOT NULL,
FOREIGN KEY(id_pedido) REFERENCES pedidos(id_pedido),
FOREIGN KEY(id_producto) REFERENCES productos(id_producto));

CREATE TABLE auditoria_stock(
id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
id_producto INT NOT NULL,
stock_anterior INT NOT NULL,
stock_nuevo INT NOT NULL,
fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(id_producto) REFERENCES productos(id_producto));

INSERT INTO productos (nombre, categoria, precio_unitario, stock_actual) VALUES ('Arroz 1kg', 'Almacen',1200.00, 150),
('aceite girasol 1L', 'almacen',2500.00, 80),
('fideos 500g', 'almacen',900.00, 200),
('detergente 750ml', 'limpieza', 1500.00, 60),
('lavandina 1L', 'limpieza', 800.00, 100),
('yerba 1kg', 'almacen', 3200.00, 90),
('jabon en polvo 3kg', 'limpieza', 4500.00, 90);

INSERT INTO clientes(razon_social, cuit, saldo_cuenta) VALUES
('Almacen Don Jose', '30-111111111-1', 0.00),
('Despensa La Esquina', '30-22222222-2', 5000.00),
('Supermercado Norte', '30-33333333-3',0.00),
('Kiosco Central', '30-44444444-4', 1200.00);

INSERT INTO pedidos(id_cliente, fecha_pedido, estado) VALUES
(1, '2026-05-02', 'CONFIRMADO'),
(2, '2026-05-03', 'PENDIENTE'),
(3, '2026-05-05', 'CONFIRMADO');

INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_venta) VALUES
(1, 1, 10, 1300.00),
(1, 3, 20, 950.00),
(2, 2, 5, 2600.00),
(3, 5, 15, 850.00),
(3, 6, 8, 3300.00);

--EJERCICIO 1 VIEWS
--A)
CREATE VIEW vista_resumen_pedidos AS
SELECT ped.id_pedido, ped.fecha_pedido, ped.estado, SUM(dtl.cantidad) AS 'total_cantidad', SUM(dtl.cantidad * dtl.precio_venta) AS 'monto_total' FROM detalle_pedido dtl 
INNER JOIN pedidos ped ON ped.id_pedido = dtl.id_pedido
GROUP BY ped.id_pedido, ped.fecha_pedido, ped.estado; 

--B)
CREATE VIEW vista_productos_limpieza AS
SELECT id_producto, nombre, precio_unitario, stock_actual FROM productos WHERE categoria = 'limpieza' ORDER BY precio_unitario DESC;
--C)
--SELECT * FROM vista_resumen_pedidos WHERE monto_total > 20000.00;

--EJERCICIO 2 TRIGGERS Y TRANSACTIONS
--A)
DELIMITER$$
	CREATE TRIGGER trg_validar_stock
	BEFORE INSERT ON detalle_pedido
	FOR EACH ROW
		BEGIN 
		DECLARE var_stock INT;
		
        SELECT stock INTO var_stock FROM productos WHERE id_producto = 			NEW.id_producto;

		IF(var_stock < NEW.cantidad) THEN
		SIGNAL SQLSTATE'45000';
		SET MESSAGE_TEXT = 'Error, stock insuficiente';
		END IF;
		END$$
DELIMITER;

--B)

DELIMITER$$
	CREATE TRIGGER trg_actualizar_saldo_cliente 
	AFTER INSERT ON detalle_pedido
	FOR EACH ROW
		DECLARE var_id_cliente INT;
    	DECLARE var_subtotal DECIMAL(10,2);

   
    	SELECT id_cliente INTO var_id_cliente 
    	FROM pedidos 
    	WHERE id_pedido = NEW.id_pedido;
  
    	SET var_subtotal = NEW.cantidad * NEW.precio_unitario;	

    	UPDATE clientes 
    	SET saldo_cliente = saldo_cliente + var_subtotal 
    	WHERE id_cliente = var_id_cliente;
DELIMITER ;

--C)

SET autocommit = 0;
START TRANSACTION;
INSERT INTO pedidos (id_cliente, fecha_pedido, estado) VALUES 
(3, '2026-06-10', 'CONFIRMADO');
SET @nuevo_pedido_id = LAST_INSERT_ID();
SET @producto_A = 10;
SET @producto_B = 15;
INSERT INTO detalle_pedido(id_pedido, id_producto, cantidad, precio_venta) VALUES 
(@nuevo_pedido_id, @producto_A, 30, 4600.00),
(@nuevo_pedido_id, @producto_B, 100,3300.00);
IF (
    (SELECT stock_actual FROM productos WHERE id_producto = @producto_A) < 30 
    OR 
    (SELECT stock_actual FROM productos WHERE id_producto = @producto_B) < 100
) THEN
    ROLLBACK;
ELSE
COMMIT;
END IF;