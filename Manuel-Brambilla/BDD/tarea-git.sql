-- CREANDO BASE DE DATOS - tienda_online
-- ============================================================
CREATE DATABASE IF NOT EXISTS tienda_online;
USE tienda_online;

CREATE TABLE categorias (
    id_categoria TINYINT      AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(50)  NOT NULL,
    descripcion  VARCHAR(100)
);

CREATE TABLE productos (
    id_producto  SMALLINT      AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100)  NOT NULL,
    precio       DECIMAL(10,2) NOT NULL,
    stock        SMALLINT      UNSIGNED DEFAULT 0,
    id_categoria TINYINT,
    activo       TINYINT(1)    DEFAULT 1,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

CREATE TABLE clientes (
    id_cliente      SMALLINT     AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(60)  NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    ciudad          VARCHAR(60),
    fecha_registro  DATE
);

CREATE TABLE pedidos (
    id_pedido  SMALLINT    AUTO_INCREMENT PRIMARY KEY,
    id_cliente SMALLINT,
    fecha      DATE        NOT NULL,
    estado     ENUM('pendiente', 'enviado', 'entregado', 'cancelado'),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

CREATE TABLE detalle_pedido (
    id_detalle      SMALLINT      AUTO_INCREMENT PRIMARY KEY,
    id_pedido       SMALLINT      NOT NULL,
    id_producto     SMALLINT      NOT NULL,
    cantidad        TINYINT       NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido)   REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- =================================================
-- Insertando DATOS a tablas
-- =================================================

INSERT INTO categorias (nombre, descripcion) VALUES
('Electrónica', 'Dispositivos y accesorios electrónicos'),
('Ropa', 'Indumentaria en general'),
('Hogar', 'Artículos para el hogar');
INSERT INTO productos (nombre, precio, stock, id_categoria) VALUES
('Auriculares Bluetooth', 3500.00, 20, 1),
('Smartwatch', 8900.00, 5, 1),
('Remera básica', 950.00, 50, 2),
('Campera impermeable', 4200.00, 15, 2),
('Silla ergonómica', 18500.00, 8, 3),
('Lámpara LED', 750.00, 30, 3);
INSERT INTO clientes (nombre, email, ciudad, fecha_registro) VALUES
('Ana García', 'ana@email.com', 'Rosario', '2024-01-15'),
('Luis Pérez', 'luis@email.com', 'Buenos Aires', '2024-03-20'),
('María Torres', 'maria@email.com', 'Córdoba', '2024-06-10'),
('Juan López', 'juan@email.com', 'Rosario', '2025-01-05');
INSERT INTO pedidos (id_cliente, fecha, estado) VALUES
(1, '2025-03-01', 'entregado'),
(1, '2025-04-10', 'enviado'),
(2, '2025-03-15', 'entregado'),
(3, '2025-04-01', 'pendiente'),
(4, '2025-04-08', 'pendiente');
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES
(1, 1, 1, 3500.00),
(1, 3, 2, 950.00),
(2, 2, 1, 8900.00),
(3, 4, 1, 4200.00),
(3, 6, 2, 750.00),
(4, 5, 1, 18500.00),
(5, 1, 2, 3500.00),
(5, 3, 3, 950.00);

-- ========================================================
-- 1) Agregar Columna telefono y actualizar nro Ana Garcia
-- ========================================================

ALTER TABLE clientes
ADD COLUMN telefono VARCHAR(20) NULL;

UPDATE clientes
SET telefono = '+54341000001'
WHERE id_cliente = '1';

-- ===========================================================
-- 2) OBTENER LISTADO DE TODOS LOS PEDIDOS CON TOTAL
-- ===========================================================

SELECT
	p.id_pedido,
    c.nombre AS cliente,
    p.fecha,
    p.estado,
    SUM(dp.cantidad * dp.precio_unitario) AS total
FROM pedidos p 
INNER JOIN clientes c ON c.id_cliente = p.id_cliente
INNER JOIN detalle_pedido dp ON dp.id_pedido = p.id_pedido
group by p.id_pedido, c.nombre, p.fecha, p.estado
order by total desc;

-- ===========================================================
-- 3) PRODUCTOS QUE NUNCA FUERON INCLUIDOS EN NINGÚN PEDIDO:
-- A) LEFT JOIN
-- B) SUBCONSULTA USANDO NOT IN
-- ===========================================================
-- A)
SELECT p.id_producto, p.nombre
FROM productos p
LEFT JOIN detalle_pedido dp ON dp.id_producto = p.id_producto
WHERE dp.id_producto IS NULL;

-- B)
SELECT id_producto, nombre
FROM productos
WHERE id_producto NOT IN (
	SELECT id_producto FROM detalle_pedido
);
-- ============================================================
-- 4) CREAR LISTA LLAMADA resumen_cliente
-- ============================================================

CREATE VIEW resumen_clientes AS
SELECT
	c.nombre,
    c.ciudad,
    COUNT(p.id_pedido) AS cantidad_pedidos,
    SUM(dp.cantidad * dp.precio_unitario) AS monto_total
FROM clientes c
INNER JOIN pedidos p ON p.id_cliente = c.id_cliente
INNER JOIN detalle_pedido dp ON dp.id_pedido = p.id_pedido
GROUP BY c.id_cliente, c.nombre, c.ciudad
ORDER BY monto_total DESC;

SELECT * FROM resumen_cliente;

-- ================================================================
-- VIEWS PARA LÓGICA DE NEGOCIO
-- ================================================================

-- CLIENTES PREMIUM (con pedidos de mas de 12000)
CREATE VIEW vista_clientes_premium AS
SELECT
	c.nombre,
    c.ciudad,
    SUM(dp.cantidad * dp.precio_unitario) AS monto_total
FROM clientes c 
INNER JOIN pedidos p ON p.id_cliente = c.id_cliente
INNER JOIN detalle_pedido dp ON dp.id_pedido = p.id_pedido
GROUP BY c.id_cliente, c.nombre, c.ciudad
HAVING monto_total > 12000;

-- verificar
SELECT * FROM vista_clientes_premium;

