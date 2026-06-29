-- ==========================
-- PROVINCIAS
-- ==========================

INSERT INTO public.provincias (id_provincia, nombre) VALUES
(1,'Buenos Aires'),
(2,'Córdoba'),
(3,'Santa Fe'),
(4,'Mendoza'),
(5,'Entre Ríos'),
(6,'Neuquén'),
(7,'Salta'),
(8,'Misiones'),
(9,'Tucumán'),
(10,'Chubut');

-- ==========================
-- CATEGORIAS
-- ==========================

INSERT INTO public.categorias (id_categoria,nombre) VALUES
(1,'Electrónica'),
(2,'Indumentaria'),
(3,'Hogar'),
(4,'Deportes'),
(5,'Belleza'),
(6,'Libros'),
(7,'Juguetes'),
(8,'Alimentos');

-- ==========================
-- DUEÑOS
-- ==========================

INSERT INTO public.duenios
(id_duenio,nombre,apellido,email,telefono)
VALUES
(1,'Juan','Pérez','juan@techstore.com','111111111'),
(2,'María','Gómez','maria@modaexpress.com','222222222'),
(3,'Carlos','Ruiz','carlos@casamoderna.com','333333333'),
(4,'Lucía','Fernández','lucia@gamerzone.com','444444444'),
(5,'Matías','Suárez','matias@sportlife.com','555555555'),
(6,'Valentina','López','valentina@beautymarket.com','666666666'),
(7,'Pedro','Martínez','pedro@libreriacentral.com','777777777'),
(8,'Camila','Sosa','camila@decohome.com','888888888'),
(9,'Joaquín','Romero','joaquin@petshopplus.com','999999999'),
(10,'Sofía','Benítez','sofia@mundocelular.com','101010101');

-- ==========================
-- CUENTAS USUARIOS
-- contraseña: usuario1
-- contraseña: usuario2
-- ...
-- ==========================

INSERT INTO public.cuentas
(id_cuenta,email,password,tipo,foto_perfil)
VALUES
(1,'lucas@email.com','usuario1','usuario','avatar1.jpg'),
(2,'flor@email.com','usuario2','usuario','avatar2.jpg'),
(3,'martin@email.com','usuario3','usuario','avatar3.jpg'),
(4,'julieta@email.com','usuario4','usuario','avatar4.jpg'),
(5,'franco@email.com','usuario5','usuario','avatar5.jpg'),
(6,'camila@email.com','usuario6','usuario','avatar6.jpg'),
(7,'nahuel@email.com','usuario7','usuario','avatar7.jpg'),
(8,'agustina@email.com','usuario8','usuario','avatar8.jpg'),
(9,'tomas@email.com','usuario9','usuario','avatar9.jpg'),
(10,'mora@email.com','usuario10','usuario','avatar10.jpg'),

(11,'techstore@email.com','tienda1','tienda','tech.jpg'),
(12,'modaexpress@email.com','tienda2','tienda','moda.jpg'),
(13,'casamoderna@email.com','tienda3','tienda','casa.jpg'),
(14,'gamerzone@email.com','tienda4','tienda','gamer.jpg'),
(15,'sportlife@email.com','tienda5','tienda','sport.jpg'),
(16,'beautymarket@email.com','tienda6','tienda','beauty.jpg'),
(17,'libreriacentral@email.com','tienda7','tienda','libros.jpg'),
(18,'decohome@email.com','tienda8','tienda','deco.jpg'),
(19,'petshopplus@email.com','tienda9','tienda','pet.jpg'),
(20,'mundocelular@email.com','tienda10','tienda','celular.jpg');

-- ==========================
-- USUARIOS
-- ==========================

INSERT INTO public.usuarios
(id_usuario,nombre,apellido,telefono,id_cuenta)
VALUES
(1,'Lucas','Rodríguez','111111111',1),
(2,'Florencia','Fernández','222222222',2),
(3,'Martín','Paz','333333333',3),
(4,'Julieta','Moreno','444444444',4),
(5,'Franco','Castro','555555555',5),
(6,'Camila','Herrera','666666666',6),
(7,'Nahuel','Torres','777777777',7),
(8,'Agustina','Silva','888888888',8),
(9,'Tomás','Ramos','999999999',9),
(10,'Mora','Navarro','101010101',10);

