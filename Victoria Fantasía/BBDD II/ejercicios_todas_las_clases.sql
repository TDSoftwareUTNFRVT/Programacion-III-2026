CREATE DATABASE IF NOT EXISTS tienda_online;
USE tienda_online;

CREATE TABLE categorias (
    id_categoria TINYINT(2) PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

CREATE TABLE productos (
    id_producto SMALLINT(5) PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock TINYINT(2),
    id_categoria TINYINT(2),
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
);

CREATE TABLE clientes (
    id_cliente SMALLINT(5) PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    fecha_registro DATE
);

CREATE TABLE pedidos (
    id_pedido SMALLINT(5) PRIMARY KEY AUTO_INCREMENT,
    id_cliente SMALLINT(5),
    fecha DATE NOT NULL,
    estado ENUM ('pendiente', 'enviado', 'entregado'),
    FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
);

CREATE TABLE detalle_pedido (
    id_detalle SMALLINT(5) PRIMARY KEY AUTO_INCREMENT,
    id_pedido SMALLINT(5) NOT NULL,
    id_producto SMALLINT(5) NOT NULL,
    cantidad TINYINT(2) NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido),
    FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
);

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

INSERT INTO clientes (nombre, email, fecha_registro) VALUES
('Ana García', 'ana@email.com', '2024-01-15'),
('Luis Pérez', 'luis@email.com', '2024-03-20'),
('María Torres', 'maria@email.com', '2024-06-10'),
('Juan López', 'juan@email.com', '2025-01-05');

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

/*--------------------- CLASE 2 ---------------------*/

ALTER TABLE clientes ADD COLUMN telefono VARCHAR(20) NULL;
UPDATE clientes SET telefono = '+543414000001' WHERE nombre = 'Ana García';

SELECT ped.id_pedido, cli.nombre, cli.ciudad, ped.fecha, ped.estado,
       SUM(dep.cantidad * dep.precio_unitario) AS total
FROM pedidos ped
JOIN clientes cli ON cli.id_cliente = ped.id_cliente
JOIN detalle_pedido dep ON dep.id_pedido = ped.id_pedido
GROUP BY ped.id_pedido, cli.nombre, cli.ciudad, ped.fecha, ped.estado
ORDER BY total DESC;

SELECT pro.nombre
FROM productos pro
LEFT JOIN detalle_pedido dep
ON dep.id_producto = pro.id_producto
WHERE dep.id_producto IS NULL;

/*1.	Agrega a la tabla clientes una columna llamada “Teléfono” que sea VARCHAR(20), que permita valores nulos. Luego, actualiza el teléfono de Ana García con el valor “+543414000001”*/
ALTER TABLE clientes ADD COLUMN telefono VARCHAR(20) NULL;
UPDATE clientes SET telefono = '+543414000001' WHERE nombre = 'Ana García';
/*2.	Obtén el listado de todos los pedidos mostrando nro.  de pedido, nombre del cliente, ciudad del cliente, fecha del pedido, estado y el total del pedido (suma de la cantidad*precio_unitario de los ítems). Ordenar por total descendente.*/
SELECT ped.id_pedido, cli.nombre, cli.ciudad, ped.fecha, ped.estado,
       SUM(dep.cantidad * dep.precio_unitario) AS total
FROM pedidos ped
JOIN clientes cli ON cli.id_cliente = ped.id_cliente
JOIN detalle_pedido dep ON dep.id_pedido = ped.id_pedido
GROUP BY ped.id_pedido, cli.nombre, cli.ciudad, ped.fecha, ped.estado
ORDER BY total DESC;
/*3.	Lista los productos que nunca fueron incluidos en ningún pedido. Resolverlo de dos formas distintas: una con LEFT JOIN y otra con subconsulta usando “NOT IN”.*/
SELECT pro.nombre
FROM detalle_pedido dep
LEFT JOIN productos pro
ON dep.id_producto = pro.id_producto
WHERE pro.nombre = null;

