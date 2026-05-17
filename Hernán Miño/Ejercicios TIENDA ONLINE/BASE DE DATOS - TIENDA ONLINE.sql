create database IF NOT EXISTS tienda_online;
use tienda_online;

CREATE TABLE IF NOT EXISTS categorias(
	id_categoria TINYINT Primary Key auto_increment,
	nombre VARCHAR(50) NOT NULL,
	descripcion VARCHAR(250));

CREATE TABLE IF NOT EXISTS productos(
	id_producto SMALLINT (5) Primary Key auto_increment,
	nombre VARCHAR(100) Not Null,
	precio DECIMAL(10,2) Not Null,
	stock TINYINT(2) DEFAULT 0,
	id_categoria TINYINT(2),
	activo TINYINT(1) DEFAULT 1,	
	FOREIGN KEY(id_categoria) REFERENCES categorias(id_categoria));

CREATE TABLE IF NOT EXISTS clientes(
	id_cliente SMALLINT(4) Primary Key auto_increment,
	nombre VARCHAR(60) Not Null,
	email VARCHAR(100) Not Null UNIQUE,
	fecha_registro DATE);

CREATE TABLE IF NOT EXISTS pedidos(
	id_pedido SMALLINT(5) Primary Key Auto_Increment,
	id_cliente SMALLINT(4), 
	fecha_pedido DATE Not Null,
	estado ENUM('pendiente','enviado','entregado'),
	FOREIGN KEY(id_cliente)REFERENCES clientes(id_cliente));
    
CREATE TABLE IF NOT EXISTS detalle_pedido(
	id_detalle SMALLINT(5) Primary Key Auto_Increment,
	id_pedido SMALLINT(5) Not Null,
	id_producto SMALLINT(5) Not Null,
	cantidad TINYINT(2) Not Null DEFAULT 1,
	precio_unitario DECIMAL (10,2) Not Null,
	FOREIGN KEY(id_pedido)REFERENCES pedidos(id_pedido),
	FOREIGN KEY(id_producto)REFERENCES productos(id_producto));
    
-- Inserción en Categorías
INSERT INTO categorias (nombre, descripcion) VALUES
('Electrónica', 'Dispositivos y accesorios electrónicos'),
('Ropa', 'Indumentaria en general'),
('Hogar', 'Artículos para el hogar');

-- Inserción en Productos
INSERT INTO productos (nombre, precio, stock, id_categoria) VALUES
('Auriculares Bluetooth', 3500.00, 20, 1),
('Smartwatch', 8900.00, 5, 1),
('Remera básica', 950.00, 50, 2),
('Campera impermeable', 4200.00, 15, 2),
('Silla ergonómica', 18500.00, 8, 3),
('Lámpara LED', 750.00, 30, 3);

-- Inserción en Clientes
INSERT INTO clientes (nombre, email, fecha_registro) VALUES
('Ana García', 'ana@email.com', '2024-01-15'),
('Luis Pérez', 'luis@email.com', '2024-03-20'),
('María Torres', 'maria@email.com', '2024-06-10'),
('Juan López', 'juan@email.com', '2025-01-05');

-- Inserción en Pedidos
INSERT INTO pedidos (id_cliente, fecha_pedido, estado) VALUES
(1, '2025-03-01', 'entregado'),
(1, '2025-04-10', 'enviado'),
(2, '2025-03-15', 'entregado'),
(3, '2025-04-01', 'pendiente'),
(4, '2025-04-08', 'pendiente');

-- Inserción en Detalle de Pedido
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES
(1, 1, 1, 3500.00),
(1, 3, 2, 950.00),
(2, 2, 1, 8900.00),
(3, 4, 1, 4200.00),
(3, 6, 2, 750.00),
(4, 5, 1, 18500.00),
(5, 1, 2, 3500.00),
(5, 3, 3, 950.00);