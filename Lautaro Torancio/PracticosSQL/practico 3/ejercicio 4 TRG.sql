-- ejercico 4
DELIMITER $$
CREATE TRIGGER trg_remove_cliente
BEFORE DELETE ON clientes 
FOR EACH ROW 
BEGIN
	INSERT INTO log_clientes_eliminados (id_cliente, nombre, email, fecha_eliminacion)
    VALUES(OLD.id_cliente,OLD.nombre,OLD.email,NOW());
END$$
DELIMITER ;
