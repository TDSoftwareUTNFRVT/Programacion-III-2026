-- 1) Cada vez que se registre una venta, el stock del producto vendido debe reducirse automaticamente en la cantidad vendida. 

-- DELIMITER $$
-- CREATE TRIGGER trg_descontar_stock
-- AFTER INSERT
-- ON ventas
-- FOR EACH ROW
-- BEGIN
	-- UPDATE productos
	-- SET stock = stock - NEW.cantidad
	-- WHERE id_producto = NEW.id_producto;
-- END$$
-- DELIMITER ;

-- 2) Al insertar una venta, el campo total debe calcularse automaticamente multiplicando cantidad por el precio del producto. 

-- DELIMITER $$
-- CREATE TRIGGER trg_calcular_total
-- BEFORE INSERT
-- ON ventas
-- FOR EACH ROW
-- BEGIN
	-- DECLARE vprecio DECIMAL(10,2);
    -- SELECT precio INTO vprecio FROM productos WHERE id_producto = NEW.id_producto;
    -- SET NEW.total = NEW.cantidad * vprecio;
-- END$$
-- DELIMITER ;

-- 3)  Cuando el precio de un producto cambie, registrar automaticamente en auditoria_precios el precio anterior, el nuevo precio, el usuario MySQL y la fecha. 

-- DELIMITER $$
-- CREATE TRIGGER trg_cambio_precio
-- AFTER UPDATE
-- ON productos
-- FOR EACH ROW
-- BEGIN
	-- IF NEW.precio != OLD.precio THEN
		-- INSERT INTO auditoria_precios(precio_anterior, precio_nuevo, usuario, fecha_cambio) VALUES(OLD.precio, NEW.precio, USER());
	-- END IF;
-- END$$
-- DELIMITER ;

-- 4) Antes de eliminar un cliente, guardar sus datos en log_clientes_eliminados para mantener un registro historico.

-- DELIMITER $$
-- CREATE TRIGGER trg_guardar_clientes_eliminados
-- BEFORE DELETE
-- ON clientes
-- FOR EACH ROW
-- BEGIN
	-- INSERT INTO log_clientes_eliminados(id_cliente, nombre, email, fecha_eliminacion) VALUES(OLD.id_cliente, OLD.nombre, OLD.email, NOW());
-- END$$
-- DELIMITER ;

-- 5) Antes de registrar una venta, verificar que exista suficiente stock. Si el stock es insuficiente, abortar la operacion con un mensaje de error.

-- DELIMITER $$
-- CREATE TRIGGER trg_verificar_stock
-- BEFORE INSERT
-- ON ventas
-- FOR EACH ROW
-- BEGIN
	-- DECLARE vstock INT;
    -- SELECT stock INTO vstock FROM productos WHERE id_producto = NEW.id_producto;
	-- IF cantidad > vstock THEN
		-- SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El stock no es suficiente.';
    -- END IF;
-- END $$
-- DELIMITER ;

-- 6) Cuando se registra una venta, descontar el total del saldo disponible del cliente automaticamente.

-- DELIMITER $$
-- CREATE TRIGGER trg_descontar_saldo_cliente
-- AFTER INSERT
-- ON ventas
-- FOR EACH ROW
-- BEGIN
	-- UPDATE clientes
	-- SET NEW.saldo = saldo - NEW.total
	-- WHERE id_cliente = NEW.id_cliente;
-- END $$
-- DELIMITER ;

-- 7) Antes de actualizar el email de un cliente, normalizar a minusculas y verificar que no exista otro cliente con ese email.

-- DELIMITER $$
-- CREATE TRIGGER trg_actualizar_email
-- BEFORE UPDATE
-- ON clientes
-- FOR EACH ROW
-- BEGIN
	-- SET NEW.email = LOWER(NEW.email);
    
    -- IF EXISTS (SELECT 1 FROM clientes WHERE email = NEW.email AND id_cliente != OLD.id_cliente) THEN
		-- SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tu email coincide con el de otro cliente.';
    -- END IF;
-- END $$
-- DELIMITER ;

-- 8) Cuando se elimine una venta (cancelacion), devolver automaticamente la cantidad al stock del producto correspondiente.

-- DELIMITER $$
-- CREATE TRIGGER trg_restaurar_stock
-- AFTER DELETE
-- ON ventas
-- FOR EACH ROW
-- BEGIN
	-- UPDATE productos
    -- SET stock = stock + OLD.cantidad
    -- WHERE id_producto = OLD.id_producto;
-- END$$
-- DELIMITER ;