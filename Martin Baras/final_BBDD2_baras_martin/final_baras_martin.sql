-- A.1
CREATE VIEW v_ocupacion_actividades AS
SELECT
actividades.id_actividad,
actividades.nombre AS actividad,
actividades.cupo_maximo,
COUNT(inscripciones.id_inscripcion) AS inscriptos,
(actividades.cupo_maximo - COUNT(inscripciones.id_inscripcion)) AS lugares_disponibles
FROM
actividades
LEFT JOIN inscripciones ON inscripciones.id_actividad =  actividades.id_actividad
AND inscripciones.estado = 'VIGENTE'
WHERE actividades.activa = 1
GROUP BY
actividades.id_actividad,
actividades.nombre,
actividades.cupo_maximo;
-- A.2
CREATE VIEW v_deuda_socios AS
SELECT 
cuotas.id_socio,
CONCAT(socios.apellido, ', ', socios.nombre) AS socio,
socios.estado,
COUNT(cuotas.estado) AS cuotas_pendientes,
SUM(cuotas.importe) AS total_adeudado
FROM cuotas
JOIN socios ON socios.id_socio = cuotas.id_socio
WHERE cuotas.estado = 'PENDIENTE'
GROUP BY cuotas.id_socio;

-- B.1
DELIMITER $$
CREATE FUNCTION fn_deuda_socio(p_id_socio INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE deuda DECIMAL(10,2);
    SELECT SUM(cuotas.importe)
    INTO deuda
    FROM cuotas
    WHERE cuotas.id_socio = p_id_socio
    AND cuotas.estado = 'PENDIENTE';
    IF deuda IS NULL THEN
        SET deuda = 0.00;
    END IF;
    RETURN deuda;
END $$
DELIMITER ;

-- B.2
DELIMITER $$
CREATE FUNCTION fn_recargo(p_id_cuota INT, p_fecha_pago DATE)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE importe DECIMAL(10,2);
    DECLARE fecha_vencimiento DATE;
    DECLARE dias_atraso INT;

    SELECT cuotas.importe, cuotas.fecha_vencimiento
    INTO importe, fecha_vencimiento
    FROM cuotas
    WHERE cuotas.id_cuota = p_id_cuota;

    IF importe IS NULL THEN
        RETURN NULL;
    END IF;

    SET dias_atraso = DATEDIFF(p_fecha_pago, fecha_vencimiento);
    IF dias_atraso <= 0 THEN RETURN importe;
    ELSEIF dias_atraso <= 10 THEN RETURN ROUND(importe * 1.05, 2);
    ELSE RETURN ROUND(importe * 1.10, 2);
    END IF;
END$$

DELIMITER ;
-- C.2
DELIMITER $$
CREATE TRIGGER trg_actividades_au
AFTER UPDATE ON actividades
FOR EACH ROW
BEGIN
	IF OLD.cuota_mensual <> NEW.cuota_mensual THEN
		INSERT INTO auditoria_precios(id_actividad, precio_anterior, precio_nuevo, fecha, usuario)
        VALUES(NEW.id_actividad, OLD.cuota_mensual, NEW.cuota_mensual, NOW(), USER());
    END IF;
END$$
DELIMITER ;

-- D.1
DELIMITER $$

CREATE PROCEDURE sp_registrar_pago(
    IN  p_id_cuota      INT,
    IN  p_medio         VARCHAR(20),
    IN  p_fecha_pago    DATE,
    OUT p_monto_cobrado DECIMAL(10,2)
)
BEGIN
    DECLARE monto DECIMAL(10,2);
    DECLARE id_socio_cuota INT;
    DECLARE estado_socio VARCHAR(20);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    IF NOT EXISTS (SELECT id_cuota FROM cuotas WHERE id_cuota = p_id_cuota) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cuota no existe';
    END IF;

    IF EXISTS (SELECT estado FROM cuotas WHERE id_cuota = p_id_cuota AND estado = 'PAGADA') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cuota ya se encuentra pagada';
    END IF;

    SET monto = fn_recargo(p_id_cuota, p_fecha_pago);

    SELECT cuotas.id_socio, socios.estado INTO id_socio_cuota, estado_socio
    FROM cuotas
    JOIN socios ON socios.id_socio = cuotas.id_socio
    WHERE cuotas.id_cuota = p_id_cuota;

    UPDATE cuotas
    SET estado = 'PAGADA'
    WHERE id_cuota = p_id_cuota;

    INSERT INTO pagos (id_cuota, fecha_pago, monto, medio)
    VALUES (p_id_cuota, p_fecha_pago, monto, p_medio);

    IF estado_socio = 'SUSPENDIDO' AND fn_deuda_socio(id_socio_cuota) = 0 THEN
        UPDATE socios
        SET estado = 'ACTIVO'
        WHERE id_socio = id_socio_cuota;
    END IF;

    SET p_monto_cobrado = monto;
    
    COMMIT;
END$$

DELIMITER ;