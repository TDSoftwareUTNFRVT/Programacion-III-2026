-- Function Ejemplo 1

DELIMITER $$
CREATE FUNCTION calcular_iva(precio DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
	RETURN precio * 0.21;
END$$
DELIMITER ;

SELECT nombre, precio, calcular_iva(precio) AS iva, precio + calcular_iva(precio) AS precio_final FROM productos;

-- Function Ejemplo 2

DELIMITER $$
CREATE FUNCTION categoria_cliente(saldo DECIMAL(10,2))
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
	DECLARE categoria VARCHAR(20);

	IF saldo >= 10000 THEN
	SET categoria = 'VIP';
	ELSEIF saldo >= 1000 THEN
	SET categoria = 'Regular';
	ELSE
	SET categoria = 'Básico';
	END IF;

	RETURN categoria;
END$$
DELIMITER ;

SELECT nombre, saldo, categoria_cliente(saldo) AS categoria FROM clientes WHERE activo = 1;

-- Function Ejemplo 3

DELIMITER $$
CREATE FUNCTION stock_disponible(p_id_producto INT)
RETURNS INT
READS SQL DATA
BEGIN
	DECLARE v_stock INT;
    SELECT stock INTO v_stock FROM productos WHERE id_producto = p_id_producto;
    
    RETURN COALESCE(v_stock, 0);
END$$
DELIMITER ;

SELECT v.id_venta, v.cantidad, stock_disponible(v.id_producto) AS stock_actual FROM ventas v WHERE stock_disponible(v.id_producto) > 0;

-- Procedure Ejemplo 1

DELIMITER $$
CREATE PROCEDURE obtener_saldo_cliente(
IN p_id_cliente INT,
OUT p_saldo DECIMAL(10,2)
)
BEGIN
	SELECT saldo INTO p_saldo FROM clientes WHERE id_cliente = p_id_cliente;
END$$
DELIMITER ;

CALL obtener_saldo_cliente(1, @mi_saldo);
SELECT @mi_saldo;

-- Procedure Ejemplo 2

DELIMITER $$
CREATE PROCEDURE registrar_venta(
IN p_id_cliente INT,
IN p_id_producto INT,
IN p_cantidad INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
		ROLLBACK;
        RESIGNAL;
    END;
    START TRANSACTION;
		IF (SELECT stock FROM productos WHERE id_producto = p_id_producto) < p_cantidad THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock Insuficiente';
		END IF;
        
        INSERT INTO ventas(id_cliente, id_producto, cantidad) VALUES (p_id_cliente, p_id_producto, p_cantidad);
	COMMIT;
END$$
DELIMITER ;

CALL registrar_venta(1, 3, 5);

-- Procedure Ejemplo 3

DELIMITER $$
CREATE PROCEDURE aplicar_descuento_vip()
BEGIN
	DECLARE v_id INT;
    DECLARE v_done BOOLEAN DEFAULT FALSE;
    
    DECLARE cur CURSOR FOR SELECT id_cliente FROM clientes WHERE saldo >= 1000 AND activo = 1;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    OPEN cur;
    loop_clientes: LOOP
    FETCH cur INTO v_id;
    IF v_done THEN LEAVE loop_clientes; END IF;
    
    UPDATE clientes SET saldo = saldo * 1.05 WHERE id_cliente = v_id;
    END LOOP;
    CLOSE cur;
END$$
DELIMITER ;

CALL aplicar_descuento_vip();

-- Ejercicio 1

DELIMITER $$
CREATE FUNCTION precio_final(p_id_producto INT)
RETURNS DECIMAL(10,2)
READS SQL DATA
BEGIN
	DECLARE variable_precio DECIMAL(10,2);
    SELECT precio INTO variable_precio FROM productos WHERE id_producto = p_id_producto;
    
    RETURN COALESCE(variable_precio * 1.21, 0);
END$$
DELIMITER ;

SELECT p.precio, precio_final(p.id_producto) AS precio_final FROM productos p;

-- Ejercicio 2

DELIMITER $$
CREATE FUNCTION dias_como_cliente(p_id INT)
RETURNS INT
READS SQL DATA
BEGIN
	DECLARE variable_fecha_registro DATETIME;
    SELECT fecha_registro INTO variable_fecha_registro FROM clientes WHERE id_cliente = p_id;
    
    RETURN DATEDIFF(NOW(), variable_fecha_registro);
END$$
DELIMITER ;

SELECT c.id_cliente, c.nombre, dias_como_cliente(c.id_cliente) AS dias_como_cliente FROM clientes c ORDER BY dias_como_cliente(c.id_cliente) DESC;

-- Ejercicio 3

DELIMITER $$
CREATE PROCEDURE registrar_cliente_completo(
IN new_nombre VARCHAR(150),
IN new_email VARCHAR(150),
IN new_saldo_inicial DECIMAL(12,2),
IN new_tipo_cuenta ENUM('corriente', 'ahorro')
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
		ROLLBACK;
        RESIGNAL;
    END;
    START TRANSACTION;
		INSERT INTO clientes(nombre, email, saldo) VALUES(new_nombre, new_email, new_saldo_inicial);
        INSERT INTO cuentas(id_cliente, tipo, saldo) VALUES(LAST_INSERT_ID(), new_tipo_cuenta, new_saldo_inicial);
    COMMIT;
END$$
DELIMITER ;

-- Para corroborar el rollback
CALL registrar_cliente_completo('Juan Pérez', 'juan@example.com', 1000, 'ahorro');

-- Ejercicio 4

DELIMITER $$
CREATE PROCEDURE resumen_cliente(
IN p_id INT,
OUT p_total_ventas INT,
OUT p_monto_total DECIMAL(12,2)
)
BEGIN
    SELECT COALESCE(COUNT(*), 0), COALESCE(SUM(total), 0) INTO p_total_ventas, p_monto_total FROM ventas WHERE id_cliente = p_id;
END$$
DELIMITER ;

CALL resumen_cliente(1, @n, @m);
SELECT @n AS total_ventas;
SELECT @m AS monto_total;

-- Ejercicio 5

DELIMITER $$
CREATE FUNCTION tiene_saldo_suficiente(
p_id INT,
p_monto DECIMAL(12,2)
)
RETURNS BOOLEAN
READS SQL DATA
BEGIN
	DECLARE variable_saldo DECIMAL(12,2);
    SELECT saldo INTO variable_saldo FROM clientes WHERE id_cliente = p_id;
    
    IF variable_saldo >= p_monto THEN
		RETURN TRUE;
	ELSE
		RETURN FALSE;
	END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE transferir_entre_clientes(
IN p_origen INT,
IN p_destino INT,
IN p_monto DECIMAL(12,2)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
		ROLLBACK;
        RESIGNAL;
    END;
    START TRANSACTION;
		IF NOT tiene_saldo_suficiente(p_origen, p_monto) THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Saldo Insuficiente';
		END IF;
        
        UPDATE clientes SET saldo = saldo - p_monto WHERE id_cliente = p_origen;
        UPDATE clientes SET saldo = saldo + p_monto WHERE id_cliente = p_destino;
    COMMIT;
END$$
DELIMITER ;

-- Para corroborar el rollback
CALL transferir_entre_clientes(1, 2, 50000);