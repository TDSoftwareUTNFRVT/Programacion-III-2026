========================================
Ejercicio 2
========================================
DELIMITER $$ CREATE TRIGGER 
trg_calc_total_pedido BEFORE INSERT
ON pedidos 
FOR EACH ROW 
BEGIN
DECLARE precio_articulo DECIMAL(10,2);
SELECT precio
INTO precio_articulo
FROM articulos 
WHERE id_articulo = NEW.id_articulo;
SET NEW.importe = precio_articulo * NEW.unidades; 
END$$ 
DELIMITER ;

========================================
Ejercicio 3
========================================
DELIMITER $$
CREATE TRIGGER trg_cambio_tarifas
AFTER UPDATE
ON articulos
FOR EACH ROW
BEGIN
    IF OLD.tarifa <> NEW.tarifa THEN
        INSERT INTO auditoria_tarifas
        (
            id_articulo,
            tarifa_anterior,
            tarifa_nueva,
            empleado
        )
        VALUES
        (
            NEW.id_articulo,
            OLD.tarifa,
            NEW.tarifa,
            USER()
        );
    END IF;
END$$
DELIMITER ;

========================================
Ejercicio 4
========================================
DELIMITER $$
CREATE TRIGGER trg_guardar_proveedores_borrados
BEFORE DELETE
ON proveedores
FOR EACH ROW
BEGIN
	INSERT INTO log_proveedores_eliminados(
			id_proveedor,
			razon_social,
			contacto,
			fecha_eliminacion
			)
		VALUES(
			OLD.id_proveedor,
			OLD.razon_social,
			OLD.contacto
			)
END$$
DELIMITER ;

========================================
Ejercicio 5
========================================
DELIMITER $$
CREATE TRIGGER trg_controlar_existencias
BEFORE INSERT
ON pedidos 
FOR EACH ROW
BEGIN
	DECLARE existencia_actual DECIMAL(10,2)
	SELECT existencias
	INTO existencia_actual
	FROM articulos
	WHERE id_articulo = NEW.id_articulo;
	
	IF existencia_actual < NEW.unidades THEN
 	SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'no se puede mostro, no tenemo stock';
	END IF;
END$$
DELIMITER ;

========================================
Ejercicio 6
========================================
DELIMITER $$
CREATE TRIGGER trg_actualizar_credito
AFTER INSERT
ON pedidos 
FOR EACH ROW
BEGIN
	DECLARE credito_viejo DECIMAL (12,2);
	SELECT credito
	INTO credito_viejo
	FROM proveedores
	UPDATE proveedores
	SET credito = credito_viejo - NEW.importe
	WHERE id_proveedor = NEW.id_proveedor;
	
END$$
DELIMITER ;

========================================
Ejercicio 7
========================================
DELIMITER $$
CREATE TRIGGER trg_proteger_contactos
BEFORE UPDATE
ON proveedores 
FOR EACH ROW
BEGIN
	
	IF LOWER(OLD.contacto) <> LOWER(NEW.contacto) THEN
		SET contacto = LOWER(NEW.contacto)
	
	ELSE 
		SIGNAL SQLSTATE '45000'
        	SET MESSAGE_TEXT = 'no se puede mostro';
	END IF;
	
END$$
DELIMITER;

========================================
Ejercicio 8
========================================
DELIMITER $$
CREATE TRIGGER trg_eliminacion_pedido
AFTER DELETE
ON pedidos
FOR EACH ROW
BEGIN
	UPDATE articulos
	SET existencias = existencias + OLD.unidades
	WHERE id_articulo = OLD.id_articulo;
	
END$$
DELIMITER ;
