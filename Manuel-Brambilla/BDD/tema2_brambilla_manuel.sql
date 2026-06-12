-- Ejercicio 1 A)
create or replace view vista_resumen_pedidos as
select
	pd.id_pedido,
    c.razon_social,
    pd.fecha_pedido,
    pd.estado,
    dp.cantidad,
    sum(dp.cantidad * pr.precio_unitario) as total_pedido
from detalle_pedido dp
inner join pedidos pd ON pd.id_pedido = dp.id_pedido
inner join productos pr on pr.id_producto = dp.id_producto
inner join clientes c on c.id_cliente = pd.id_cliente
group by pd.id_pedido, c.razon_social, pd.fecha_pedido, pd.estado, dp.cantidad;

select * from vista_resumen_pedidos;

-- ==================================================================
-- Ejercicio 1 B)
create or replace view vista_productos_limpieza as
select
	id_producto as ID,
    nombre as Nombre,
    precio_unitario as Precio_Unitario,
    stock_actual as Stock_Actual
from productos
where categoria = 'Limpieza'
order by precio_unitario desc;

select * from vista_productos_limpieza;

-- =============================================================
-- Ejercicio 1 C)

select *
from vista_resumen_pedidos
where total_pedido > 20000.00

-- ==============================================================
-- Ejercicio 2 A)

DELIMITER $$
CREATE TRIGGER trg_validar_stock
BEFORE INSERT ON detalle_pedido
FOR EACH ROW
BEGIN
    SELECT stock_actual
    FROM productos
    WHERE id_producto = NEW.id_producto;

    IF stock_actual < NEW.stock_actual THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente para realizar la venta';
    END IF;
END$$
DELIMITER ;

-- ===========================================
-- Ejercicio 2 B)



-- ============================================
-- Ejercicio 2 C)



-- ============================================
-- Ejercicio 2 D)























