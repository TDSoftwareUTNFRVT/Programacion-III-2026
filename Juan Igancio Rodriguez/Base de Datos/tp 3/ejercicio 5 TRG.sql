-- Ejercicio 5 
DELIMITER $$
CREATE TRIGGER trg_verify_stock
BEFORE INSERT ON ventas 
FOR EACH ROW
BEGIN 
	DECLARE variable_stock INT ;
    SELECT stock INTO variable_stock FROM productos WHERE id_producto = NEW.id_producto;
    IF variable_stock < NEW.cantidad THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay stock';
	END IF;
END$$
DELIMITER ;
    
	