-- ==========================
-- TIENDAS
-- ==========================

INSERT INTO public.tiendas
(id_tienda,nombre,slogan,telefono,direccion,id_duenio,id_provincia,
color_primario,color_secundario,color_terciario,id_cuenta,rating,establecimiento)
VALUES

(1,'Tech Store',
'Lo último en tecnología',
'1140000001',
'Av. Corrientes 1234',
1,1,
'#0057FF','#FFFFFF','#222222',
11,
4.8,
2018),

(2,'Moda Express',
'Vestite con estilo',
'3514000002',
'San Martín 456',
2,2,
'#FF0066','#FFFFFF','#000000',
12,
4.4,
2020),

(3,'Casa Moderna',
'Todo para tu hogar',
'3414000003',
'Belgrano 120',
3,3,
'#795548','#FFFFFF','#D7CCC8',
13,
4.6,
2017),

(4,'Gamer Zone',
'Gaming sin límites',
'2614000004',
'Las Heras 222',
4,4,
'#00E676','#000000','#424242',
14,
4.9,
2019),

(5,'Sport Life',
'Viví el deporte',
'3434000005',
'25 de Mayo 800',
5,5,
'#1976D2','#FFFFFF','#F44336',
15,
4.5,
2016),

(6,'Beauty Market',
'Belleza para todos',
'2994000006',
'Mitre 512',
6,6,
'#E91E63','#FFFFFF','#F8BBD0',
16,
4.3,
2021),

(7,'Librería Central',
'Un libro, una aventura',
'3874000007',
'Rivadavia 700',
7,7,
'#3F51B5','#FFFFFF','#9FA8DA',
17,
4.7,
2015),

(8,'Deco Home',
'Decorá tus espacios',
'3764000008',
'España 321',
8,8,
'#8D6E63','#FFFFFF','#BCAAA4',
18,
4.4,
2018),

(9,'Pet Shop Plus',
'Todo para tu mascota',
'3814000009',
'Urquiza 111',
9,9,
'#4CAF50','#FFFFFF','#A5D6A7',
19,
4.8,
2022),

(10,'Mundo Celular',
'Conectados siempre',
'2804000010',
'9 de Julio 900',
10,10,
'#1565C0','#FFFFFF','#90CAF9',
20,
4.9,
2014);

-- =====================================
-- PRODUCTOS (1-25)
-- =====================================

INSERT INTO public.productos
(id_producto,nombre,precio,stock,imagen,activo,id_tienda,eliminado,id_categoria,ventas,vistas,favoritos,tipo)
VALUES

-- =======================
-- TECH STORE
-- =======================

(1,'iPhone 15',1599999,25,'iphone15.jpg',true,1,false,1,145,3250,420,'Celular'),
(2,'Samsung Galaxy S25',1399999,30,'s25.jpg',true,1,false,1,110,2870,355,'Celular'),
(3,'MacBook Air M3',2499999,12,'macbook.jpg',true,1,false,1,42,1300,190,'Notebook'),
(4,'Notebook Lenovo IdeaPad',1199999,18,'lenovo.jpg',true,1,false,1,67,1850,220,'Notebook'),
(5,'AirPods Pro',499999,45,'airpods.jpg',true,1,false,1,180,4520,580,'Auriculares'),

-- =======================
-- MODA EXPRESS
-- =======================

(6,'Remera Oversize Negra',29999,120,'remera_negra.jpg',true,2,false,2,92,950,60,'Remera'),
(7,'Jean Slim Fit',69999,65,'jean.jpg',true,2,false,2,71,860,52,'Jean'),
(8,'Campera Inflable',159999,28,'campera.jpg',true,2,false,2,33,640,40,'Campera'),
(9,'Buzo Canguro',55999,55,'buzo.jpg',true,2,false,2,80,930,58,'Buzo'),
(10,'Zapatillas Urban',129999,40,'urban.jpg',true,2,false,2,47,810,49,'Calzado'),