/*4.	Crea una vista llamada “resumen_clientes” que muestre para cada cliente: su nombre, ciudad, cantidad total de pedidos y monto total acumulado en todos sus pedidos. La vista debe mostrar los clientes ordenados por monto total descendente.*/
CREATE VIEW resumen_clientes AS
	SELECT cli.nombre AS "Nombre del cliente",
			cli.ciudad "Ciudad del cliente",
            COUNT(ped.id_pedido) AS "Cantidad total de pedidos",
			SUM(dep.cantidad * dep.precio_unitario) AS "Monto total acumulado"
	FROM clientes cli
    JOIN pedidos ped
		ON ped.id_cliente = cli.id_cliente;

/*--------------------- CLASE 3 ---------------------*/

CREATE VIEW resumen_clientes AS
	SELECT cli.nombre AS "Nombre del cliente",
			cli.ciudad "Ciudad del cliente",
            COUNT(ped.id_pedido) AS "Cantidad total de pedidos",
			SUM(dep.cantidad * dep.precio_unitario) AS "Monto total acumulado"
	FROM clientes cli
    JOIN pedidos ped
		ON ped.id_cliente = cli.id_cliente
	JOIN detalle_pedido dep
		ON ped.id_pedido = dep.id_pedido
	GROUP BY cli.nombre, cli.ciudad
    ORDER BY SUM(dep.cantidad * dep.precio_unitario) DESC;

CREATE OR REPLACE VIEW vista_detalle_pedidos AS
	SELECT
		pedidos.id_pedido, pedidos.fecha, pedidos.estado,
        clientes.nombre AS nombre_cliente, clientes.ciudad, clientes.email,
        productos.nombre AS nombre_producto,
        categorias.nombre AS categoria,
        detalle_pedido.cantidad, detalle_pedido.precio_unitario, detalle_pedido.cantidad * detalle_pedido.precio_unitario AS subtotal
	FROM pedidos
    JOIN clientes ON clientes.id_cliente = pedidos.id_cliente
    JOIN detalle_pedido ON detalle_pedido.id_pedido = pedidos.id_pedido
	JOIN productos ON productos.id_producto = detalle_pedido.id_producto
    JOIN categorias ON categorias.id_categoria = productos.id_categoria
;

/*Crear una vista de resumen de ventas por clientes*/
CREATE OR REPLACE VIEW resumen_venta_clientes AS
	SELECT
		clientes.nombre,
        pedidos.id_pedido, pedidos.fecha, pedidos.estado,
        detalle_pedido.cantidad, detalle_pedido.precio_unitario * detalle_pedido.cantidad
	FROM pedidos
    JOIN clientes ON clientes.id_cliente = pedidos.id_cliente
    JOIN detalle_pedido ON detalle_pedido.id_pedido = pedidos.id_pedido
;

SELECT * FROM vista_detalle_pedidos;

/*Sobre la vista de detalles de pedidos, crear filtros productivos a la lógica de negocio.*/

/*Filtro para visualizar la cantidad de pedidos entregados por año*/
CREATE VIEW cantidad_pedidos_anual AS
	SELECT COUNT(*) AS "Cantidad total de pedidos", YEAR(fecha) AS "Año"
	FROM vista_detalle_pedidos
	GROUP BY YEAR(fecha)
;

/*Filtro para visualizar el total gastado por un cliente anualmente*/
CREATE VIEW total_consumo_anual_por_cliente AS
	SELECT nombre_cliente AS "Cliente", YEAR(fecha) AS "Año", SUM(subtotal) AS "Total"
    FROM vista_detalle_pedidos
    GROUP BY nombre_cliente, YEAR(fecha)
;

/*Filtro para visualizar el total de productos vendidos de mayor a menor*/
CREATE VIEW total_ventas_por_producto_desc AS
	SELECT nombre_producto, SUM(cantidad) AS "Total de unidades vendidas", SUM(subtotal) AS "Monto total"
    FROM vista_detalle_pedidos
    GROUP BY nombre_producto
    ORDER BY SUM(cantidad) DESC
;

/*Filtro para visualizar los pedidos pendientes por ciudad*/
CREATE VIEW pedidos_pendientes_por_ciudad AS
	SELECT id_pedido AS "Código de pedido", fecha, estado, nombre_cliente AS "Cliente", ciudad
    FROM vista_detalle_pedidos
    WHERE estado = "pendiente"
    ORDER BY ciudad
