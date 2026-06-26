CREATE DATABASE almacen_mayorista;
USE almacen_mayorista;

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
 FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);
CREATE TABLE detalle_pedido (
 id_detalle INT PRIMARY KEY AUTO_INCREMENT,
 id_pedido INT NOT NULL,
 id_producto INT NOT NULL,
 cantidad INT NOT NULL,
 precio_venta DECIMAL(10,2) NOT NULL,
 FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
 FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);
CREATE TABLE auditoria_stock (
 id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
 id_producto INT NOT NULL,
 stock_anterior INT NOT NULL,
 stock_nuevo INT NOT NULL,
 fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

INSERT INTO productos (nombre, categoria, precio_unitario, stock_actual) VALUES
('Arroz 1kg', 'Almacén', 1200.00, 150),
('Aceite Girasol 1L','Almacén', 2500.00, 80),
('Fideos 500g', 'Almacén', 900.00, 200),
('Detergente 750ml', 'Limpieza', 1500.00, 60),
('Lavandina 1L', 'Limpieza', 800.00, 100),
('Yerba 1kg', 'Almacén', 3200.00, 90),
('Jabón en polvo 3kg','Limpieza', 4500.00, 40);
INSERT INTO clientes (razon_social, cuit, saldo_cuenta) VALUES
('Almacén Don José', '30-11111111-1', 0.00),
('Despensa La Esquina', '30-22222222-2', 5000.00),
('Supermercado Norte', '30-33333333-3', 0.00),
('Kiosco Central', '30-44444444-4', 1200.00);
INSERT INTO pedidos (id_cliente, fecha_pedido, estado) VALUES
(1, '2026-05-02', 'CONFIRMADO'),
(2, '2026-05-03', 'PENDIENTE'),
(3, '2026-05-05', 'CONFIRMADO');
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_venta) VALUES
(1, 1, 10, 1300.00),
(1, 3, 20, 950.00),
(2, 2, 5, 2600.00),
(3, 5, 15, 850.00),
(3, 6, 8, 3300.00);


-- Ejercicio 1.a 

CREATE VIEW vista_pedidos_detalles AS
	SELECT
	pedidos.id_pedido,
	clientes.razon_social,
    productos.nombre,
    detalle_pedido.cantidad,
    detalle_pedido.precio_venta,
    sum(detalle_pedido.cantidad * detalle_pedido.precio_venta) as subtotal
FROM detalle_pedido
JOIN productos on detalle_pedido.id_producto = productos.id_producto
JOIN pedidos on detalle_pedido.id_pedido = pedidos.id_pedido
JOIN clientes on clientes.id_cliente = pedidos.id_cliente
GROUP BY id_pedido, razon_social, nombre, cantidad, precio_venta;



-- Ejercicio 1.b 

 CREATE VIEW vista_stock_bajo AS
	SELECT
	id_producto,
    nombre,
    categoria,
    stock_actual
FROM productos
WHERE stock_actual = stock_actual < 50


-- Ejercicio 1.c 

SELECT 
id_cliente
from vista_pedidos_detalle
WHERE su
ORDER BY subtotal desc

-- Ejercicio 2.a

DELIMITER $$
CREATE TRIGGER trg_actualizar_stock
AFTER INSERT ON detalle_pedido;
FOR EACH ROW 
BEGIN 
	DECLARE v_stock_actual INT;
    DECLARE v_cantidad INT;
    SET v_stock_actual = 
    



    

