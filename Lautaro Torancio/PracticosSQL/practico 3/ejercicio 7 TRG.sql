-- Ejercicio 7 
DELIMITER $$
CREATE TRIGGER trg_normalizar_cuenta
BEFORE UPDATE ON clientes
FOR EACH ROW 
BEGIN
	SET NEW.email = LOWER(NEW.email);
    IF EXISTS(SELECT 1 FROM clientes WHERE email = NEW.email AND id_cliente <> OLD.id_cliente) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Hay un gmail de otro cliente parecido';
	END IF;
END$$
DELIMITER ;