-- =======================
-- CASA MODERNA
-- =======================

(11,'Mesa de Comedor',329999,12,'mesa.jpg',true,3,false,3,18,530,34,'Mueble'),
(12,'Silla Escandinava',69999,50,'silla.jpg',true,3,false,3,44,910,62,'Mueble'),
(13,'Lámpara LED',39999,80,'lampara.jpg',true,3,false,3,74,1250,88,'Iluminación'),
(14,'Biblioteca Moderna',249999,10,'biblioteca.jpg',true,3,false,3,15,470,29,'Mueble'),
(15,'Alfombra Decorativa',89999,35,'alfombra.jpg',true,3,false,3,31,690,42,'Decoración'),

-- =======================
-- GAMER ZONE
-- =======================

(16,'Mouse Logitech G502',89999,45,'g502.jpg',true,4,false,1,140,2980,310,'Gaming'),
(17,'Teclado Mecánico Redragon',129999,35,'teclado.jpg',true,4,false,1,99,2260,260,'Gaming'),
(18,'Monitor 27 165Hz',699999,14,'monitor.jpg',true,4,false,1,26,980,130,'Gaming'),
(19,'Silla Gamer RGB',599999,9,'silla_gamer.jpg',true,4,false,1,21,850,118,'Gaming'),
(20,'Joystick Xbox',189999,38,'joystick.jpg',true,4,false,1,88,2140,250,'Gaming'),

-- =======================
-- SPORT LIFE
-- =======================

(21,'Pelota Adidas',45999,60,'pelota.jpg',true,5,false,4,82,1330,96,'Fútbol'),
(22,'Mancuernas 10kg',84999,34,'mancuernas.jpg',true,5,false,4,51,970,73,'Fitness'),
(23,'Colchoneta Yoga',39999,70,'yoga.jpg',true,5,false,4,63,1120,81,'Fitness'),
(24,'Raqueta Tenis Wilson',189999,15,'raqueta.jpg',true,5,false,4,18,620,39,'Tenis'),
(25,'Bicicleta MTB Rodado 29',1299999,8,'bicicleta.jpg',true,5,false,4,14,580,55,'Ciclismo');

-- =====================================
-- PRODUCTOS (26-50)
-- =====================================

INSERT INTO public.productos
(id_producto,nombre,precio,stock,imagen,activo,id_tienda,eliminado,id_categoria,ventas,vistas,favoritos,tipo)
VALUES

-- =======================
-- BEAUTY MARKET
-- =======================

(26,'Perfume Importado',189999,28,'perfume.jpg',true,6,false,5,64,1450,102,'Perfume'),
(27,'Base Líquida',34999,75,'base.jpg',true,6,false,5,118,2100,176,'Maquillaje'),
(28,'Labial Mate',19999,120,'labial.jpg',true,6,false,5,155,2640,198,'Maquillaje'),
(29,'Crema Facial',42999,62,'crema.jpg',true,6,false,5,91,1705,123,'Cuidado Facial'),
(30,'Shampoo Profesional',27999,95,'shampoo.jpg',true,6,false,5,102,1830,134,'Cabello'),

-- =======================
-- LIBRERÍA CENTRAL
-- =======================

(31,'El Principito',19999,80,'principito.jpg',true,7,false,6,220,3820,310,'Libro'),
(32,'1984',24999,60,'1984.jpg',true,7,false,6,174,2950,240,'Libro'),
(33,'Cuaderno Universitario',8999,200,'cuaderno.jpg',true,7,false,6,310,4320,265,'Librería'),
(34,'Agenda 2026',17999,95,'agenda.jpg',true,7,false,6,82,1180,74,'Papelería'),
(35,'Lapicera Parker',35999,55,'parker.jpg',true,7,false,6,58,980,61,'Papelería'),

-- =======================
-- DECO HOME
-- =======================

