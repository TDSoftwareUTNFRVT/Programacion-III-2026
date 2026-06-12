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
cuit  VARCHAR(15) NOT NULL UNIQUE,
saldo_cuenta DECIMAL(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE pedidos (
id_pedidos  INT PRIMARY KEY AUTO_INCREMENT,
id_cliente  INT NOT NULL,
fecha_pedido DATE NOT NULL,
estado VARCHAR(20) NOT NULL DEFAULT "PENDIENTE",
FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
);

CREATE TABLE detalle_pedido (
id_detalle INT PRIMARY KEY AUTO_INCREMENT,
id_pedido  INT NOT NULL,
id_producto  INT NOT NULL,
cantidad  INT NOT NULL,
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
('Arroz 1kg', 'Almacen', 1200.00, 150),
('Aceite Girasol 1L', 'Almacen', 25000.00, 80),
('Fideos 500g', 'Almacen', 900.00, 200),
('Detergente 750ml', 'Limpieza', 800.00, 100),
('Lavandina 1L', 'Limpieza', 800.00, 100),
('Yerba 1kg', 'Almacen', 3200.00, 90),
('Jabon en polvo 3kg', 'Limpieza', 4500.00, 40);

INSERT INTO clientes (razon_social, cuit, saldo_cuenta) VALUES
('Almacen Don jose', '30-11111111-1', 0.00),
('Despensa La Esquina', '30-22222222-2', 5000.00),
('Supermercado norte', '30-33333333-3', 0.00),
('Kiosco Central', '30-44444444-4', 1200.00) ;

INSERT INTO pedidos (id_cliente, fecha_pedido, estado) VALUES
(1, '2026-05-02', 'CONFIRMADO'),
(2, '2026-05-03', 'PENDIENTE'),
(3, '2026-05-05', 'CONFIRMADO');

INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_ventas) VALUES
(1, 1, 10, 1300.00),
(1, 3, 20, 950.00),
(2, 2, 5, 2600.00),
(3, 5, 15, 850.00),
(3, 6, 8, 3300.00);

-- Ejercicio 1.a
CREATE OR REPLACE VIEW vista_pedidos_detalle AS
SELECT pedidos.id_pedido AS nombre_pedido,
clientes.razon_social,
productos.nombre,
detalle_pedido.cantidad,
detalle_pedido.precio_venta,
SUM (detalle_pedido.cantidad * detalle_pedido.precio_venta) AS subtotal
FROM detalle_pedido
INNER JOIN clientes ON clientes.id_cliente = pedidos.id_cliente
INNER JOIN productos ON productos.id_producto = detalle_pedido.id_producto;

SELECT*FROM vista_pedidos_detalle;

-- Ejercicio 1.b
CREATE OR REPLACE VIEW vista_stock_bajo AS
SELECT productos.id_producto,
productos.nombre,
productos.categoria,
productos.stock_actual
FROM productos
WHERE stock_actual > 50;

SELECT cliente, 
COUNT(DISTINCT id_pedido) AS cantidad_pedidos, 
SUM(subtotal)             
AS total_comprado 
FROM vista_pedidos_detalle
GROUP BY cliente
ORDER BY total_comprado DESC; 

-- Ejercicio 2.a
DELIMITER $$ 
CREATE TRIGGER  trg_actualizar_stock 
AFTER INSERT  ON detalle_pedido 
FOR EACH ROW  
BEGIN  
UPDATE productos  
SET stock_actual = stock - NEW.cantidad  
WHERE id_producto = NEW.id_producto;  
END$$  
DELIMITER ;  

-- Prueba: INSERT INTO ventas (id_cliente, id_producto, cantidad, total) VALUES (1, 3, 5, 250.00); 

SELECT stock_actual FROM productos WHERE id_producto = 3;

-- Ejercicio 2.b
DELIMITER $$ 
CREATE TRIGGER trg_auditoria_stock
AFTER UPDATE ON productos 
FOR EACH ROW 
BEGIN 
    IF OLD.precio <> NEW.precio THEN 
        INSERT INTO auditoria_stock 
            (id_producto, precio_anterior, precio_nuevo, usuario, fecha_cambio) 
        VALUES 
            (NEW.id_producto, OLD.precio, NEW.precio, USER(), NOW()); 
    END IF; 
END$$ 
DELIMITER ; 

-- Ejercicio 2.c
START TRANSACTION; 
INSERT INTO pedidos (id_cliente, fecha, estado) 
VALUES (4, '2026-06-10', 'CONFIRMADO'); 
SET @id_pedido = LAST_INSERT_ID(); 
SAVEPOINT sp_pedido;     
INSERT INTO ventas (cantidad, nombre, precio_unitario)
VALUES (5, 'Arroz 1kg', 1300.00); 
SAVEPOINT sp_venta1; 
INSERT INTO ventas (cantidad, nombre, precio_unitario) 
VALUES (3, 'Lavandina 1L', 850.00); 
SAVEPOINT sp_venta2;  
UPDATE pedidos SET estado = 'confirmado' WHERE id = @id_pedido; 
COMMIT;

