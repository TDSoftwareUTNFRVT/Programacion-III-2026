CREATE DATABASE IF NOT EXISTS nuevo;
USE nuevo;
CREATE TABLE clientes ( 
id_cliente INT AUTO_INCREMENT PRIMARY KEY, 
nombre VARCHAR(100) NOT NULL, email VARCHAR(150) UNIQUE, 
saldo DECIMAL(12,2) DEFAULT 0.00, activo TINYINT(1) DEFAULT 1, 
fecha_registro DATETIME DEFAULT NOW() 
); 

CREATE TABLE productos(
id_producto INT AUTO_INCREMENT PRIMARY KEY, 
nombre VARCHAR(100) NOT NULL, 
precio DECIMAL(10,2) NOT NULL, 
stock INT DEFAULT 0, 
fecha_modificacion DATETIME );

CREATE TABLE ventas ( 
id_venta INT AUTO_INCREMENT PRIMARY KEY, 
id_cliente INT NOT NULL, 
id_producto INT NOT NULL, 
cantidad INT NOT NULL, 
total DECIMAL(12,2), 
fecha DATETIME DEFAULT NOW(), 
FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente), 
FOREIGN KEY (id_producto) REFERENCES productos(id_producto) 
);

CREATE TABLE auditoria_precios ( 
id INT AUTO_INCREMENT PRIMARY KEY, 
id_producto INT, 
precio_anterior DECIMAL(10,2), 
precio_nuevo DECIMAL(10,2), 
usuario VARCHAR(100), 
fecha_cambio DATETIME DEFAULT NOW() 
); 

CREATE TABLE log_clientes_eliminados(
id INT AUTO_INCREMENT PRIMARY KEY, 
id_cliente INT, 
nombre VARCHAR(100), 
email VARCHAR(150), 
fecha_eliminacion DATETIME DEFAULT NOW() 
);

-- segunda parte de tablas para las transacciones 

CREATE TABLE cuentas ( 
id INT AUTO_INCREMENT PRIMARY KEY, 
id_cliente INT NOT NULL, 
tipo ENUM('corriente','ahorro') DEFAULT 'ahorro', 
saldo DECIMAL(12,2) DEFAULT 0.00, 
FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
); 

CREATE TABLE pedidos ( 
id INT AUTO_INCREMENT PRIMARY KEY,
id_cliente INT, 
total DECIMAL(12,2),
estado VARCHAR(20) DEFAULT 'pendiente'
);

-- tabla  nueva para el ejercicio 14 

CREATE TABLE asientos(
id INT AUTO_INCREMENT PRIMARY KEY,
estado ENUM('libre','reservado') DEFAULT 'libre'
);