;

/*Filtro para visualizar cuántas unidades se vendieron de cada categoría, ordenado de mayor a menor*/
CREATE VIEW ventas_por_categoria AS
	SELECT categoria, SUM(cantidad) AS "Cantidad total vendida", SUM(subtotal) AS "Monto total"
    FROM vista_detalle_pedidos
    GROUP BY categoria
    ORDER BY SUM(cantidad) DESC
;

/*--------------------- CLASE 4 ---------------------*/

create database if not exists tienda_online2;

use tienda_online2;
        
CREATE TABLE clientes (
	id_cliente INT AUTO_INCREMENT PRIMARY KEY, 
	nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    saldo DECIMAL(12,2) DEFAULT 0.00,
    activo TINYINT(1) DEFAULT 1, 
	fecha_registro DATETIME DEFAULT NOW()
);

CREATE TABLE productos ( 
	id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0, 
	fecha_modificacion DATETIME
);

CREATE TABLE ventas (
	id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    total DECIMAL(12,2),
    fecha DATETIME DEFAULT NOW(),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) 
);

CREATE TABLE auditoria_precios ( 
	id INT AUTO_INCREMENT PRIMARY KEY, 
	id_producto INT,
    precio_anterior DECIMAL(10,2),
    precio_nuevo DECIMAL(10,2),
    usuario VARCHAR(100),
    fecha_cambio DATETIME DEFAULT NOW()
);

CREATE TABLE log_clientes_eliminados ( 
	id INT AUTO_INCREMENT PRIMARY KEY, 
	id_cliente INT,
    nombre VARCHAR(100), 
	email VARCHAR(150),
    fecha_eliminacion DATETIME DEFAULT NOW()
);

/*Enunciado: Cada vez que se registre una venta, el stock del producto vendido debe reducirse 
automaticamente en la cantidad vendida. */
DELIMITER $$
CREATE TRIGGER trg_descontar_stock
	AFTER INSERT ON ventas FOR EACH ROW 
	BEGIN 
		UPDATE productos 
		SET stock = stock - NEW.cantidad 
		WHERE id_producto = NEW.id_producto; 
	END $$ 
	DELIMITER ;
INSERT INTO ventas (id_cliente, id_producto, cantidad, total)
	VALUES (1, 3, 5, 250.00);
SELECT stock FROM productos WHERE id_producto = 3;

/*Enunciado: Al insertar una venta, el campo total debe calcularse automaticamente multiplicando 
cantidad por el precio del producto. */
DELIMITER $$
CREATE TRIGGER trg_calculo_total_venta
	BEFORE INSERT ON ventas
    FOR EACH ROW
    BEGIN
        SET NEW.total = NEW.cantidad * (
			SELECT precio FROM productos
            WHERE id_producto = NEW.id_producto);
    END $$
DELIMITER ;

/*Enunciado: Cuando el precio de un producto cambie, registrar automaticamente en auditoria_precios 
el precio anterior, el nuevo precio, el usuario MySQL y la fecha. */
DELIMITER $$
CREATE TRIGGER trg_cambio_precio
	AFTER UPDATE ON productos
    FOR EACH ROW
    BEGIN
		IF OLD.precio <> NEW.precio THEN
			INSERT INTO auditoria_precios (id_producto, precio_anterior, precio_nuevo, usuario)
			VALUES (NEW.id_producto, OLD.precio, NEW.precio, USER());
		END IF;
    END $$
DELIMITER ;

/*Enunciado: Antes de eliminar un cliente, guardar sus datos en log_clientes_eliminados para mantener 
un registro historico. */
DELIMITER $$
CREATE TRIGGER trg_registro_eliminaciones
	BEFORE DELETE ON clientes
    FOR EACH ROW
    BEGIN
		INSERT INTO log_clientes_eliminados (id_cliente, nombre, email, fecha_eliminacion)
        VALUES (OLD.id_cliente, OLD.nombre, OLD.email, NOW());
    END $$
