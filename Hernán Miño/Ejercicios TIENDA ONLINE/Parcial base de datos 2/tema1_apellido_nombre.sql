/*
create database IF NOT EXISTS EL_Almacen_Mayorista;
use El_Almacen_Mayorista;

CREATE TABLE productos(
id_producto INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR (100) NOT NULL,
categoria VARCHAR (50) NOT NULL,
precio_unitario DECIMAL (10,2) NOT NULL,
stock_actual INT NOT NULL DEFAULT 0);

CREATE TABLE clientes (
id_cliente INT PRIMARY KEY AUTO_INCREMENT,
razon_social VARCHAR(100) NOT NULL,
cuit VARCHAR(15) NOT NULL UNIQUE,
saldo_cuenta DECIMAL(10,2) NOT NULL DEFAULT 0);

CREATE TABLE pedidos (
id_pedido INT PRIMARY KEY AUTO_INCREMENT,
id_cliente INT NOT NULL,
fecha_pedido DATE NOT NULL,
estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente));

CREATE TABLE auditoria_stock(
id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
id_producto INT NOT NULL,
stock_anterior INT NOT NULL,
stock_nuevo INT NOT NULL,
fecha_cambio DATETIME NOT NULL DEFAULT current_timestamp,
FOREIGN KEY (id_producto) REFERENCES productos (id_producto));

CREATE TABLE detalle_pedido(
id_detalle INT PRIMARY KEY AUTO_INCREMENT;
id

INSERT INTO productos (nombre,categoria,precio_unitario, stock_actual) VALUES
('Arroz 1kg', 'Almacén', 1200.00 , 150),
('Aceite Girasol 1L', 'Almacén', 2500.00 , 80),
('Fideos 500g', 'Almacén', 900.00 , 200),
('Detergente 750ml', 'Limpieza', 1500.00 , 60),
('Lavandina 1L', 'Limpieza', 800.00 , 100),
('Yerba 1kg', 'Almacén', 3200.00 , 90),
('Jabón en polvo 3KG', 'Limpieza', 4500.00 , 40);

INSERT INTO clientes (razon_social,cuit,saldo_cuentas) VALUES
('Almacén Don José', '30-11111111-1', 0.00),
('Despensa La Esquina', '30-22222222-2', 5000.00),
('Supermercado Norte', '30-33333333-3', 0.00),
('Kiosco Central', '30-44444444-1', 0.00);

INSERT INTO pedidos (id_cliente, fecha_pedido, estado) VALUE 
(1, '2026-05-02', 'CONFIRMADO'),
(2, '2026-05-03', 'PENDIENTE'),
(3, '2026-05-05', 'CONFIRMADO');

INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_venta) VALUE 
(1,1,10,1300.00),
(1,3,20,950.00),
(2,2,5,2600.00),
(3,5,15,850.00),
(3,6,8,3300.00);
*/
-- VISTA LLAMADA VISTA_PEDIDOS_DETALLE QUE MUESTRE, PARA CADA LINEA DE DETALLE PEDIDO LAS SIGUIENTES COL
-- NUMERO PEDIDO, RAZON SOCIAL DEL CLIENTE, NOMBRE DEL PRODUCTO, CANTIDAD, PRECIO DE VENTA Y SUBTOTAL
-- Ejercicio 1.a
CREATE VIEW vista_pedidos_detalle AS 
SELECT c.id_cliente, d.id_pedido,c.razon_social,p.nombre,d.cantidad,p.precio_unitario,(d.cantidad*d.precip_unitario) AS sub_total
FROM 
pedidos p
INNER JOIN 
detalle_pedido d ON p.id_pedido = d.id_pedido;

-- vista llamada vista_stock_bajo que muestre id_producto,nombre,categoria y 
-- stock_actual de todos los productos cuyo stock_actual de sea menor a 50 unidades
-- Ejercicio 1.b

CREATE VIEW vista_stock_bajo AS
SELECT p.id_producto, p.nombre, p.categoria,p.stock_actual AS nivel_stock
FROM productos WHERE p.stock_actual = p.stock_actual < 50;

-- Utilizando la vista vista_pedidos_detalle, escribir una cosntulta que muestre el total facturado
-- (suma de subtotales) por cada cliente ordenando de mayor a menos;
--Ejercicio 1.c

SELECT id_cliente,SUM(sub_total) AS TotalFacturado FROM vista_detalle_pedido
group by id_cliente
order by TotalFacturado DESC;

-- crear un trigger llamado trg_actualizar_stock que se dispare AFTER INSERT sobre la tabla detalle_pedido,
-- el trigger debe descontar del stock_actual de la tabla productos la cantidad vendida correspondiente al producto insertado
-- Ejercicio 2.a 

DELIMITER $$
CREATE TRIGGER trg_actualizar_stock
AFTER INSERT
ON detalle_pedido
FOR EACH ROW
BEGIN
    UPDATE productos
    SET stock_actual = stock_actual - NEW.cantidad
    WHERE id_producto = NEW.id_producto;
END$$
DELIMITER ;

-- creat un trigger llamado trg_auditoria_stock que se dispare AFTER UPDATE sobre la tabla productos,
-- y que se inserte un registro en la tabla auditoria_stock cada vez que cambie el valor de stock_actual
-- Ejercio 2.b
DELIMITER $$
CREATE TRIGGER trg_auditoria_stock
AFTER UPDATE
ON productos
FOR EACH ROW
BEGIN
  IF OLD.stock_actual <> NEW.stock_actual THEN
        INSERT INTO auditoria_stock
        (stock_anterior,stock_nuevo)
        VALUES
        (OLD.stock_actual,NEW.stock_actual);
    END IF;
END$$
DELIMITER ;

-- Escribir una transacción que registre un nuevo pedido para el cliente 'Kiosco Central' (id_cliente = 4) 
-- con fecha '2026-06-10', insertando un pedido en estado 'confirmado' y dos lineas de detalle: 5 unidades del producto
-- 'Arróz 1kg' a $1300 y 3 unidades de 'Lavandina 1L' a $850. la transación debe garanzitar que, si ocurriera algún error
-- durante las lineas de detalle, se revierta todo el pedido (usar STAR TRANSACTION, COMMIT y ROLLBACK)
-- Ejercicio 2.c
START TRANSACTION;
	BEGIN TRY
		INSERT INTO pedidos (id_cliente, fecha, estado)
		VALUES (4, '2026-06-10', 'confirmado');

		DECLARE @id_nuevo_pedido INT;
		SET @id_nuevo_pedido = SCOPE_IDENTITY(); 

		INSERT INTO detalles_pedido (id_pedido, id_producto, cantidad, precio_unitario)
		VALUES (@id_nuevo_pedido, 101, 5, 1300.00);

		INSERT INTO detalles_pedido (id_pedido, id_producto, cantidad, precio_unitario)
		VALUES (@id_nuevo_pedido, 202, 3, 850.00);

		COMMIT;
	END TRY
		BEGIN CATCH
			ROLLBACK;
	END CATCH;


-- Verificar, mediante una consulta SELECT que los triggers de los puntos (a) (b) se hayan ejecutado correctamente luego de
-- confirmar la transacción del punto (c) (comprobar el stock de 'Arróz 1 kg' y el contenido de auditoria_stock)
