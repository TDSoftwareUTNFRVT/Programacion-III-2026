/* Parte A: Vistas */
/* Ej. A.1 */
CREATE VIEW  v_ocupacion_actividades AS
	SELECT 
		act.id_actividad,
        act.nombre,
        act.cupo_maximo,
        COUNT(ins.estado) AS inscriptos,
        (act.cupo_maximo - COUNT(ins.estado)) AS lugares_disponibles
	FROM actividades act
    JOIN inscripciones ins ON act.id_actividad = ins.id_actividad
    WHERE ins.estado = 'VIGENTE' AND activa = 1
    GROUP BY act.id_actividad, act.nombre
;
/* Ej. A.2 */
CREATE VIEW v_deuda_socios AS
	SELECT 
		soc.id_socio,
        (soc.apellido + ", " + soc.nombre) AS socio,
        soc.estado,
        COUNT(cuo.estado) AS coutas_pendientes,
        SUM(cuo.importe) AS total_adeudado
	FROM socios soc
    JOIN cuotas cuo
		ON soc.id_socio = cuo.id_socio
	WHERE cuo.estado = 'PENDIENTE'
    GROUP BY soc.id_socio
;
/* Parte B: Funciones */
/* Ej. B.1 */
DELIMITER $$
CREATE FUNCTION fn_deuda_socio (p_id_socio INT) 
RETURNS DECIMAL (10,2)
DETERMINISTIC
BEGIN
	DECLARE deuda_socio DECIMAL (10,2);
    
    SET deuda_socio = (SELECT SUM(cuo.importe) FROM cuotas cuo WHERE estado = 'PENDIENTE');
    
    IF deuda_socio = 0 THEN
		RETURN 0.00;
	END IF;
    
    RETURN deuda_socio;
END $$
DELIMITER ;
/* Ej. B.2 */
DELIMITER $$
CREATE FUNCTION fn_recargo (
	p_id_cuota INT, 
    p_fecha_pago DATE
)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
	DECLARE dias_atraso INT;
    
    SET dias_atraso = DATEDIFF(p_fecha_pago, (SELECT fecha_vencimiento FROM cuotas WHERE id_cuota = p_id_cuota));
    
    IF EXISTS(SELECT 1 FROM cuotas WHERE id_cuota = p_id_cuota) = 0 THEN
		RETURN NULL;
    END IF;
    
    IF dias_atraso <= 0 THEN
		RETURN (SELECT importe FROM cuotas WHERE id_cuota = p_id_cuota);
	END IF;
    
	IF dias_atraso >= 1 AND dias_atraso <= 10 THEN
		RETURN ROUND((SELECT importe FROM cuotas WHERE id_cuota = p_id_cuota) * 1.05, 2);
    END IF;
    
	RETURN ROUND((SELECT importe FROM cuotas WHERE id_cuota = p_id_cuota) * 1.10, 2);
END $$
DELIMITER ;
/* Parte C: Triggers */
/* Ej. C.1 */
DELIMITER $$
CREATE TRIGGER trg_inscripciones_bi
BEFORE INSERT ON inscripciones
FOR EACH ROW
    BEGIN
		IF EXISTS(SELECT 1 FROM socios WHERE id_socio = NEW.id_socio) = 0
			OR estado = 'CANCELADA'
		THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El socio no está activo';
		END IF;
        
        IF fn_deuda_socio(NEW.id_socio) > 0 THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El socio registra deuda';
		END IF;
        
        IF (SELECT COUNT(id_inscripcion) FROM inscripciones WHERE estado = 'VIGENTE') > (SELECT cupo_maximo FROM actividades WHERE id_actividad = NEW.id_actividad) THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La actividad no tiene cupo
disponible';
        END IF;
    END $$
DELIMITER ;
/* Ej. C.2 */
DELIMITER $$
CREATE TRIGGER trg_actividades_au 
AFTER UPDATE ON actividades
FOR EACH ROW
BEGIN
	IF NEW.cuota_mensual <> OLD.cuota_mensual THEN
		INSERT INTO auditoria_precios (
			id_actividad,
            precio_anterior,
            precio_nuevo,
            fecha,
            usuario)
		VALUES (
			NEW.id_actividad,
            OLD.cuota_mensual,
            NEW.cuota_mensual,
            NOW(),
            USER());
    END IF;
END $$
DELIMITER ;
/* Parte D: Procedimiento almacenado con transacción */
/* Ej. D.1 */
DELIMITER $$
CREATE PROCEDURE sp_registrar_pago (
IN p_id_cuota INT,
IN p_medio VARCHAR(20),
IN p_fecha_pago DATE,
OUT p_monto_cobrado DECIMAL(10,2)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
        RESIGNAL;
    END;
    
	START TRANSACTION;
		IF EXISTS(SELECT * FROM cuotas WHERE id_cuota = p_id_cuota) = 0 THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cuota no existe';
        END IF;
        
        IF (SELECT estado FROM cuotas WHERE id_cuota = p_id_cuota) = 'PAGADA' THEN
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cuota ya se encuentra pagada';
        END IF;
        
        UPDATE cuotas
			SET estado = 'PAGADA'
		WHERE id_cuota = p_id_cuota;
        
        INSERT INTO pagos (id_cuota, fecha_pago, monto, medio)
		VALUES (
			p_id_cuota,
            p_fecha_pago,
            (SELECT fn_recargo(p_id_cuota, p_fecha_pago)),
            p_medio);
            
		IF (SELECT socios.estado FROM cuotas JOIN socios ON cuotas.id_socio = socios.id_socio WHERE id_cuota = p_id_cuota) = 'SUSPENDIDO' AND (SELECT fn_deuda_socio((SELECT id_socio FROM cuotas JOIN socios ON cuotas.id_socio = socios.id_socio WHERE id_cuota = p_id_cuota))) THEN
			UPDATE socios
            SET estado = 'ACTIVO'
            WHERE id_socio = (SELECT socios.id_socio FROM cuotas JOIN socios ON cuotas.id_socio = socios.id_socio WHERE id_cuota = p_id_cuota);
        END IF;
    COMMIT;
END $$
DELIMITER ;