DELIMITER ;

/*Enunciado: Antes de registrar una venta, verificar que exista suficiente stock. Si el stock es 
insuficiente, abortar la operacion con un mensaje de error. */
DELIMITER $$
CREATE TRIGGER trg_validar_stock
	BEFORE INSERT ON ventas
    FOR EACH ROW
    BEGIN
		IF (SELECT stock FROM productos WHERE id_producto = NEW.id_producto) < NEW.cantidad THEN
			SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "Lo sentimos, no contamos con stock suficiente para realizar esta venta.";
		END IF;
    END $$
DELIMITER ;

/*Enunciado: Cuando se registra una venta, descontar el total del saldo disponible del cliente 
automaticamente. */
DELIMITER $$
CREATE TRIGGER trg_actualizar_saldo_cliente
	AFTER INSERT ON ventas
    FOR EACH ROW
    BEGIN
		UPDATE clientes
        SET saldo = saldo - NEW.total
        WHERE id_cliente = NEW.id_cliente;
    END $$
DELIMITER ;

/*Antes de actualizar el email de un cliente, normalizar a minusculas y verificar que no 
exista otro cliente con ese email. */
DELIMITER $$
CREATE TRIGGER trg_verificar_existencia_usuarios
	BEFORE UPDATE ON clientes
    FOR EACH ROW
    BEGIN
		IF (LOWER(NEW.email) IN (SELECT email FROM clientes WHERE id_cliente != OLD.id_cliente)) THEN
			SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "Ya existe un cliente con ese e-mail.";
        END IF;
        SET NEW.email = LOWER(NEW.email);
    END $$
DELIMITER ;

/*--------------------- CLASE 5 ---------------------*/
USE tienda_online2;

CREATE TABLE cuentas ( id INT AUTO_INCREMENT PRIMARY 
KEY, id_cliente INT NOT NULL, tipo 
ENUM('corriente','ahorro') DEFAULT 'ahorro', saldo 
DECIMAL(12,2) DEFAULT 0.00, FOREIGN KEY (id_cliente) 
REFERENCES clientes(id_cliente) 
);

CREATE TABLE pedidos ( id INT 
AUTO_INCREMENT PRIMARY KEY, 
id_cliente INT, total DECIMAL(12,2), 
estado VARCHAR(20) DEFAULT 
'pendiente' 
);


/*Ejercicio 9: Transaccion simple con COMMIT y ROLLBACK 
Enunciado: Insertar un nuevo cliente y registrar su primera compra. Si ocurre cualquier error, 
deshacer todo.*/
DELIMITER $$
CREATE PROCEDURE nuevo_cliente_con_compra()
	BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
	ROLLBACK; -- Si algo falla
	END;
	START TRANSACTION;
	INSERT INTO clientes (nombre, email, saldo) 
		VALUES ('Ana Torres', 'ana@email.com', 1000.00); 
	SET @id = LAST_INSERT_ID();
    INSERT INTO ventas (id_cliente, id_producto, cantidad, total) 
		VALUES (@id, 1, 2, 150.00);
	COMMIT; -- Si todo OK --
END $$
DELIMITER ;

/*Ejercicio 10: Transferencia bancaria con validacion 
Enunciado: Implementar una transferencia entre dos cuentas. Validar que el saldo sea suficiente.*/
DELIMITER $$ 
CREATE PROCEDURE transferir_saldo (
	IN c_origen INT,
    IN c_destino INT,
    IN c_monto DECIMAL(12,2)
) -- Acá se establecen los parámetros que vamos a utilizar en nuestro procedimiento
BEGIN 
	DECLARE EXIT HANDLER FOR SQLEXCEPTION 
	BEGIN 
		ROLLBACK;
		RESIGNAL; -- Re-lanza el error al cliente 
	END; 
START TRANSACTION;
	IF (SELECT saldo FROM cuentas WHERE id = c_origen) < c_monto THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Saldo insuficiente';
	END IF;
	UPDATE cuentas SET saldo = saldo - c_monto WHERE id = c_origen; 
	UPDATE cuentas SET saldo = saldo + c_monto WHERE id = c_destino; 
