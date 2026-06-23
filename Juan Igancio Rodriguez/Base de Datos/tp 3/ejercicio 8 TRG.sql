-- ejercicio 8
USE nuevo;
DELIMITER $$
CREATE TRIGGER trg_restaurar_stock
AFTER DELETE ON ventas
FOR EACH ROW 
BEGIN
	UPDATE productos
    SET stock = stock + OLD.cantidad
    WHERE id_producto = OLD.id_producto;
END$$
DELIMITER ;