-- Ejercicio 6
DELIMITER $$
CREATE TRIGGER trg_actualizar_saldo
AFTER INSERT ON ventas 
FOR EACH ROW 
BEGIN
	UPDATE clientes 
    SET saldo = saldo - NEW.total
    WHERE id_cliente = NEW.id_cliente;
END$$
DELIMITER ;