-- PROVINCIAS
INSERT INTO public.provincias (id_provincia, nombre) VALUES
(1, 'Buenos Aires'),
(2, 'Cordoba'),
(3, 'Santa Fe');

-- CATEGORIAS
INSERT INTO public.categorias (id_categoria, nombre) VALUES
(1, 'Electrónica'),
(2, 'Indumentaria'),
(3, 'Hogar y Decoración');

-- DUEÑOS (De las tiendas)
INSERT INTO public.duenios (id_duenio, nombre, apellido, email, telefono) VALUES
(1, 'Juan', 'Pérez', 'juan.perez@tienda.com', '1122334455'),
(2, 'María', 'Gómez', 'maria.gomez@tienda.com', '3519876543');

-- CUENTAS (Tanto para usuarios como para tiendas)
INSERT INTO public.cuentas (id_cuenta, email, password, tipo, foto_perfil) VALUES
(1, 'comprador1@email.com', 'pass_segura_1', 'usuario', 'avatar1.jpg'),
(2, 'comprador2@email.com', 'pass_segura_2', 'usuario', NULL),
(3, 'tienda.tech@email.com', 'pass_tienda_1', 'tienda', 'logo_tech.jpg'),
(4, 'tienda.moda@email.com', 'pass_tienda_2', 'tienda', 'logo_moda.jpg');

-- USUARIOS (Depende de cuentas)
INSERT INTO public.usuarios (id_usuario, nombre, apellido, telefono, id_cuenta) VALUES
(1, 'Lucas', 'Rodríguez', '1133445566', 1),
(2, 'Florencia', 'Fernández', '3415556677', 2);

-- TIENDAS (Depende de duenios, provincias y cuentas)
INSERT INTO public.tiendas (id_tienda, nombre, slogan, telefono, direccion, id_duenio, id_provincia, color_primario, color_secundario, color_terciario, id_cuenta, rating, establecimiento) VALUES
(1, 'Tech Store', 'Lo mejor en tecnología', '1144444444', 'Av. Corrientes 1234', 1, 1, '#0000FF', '#FFFFFF', '#CCCCCC', 3, 4.5, 101),
(2, 'Moda Express', 'Tu ropa al instante', '3515555555', 'Calle Falsa 123', 2, 2, '#FF0000', '#000000', '#EEEEEE', 4, 4.2, 102);

-- PRODUCTOS (Depende de tiendas y categorias)
INSERT INTO public.productos (id_producto, nombre, precio, stock, imagen, activo, id_tienda, eliminado, id_categoria, ventas, vistas, favoritos, tipo) VALUES
(1, 'Smartphone X', 899.99, 50, 'phone.jpg', true, 1, false, 1, 10, 150, 5, 'General'),
(2, 'Auriculares Bluetooth', 49.99, 200, 'headphones.jpg', true, 1, false, 1, 45, 300, 25, 'General'),
(3, 'Remera de Algodón', 19.99, 100, 'tshirt.jpg', true, 2, false, 2, 30, 120, 12, 'General');

-- PRODUCTOS X CATEGORIAS (Tabla intermedia)
INSERT INTO public.productosxcategorias (id, id_producto, id_categoria) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 2);

-- PEDIDOS (Depende de usuarios)
INSERT INTO public.pedidos (id_pedido, fecha, direccion, id_usuario, entregado, metodo_pago) VALUES
(1, '2026-06-25', 'Av. Corrientes 500, CABA', 1, false, 'Tarjeta de Crédito'),
(2, '2026-06-26', 'Belgrano 450, Córdoba', 2, true, 'Efectivo');

-- DETALLE DE PEDIDOS (Depende de pedidos y productos)
INSERT INTO public.detallepedidos (id_detallepedido, cantidad, precio_total, id_pedido, id_producto) VALUES
(1, 1, 899.99, 1, 1),  -- 1 Smartphone X en el pedido 1
(2, 2, 99.98, 1, 2),   -- 2 Auriculares en el pedido 1
(3, 2, 39.98, 2, 3);   -- 2 Remeras en el pedido 2

SELECT setval('public.categorias_id_categoria_seq', COALESCE(MAX(id_categoria), 1)) FROM public.categorias;
SELECT setval('public.cuentas_id_cuenta_seq', COALESCE(MAX(id_cuenta), 1)) FROM public.cuentas;
SELECT setval('public.detallepedidos_id_detallepedido_seq', COALESCE(MAX(id_detallepedido), 1)) FROM public.detallepedidos;
SELECT setval('public.duenios_id_duenio_seq', COALESCE(MAX(id_duenio), 1)) FROM public.duenios;
SELECT setval('public.pedidos_id_pedido_seq', COALESCE(MAX(id_pedido), 1)) FROM public.pedidos;
SELECT setval('public.productos_id_producto_seq', COALESCE(MAX(id_producto), 1)) FROM public.productos;
SELECT setval('public.productosxcategorias_id_seq', COALESCE(MAX(id), 1)) FROM public.productosxcategorias;
SELECT setval('public.provincias_id_provincia_seq', COALESCE(MAX(id_provincia), 1)) FROM public.provincias;
SELECT setval('public.tiendas_id_tienda_seq', COALESCE(MAX(id_tienda), 1)) FROM public.tiendas;
SELECT setval('public.usuarios_id_usuario_seq', COALESCE(MAX(id_usuario), 1)) FROM public.usuarios;