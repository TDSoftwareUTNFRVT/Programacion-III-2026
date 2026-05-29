-- EJERCICIO 2
DELIMITER $$ 
CREATE TRIGGER trg_cambio_precio
AFTER UPDATE 
ON productos 
FOR EACH ROW
BEGIN
	IF OLD.precio != NEW.precio THEN
		INSERT INTO auditoria_precios(
		id_producto, precio_anterior, nuevo_precio, usuario)
		VALUES(NEW.id_producto, OLD.precio, NEW.precio, USER());
    END IF;
END$$
DELIMITER ; 