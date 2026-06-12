CREATE DATABASE el_almacen_mayorista;
USE el_almacen_mayorista;
CREATE TABLE productos (
	id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    precio_unitario DECIMAL (10,2) NOT NULL,
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
    precio_venta DECIMAL(10,2),
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
("Arroz 1kg", "Almacén", 1200.00, 150),
("Aceite Girasol 1L", "Almacén", 2500.00, 80),
("Fideos 500g", "Almacén", 900.00, 200),
("Detergente 750ml", "Limpieza", 1500.00, 60),
("Lavandina 1L", "Limpieza", 800.00, 100),
("Yerba 1kg", "Almacén", 3200.00, 90),
("Jabón en polvo 3kg", "Limpieza", 4500.00, 40);
INSERT INTO clientes (razon_social, cuit, saldo_cuenta) VALUES
("Almacén Don José", "30-11111111-1", 0.00),
("Despensa La Esquina", "30-22222222-2", 5000.00),
("Supermercado Norte", "30-33333333-3", 0.00),
("Kiosco Central", "30-44444444-4", 1200.00);
INSERT INTO pedidos (id_cliente, fecha_pedido, estado) VALUES
(1, "2026-05-02", "CONFIRMADO"),
(2, "2026-05-03", "PENDIENTE"),
(3, "2026-05-05", "CONFIRMADO");
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_venta) VALUES
(1, 1, 10, 1300.00),
(1, 3, 20, 950.00),
(2, 2, 5, 2600.00),
(3, 5, 15, 850.00),
(3, 6, 8, 3300.00);
SELECT * FROM productos;
SELECT * FROM clientes;
SELECT * FROM pedidos;
SELECT * FROM detalle_pedido;


-- EJERCICIO 1, VIEWS
-- Ejercicio 1.a)
CREATE VIEW vista_resumen_pedidos AS
	SELECT ped.id_pedido AS "ID Pedido", 
		cli.razon_social AS "Razón social cliente",
		ped.fecha_pedido AS "Fecha del pedido",
		ped.estado AS "Estado del pedido",
		dp.cantidad AS "Unidades compradas",
		(dp.cantidad * dp.precio_venta) monto_total
	FROM pedidos ped
	JOIN clientes cli ON ped.id_cliente = cli.id_cliente
    JOIN detalle_pedido dp ON ped.id_pedido = dp.id_pedido;
-- Ejercicio 1.b)
CREATE VIEW vista_productos_limpieza AS
	SELECT id_producto AS "ID Producto",
		nombre AS "Nombre producto",
        precio_unitario AS "Precio unitario",
        stock_actual AS "Stock actual"
	FROM productos
    WHERE categoria = "Limpieza"
    ORDER BY precio_unitario DESC;
-- Ejercicio 1.c)
SELECT * FROM vista_resumen_pedidos WHERE monto_total > 20000;

-- EJERCICIO 2, TRIGGERS Y TRANSACTIONS
-- Ejercicio 2.a)
DELIMITER $$
CREATE TRIGGER trg_validar_stock
	BEFORE INSERT ON detalle_pedido
    FOR EACH ROW
    BEGIN
		IF NEW.cantidad > productos.stock_actual THEN
			SIGNAL SQLSTATE "45000" SET MESSAGE_TEXT = "La cantidad solicitada excede el stock disponible.";
		END IF;
END $$
DELIMITER ;
-- Ejercicio 2.b)
DELIMITER $$
CREATE TRIGGER trg_actualizar_saldo_cliente
	AFTER INSERT ON detalle_pedido
    FOR EACH ROW
    BEGIN
		UPDATE clientes
        SET saldo_cuenta = saldo_cuenta + (NEW.cantidad * NEW.precio_venta)
        WHERE id_cliente = pedidos.id_cliente;
END $$
DELIMITER ;
-- Ejercicio 2.c)
DELIMITER $$
CREATE PROCEDURE insertar_datos (
)
BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
	ROLLBACK;
	END;
START TRANSACTION;
	INSERT INTO pedidos (id_cliente, fecha_pedido, estado) VALUES (3, "2026-06-10", "CONFIRMADO");
    INSERT INTO detalle_pedido (id_pedido, id_producto, cantidadd, precio_venta) VALUES
		(last_insert_id(), (SELECT id_producto FROM productos WHERE nombre = "Jabón en polvo 3kg"), 30, 4600.00),
        (last_insert_id(), (SELECT id_producto FROM productos WHERE nombre = "Yerba 1kg"), 100, 3300.00);
COMMIT;
END $$
DELIMITER ;
-- Ejercicio 2.d)
SELECT * FROM clientes;
-- La línea que dispararía el trigger trg_validar_stock sería la que inserta 100 unidades del producto "Yerba 1kg" en detalle_pedido, ya que el stock actual del producto es de 90 unidades.