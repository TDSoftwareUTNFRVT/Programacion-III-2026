CREATE TABLE productos (
  id_producto INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50),
  precio_unitario DECIMAL(10,2) NOT NULL,
  stock_actual INT NOT NULL DEFAULT 0
);

CREATE TABLE clientes (
  id_cliente INT PRIMARY KEY AUTO_INCREMENT,
  razon_social VARCHAR(100),
  cuit VARCHAR(15) NOT NULL,
  saldo_cuenta DECIMAL(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE pedidos (
  id_pedido INT PRIMARY KEY AUTO_INCREMENT,
  id_cliente INT NOT NULL,
  fecha_pedido DATE NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

CREATE TABLE detalle_pedido (
  id_detalle INT PRIMARY KEY AUTO_INCREMENT,
  id_pedido INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  precio_venta DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE auditoria_stock (
  id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
  id_producto INT NOT NULL,
  stock_anterior INT NOT NULL,
  stock_nuevo INT NOT NULL,
  fecha_cambio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
);

INSERT INTO productos (nombre, categoria, precio_unitario, stock_actual) VALUES
('ARROZ 1 KG', 'ALMACEN', 1200.00, 150),
('ACEITE GIRASOL 1 LT', 'ALMACEN', 2500.00, 80),
('FIDEOS 500G', 'ALMACEN', 900.00, 200),
('DETERGENTE 75ML', 'LIMPIEZA', 1500.00, 60),
('LAVANDINA 1L', 'LIMPIEZA', 800.00, 100),
('YERBA 1 KG', 'ALMACEN', 3200.00, 90),
('JABON EN POLVO 3 KG', 'ALMACEN', 4500.00, 40);

INSERT INTO clientes (razon_social, cuit, saldo_cuenta) VALUES
('ALMACEN DON JOSE', '30-11111111-1', 0.00),
('DESPENSA LA ESQUINA', '30-22222222-2', 5000.00),
('SUPERMECADO NORTE', '30-33333333-3', 0.00),
('KIOSCO CENTRAL', '30-44444444-4', 1200.00);

INSERT INTO pedidos (id_cliente, fecha_pedido, estado) VALUES
(1, '2026-05-02', 'CONFIRMADO'),
(2, '2026-05-03', 'PENDIENTE'),
(3, '2026-05-05', 'CONFIRMADO');

INSERT INTO detalle_pedido ( id_pedido, id_producto, cantidad, precio_venta) VALUES
(1, 1, 10, 1300.00),
(1, 3, 20, 950.00),
(2, 2, 5, 2600.00),
(3, 5, 15, 850.00),
(3, 6, 8, 3300.00);

SELECT * FROM pedidos;


CREATE OR REPLACE VIEW vista_pedidos_detalle AS
  SELECT detalle_pedido.id_pedido, clientes.razon_social, productos.nombre, detalle_pedido.cantidad, (detalle_pedido.cantidad*detalle_pedido.precio_venta) AS subtotal
  FROM detalle_pedido
  INNER JOIN productos ON productos.id_producto = detalle_pedido.id_producto
  INNER JOIN pedidos ON pedidos.id_pedido = detalle_pedido.id_pedido
  INNER JOIN clientes ON clientes.id_cliente = pedidos.id_cliente;

SELECT * FROM vista_pedidos_detalle;

-- 2
CREATE OR REPLACE VIEW vista_stock_bajo AS
  SELECT productos.id_producto , productos.nombre, productos.categoria, productos.stock_actual 
  FROM productos
  WHERE stock_actual < 50;

SELECT * FROM vista_stock_bajo;



SELECT razon_social, SUM(subtotal) AS total_facturado
FROM vista_pedidos_detalle
GROUP BY razon_social
ORDER BY total_facturado DESC;



DELIMITER $$
CREATE TRIGGER trg_actualizar_stock
AFTER INSERT ON detalle_pedido
FOR EACH ROW
BEGIN
  UPDATE productos
  SET stock_actual = stock_actual - NEW.cantidad
  WHERE id_producto = NEW.id_producto;
END $$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER trg_auditoria_stock
AFTER UPDATE ON productos
FOR EACH ROW
BEGIN
  INSERT INTO auditoria_stock (id_producto, stock_anterior, stock_nuevo) 
  VALUES (OLD.id_producto, OLD.stock_actual, NEW.stock_actual);
END $$
DELIMITER ;


START TRANSACTION;
  INSERT INTO pedidos (id_cliente, fecha_pedido, estado) 
  VALUES 
  (4, '2026-06-10', 'CONFIRMADO');
  INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_venta) 
  VALUES 
  (LAST_INSERT_ID(), 1, 5, 1300.00),
  (LAST_INSERT_ID(), 5, 3, 850.00);
COMMIT;


SELECT auditoria_stock.*, productos.*
FROM auditoria_stock
INNER JOIN productos ON productos.id_producto = auditoria_stock.id_producto;