(36,'Cuadro Decorativo',45999,40,'cuadro.jpg',true,8,false,3,49,1050,83,'Decoración'),
(37,'Almohadón Nórdico',22999,90,'almohadon.jpg',true,8,false,3,103,1690,141,'Decoración'),
(38,'Espejo Redondo',69999,35,'espejo.jpg',true,8,false,3,57,1130,92,'Decoración'),
(39,'Reloj de Pared',39999,48,'reloj.jpg',true,8,false,3,66,1290,96,'Decoración'),
(40,'Florero Cerámica',28999,52,'florero.jpg',true,8,false,3,54,980,80,'Decoración'),

-- =======================
-- PET SHOP PLUS
-- =======================

(41,'Alimento Balanceado Perro',44999,110,'dogfood.jpg',true,9,false,8,141,2350,188,'Mascotas'),
(42,'Alimento Balanceado Gato',41999,95,'catfood.jpg',true,9,false,8,122,2100,170,'Mascotas'),
(43,'Correa Premium',19999,80,'correa.jpg',true,9,false,8,73,1260,98,'Accesorio'),
(44,'Juguete Mordillo',14999,140,'mordillo.jpg',true,9,false,7,105,1880,152,'Juguete'),
(45,'Cucha Mediana',89999,18,'cucha.jpg',true,9,false,8,32,720,45,'Mascotas'),

-- =======================
-- MUNDO CELULAR
-- =======================

(46,'Funda iPhone 15',14999,150,'funda15.jpg',true,10,false,1,241,3980,286,'Accesorio'),
(47,'Cargador USB-C 45W',34999,90,'cargador.jpg',true,10,false,1,176,2840,219,'Accesorio'),
(48,'Cable USB-C',9999,180,'cable.jpg',true,10,false,1,291,4750,305,'Accesorio'),
(49,'Power Bank 20000mAh',79999,42,'powerbank.jpg',true,10,false,1,68,1460,118,'Accesorio'),
(50,'Smartwatch Fit Pro',249999,26,'smartwatch.jpg',true,10,false,1,83,1720,156,'Wearable');

-- =====================================
-- PRODUCTOS X CATEGORIAS
-- =====================================

INSERT INTO public.productosxcategorias
(id,id_producto,id_categoria)
VALUES

(1,1,1),
(2,2,1),
(3,3,1),
(4,4,1),
(5,5,1),

(6,6,2),
(7,7,2),
(8,8,2),
(9,9,2),
(10,10,2),

(11,11,3),
(12,12,3),
(13,13,3),
(14,14,3),
(15,15,3),

(16,16,1),
(17,17,1),
(18,18,1),
(19,19,1),
(20,20,1),

(21,21,4),
(22,22,4),
(23,23,4),
(24,24,4),
(25,25,4),

(26,26,5),
(27,27,5),
(28,28,5),
(29,29,5),
(30,30,5),

(31,31,6),
(32,32,6),
(33,33,6),
(34,34,6),
(35,35,6),

(36,36,3),
(37,37,3),
(38,38,3),
(39,39,3),
(40,40,3),

(41,41,8),
(42,42,8),
(43,43,8),
(44,44,7),
(45,45,8),

(46,46,1),
(47,47,1),
(48,48,1),
(49,49,1),
(50,50,1);

-- =====================================
-- PEDIDOS
-- =====================================

INSERT INTO public.pedidos
(id_pedido,fecha,direccion,id_usuario,entregado,metodo_pago)
VALUES

(1,'2026-06-01','Av. Corrientes 1234, CABA',1,true,'Tarjeta de Crédito'),
(2,'2026-06-02','San Martín 455, Córdoba',2,true,'Mercado Pago'),
(3,'2026-06-03','Belgrano 888, Rosario',3,false,'Transferencia'),
(4,'2026-06-04','Mitre 234, Mendoza',4,true,'Efectivo'),
(5,'2026-06-05','Rivadavia 987, Paraná',5,true,'Débito'),

