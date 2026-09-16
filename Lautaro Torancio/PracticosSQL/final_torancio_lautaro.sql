-- ejercicio A.1
USE club_deportivo;
CREATE OR REPLACE VIEW v_ocupacion_actividades AS
SELECT 
actividades.id_actividad,
actividades.nombre AS actividad,
actividades.cupo_maximo,
COALESCE(COUNT(inscripciones.id_inscripcion),0) AS inscriptos,
actividades.cupo_maximo - COALESCE(COUNT(inscripciones.id_inscripcion),0) AS lugares_disponibles
FROM actividades
LEFT JOIN inscripciones 
       ON actividades.id_actividad = inscripciones.id_actividad 
       AND inscripciones.estado = 'VIGENTE'
WHERE actividades.activa = 1
GROUP BY actividades.id_actividad, actividades.nombre, actividades.cupo_maximo;

-- ejercicio A.2

CREATE OR REPLACE VIEW v_deuda_socios AS
SELECT socios.id_socio,
       CONCAT(socios.apellido, socios.nombre) AS socio,
       socios.estado,
       COUNT(cuotas.id_cuota) AS cuotas_pendientes,
       SUM(cuotas.importe) AS total_adeudado
FROM socios
JOIN cuotas ON socios.id_socio = cuotas.id_socio
WHERE cuotas.estado = 'PENDIENTE'
GROUP BY socios.id_socio, socios.apellido, socios.nombre, socios.estado;

-- ejercicio B.1

DELIMITER $$
CREATE FUNCTION fn_deuda_socio(p_id_socio INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
  DECLARE v_deuda DECIMAL(10,2);
  SELECT COALESCE(SUM(importe),0.00)
  INTO v_deuda
  FROM cuotas
  WHERE id_socio = p_id_socio AND estado = 'PENDIENTE';
  RETURN v_deuda;
END$$
DELIMITER ;

-- ejercicio B.2

DELIMITER $$
CREATE FUNCTION fn_recargo(p_id_cuota INT, p_fecha_pago DATE)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
  DECLARE v_importe DECIMAL(10,2);
  DECLARE v_venc DATE;
  DECLARE v_dias INT;
  DECLARE v_monto DECIMAL(10,2);

  SELECT importe, fecha_vencimiento
  INTO v_importe, v_venc
  FROM cuotas
  WHERE id_cuota = p_id_cuota;
  IF v_importe IS NULL THEN
    RETURN NULL;
  END IF;
  SET v_dias = DATEDIFF(p_fecha_pago, v_venc);
  IF v_dias <= 0 THEN
	SET v_monto = v_importe;
  ELSEIF v_dias BETWEEN 1 AND 10 THEN
	SET v_monto = ROUND(v_importe * 1.05, 2);
  ELSE
	SET v_monto = ROUND(v_importe * 1.10, 2);
  END IF;
  RETURN v_monto;
END$$
DELIMITER ;

-- ejercicio parte D

DELIMITER $$
CREATE PROCEDURE sp_registrar_pago(
  IN p_id_cuota INT,
  IN p_medio VARCHAR(20),
  IN p_fecha_pago DATE,
  OUT p_monto_cobrado DECIMAL(10,2)
)
BEGIN
  DECLARE v_estado ENUM('PENDIENTE','PAGADA');
  DECLARE v_id_socio INT;

  DECLARE EXIT HANDLER FOR SQLEXCEPTION
BEGIN    
	ROLLBACK;
	RESIGNAL;
END;
  SELECT estado, id_socio INTO v_estado, v_id_socio
  FROM cuotas 
  WHERE id_cuota = p_id_cuota;
  IF v_estado IS NULL THEN 
	SIGNAL SQLSTATE '45000' SET MESSAGE_tEXT = 'La cuota no esiste';
END IF;
  IF v_estado = 'PAGADA' THEN 
	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cuota ya se encuentra paga';

	START TRANSACTION;
		SET p_monto_cobrado = fn_recargo(p_id_cuota, p_fecha_pago);
	UPDATE cuotas SET estado = 'PAGADA'
	WHERE id_cuota = p_id_cuota;

	INSERT INTO pagos(id_cuota, fecha_pago, monto, medio)
	VALUES(p_id_cuota, p_fecha_pago, p_monto_cobrado, p_medio);
END IF;
	IF (SELECT estado FROM socios WHERE id_socio = v_id_socio) = 'SUSPENDIDO' AND fn_deuda_socio(v_id_socio) = 0 THEN
		UPDATE socios SET activo = 'ACTIVO'
		WHERE id_socio = v_id_socio;
	END IF;
	COMMIT;
END$$
DELIMITER ;
