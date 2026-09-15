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
/* Resultado: */
 
/* E.5 */
INSERT INTO inscripciones (id_socio, id_actividad) VALUES (3, 3);
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
/* Resultado: *