-- 9) Insertar un nuevo cliente y registrar su primera compra. Si ocurre cualquier error, deshacer todo. 

-- START TRANSACTION;
-- INSERT INTO clientes(nombre, email, saldo) VALUES('Ana Torres', 'ana@email.com', 1000);
-- SET @id = last_insert_id();
-- INSERT INTO VENTAS(id_cliente, id_producto, cantidad, total) VALUES(@id, 1, 2, 150.00);
-- COMMIT;
-- ROLLBACK;

-- 10) Implementar una transferencia entre dos cuentas. Validar que el saldo sea suficiente. 

-- START TRANSACTION;
	-- SET AUTOCOMMIT = 0;
	-- UPDATE cuentas SET saldo = saldo - 300 WHERE id_cliente = 1;
    -- UPDATE cuentas SET saldo = saldo + 300 WHERE id_cliente = 4;
-- COMMIT;
-- ROLLBACK;

-- START TRANSACTION;
	-- SET AUTOCOMMIT = 0;
	
    -- SET @transferencia = 1000;
    
    -- SET @emisor = 1;
    -- SET @receptor = 2;
    
    -- UPDATE cuentas
		-- SET saldo = saldo - @transferencia
	-- WHERE id = @emisor;
    
    -- UPDATE cuentas
		-- SET saldo = saldo + @transferencia
	-- WHERE id = @receptor;
-- COMMIT;
-- ROLLBACK;

-- 11) Registrar un pedido con multiples pasos. Usar SAVEPOINTs para poder deshacer pasos individuales. 

-- START TRANSACTION;
	-- SET AUTOCOMMIT = 0;
    
    -- SELECT id_cliente INTO @id_cliente FROM clientes WHERE id_cliente = last_insert_id();
    -- SAVEPOINT sp_obtener_id_cliente;
    
    -- SELECT total INTO @total FROM ventas WHERE id_cliente = last_insert_id();
    -- SAVEPOINT sp_obtener_total;
    
    -- SELECT estado INTO @estado FROM pedidos WHERE id_cliente = last_insert_id();
    -- SAVEPOINT sp_obtener_estado;
    
    -- INSERT INTO pedidos(id_cliente, total, estado) VALUES(@id_cliente, @total, @estado);
-- COMMIT;
-- ROLLBACK;

-- 12) Insertar un lote de 5 productos en una sola transaccion usando autocommit deshabilitado.

-- START TRANSACTION;
	-- SET AUTOCOMMIT = 0;
    
    -- INSERT INTO productos(nombre, precio, stock) VALUES ('Remera Supreme', 150000.00, 15), ('Cartuchera Mundial 2022', 340000.00, 25), ('Mouse Gamer RGB', 950000.00, 5), ('Goma de borrar', 1530000.00, 115), ('Galletitas Fauna', 250000.00, 415);
-- COMMIT;
-- ROLLBACK;

-- 13) Abrir dos sesiones. En la Sesion A, leer el saldo dos veces. Entre lecturas, la Sesion B modifica el saldo. Observar el comportamiento.
-- TEMA NO VISTO

-- 14) Simular un sistema de reserva donde dos usuarios intentan reservar el ultimo asiento disponible simultaneamente.

-- START TRANSACTION;
	-- SET AUTOCOMMIT = 0;
    -- SELECT disponible FROM asientos WHERE id_asiento = 10 FOR UPDATE;
	-- UPDATE asientos SET disponible = 0 WHERE id_asiento = 10;
-- COMMIT;
-- ROLLBACK;

-- 15) Crear un procedimiento que intente insertar en una tabla con constraint de clave duplicada, capturando el error con HANDLER.
-- TEMA NO VISTO

-- 16) Implementar el proceso completo de una compra: verificar stock, registrar venta, actualizar stock y debitar saldo del cliente.

-- START TRANSACTION;
	-- SET AUTOCOMMIT = 0;
    -- SELECT id_producto INTO @id_producto FROM productos WHERE nombre = 'Remera Supreme';
    -- SELECT precio INTO @precio FROM productos WHERE nombre = 'Remera Supreme';
    -- SELECT stock INTO @stock FROM productos WHERE nombre = 'Remera Supreme';
    
    -- UPDATE productos
		-- SET stock = stock - 10
	-- WHERE id_producto = @id_producto AND stock >= 10;
    
    -- SET @total = @precio * 10;
    
    -- INSERT INTO ventas(id_cliente, id_producto, cantidad, total) VALUES(1, @id_producto, 10, @total);
    
    -- UPDATE clientes
		-- SET saldo = saldo - @total
	-- WHERE id_cliente = 1;
-- COMMIT;
-- ROLLBACK;