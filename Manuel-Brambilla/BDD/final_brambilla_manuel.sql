
-- A.1
CREATE OR REPLACE VIEW v_ocupacion_actividades AS
SELECT
	a.id_actividad,
    a.nombre as actividad,
    a.cupo_maximo,
    insc.estado as inscriptos,
    a.cupo_maximo - count(insc.estado) as lugares_disponibles
FROM actividades a 
INNER JOIN inscripciones insc ON insc.id_actividad = a.id_actividad
WHERE insc.estado = 'VIGENTE'
GROUP BY id_actividad, cupo_maximo;

-- -----------------------------------------------------------------------
-- A.2)
CREATE OR REPLACE VIEW v_deuda_socios AS
SELECT 
	s.id_socio,
    CONCAT(s.apellido,' ', s.nombre) as socio,
    s.estado,
    COUNT(cts.estado) AS cuotas_pendientes,
    SUM(cts.importe) as total_adeudado
FROM cuotas cts
INNER JOIN cuotas cts ON cts.id_socio = s.id_socio
WHERE cts.estado = 'PENDIENTE'
GROUP BY id_socio, estado;

-- --------------------------------------------------------------------------
-- B.1.
DELIMITER $$
CREATE FUNCTION fn_deuda_socio(
	p_id_socio INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
	DECLARE importe_pendiente DECIMAL(10,2);
    IF estado = 'PENDIENTE' THEN
		SELECT SUM(importe * estado) INTO importe_pendiente
		FROM cuotas 
		WHERE id_socio = p_id_socio;
    END IF;
	return IFNULL(importe_pendiente, 0);
END$$
DELIMITER ;
-- ----------------------------------------------------------------------------
-- C.1)
DELIMITER $$
CREATE TRIGGER trg_inscripciones_bi
BEFORE INSERT
ON inscripciones
FOR EACH ROW
BEGIN
	DECLARE socio_id INT;
    DECLARE actividad_id INT;
    
    SELECT id_socio INTO socio_id FROM socios
    where id_socio = new.id_socio;
    
    SELECT id_actividad INTO actividad_id from actividades
    WHERE id_actividad = new.id_actividad;
    
	IF socio_id <> 'ACTIVO' THEN
		signal sqlstate '45000'
			set message_text = 'El socio no está activo';
	ELSEIF fn_deuda_socio(p_id_socio) THEN
		signal sqlstate '45000'
			set message_text = 'El socio registra deuda';
	ELSEIF actividad_id >= cupo_maximo then
		signal sqlstate '45000'
		set message_text = 'La actividad no tiene cupo disponible';
		
	END IF;
END$$
DELIMITER ;
-- --------------------------------------------------------------------
-- C.2
DELIMITER $$
CREATE TRIGGER trg_actividades_au
AFTER UPDATE ON actividades
FOR EACH ROW
BEGIN
    IF OLD.cuota_mensual <> NEW.cuota_mensual THEN
        INSERT INTO auditoria_precios (
            id_actividad, 
            precio_anterior, 
            precio_nuevo, 
            fecha, 
            usuario
        )
        VALUES (
            NEW.id_actividad, 
            OLD.cuota_mensual, 
            NEW.cuota_mensual, 
            NOW(), 
            USER()
        );
    END IF;
END$$
DELIMITER ;

-- --------------------------------------------------------------------
-- PARTE D - procedimiento almacenado con transacción
DELIMITER $$

