/*Enunciado: Al insertar una venta, el campo total debe calcularse automaticamente multiplicando
cantidad por el precio del producto.*/

DELIMITER $$

CREATE TRIGGER calcular_total_venta
BEFORE INSERT ON ventas
FOR EACH ROW
BEGIN
    DECLARE precio_prod DECIMAL(10,2);

    SELECT precio INTO precio_prod 
    FROM productos 
    WHERE id_producto = NEW.id_producto;

    SET NEW.total = precio_prod * NEW.cantidad;
END $$

DELIMITER ;


/*Ejercicio 3: AFTER UPDATE - Auditoria de cambio de precios
Enunciado: Cuando el precio de un producto cambie, registrar automaticamente en auditoria_precios
el precio anterior, el nuevo precio, el usuario MySQL y la fecha.*/

DELIMITER $$
CREATE TRIGGER controlar_cambio_precio 
AFTER UPDATE ON productos
FOR EACH ROW
BEGIN
	IF NEW.precio <> OLD.precio THEN 
        INSERT INTO auditoria_precios (id_producto, precio_anterior, precio_nuevo, usuario, fecha_cambio)
        VALUES (OLD.id_producto, OLD.precio, NEW.precio, USER(), NOW());
    END IF;
END $$

DELIMITER ;

/*Ejercicio 4: BEFORE DELETE - Log antes de eliminar cliente
Enunciado: Antes de eliminar un cliente, guardar sus datos en log_clientes_eliminados para mantener
un registro historico.*/

DELIMITER $$
CREATE TRIGGER registrar_cliente_eliminado 
BEFORE DELETE ON clientes
FOR EACH ROW
BEGIN
	INSERT INTO log_clientes_eliminados(id_cliente,nombre,email,fecha_eliminacion)
    VALUES (OLD.id_cliente,OLD.nombre,OLD.email,NOW());

END $$
DELIMITER ;


/*
Ejercicio 5: BEFORE INSERT - Validar stock disponible
Enunciado: Antes de registrar una venta, verificar que exista suficiente stock. Si el stock es
insuficiente, abortar la operacion con un mensaje de error.
Consejo: SIGNAL SQLSTATE '45000' es el codigo generico de error definido por el usuario en MySQL.
Siempre incluye SET MESSAGE_TEXT para dar un mensaje descriptivo.
*/

DELIMITER $$

CREATE TRIGGER validar_stock_disponible
BEFORE INSERT ON ventas
FOR EACH ROW
BEGIN
    DECLARE stock_actual INT;
    
    SELECT stock INTO stock_actual 
    FROM productos 
    WHERE id_producto = NEW.id_producto;
    
    IF NEW.cantidad > stock_actual THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: No hay suficiente stock disponible para realizar esta venta.';
    END IF;
END $$

DELIMITER ;


/*
Ejercicio 6: AFTER INSERT - Actualizar saldo del cliente
Enunciado: Cuando se registra una venta, descontar el total del saldo disponible del cliente
automaticamente.
*/

DELIMITER $$

CREATE TRIGGER actualizar_saldo_cliente
AFTER INSERT ON ventas
FOR EACH ROW
BEGIN
    UPDATE clientes 
    SET saldo = saldo - NEW.total
    WHERE id_cliente = NEW.id_cliente;
END $$

DELIMITER ;



/*
Ejercicio 7: BEFORE UPDATE - Proteger email, normalizar a minusculas
Enunciado: Antes de actualizar el email de un cliente, normalizar a minusculas y verificar que no
exista otro cliente con ese email.
*/

DELIMITER $$

CREATE TRIGGER proteger_y_normalizar_email
BEFORE UPDATE ON clientes
FOR EACH ROW
BEGIN
    DECLARE email_repetido INT DEFAULT 0;
    
    SET NEW.email = LOWER(NEW.email);
    
    IF NEW.email <> OLD.email THEN
        SELECT COUNT(*) INTO email_repetido 
        FROM clientes 
        WHERE email = NEW.email AND id_cliente <> OLD.id_cliente;
        
        IF email_repetido > 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error: El correo electrónico ya se encuentra registrado por otro cliente.';
        END IF;
    END IF;
END $$

DELIMITER ;



/*
Ejercicio 8: AFTER DELETE - Restaurar stock al cancelar venta
Enunciado: Cuando se elimine una venta (cancelacion), devolver automaticamente la cantidad al
stock del producto correspondiente
*/

DELIMITER $$

CREATE TRIGGER restaurar_stock_cancelacion
AFTER DELETE ON ventas
FOR EACH ROW
BEGIN
    UPDATE productos 
    SET stock = stock + OLD.cantidad
    WHERE id_producto = OLD.id_producto;
END $$

DELIMITER ;