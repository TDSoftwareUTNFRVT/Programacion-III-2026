-- ejercicio 16 Implementar el proceso completo de una compra: verificar stock, registrar venta, actualizar stock y debitar saldo del cliente.
USE nuevo;
INSERT INTO clientes (nombre, email, saldo)
VALUES ('Juan Pérez', 'juan@example.com', 5000.00);

INSERT INTO productos (nombre, precio, stock, fecha_modificacion)
VALUES ('Notebook Lenovo', 300.00, 10, NOW());

START TRANSACTION;
SELECT stock
FROM productos 
WHERE id_producto = 1
FOR UPDATE;

INSERT INTO ventas (id_cliente, id_producto, cantidad, total)
VALUES (1, 1, 3, 3*300);

UPDATE productos
SET stock = stock - 3
WHERE id_producto = 1;

UPDATE clientes
SET saldo = saldo - 900.00
WHERE id_cliente = 1;

COMMIT;