CREATE PROCEDURE sp_registrar_pago(
    IN p_id_cuota INT,
    IN p_medio VARCHAR(20),
    IN p_fecha_pago DATE,
    OUT p_monto_cobrado DECIMAL(10,2)
)
BEGIN
    DECLARE v_estado_cuota VARCHAR(20);
    DECLARE v_id_socio INT;
    DECLARE v_estado_socio VARCHAR(20);
    DECLARE v_deuda_restante DECIMAL(10,2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SELECT estado, id_socio INTO v_estado_cuota, v_id_socio
    FROM cuotas
    WHERE id_cuota = p_id_cuota;

    IF v_estado_cuota IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'La cuota no existe';
    END IF;

    IF v_estado_cuota = 'PAGADA' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'La cuota ya se encuentra pagada';
    END IF;

    SET p_monto_cobrado = fn_recargo(p_id_cuota, p_fecha_pago);

    START TRANSACTION;

        UPDATE cuotas 
        SET estado = 'PAGADA' 
        WHERE id_cuota = p_id_cuota;

        INSERT INTO pagos (id_cuota, fecha_pago, monto, medio)
        VALUES (p_id_cuota, p_fecha_pago, p_monto_cobrado, p_medio);

        SELECT estado INTO v_estado_socio 
        FROM socios 
        WHERE id_socio = v_id_socio;

        IF v_estado_socio = 'SUSPENDIDO' THEN
            SET v_deuda_restante = fn_deuda_socio(v_id_socio);
            
            IF v_deuda_restante = 0 THEN
                UPDATE socios 
                SET estado = 'ACTIVO' 
                WHERE id_socio = v_id_socio;
            END IF;
        END IF;

    COMMIT;
END$$
DELIMITER ;

/* E.1 */
SELECT * FROM v_ocupacion_actividades;
/* Resultado: */
 
/* E.2 */
SELECT * FROM v_deuda_socios;
/* Resultado: */
 
/* E.3 */
SELECT fn_deuda_socio(3) AS deuda_3, fn_deuda_socio(8) AS deuda_8;
/* Resultado: */
 
/* E.4 */
SELECT fn_recargo(12, '2026-09-10') AS r1, fn_recargo(12, '2026-09-20') AS r2,
       fn_recargo(12, '2026-09-21') AS r3, fn_recargo(999, '2026-09-10') AS r4;
/* Resultado: *
NSERT INTO inscripciones (id_socio, id_actividad) VALUES (3, 3);
/* Resultado: */
 
/* E.6 */
INSERT INTO inscripciones (id_socio, id_actividad) VALUES (7, 3);
/* Resultado: */
 
/* E.7 */
INSERT INTO inscripciones (id_socio, id_actividad) VALUES (8, 1);
/* Resultado: */
 
/* E.8 */
INSERT INTO inscripciones (id_socio, id_actividad) VALUES (8, 3);
SELECT * FROM v_ocupacion_actividades WHERE id_actividad = 3;
/* Resultado: */
 
/* E.9 */
UPDATE actividades SET cuota_mensual = 20000.00 WHERE id_actividad = 1;
UPDATE actividades SET cupo_maximo = 25 WHERE id_actividad = 2;
SELECT id_actividad, precio_anterior, precio_nuevo FROM auditoria_precios;
/* Resultado: */
 
/* E.10 */
CALL sp_registrar_pago(16, 'CHEQUE', '2026-09-15', @monto);
SELECT estado FROM cuotas WHERE id_cuota = 16;
SELECT COUNT(*) AS cant_pagos FROM pagos;
/* Resultado: */
 
/* E.11 */
CALL sp_registrar_pago(16, 'TRANSFERENCIA', '2026-09-15', @monto);
SELECT @monto;
SELECT estado FROM cuotas WHERE id_cuota = 16;
SELECT COUNT(*) AS cant_pagos FROM pagos;
/* Resultado: */
 
/* E.12 */
CALL sp_registrar_pago(16, 'EFECTIVO', '2026-09-16', @monto);
CALL sp_registrar_pago(999, 'EFECTIVO', '2026-09-16', @monto);
/* Resultado: */
 
/* E.13 */
CALL sp_registrar_pago(5, 'EFECTIVO', '2026-09-15', @monto);
SELECT @monto;
SELECT estado FROM socios WHERE id_socio = 3;
/* Resultado: */
 
/* E.14 */
CALL sp_registrar_pago(14, 'TARJETA', '2026-09-15', @monto);
SELECT @monto;
SELECT estado FROM socios WHERE id_socio = 3;
SELECT * FROM v_deuda_socios;
/* Resultado: */