(6,'2026-06-06','Sarmiento 456, Neuquén',6,false,'Tarjeta de Crédito'),
(7,'2026-06-07','España 654, Salta',7,true,'Mercado Pago'),
(8,'2026-06-08','Urquiza 123, Posadas',8,false,'Transferencia'),
(9,'2026-06-09','Colón 876, Tucumán',9,true,'Débito'),
(10,'2026-06-10','25 de Mayo 321, Trelew',10,true,'Efectivo'),

(11,'2026-06-11','Lavalle 345, CABA',1,false,'Mercado Pago'),
(12,'2026-06-12','Mitre 876, Córdoba',2,true,'Tarjeta de Crédito'),
(13,'2026-06-13','San Luis 789, Rosario',3,true,'Transferencia'),
(14,'2026-06-14','Moreno 432, Mendoza',4,false,'Débito'),
(15,'2026-06-15','French 888, Paraná',5,true,'Mercado Pago'),

(16,'2026-06-16','Brown 999, Neuquén',6,true,'Tarjeta de Crédito'),
(17,'2026-06-17','Buenos Aires 222, Salta',7,false,'Transferencia'),
(18,'2026-06-18','Junín 654, Posadas',8,true,'Débito'),
(19,'2026-06-19','Libertad 777, Tucumán',9,true,'Mercado Pago'),
(20,'2026-06-20','Yrigoyen 147, Trelew',10,false,'Tarjeta de Crédito'),

(21,'2026-06-21','Callao 852, CABA',1,true,'Efectivo'),
(22,'2026-06-22','Perú 369, Córdoba',4,true,'Mercado Pago'),
(23,'2026-06-23','Italia 159, Rosario',6,false,'Transferencia'),
(24,'2026-06-24','Alem 951, Mendoza',8,true,'Tarjeta de Crédito'),
(25,'2026-06-25','Pellegrini 753, Paraná',10,false,'Débito');

-- =====================================
-- DETALLE PEDIDOS
-- =====================================

INSERT INTO public.detallepedidos
(id_detallepedido,cantidad,precio_total,id_pedido,id_producto)
VALUES

(1,1,1599999,1,1),
(2,2,999998,1,5),
(3,1,14999,1,46),

(4,2,59998,2,6),
(5,1,129999,2,10),

(6,1,2499999,3,3),
(7,1,499999,3,5),

(8,1,699999,4,18),
(9,1,189999,4,20),

(10,2,91998,5,21),
(11,1,84999,5,22),

(12,1,189999,6,26),
(13,2,39998,6,28),

(14,1,19999,7,31),
(15,3,26997,7,33),

(16,2,45998,8,37),
(17,1,69999,8,38),

(18,2,89998,9,41),
(19,1,19999,9,43),

(20,1,249999,10,50),
(21,2,19998,10,48),

(22,1,1399999,11,2),
(23,1,34999,11,47),
(24,2,29998,11,46),

(25,1,69999,12,12),
(26,2,79998,12,13),

(27,1,249999,13,14),
(28,1,89999,13,15),

(29,1,129999,14,17),
(30,1,599999,14,19),

(31,2,169998,15,22),
(32,1,1299999,15,25),

(33,1,42999,16,29),
(34,2,55998,16,30),

(35,1,24999,17,32),
(36,2,71998,17,35),

(37,1,39999,18,39),
(38,1,28999,18,40),

(39,2,83998,19,42),
(40,1,89999,19,45),

(41,1,79999,20,49),
(42,2,69998,20,47),

(43,1,2499999,21,3),
(44,1,1599999,21,1),

(45,2,111998,22,9),
(46,1,159999,22,8),

(47,1,329999,23,11),
(48,2,139998,23,12),

(49,1,699999,24,18),
(50,1,89999,24,16),

(51,1,189999,25,24),
(52,1,39999,25,23),

(53,1,34999,2,27),
(54,2,39998,5,31),
(55,1,45999,8,36),
(56,2,29998,9,44),
(57,1,34999,12,47),
(58,1,14999,16,46),
(59,2,19998,18,48),
(60,1,249999,25,50);

-- =====================================
-- VENTAS
-- =====================================

