
CREATE TABLE productos (
	id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR (50) NOT NULL,
    precio_unitario DECIMAL (10,2) NOT NULL,
    stock_actual INT NOT NULL DEFAULT 0
);
    
CREATE TABLE clientes (
	id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    razon_social VARCHAR (100) NOT NULL,
    cuit VARCHAR(15) NOT NULL UNIQUE,
    saldo_cuenta DECIMAL(10,2) NOT NULL DEFAULT 0
);


CREATE TABLE pedidos (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    fecha_pedido DATE NOT NULL,
    estado VARCHAR (20) NOT NULL DEFAULT 'PENDIENTE',
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

CREATE TABLE detalle_pedido (
    id_detalle INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL;
    cantidad INT NOT NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_pedido) REFERENCES productos(id_producto)
);

CREATE TABLE auditoria_stock (
    id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    stock_anterior INT NOT NULL,
    stock_nuevo INT NOT NULL,
    fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

INSERT INTO productos (nombre,categoria,precio_unitario,stock_actual) VALUES
('Arroz 1kg', 'Almacén', 1200.00,150),
('Aceite Girasol 1L', 'Almacén', 2500.00,80),
('Fideos 500g', 'Almacén', 900.00,200),
('Detergente 750ml', 'Limpieza', 1500.00,60),
('Lavandina 1L', 'Limpieza', 800.00,100),
('Yerba 1 Kg', 'Almacén', 3200.00,90),
('Jabón en polvo 3 Kg', 'Limpieza', 4500.00,40);

INSERT INTO clientes (razon_social,cuit,saldo_cuenta) VALUES
('Almacén Don José', '30-11111111-1',0.00),
('Despensa La Esquina', '30-22222222-2',5000.00),
('Supermercado Norte', '30-33333333-3',0.00),
('Kiosco Central', '30-44444444-4',1200.00);

INSERT INTO pedidos (id_cliente,fecha_pedido,estado) VALUES
(1,'2026-05-02','CONFIRMADO'),
(2,'2026-05-03','PENDIENTE'),
(3,'2026-05-05','CONFIRMADO');

INSERT INTO detalle_pedido (id_pedido,id_producto,cantidad,precio_venta) VALUES
(1,1,10,1300.00),
(1,3,20,950.00),
(2,2,5,2600.00),
(3,5,15,850.00),
(3,6,8,3300.00);

--Ejercicio 1.a

CREATE VIEW vista_resumen_pedidos2 AS
SELECT
    p.id_pedido,
    c.razon_social,
    p.fecha_pedido,
    p.estado,
    SUM(dp.cantidad) AS total_unidades,
    SUM(dp.cantidad * dp.precio_venta) AS monto_total
FROM pedidos pCREATE VIEW vista_productos_limpieza AS
SELECT
    id_producto,
    nombre,
    precio_unitario,
    stock_actual
FROM productos
WHERE categoria = 'Limpieza'
ORDER BY precio_unitario DESC;
    JOIN clientes c    ON p.id_cliente  = c.id_cliente
    JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
GROUP BY
    p.id_pedido;

--Ejercicio 1.b
CREATE VIEW vista_productos_limpieza AS 
SELECT id_producto, nombre, precio_unitario, stock_actual 
FROM productos WHERE categoria = 'Limpieza' 
ORDER BY precio_unitario DESC;



--Ejercicio 1.c
SELECT *
FROM vista_resumen_pedidos
WHERE monto_total > 20000;


--Ejercicio 2.a
DELIMITER //

CREATE TRIGGER trg_validar_stock
BEFORE INSERT ON detalle_pedido
FOR EACH ROW
BEGIN
    DECLARE v_actual_stock INT;

    SELECT stock_actual
    INTO v_actual_stock
    FROM productos
    WHERE id_producto = NEW.id_producto;

    IF NEW.cantidad > v_actual_stock THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Stock insuficiente';
    END IF;
END//

DELIMITER ;


--Ejercicio 2.b
DELIMITER //

CREATE TRIGGER tgr_actualizar_saldo_cliente
AFTER INSERT ON detalle_pedido
FOR EACH ROW
BEGIN
    DECLARE dato_id_cliente INT;

    SELECT id_cliente
    INTO dato_id_cliente
    FROM pedidos
    WHERE id_pedido = NEW.id_pedido;

    UPDATE clientes
    SET saldo_cuenta = saldo_cuenta + (NEW.cantidad * NEW.precio_venta)
    WHERE id_cliente = dato_id_cliente;
END//

DELIMITER ;


--Ejercicio 2.c


START TRANSACTION;

INSERT INTO pedidos (id_cliente, fecha_pedido, estado)
VALUES (3, '2026-06-10', 'CONFIRMADO');

SET @id_nuevo_pedido = LAST_INSERT_ID();

INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_venta)
VALUES (@id_nuevo_pedido, 7, 30, 4600.00);

INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_venta)
VALUES (@id_nuevo_pedido, 6, 100, 3300.00);



--Ejercicio 2.d

/* El disparo que produce el error es este 

INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_venta)
VALUES (@id_nuevo_pedido, 6, 100, 3300.00)

porque la cantidad que se que se debitara con la transaction es de 100 y la que figura en stock es de 90, es decir, 
que no hay stock suficiente para por llevar a cabo la sentencia

con la siguiente consulta:
    SELECT saldo_cuenta
    FROM clientes
    WHERE id_cliente=3;

el saldo de supermercado norte es 0.00

luego de transaction es de $138000

pero realizando un rollback vuelve a 0.00




;