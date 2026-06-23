USE nuevo;
-- ejercicio 11 Enunciado: Registrar un pedido con multiples pasos. Usar SAVEPOINTs para poder deshacer pasos individuales.
START TRANSACTION;
INSERT INTO pedidos (estado, total) VALUES ('pendiente', 3000);
SAVEPOINT sp_pedidos;
INSERT INTO cuentas (id_cliente, tipo, saldo)
VALUES (1, 'ahorro', 2500);
SAVEPOINT sp_cuentas;
COMMIT;