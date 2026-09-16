CREATE DATABASE club_deportivo CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE club_deportivo;
-- ---------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------
CREATE TABLE socios (
id_socio INT AUTO_INCREMENT PRIMARY KEY,
dni VARCHAR(10) NOT NULL UNIQUE,
apellido VARCHAR(50) NOT NULL,
nombre VARCHAR(50) NOT NULL,
email VARCHAR(100) NOT NULL,
fecha_alta DATE NOT NULL,
estado ENUM('ACTIVO','SUSPENDIDO','BAJA') NOT NULL DEFAULT 'ACTIVO'
);
CREATE TABLE actividades (
id_actividad INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(50) NOT NULL UNIQUE,
cuota_mensual DECIMAL(10,2) NOT NULL,
cupo_maximo INT NOT NULL,
activa TINYINT(1) NOT NULL DEFAULT 1
);
CREATE TABLE inscripciones (
id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
id_socio INT NOT NULL,
id_actividad INT NOT NULL,
fecha_inscripcion DATE NOT NULL DEFAULT (CURRENT_DATE),
estado ENUM('VIGENTE','CANCELADA') NOT NULL DEFAULT 'VIGENTE',
UNIQUE KEY uq_socio_actividad (id_socio, id_actividad),
FOREIGN KEY (id_socio) REFERENCES socios(id_socio),
FOREIGN KEY (id_actividad) REFERENCES actividades(id_actividad)
);
CREATE TABLE cuotas (
id_cuota INT AUTO_INCREMENT PRIMARY KEY,
id_socio INT NOT NULL,
id_actividad INT NOT NULL,
periodo CHAR(7) NOT NULL, -- formato 'AAAA-MM'
importe DECIMAL(10,2) NOT NULL,
fecha_vencimiento DATE NOT NULL,
estado ENUM('PENDIENTE','PAGADA') NOT NULL DEFAULT 'PENDIENTE',
UNIQUE KEY uq_cuota (id_socio, id_actividad, periodo),
FOREIGN KEY (id_socio) REFERENCES socios(id_socio),
FOREIGN KEY (id_actividad) REFERENCES actividades(id_actividad)
);
CREATE TABLE pagos (
id_pago INT AUTO_INCREMENT PRIMARY KEY,
id_cuota INT NOT NULL,
fecha_pago DATE NOT NULL,
monto DECIMAL(10,2) NOT NULL,
medio VARCHAR(20) NOT NULL,
CONSTRAINT chk_pagos_medio CHECK (medio IN ('EFECTIVO','TRANSFERENCIA','TARJETA')),
FOREIGN KEY (id_cuota) REFERENCES cuotas(id_cuota)
);
CREATE TABLE auditoria_precios (
id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
id_actividad INT NOT NULL,
precio_anterior DECIMAL(10,2) NOT NULL,
precio_nuevo DECIMAL(10,2) NOT NULL,
fecha DATETIME NOT NULL,
usuario VARCHAR(100) NOT NULL,
FOREIGN KEY (id_actividad) REFERENCES actividades(id_actividad)
);
-- ---------------------------------------------------------------------
-- Datos
-- ---------------------------------------------------------------------
INSERT INTO socios (dni, apellido, nombre, email, fecha_alta, estado) VALUES
('30111222', 'Gómez', 'Laura', 'laura.gomez@mail.com', '2024-02-05', 'ACTIVO'),
('31222333', 'Fernández', 'Martín', 'martin.fernandez@mail.com','2024-03-12', 'ACTIVO'),
('32333444', 'Rossi', 'Julieta', 'julieta.rossi@mail.com', '2024-04-20', 'SUSPENDIDO'),
('33444555', 'Bianchi', 'Tomás', 'tomas.bianchi@mail.com', '2025-01-15', 'ACTIVO'),
('34555666', 'Pereyra', 'Sofía', 'sofia.pereyra@mail.com', '2025-03-03', 'ACTIVO'),
('35666777', 'Martínez', 'Diego', 'diego.martinez@mail.com', '2025-05-10', 'BAJA'),
('36777888', 'Luna', 'Camila', 'camila.luna@mail.com', '2025-08-01', 'ACTIVO'),
('37888999', 'Acosta', 'Nicolás', 'nicolas.acosta@mail.com', '2026-09-01', 'ACTIVO');
INSERT INTO actividades (nombre, cuota_mensual, cupo_maximo, activa) VALUES
('Natación', 18000.00, 3, 1),
('Musculación', 15000.00, 20, 1),
('Yoga', 12000.00, 2, 1),
('Básquet', 14000.00, 15, 1),
('Patín', 13000.00, 10, 0),
('Pilates', 16000.00, 8, 1);
INSERT INTO inscripciones (id_socio, id_actividad, fecha_inscripcion, estado) VALUES
(1, 1, '2026-03-02', 'VIGENTE'),
(2, 1, '2026-03-02', 'VIGENTE'),
(4, 1, '2026-03-05', 'VIGENTE'),
(1, 2, '2026-03-10', 'VIGENTE'),
(3, 2, '2026-03-10', 'VIGENTE'),
(5, 2, '2026-04-01', 'VIGENTE'),
(7, 2, '2026-04-07', 'VIGENTE'),
(5, 3, '2026-04-15', 'VIGENTE'),
(2, 4, '2026-05-02', 'VIGENTE'),
(7, 1, '2026-04-07', 'CANCELADA'),
(6, 4, '2026-05-02', 'CANCELADA');
INSERT INTO cuotas (id_socio, id_actividad, periodo, importe, fecha_vencimiento, estado) VALUES
-- Período 2026-08 (id_cuota 1 a 9)
(1, 1, '2026-08', 18000.00, '2026-08-10', 'PAGADA'),
(2, 1, '2026-08', 18000.00, '2026-08-10', 'PAGADA'),
(4, 1, '2026-08', 18000.00, '2026-08-10', 'PAGADA'),
(1, 2, '2026-08', 15000.00, '2026-08-10', 'PAGADA'),
(3, 2, '2026-08', 15000.00, '2026-08-10', 'PENDIENTE'),
(5, 2, '2026-08', 15000.00, '2026-08-10', 'PAGADA'),
(7, 2, '2026-08', 15000.00, '2026-08-10', 'PAGADA'),
(5, 3, '2026-08', 12000.00, '2026-08-10', 'PAGADA'),
(2, 4, '2026-08', 14000.00, '2026-08-10', 'PAGADA'),
-- Período 2026-09 (id_cuota 10 a 18)
(1, 1, '2026-09', 18000.00, '2026-09-10', 'PAGADA'),
(2, 1, '2026-09', 18000.00, '2026-09-10', 'PAGADA'),
(4, 1, '2026-09', 18000.00, '2026-09-10', 'PENDIENTE'),
(1, 2, '2026-09', 15000.00, '2026-09-10', 'PAGADA'),
(3, 2, '2026-09', 15000.00, '2026-09-10', 'PENDIENTE'),
(5, 2, '2026-09', 15000.00, '2026-09-10', 'PAGADA'),
(7, 2, '2026-09', 15000.00, '2026-09-10', 'PENDIENTE'),
(5, 3, '2026-09', 12000.00, '2026-09-10', 'PAGADA'),
(2, 4, '2026-09', 14000.00, '2026-09-10', 'PAGADA');
INSERT INTO pagos (id_cuota, fecha_pago, monto, medio) VALUES
( 1, '2026-08-05', 18000.00, 'TRANSFERENCIA'),
( 2, '2026-08-08', 18000.00, 'EFECTIVO'),
( 3, '2026-08-10', 18000.00, 'TARJETA'),
( 4, '2026-08-05', 15000.00, 'TRANSFERENCIA'),
( 6, '2026-08-09', 15000.00, 'EFECTIVO'),
( 7, '2026-08-15', 15750.00, 'EFECTIVO'),
( 8, '2026-08-03', 12000.00, 'TARJETA'),
( 9, '2026-08-25', 15400.00, 'TRANSFERENCIA'),
(10, '2026-09-04', 18000.00, 'TRANSFERENCIA'),
(11, '2026-09-09', 18000.00, 'EFECTIVO'),
(13, '2026-09-04', 15000.00, 'TRANSFERENCIA'),
(15, '2026-09-10', 15000.00, 'EFECTIVO'),
(17, '2026-09-02', 12000.00, 'TARJETA'),
(18, '2026-09-08', 14000.00, 'TRANSFERENCIA');

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
