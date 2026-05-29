USE nuevo;
-- ejercicio 10 Enunciado: Implementar una transferencia entre dos cuentas. Validar que el saldo sea suficiente.
START TRANSACTION;
SET autocommit = 0;
	UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;
	UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;
COMMIT;