INSERT INTO public.ventas
(id_venta, fecha, id_producto, id_tienda, id_usuario, id_pedido, cantidad, precio_unitario, total)
VALUES

(1,'2026-06-01 10:15:00',1,1,1,1,1,1599999,1599999),
(2,'2026-06-01 10:16:00',5,1,1,1,2,499999,999998),
(3,'2026-06-01 10:17:00',46,10,1,1,1,14999,14999),

(4,'2026-06-02 15:30:00',6,2,2,2,2,29999,59998),
(5,'2026-06-02 15:31:00',10,2,2,2,1,129999,129999),

(6,'2026-06-03 12:10:00',3,1,3,3,1,2499999,2499999),
(7,'2026-06-03 12:11:00',5,1,3,3,1,499999,499999),

(8,'2026-06-04 09:50:00',18,4,4,4,1,699999,699999),
(9,'2026-06-04 09:51:00',20,4,4,4,1,189999,189999),

(10,'2026-06-05 17:45:00',21,5,5,5,2,45999,91998),
(11,'2026-06-05 17:46:00',22,5,5,5,1,84999,84999),

(12,'2026-06-06 11:05:00',26,6,6,6,1,189999,189999),
(13,'2026-06-06 11:06:00',28,6,6,6,2,19999,39998),

(14,'2026-06-07 14:20:00',31,7,7,7,1,19999,19999),
(15,'2026-06-07 14:21:00',33,7,7,7,3,8999,26997),

(16,'2026-06-08 18:10:00',37,8,8,8,2,22999,45998),
(17,'2026-06-08 18:11:00',38,8,8,8,1,69999,69999),

(18,'2026-06-09 13:40:00',41,9,9,9,2,44999,89998),
(19,'2026-06-09 13:41:00',43,9,9,9,1,19999,19999),

(20,'2026-06-10 16:55:00',50,10,10,10,1,249999,249999),
(21,'2026-06-10 16:56:00',48,10,10,10,2,9999,19998),

(22,'2026-06-11 11:30:00',2,1,1,11,1,1399999,1399999),
(23,'2026-06-11 11:31:00',47,10,1,11,1,34999,34999),

(24,'2026-06-12 10:25:00',12,3,2,12,1,69999,69999),
(25,'2026-06-12 10:26:00',13,3,2,12,2,39999,79998),

(26,'2026-06-13 15:00:00',14,3,3,13,1,249999,249999),
(27,'2026-06-13 15:01:00',15,3,3,13,1,89999,89999),

(28,'2026-06-14 09:40:00',17,4,4,14,1,129999,129999),
(29,'2026-06-14 09:41:00',19,4,4,14,1,599999,599999),

(30,'2026-06-15 18:30:00',25,5,5,15,1,1299999,1299999);

SELECT setval('public.categorias_id_categoria_seq', (SELECT MAX(id_categoria) FROM categorias), true);
SELECT setval('public.cuentas_id_cuenta_seq', (SELECT MAX(id_cuenta) FROM cuentas), true);
SELECT setval('public.detallepedidos_id_detallepedido_seq', (SELECT MAX(id_detallepedido) FROM detallepedidos), true);
SELECT setval('public.duenios_id_duenio_seq', (SELECT MAX(id_duenio) FROM duenios), true);
SELECT setval('public.pedidos_id_pedido_seq', (SELECT MAX(id_pedido) FROM pedidos), true);
SELECT setval('public.productos_id_producto_seq', (SELECT MAX(id_producto) FROM productos), true);
SELECT setval('public.productosxcategorias_id_seq', (SELECT MAX(id) FROM productosxcategorias), true);
SELECT setval('public.provincias_id_provincia_seq', (SELECT MAX(id_provincia) FROM provincias), true);
SELECT setval('public.tiendas_id_tienda_seq', (SELECT MAX(id_tienda) FROM tiendas), true);
SELECT setval('public.usuarios_id_usuario_seq', (SELECT MAX(id_usuario) FROM usuarios), true);
SELECT setval('public.ventas_id_venta_seq', (SELECT MAX(id_venta) FROM ventas), true);