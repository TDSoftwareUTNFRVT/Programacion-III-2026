-- ejercicio 14 
USE neuvo;
INSERT INTO asientos (estado) VALUES('libre');
START TRANSACTION;
SELECT estado FROM asientos WHERE id = 1 FOR UPDATE;

UPDATE asientos
SET estado = 'libre'
WHERE id = 1 AND estado = 'libre';
COMMIT;