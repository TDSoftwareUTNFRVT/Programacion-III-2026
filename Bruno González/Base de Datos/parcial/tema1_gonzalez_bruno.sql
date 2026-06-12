CREATE DATABASE IF NOT EXISTS parcial;
USE parcial;

CREATE TABLE productos (
	id_producto INT PRIMARY KEY AUTO_INCREMENT,
	nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    stock_actual INT NOT NULL DEFAULT 0
);

CREATE TABLE clientes (
	id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    razon_social VARCHAR(100) NOT NULL,
    cuit VARCHAR(15) NOT NULL UNIQUE,
    saldo_cuenta DECIMAL(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE pedidos (
	id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    fecha_pedido DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    FOREIGN KEY(id_cliente) REFERENCES clientes(id_cliente)
);

CREATE TABLE detalle_pedido (
	id_detalle INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    FOREIGN KEY(id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY(id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE auditoria_stock (
	id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    stock_anterior INT NOT NULL,
    stock_nuevo INT NOT NULL,
    fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(id_producto) REFERENCES productos(id_producto)
);

INSERT INTO productos(nombre, categoria, precio_unitario, stock_actual) VALUES
('Arroz 1kg', 'Almacén',  1200.00, 150),
('Aceite Girasol 1L', 'Almacén',  2500.00, 80),
('Fideos 500g', 'Almacén',  900.00, 200),
('Detergente 750ml', 'Limpieza',  1500.00, 60),
('Lavandina 1L', 'Limpieza',  800.00, 100),
('Yerba 1kg', 'Almacén',  3200.00, 90),
('Jabón en polvo 3kg', 'Limpieza',  4500.00, 40);

INSERT INTO clientes(razon_social, cuit, saldo_cuenta) VALUES
('Almacén Don José', '30-11111111-1', 0.00),
('Despensa La Esquina', '30-22222222-2', 5000.00),
('Supermercado Norte', '30-33333333-3', 0.00),
('Kiosco Central', '30-44444444-4', 1200.00);

INSERT INTO pedidos(id_cliente, fecha_pedido, estado) VALUES
(1, '2026-05-02', 'CONFIRMADO'),
(2, '2026-05-03', 'PENDIENTE'),
(3, '2026-05-05', 'CONFIRMADO');

INSERT INTO detalle_pedido(id_pedido, id_producto, cantidad, precio_venta) VALUES
(1,1,10,1300.00),
(1,3,20,950.00),
(2,2,5,2600.00),
(3,5,15,850.00),
(3,6,8,3300.00);

-- Ejercicio 1.a

CREATE OR REPLACE VIEW vista_pedidos_detalle AS SELECT
pedidos.id_pedido AS numero_pedido,
clientes.razon_social AS razon_social_cliente,
productos.nombre AS producto,
detalle_pedido.cantidad AS cantidad,
detalle_pedido.precio_venta AS precio_venta,
detalle_pedido.cantidad * detalle_pedido.precio_venta AS subtotal
FROM pedidos
INNER JOIN clientes ON clientes.id_cliente = pedidos.id_cliente
INNER JOIN detalle_pedido ON pedidos.id_pedido = detalle_pedido.id_pedido
INNER JOIN productos ON productos.id_producto = detalle_pedido.id_producto;

-- Ejercicio 1.b

CREATE OR REPLACE VIEW vista_stock_bajo AS SELECT
productos.id_producto AS id_producto,
productos.nombre AS nombre,
productos.categoria AS categoria,
productos.stock_actual
FROM productos
WHERE productos.stock_actual < 50;

-- Ejercicio 1.c

SELECT razon_social_cliente AS cliente, SUM(subtotal) AS total_facturado FROM parcial.vista_pedidos_detalle GROUP BY razon_social_cliente ORDER BY cliente, total_facturado DESC;

-- Ejercicio 2.a

DELIMITER $$
CREATE TRIGGER trg_actualizar_stock
AFTER INSERT ON detalle_pedido FOR EACH ROW
BEGIN
	UPDATE productos SET stock_actual = stock_actual - NEW.cantidad WHERE id_producto = NEW.id_producto;
END$$
DELIMITER ;

-- Ejercicio 2.b

DELIMITER $$
CREATE TRIGGER trg_auditoria_stock
AFTER UPDATE ON productos FOR EACH ROW
BEGIN
	INSERT INTO auditoria_stock(id_producto, stock_anterior, stock_nuevo) VALUES(NEW.id_producto, OLD.stock_actual, NEW.stock_actual);
END$$
DELIMITER ;

-- Ejercicio 2.c

START TRANSACTION;
	SET AUTOCOMMIT = 0;
    
    INSERT INTO pedidos(id_cliente, fecha_pedido, estado) VALUES(4, '2026-06-10', 'CONFIRMADO');
    
    INSERT INTO detalle_pedido(id_pedido, id_producto, cantidad, precio_venta) VALUES
    (4, 1, 5, 1300.00),
    (4, 5, 3, 850.00);
-- ROLLBACK; si sale todo mal
COMMIT;

-- Ejercicio 2.d

SELECT * FROM productos;
SELECT * FROM auditoria_stock;