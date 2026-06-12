
/*
Ejercicio 9: Transaccion simple con COMMIT y ROLLBACK
Enunciado: Insertar un nuevo cliente y registrar su primera compra. Si ocurre cualquier error,
deshacer todo.
*/

START TRANSACTION;

INSERT INTO clientes (nombre, email, saldo)
VALUES ('Ana Torres', 'ana@email.com', 1000.00);


SET @id = LAST_INSERT_ID(); 

INSERT INTO ventas (id_cliente, id_producto, cantidad, total)
VALUES (@id, 1, 2, 150.00);


COMMIT;     



-- =============================================================================


/*
Ejercicio 10: Transferencia bancaria con validacion
Enunciado: Implementar una transferencia entre dos cuentas. Validar que el saldo sea suficiente.
Nota: Se utiliza un procedimiento almacenado para automatizar la lógica de validación y el ROLLBACK.
*/
DELIMITER $$

CREATE PROCEDURE transferencia_bancaria(
    IN p_id_origen INT,
    IN p_id_destino INT,
    IN p_monto DECIMAL(12,2)
)
BEGIN
    DECLARE v_saldo DECIMAL(12,2);

    SELECT saldo INTO v_saldo
    FROM clientes
    WHERE id_cliente = p_id_origen;

    IF v_saldo < p_monto THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Saldo insuficiente.';
    ELSE
        START TRANSACTION;

            UPDATE clientes SET saldo = saldo - p_monto WHERE id_cliente = p_id_origen;
            UPDATE clientes SET saldo = saldo + p_monto WHERE id_cliente = p_id_destino;

        COMMIT;

        SELECT 'Transferencia exitosa.' AS mensaje;
    END IF;

END $$

DELIMITER ;


-- =============================================================================


/*
Ejercicio 11: Uso de SAVEPOINT en proceso de pedido
Enunciado: Registrar un pedido con multiples pasos. Usar SAVEPOINTs para poder deshacer pasos
individuales.
*/

DELIMITER $$

CREATE PROCEDURE registrar_pedido(
    IN p_id_cliente INT,
    IN p_id_producto INT,
    IN p_cantidad INT
)
BEGIN
    DECLARE v_stock INT;
    DECLARE v_precio DECIMAL(10,2);
    DECLARE v_total DECIMAL(12,2);

    START TRANSACTION;

    -- PASO 1: Insertar la venta
    INSERT INTO ventas (id_cliente, id_producto, cantidad, total)
    VALUES (p_id_cliente, p_id_producto, p_cantidad, 0);

    SAVEPOINT paso1_venta;


    SELECT stock, precio INTO v_stock, v_precio
    FROM productos WHERE id_producto = p_id_producto;

    IF v_stock < p_cantidad THEN
        ROLLBACK TO paso1_venta; 
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Stock insuficiente. Se canceló el pedido.';
    END IF;

    UPDATE productos
    SET stock = stock - p_cantidad
    WHERE id_producto = p_id_producto;

    SAVEPOINT paso2_stock;

    SET v_total = v_precio * p_cantidad;

    UPDATE ventas
    SET total = v_total
    WHERE id_cliente = p_id_cliente
      AND id_producto = p_id_producto
      ORDER BY id_venta DESC LIMIT 1;

    SAVEPOINT paso3_total;

    UPDATE clientes
    SET saldo = saldo - v_total
    WHERE id_cliente = p_id_cliente;

    COMMIT;

    SELECT 'Pedido registrado correctamente.' AS mensaje;

END $$

DELIMITER ;



