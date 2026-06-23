-- EJERCICIO 3 
DELIMITER $$
CREATE TRIGGER trg_clientes_eliminados
BEFORE DELETE 
ON clientes
FOR EACH ROW
BEGIN
	INSERT INTO log_clientes_eliminados(
    fecha_eliminacion, email, nombre)
    VALUES(NOW.fecha_registro, USER(), OLD.saldo);
END$$
DELIMITER ;