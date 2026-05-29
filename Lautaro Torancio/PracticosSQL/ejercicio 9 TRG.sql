USE nuevo;
-- ejercicio 9
START TRANSACTION;
INSERT INTO clientes (nombre, email, saldo)
VALUES ('Ana Torres', 'ana@email.com', 1000.00);
SET @id = LAST_INSERT_ID(); 

INSERT INTO ventas (id_cliente,id_producto, cantidad, total)
VALUES (@id, 1, 2, 150.00);
COMMIT;