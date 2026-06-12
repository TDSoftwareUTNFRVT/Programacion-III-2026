---===========---
--- ESQUELETO ---
---===========---

CREATE TABLE PRODUCTOS (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    stock_actual INT NOT NULL DEFAULT 0,
);
CREATE TABLE CLIENTES (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    razon_social VARCHAR(100) NOT NULL,
    cuit VARCHAR(15) NOT NULL UNIQUE,
    saldo_cuenta DECIMAL(10, 2) NOT NULL DEFAULT 0
);
CREATE TABLE PEDIDOS (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    fecha_pedido DATE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    FOREIGN KEY (id_cliente) REFERENCES CLIENTES(id_cliente)
);
CREATE TABLE DETALLE_PEDIDO (
    id_detalle INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_venta DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES PEDIDOS(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES PRODUCTOS(id_producto)
);
CREATE TABLE AUDITORIA_STOCK(
    id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    stock_anterior INT NOT NULL,
    stock_nuevo INT NOT NULL,
    fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES PRODUCTOS(id_producto)
);
---============---
---   INSERT   ---
---============---
INSERT  INTO PRODUCTOS (nombre,categoria,precio_unitario,stock_actual) VALUES
('Arroz 1kg','Almacen', 1200.00, 150),
('Aceite Girasol 1L','Almacen', 2500.00, 80),
('Fideos 500g','Almacen', 900.00, 200),
('detergente 750ml','Limpieza', 1500.00, 60),
('lavandina 1L','Limpieza', 800.00, 100),
('yerba mate 1kg','Almacen', 3200.00, 90),
('jabon en polvo 3kg','Limpieza', 4500.00, 50);
insert into CLIENTES (razon_social, cuit, saldo_cuenta) values
('almacen don jose',   '30-11111111-1', 0.00),
('despensa la esquin', '30-22222222-2', 5000.00),
('supermercado norte', '30-33333333-3', 0.00),
('kiosco Central',     '30-44444444-4', 1200.00),
;
insert into PEDIDOS (id_cliente, fecha_pedido, estado) values
(1, '2026-05-02', 'CONFIRMADO'),
(2, '2026-05-03', 'PENDIENTE'),
(3, '2026-05-05', 'CONFIRMADO'),
;
insert into DETALLE_PEDIDO (id_pedido, id_producto, cantidad, precio_venta) values
(1, 1, 10, 1300.00),
(1, 3, 20, 950.00),
(2, 2, 5, 2600.00),
(3, 5, 15, 850.00),
(3, 6, 8, 3300.00),
;
-- EJERCIO 1.A --
CREATE VIEW vista_resumen_pedidos AS 
select 
    p.id_pedido,
    c.razon_social,
    p.fecha_pedido,
    p.estado,
    sum(dp.cantidad) as cantidad_unidades,
    sum(dp.cantidad * dp.precio_venta) as total_pedido
from PEDIDOS p
join CLIENTES c on p.id_cliente = c.id_cliente
join DETALLE_PEDIDO dp on p.id_pedido = dp.id_pedido
GROUP BY p.id_pedido, c.razon_social, p.fecha_pedido, p.estado;

-- EJERCIO 1.B --
CREATE VIEW vista_productos_limpieza AS
SELECT id_producto, nombre, precio_unitario, stock_actual
FROM PRODUCTOS
WHERE categoria = 'Limpieza' ORDER BY precio_unitario DESC;
-- EJERCIO 1.C --
CREATE VIEW vista_resumen_pedidos2 AS
SELECT
    p.id_pedido,
    SUM(dp.cantidad * dp.precio_venta) AS total_pedido
FROM PEDIDOS p
JOIN DETALLE_PEDIDO dp ON p.id_pedido = dp.id_pedido
GROUP BY p.id_pedido
HAVING SUM(dp.cantidad * dp.precio_venta) > 20000;

-- EJERCIO 2.A --
DELIMITER $$
CREATE TRIGGER trg_validar_stock
BEFORE INSERT ON DETALLE_PEDIDO
FOR EACH ROW
BEGIN
    DECLARE stock_disponible INT;
    SELECT stock_actual INTO stock_disponible
    FROM PRODUCTOS
    WHERE id_producto = NEW.id_producto;

    IF NEW.cantidad > stock_disponible THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cantidad supera los limites wachin';
    END IF;
END$$
DELIMITER ;
-- EJERCIO 2.B --
DELIMITER $$
CREATE TRIGGER trg_actualizar_saldo_cliente
AFTER INSERT ON DETALLE_PEDIDO
FOR EACH ROW
BEGIN
    UPDATE CLIENTES c
    JOIN PEDIDOS p ON c.id_cliente = p.id_cliente
    SET c.saldo_cuenta = c.saldo_cuenta + (NEW.cantidad * NEW.precio_venta)
    WHERE p.id_pedido = NEW.id_pedido;
END$$
DELIMITER ;
-- EJERCIO 2.C --
DELIMITER $$
CREATE PROCEDURE insertar_pedido_supermercado_norte()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    INSERT INTO PEDIDOS (id_cliente, fecha_pedido, estado)
    VALUES (3, '2026-06-10', 'CONFIRMADO');

    SET @nuevo_pedido_id = LAST_INSERT_ID();

    INSERT INTO DETALLE_PEDIDO (id_pedido, id_producto, cantidad, precio_venta)
    VALUES
        (@nuevo_pedido_id, 7, 30, 4500.00),
        (@nuevo_pedido_id, 6, 100, 3200.00);

    COMMIT;
END$$
DELIMITER ;

CALL insertar_pedido_supermercado_norte();
DROP PROCEDURE insertar_pedido_supermercado_norte;
-- EJERCIO 2.D --