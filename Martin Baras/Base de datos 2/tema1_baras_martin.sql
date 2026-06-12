-- Creacion tabas
CREATE TABLE productos(
	id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR (100) NOT NULL, 
    categoria VARCHAR (50) NOT NULL,
    precio_unitario DECIMAL (10,2) NOT NULL,
    stock_actual INT NOT NULL DEFAULT 0
);
CREATE TABLE clientes(
	id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    razon_social VARCHAR (100) NOT NULL, 
    cuit VARCHAR (15) NOT NULL UNIQUE,
    saldo_cuenta DECIMAL (10,2) NOT NULL
);
CREATE TABLE pedidos(
	id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL, 
    fecha_pedido DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);
CREATE TABLE detalle_pedido(
	id_detalle INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
    
);
CREATE TABLE auditoria_stock(
	id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    stock_anterior INT NOT NULL,
    stock_nuevo INT NOT NULL,
    fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insercion de valores
INSERT INTO clientes (razon_social, cuit, saldo_cuenta) VALUES
('almacen don jose', '30-11111111-1',0.00),
('despensa la esquina', '30-22222222-2',5000.00),
('supermercado norte', '30-33333333-3', 0.00),
('kiosco central','30-44444444-4',1200.00);

INSERT INTO pedidos (id_cliente, fecha_pedido, estado) VALUES
(1,'2026-05-02','CONFIRMADO'),
(2,'2026-05-03','PENDIENTE'),
(3,'2026-05-05','CONFIRMADO');

INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_venta) VALUES
(1,1,10,1300.00),
(1,3,20,950.00),
(2,2,5,2600.00),
(3,5,15,850.00),
(3,6,8,3300.00);

-- 1.a
CREATE VIEW vista_pedidos_detalle AS
SELECT detalle_pedido.id_detalle AS Numero_pedido,
clientes.razon_social AS Razon_social,
productos.nombre AS Producto,
detalle_pedido.cantidad AS Cantidad,
detalle_pedido.precio_venta AS Precio_unitario,
detalle_pedido.cantidad * Precio_unitario AS Subtotal
FROM detalle_pedido
JOIN pedidos ON detalle_pedido.id_pedido = pedidos.id_pedido
JOIN clientes ON pedidos.id_cliente = clientes.id_cliente
JOIN productos ON detalle_pedido.id_producto = productos.id_producto;

-- 1.b
CREATE VIEW vista_stock_bajo AS
SELECT 
id_producto AS ID_Producto,
nombre AS Nombre,
categoria AS Categoria,
stock_actual AS Stock
FROM productos
WHERE stock_actual <=50;

-- 1.c
CREATE VIEW suma_subtotales AS
SELECT Razon_social, SUM(Subtotal) AS Total FROM vista_pedidos_detalle GROUP BY Razon_social ORDER BY Total DESC;

-- 2.a
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

-- 2.b
DELIMITER $$
CREATE TRIGGER trg_auditoria_stock
AFTER UPDATE ON productos
FOR EACH ROW
BEGIN
	INSERT INTO auditoria_stock (id_producto, stock_anterior, stock_nuevo, fecha_cambio)
    VALUES (NEW.id_producto, OLD.stock_actual, NEW.stock_actual, NOW());
END$$
DELIMITER ;

-- 2.c
DELIMITER $$
START TRANSACTION;
BEGIN
	INSERT INTO pedidos (id_cliente, fecha_pedido, estado)
    VALUES (4, '2026-01-01', 'confirmado');
    INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_venta)
    VALUES
    (LAST_INSERT_ID(), 1, 5, 1300.00),
    (LAST_INSERT_ID(), 5, 3, 850.00);
END$$
ROLLBACK;
DELIMITER ;

-- 2.d
DELIMITER $$
CREATE PROCEDURE registrar_pedido()
BEGIN
    START TRANSACTION;
    INSERT INTO pedidos (id_cliente, fecha_pedido, estado)
    VALUES (4, '2026-01-01', 'CONFIRMADO');
    INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_venta)
    VALUES
        (LAST_INSERT_ID(), 1, 5, 1300.00),
        (LAST_INSERT_ID(), 5, 3, 850.00);
    COMMIT;
END$$
DELIMITER ;
CALL registrar_pedido();
SELECT * FROM productos;
SELECT * FROM auditoria_stock;