COMMIT; 
END$$ 
DELIMITER ; 
CALL transferir_saldo(1, 2, 300.00); -- Acá se pasan los parámetros con los que se trabaja en el procedimiento

/*Ejercicio 11: Uso de SAVEPOINT en proceso de pedido 
Enunciado: Registrar un pedido con multiples pasos. Usar SAVEPOINTs para poder deshacer pasos individuales.*/
DELIMITER $$
CREATE PROCEDURE p_nuevo_cliente (
	IN nombre_cliente VARCHAR(100),
    IN tipo_cuenta ENUM('corriente', 'ahorro')
)
BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN
	ROLLBACK TO SAVEPOINT sp_ningun_cambio_registrado;
    ROLLBACK;
END;
START TRANSACTION;
	SAVEPOINT sp_ningun_cambio_registrado;
	INSERT INTO clientes (nombre) VALUES (nombre_cliente);
    SAVEPOINT sp_cliente_agregado;
    INSERT INTO cuentas (id_cliente, tipo, saldo) VALUES (last_insert_id(), tipo_cuenta, 0.00);
    SAVEPOINT sp_cuenta_creada;
COMMIT;
END $$
DELIMITER ;

/*Ejercicio 12: Autocommit OFF - Insercion de lote de productos 
Enunciado: Insertar un lote de 5 productos en una sola transaccion usando autocommit deshabilitado.*/
SET autocommit = 0;
INSERT INTO productos (nombre, precio, stock) VALUES
	('Laptop', 1200.00, 15),
	('Tablet', 400.00, 25),
	('Impresora', 180.00, 10),
	('Parlante Bluetooth', 55.00, 60),
	('Disco Externo', 95.00, 35);
COMMIT;
SET autocommit = 1;

/*Ejercicio 14: FOR UPDATE - Reserva de asientos concurrente 
Enunciado: Simular un sistema de reserva donde dos usuarios intentan reservar el ultimo asiento disponible simultaneamente.*/
CREATE TABLE asientos (
	numero_asiento TINYINT PRIMARY KEY AUTO_INCREMENT,
    disponibilidad ENUM("disponible", "ocupado")
);
INSERT INTO asientos (disponibilidad) VALUES
	('disponible'),
    ('disponible'),
    ('disponible'),
    ('disponible'),
    ('disponible'),
    ('disponible'),
    ('disponible'),
    ('disponible'),
    ('disponible'),
    ('disponible');

DELIMITER $$
CREATE PROCEDURE cambiar_disponibilidad()
BEGIN
START TRANSACTION;
	SELECT * FROM asientos WHERE numero_asiento = 1 FOR UPDATE;
    IF (SELECT disponibilidad FROM asientos WHERE numero_asiento = 1) = "ocupado" THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Asiento ocupado';
		ROLLBACK;
    END IF;
    UPDATE asientos SET disponibilidad = "ocupado" WHERE numero_asiento = 1;
COMMIT;
END $$
DELIMITER ;

/*Ejercicio 16: Proceso de compra completo - multiples tablas 
Enunciado: Implementar el proceso completo de una compra: verificar stock, registrar venta, actualizar stock y debitar saldo del cliente.*/
DELIMITER $$
CREATE PROCEDURE compra_completa(
	IN p_id_cliente INT,
    IN p_id_producto INT,
    IN p_cantidad INT
)
BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN
    ROLLBACK;
END;
START TRANSACTION;
	IF (SELECT stock FROM productos WHERE id_producto = p_id_producto) < p_cantidad THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuficiente';
    END IF;
    INSERT INTO ventas (id_cliente, id_producto, cantidad) VALUES (p_id_cliente, p_id_producto, p_cantidad);
    UPDATE productos SET stock = stock - p_cantidad WHERE id_producto = p_id_producto;
    UPDATE clientes SET saldo = saldo - (SELECT total FROM ventas WHERE id_venta = last_insert_id())
		WHERE id_cliente = p_id_cliente;
COMMIT;
END $$
DELIMITER ;

/* LOS EJERCICIOS 13 Y 15 NO HABÍA QUE HACERLOS */