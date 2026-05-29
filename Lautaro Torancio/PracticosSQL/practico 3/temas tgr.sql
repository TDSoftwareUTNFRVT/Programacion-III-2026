USE nuevo;
DELIMITER $$ 
CREATE TRIGGER calcular_total
BEFORE INSERT ON ventas
FOR EACH ROW
BEGIN 
	DECLARE variable_precio DECIMAL(10,2);
	SELECT precio INTO variable_precio FROM productos WHERE id_producto = NEW.id_producto;
	SET NEW.total = NEW.cantidad * variable_precio;
END$$
DELIMITER ;