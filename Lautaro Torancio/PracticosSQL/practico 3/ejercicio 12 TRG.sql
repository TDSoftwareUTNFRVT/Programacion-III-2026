-- ejercicio 12
USE nuevo;
SET autocommit = 0;
START TRANSACTION;
INSERT INTO productos (nombre, precio, stock, fecha_modificacion) VALUES ('Notebook', 200.00, 10, NOW());

INSERT INTO productos (nombre, precio, stock, fecha_modificacion) VALUES ('Mesa', 150.00, 5, NOW());

INSERT INTO productos (nombre, precio, stock, fecha_modificacion) VALUES ('Silla', 80.00, 20, NOW());

INSERT INTO productos (nombre, precio, stock, fecha_modificacion) VALUES ('Lámpara', 50.00, 15, NOW());

INSERT INTO productos (nombre, precio, stock, fecha_modificacion) VALUES ('Teclado', 100.00, 12, NOW());
COMMIT;