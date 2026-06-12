-- CREACIÓN DE BASE DE DATOS Y TABLAS
-- ============================================
CREATE DATABASE IF NOT EXISTS triggers_db;
USE triggers_db;

CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    saldo DECIMAL(12,2) DEFAULT 0.00,
    activo TINYINT(1) DEFAULT 1,
    fecha_registro DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    fecha_modificacion DATETIME
);

CREATE TABLE IF NOT EXISTS ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    total DECIMAL(12,2),
    fecha DATETIME DEFAULT NOW(),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE IF NOT EXISTS auditoria_precios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT,
    precio_anterior DECIMAL(10,2),
    precio_nuevo DECIMAL(10,2),
    usuario VARCHAR(100),
    fecha_cambio DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS log_clientes_eliminados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    nombre VARCHAR(100),
    email VARCHAR(150),
    fecha_eliminacion DATETIME DEFAULT NOW()
);

-- DATOS DE PRUEBA
-- ============================================
INSERT INTO clientes (nombre, email, saldo) VALUES ('Ana Torres', 'ana@email.com', 1000.00);
INSERT INTO productos (nombre, precio, stock) VALUES ('Auriculares', 500.00, 20);

-- ============================================
-- EJERCICIO 1: AFTER INSERT - Descontar stock

DELIMITER $$
CREATE TRIGGER trg_descontar_stock
AFTER INSERT ON ventas
FOR EACH ROW
BEGIN
    UPDATE productos
    SET stock = stock - NEW.cantidad
    WHERE id_producto = NEW.id_producto;
END$$
DELIMITER ;

-- ============================================
-- EJERCICIO 2

DELIMITER $$
CREATE TRIGGER trg_calcular_total
BEFORE INSERT ON ventas
FOR EACH ROW
BEGIN
    DECLARE v_precio DECIMAL(10,2);
    SELECT precio INTO v_precio
    FROM productos
    WHERE id_producto = NEW.id_producto;
    SET NEW.total = NEW.cantidad * v_precio;
END$$
DELIMITER ;

-- ============================================
-- EJERCICIO 3

DELIMITER $$
CREATE TRIGGER trg_auditoria_precios
AFTER UPDATE ON productos
FOR EACH ROW
BEGIN
    IF OLD.precio <> NEW.precio THEN
        INSERT INTO auditoria_precios (id_producto, precio_anterior, precio_nuevo, usuario)
        VALUES (NEW.id_producto, OLD.precio, NEW.precio, USER());
    END IF;
END$$
DELIMITER ;

-- ============================================
-- EJERCICIO 4

DELIMITER $$
CREATE TRIGGER trg_log_cliente_eliminado
BEFORE DELETE ON clientes
FOR EACH ROW
BEGIN
    INSERT INTO log_clientes_eliminados (id_cliente, nombre, email)
    VALUES (OLD.id_cliente, OLD.nombre, OLD.email);
END$$
DELIMITER ;

-- ============================================
-- EJERCICIO 5

DELIMITER $$
CREATE TRIGGER trg_validar_stock
BEFORE INSERT ON ventas
FOR EACH ROW
BEGIN
    DECLARE v_stock INT;
    SELECT stock INTO v_stock
    FROM productos
    WHERE id_producto = NEW.id_producto;

    IF v_stock < NEW.cantidad THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente para realizar la venta';
    END IF;
END$$
DELIMITER ;

-- ============================================
-- EJERCICIO 6

DELIMITER $$
CREATE TRIGGER trg_actualizar_saldo
AFTER INSERT ON ventas
FOR EACH ROW
BEGIN
    UPDATE clientes
    SET saldo = saldo - NEW.total
    WHERE id_cliente = NEW.id_cliente;
END$$
DELIMITER ;

-- ============================================
-- EJERCICIO 7

DELIMITER $$
CREATE TRIGGER trg_normalizar_email
BEFORE UPDATE ON clientes
FOR EACH ROW
BEGIN
    IF NEW.email <> OLD.email THEN
        SET NEW.email = LOWER(NEW.email);
    END IF;
END$$
DELIMITER ;

-- ============================================
-- EJERCICIO 8

DELIMITER $$
CREATE TRIGGER trg_restaurar_stock
AFTER DELETE ON ventas
FOR EACH ROW
BEGIN
    UPDATE productos
    SET stock = stock + OLD.cantidad
    WHERE id_producto = OLD.id_producto;
END$$
DELIMITER ;

-- ============================================
-- TABLAS ADICIONALES PARA TRANSACCIONES
-- ============================================

CREATE TABLE IF NOT EXISTS cuentas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    tipo ENUM('corriente', 'ahorro') DEFAULT 'ahorro',
    saldo DECIMAL(12,2) DEFAULT 0.00,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    total DECIMAL(12,2),
    estado VARCHAR(20) DEFAULT 'pendiente'
);


-- ============================================
-- EJERCICIO 9

START TRANSACTION;

INSERT INTO clientes (nombre, email, saldo)
VALUES ('Carlos Ruiz', 'carlos@email.com', 1000.00);

SET @id = LAST_INSERT_ID();

INSERT INTO ventas (id_cliente, id_producto, cantidad, total)
VALUES (@id, 1, 2, 150.00);

COMMIT;
-- ROLLBACK; -- Descomentar si ocurre un error


-- ============================================
-- EJERCICIO 10

START TRANSACTION;

SET @origen = 1;
SET @destino = 2;
SET @monto = 200.00;

UPDATE cuentas SET saldo = saldo - @monto WHERE id = @origen;
UPDATE cuentas SET saldo = saldo + @monto WHERE id = @destino;

-- Validar que el saldo no quedó negativo
IF (SELECT saldo FROM cuentas WHERE id = @origen) < 0 THEN
    ROLLBACK;
ELSE
    COMMIT;
END IF;


-- ============================================
-- EJERCICIO 11

START TRANSACTION;

INSERT INTO pedidos (id_cliente, total) VALUES (1, 500.00);
SAVEPOINT sp_pedido_creado;

INSERT INTO ventas (id_cliente, id_producto, cantidad, total)
VALUES (1, 1, 2, 500.00);
SAVEPOINT sp_venta_ok;

COMMIT;


-- ============================================
-- EJERCICIO 12

SET autocommit = 0;

INSERT INTO productos (nombre, precio, stock) VALUES ('Producto A', 100.00, 50);
INSERT INTO productos (nombre, precio, stock) VALUES ('Producto B', 200.00, 30);
INSERT INTO productos (nombre, precio, stock) VALUES ('Producto C', 300.00, 20);
INSERT INTO productos (nombre, precio, stock) VALUES ('Producto D', 400.00, 15);
INSERT INTO productos (nombre, precio, stock) VALUES ('Producto E', 500.00, 10);

COMMIT;
SET autocommit = 1;

