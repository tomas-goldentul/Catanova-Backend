--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.0

-- Started on 2026-06-22 09:37:38

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4903 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id_categoria integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16402)
-- Name: categorias_id_categoria_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_id_categoria_seq OWNER TO postgres;

--
-- TOC entry 4904 (class 0 OID 0)
-- Dependencies: 216
-- Name: categorias_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_categoria_seq OWNED BY public.categorias.id_categoria;


--
-- TOC entry 234 (class 1259 OID 16515)
-- Name: cuentas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuentas (
    id_cuenta integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tipo character varying(20) NOT NULL,
    foto_perfil character varying(255),
    CONSTRAINT cuentas_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['usuario'::character varying, 'tienda'::character varying])::text[])))
);


ALTER TABLE public.cuentas OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16514)
-- Name: cuentas_id_cuenta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cuentas_id_cuenta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cuentas_id_cuenta_seq OWNER TO postgres;

--
-- TOC entry 4905 (class 0 OID 0)
-- Dependencies: 233
-- Name: cuentas_id_cuenta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cuentas_id_cuenta_seq OWNED BY public.cuentas.id_cuenta;


--
-- TOC entry 217 (class 1259 OID 16403)
-- Name: detallepedidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detallepedidos (
    id_detallepedido integer NOT NULL,
    cantidad integer NOT NULL,
    precio_total numeric(10,2) NOT NULL,
    id_pedido integer NOT NULL,
    id_producto integer NOT NULL
);


ALTER TABLE public.detallepedidos OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16406)
-- Name: detallepedidos_id_detallepedido_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detallepedidos_id_detallepedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detallepedidos_id_detallepedido_seq OWNER TO postgres;

--
-- TOC entry 4906 (class 0 OID 0)
-- Dependencies: 218
-- Name: detallepedidos_id_detallepedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detallepedidos_id_detallepedido_seq OWNED BY public.detallepedidos.id_detallepedido;


--
-- TOC entry 219 (class 1259 OID 16407)
-- Name: duenios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.duenios (
    id_duenio integer NOT NULL,
    nombre character varying(50) NOT NULL,
    apellido character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    telefono character varying(20) NOT NULL
);


ALTER TABLE public.duenios OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16410)
-- Name: duenios_id_duenio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.duenios_id_duenio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.duenios_id_duenio_seq OWNER TO postgres;

--
-- TOC entry 4907 (class 0 OID 0)
-- Dependencies: 220
-- Name: duenios_id_duenio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.duenios_id_duenio_seq OWNED BY public.duenios.id_duenio;


--
-- TOC entry 221 (class 1259 OID 16411)
-- Name: pedidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedidos (
    id_pedido integer NOT NULL,
    fecha date NOT NULL,
    direccion character varying(100) NOT NULL,
    id_usuario integer NOT NULL,
    entregado boolean NOT NULL,
    metodo_pago character varying(50) NOT NULL
);


ALTER TABLE public.pedidos OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16414)
-- Name: pedidos_id_pedido_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedidos_id_pedido_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedidos_id_pedido_seq OWNER TO postgres;

--
-- TOC entry 4908 (class 0 OID 0)
-- Dependencies: 222
-- Name: pedidos_id_pedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedidos_id_pedido_seq OWNED BY public.pedidos.id_pedido;


--
-- TOC entry 223 (class 1259 OID 16415)
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    id_producto integer NOT NULL,
    nombre character varying(100) NOT NULL,
    precio numeric(10,2) NOT NULL,
    stock integer NOT NULL,
    imagen character varying(255) NOT NULL,
    activo boolean NOT NULL,
    id_tienda integer NOT NULL,
    eliminado boolean DEFAULT false NOT NULL,
    id_categoria integer,
    ventas integer DEFAULT 0,
    vistas integer DEFAULT 0,
    favoritos integer DEFAULT 0
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16422)
-- Name: productos_id_producto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_id_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_id_producto_seq OWNER TO postgres;

--
-- TOC entry 4909 (class 0 OID 0)
-- Dependencies: 224
-- Name: productos_id_producto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_id_producto_seq OWNED BY public.productos.id_producto;


--
-- TOC entry 225 (class 1259 OID 16423)
-- Name: productosxcategorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productosxcategorias (
    id integer NOT NULL,
    id_producto integer NOT NULL,
    id_categoria integer NOT NULL
);


ALTER TABLE public.productosxcategorias OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16426)
-- Name: productosxcategorias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productosxcategorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productosxcategorias_id_seq OWNER TO postgres;

--
-- TOC entry 4910 (class 0 OID 0)
-- Dependencies: 226
-- Name: productosxcategorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productosxcategorias_id_seq OWNED BY public.productosxcategorias.id;


--
-- TOC entry 227 (class 1259 OID 16427)
-- Name: provincias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provincias (
    id_provincia integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.provincias OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16430)
-- Name: provincias_id_provincia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.provincias_id_provincia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.provincias_id_provincia_seq OWNER TO postgres;

--
-- TOC entry 4911 (class 0 OID 0)
-- Dependencies: 228
-- Name: provincias_id_provincia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.provincias_id_provincia_seq OWNED BY public.provincias.id_provincia;


--
-- TOC entry 229 (class 1259 OID 16431)
-- Name: tiendas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tiendas (
    id_tienda integer NOT NULL,
    nombre character varying(50) NOT NULL,
    slogan character varying(150) NOT NULL,
    telefono character varying(20) NOT NULL,
    direccion character varying(100) NOT NULL,
    id_duenio integer NOT NULL,
    id_provincia integer NOT NULL,
    color_primario character varying(7),
    color_secundario character varying(7),
    color_terciario character varying(7),
    id_cuenta integer
);


ALTER TABLE public.tiendas OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16436)
-- Name: tiendas_id_tienda_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tiendas_id_tienda_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tiendas_id_tienda_seq OWNER TO postgres;

--
-- TOC entry 4912 (class 0 OID 0)
-- Dependencies: 230
-- Name: tiendas_id_tienda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tiendas_id_tienda_seq OWNED BY public.tiendas.id_tienda;


--
-- TOC entry 231 (class 1259 OID 16437)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    nombre character varying(50) NOT NULL,
    apellido character varying(50) NOT NULL,
    telefono character varying(20) NOT NULL,
    id_cuenta integer
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16442)
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 4913 (class 0 OID 0)
-- Dependencies: 232
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- TOC entry 4679 (class 2604 OID 16443)
-- Name: categorias id_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id_categoria SET DEFAULT nextval('public.categorias_id_categoria_seq'::regclass);


--
-- TOC entry 4692 (class 2604 OID 16518)
-- Name: cuentas id_cuenta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas ALTER COLUMN id_cuenta SET DEFAULT nextval('public.cuentas_id_cuenta_seq'::regclass);


--
-- TOC entry 4680 (class 2604 OID 16444)
-- Name: detallepedidos id_detallepedido; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos ALTER COLUMN id_detallepedido SET DEFAULT nextval('public.detallepedidos_id_detallepedido_seq'::regclass);


--
-- TOC entry 4681 (class 2604 OID 16445)
-- Name: duenios id_duenio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.duenios ALTER COLUMN id_duenio SET DEFAULT nextval('public.duenios_id_duenio_seq'::regclass);


--
-- TOC entry 4682 (class 2604 OID 16446)
-- Name: pedidos id_pedido; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos ALTER COLUMN id_pedido SET DEFAULT nextval('public.pedidos_id_pedido_seq'::regclass);


--
-- TOC entry 4683 (class 2604 OID 16447)
-- Name: productos id_producto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN id_producto SET DEFAULT nextval('public.productos_id_producto_seq'::regclass);


--
-- TOC entry 4688 (class 2604 OID 16448)
-- Name: productosxcategorias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productosxcategorias ALTER COLUMN id SET DEFAULT nextval('public.productosxcategorias_id_seq'::regclass);


--
-- TOC entry 4689 (class 2604 OID 16449)
-- Name: provincias id_provincia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincias ALTER COLUMN id_provincia SET DEFAULT nextval('public.provincias_id_provincia_seq'::regclass);


--
-- TOC entry 4690 (class 2604 OID 16450)
-- Name: tiendas id_tienda; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas ALTER COLUMN id_tienda SET DEFAULT nextval('public.tiendas_id_tienda_seq'::regclass);


--
-- TOC entry 4691 (class 2604 OID 16451)
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- TOC entry 4878 (class 0 OID 16399)
-- Dependencies: 215
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id_categoria, nombre) FROM stdin;
1	Electrónica
2	Computadoras
3	Accesorios
4	Ropa
5	Muebles
\.


--
-- TOC entry 4897 (class 0 OID 16515)
-- Dependencies: 234
-- Data for Name: cuentas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuentas (id_cuenta, email, password, fecha_creacion, tipo, foto_perfil) FROM stdin;
1	max@gmail.com	$2b$10.hash1	2026-06-22 08:24:08.236661	usuario	\N
2	tienda1@gmail.com	$2b$10.hash2	2026-06-22 08:24:08.236661	tienda	\N
3	juan@gmail.com	$2b$10.hash3	2026-06-22 08:24:08.236661	usuario	\N
33	josh@gmail.com	hash123	2026-06-22 08:30:30.638347	usuario	\N
34	dean@gmail.com	hash123	2026-06-22 08:30:30.638347	usuario	\N
35	maria@gmail.com	hash123	2026-06-22 08:30:30.638347	usuario	\N
36	lucas@gmail.com	hash123	2026-06-22 08:30:30.638347	usuario	\N
37	tida1@gmail.com	hash123	2026-06-22 08:30:30.638347	tienda	\N
38	tienda2@gmail.com	hash123	2026-06-22 08:30:30.638347	tienda	\N
39	tienda3@gmail.com	hash123	2026-06-22 08:30:30.638347	tienda	\N
40	admdn@gmail.com	hash123	2026-06-22 08:30:30.638347	tienda	\N
41	sofia@gmail.com	hash123	2026-06-22 08:30:30.638347	usuario	\N
42	carlos@gmail.com	hash123	2026-06-22 08:30:30.638347	usuario	\N
\.


--
-- TOC entry 4880 (class 0 OID 16403)
-- Dependencies: 217
-- Data for Name: detallepedidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detallepedidos (id_detallepedido, cantidad, precio_total, id_pedido, id_producto) FROM stdin;
1	1	1200.00	1	1
2	2	91.98	1	2
3	1	89.50	2	3
4	3	75.00	2	4
5	1	55.00	3	5
6	2	360.00	3	6
7	1	450.00	4	7
8	2	50.00	4	2
\.


--
-- TOC entry 4882 (class 0 OID 16407)
-- Dependencies: 219
-- Data for Name: duenios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.duenios (id_duenio, nombre, apellido, email, telefono) FROM stdin;
1	Carlos	López	carlos.lopez@email.com	1123456789
2	María	García	maria.garcia@email.com	1134567890
3	Juan	Martínez	juan.martinez@email.com	1145678901
\.


--
-- TOC entry 4884 (class 0 OID 16411)
-- Dependencies: 221
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedidos (id_pedido, fecha, direccion, id_usuario, entregado, metodo_pago) FROM stdin;
1	2026-05-10	Calle Secundaria 200	1	f	tarjeta de crédito
2	2026-05-12	Avenida Central 150	2	t	transferencia bancaria
3	2026-05-15	Calle Tercera 300	3	f	efectivo
4	2026-05-17	Paseo del Río 500	4	f	tarjeta de débito
\.


--
-- TOC entry 4886 (class 0 OID 16415)
-- Dependencies: 223
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos (id_producto, nombre, precio, stock, imagen, activo, id_tienda, eliminado, id_categoria, ventas, vistas, favoritos) FROM stdin;
1	Laptop Lenovo ThinkPad	1200.00	50	https://example.com/laptop.jpg	t	1	f	\N	0	0	0
2	Mouse Logitech	45.99	150	https://example.com/mouse.jpg	t	1	f	\N	0	0	0
4	Remera Básica	25.00	200	https://example.com/remera.jpg	t	2	f	\N	0	0	0
5	Pantalón Denim	55.00	120	https://example.com/pantalon.jpg	t	2	f	\N	0	0	0
6	Silla Escritorio	180.00	35	https://example.com/silla.jpg	t	3	f	\N	0	0	0
7	Escritorio Madera	450.00	20	https://example.com/escritorio.jpg	t	3	f	\N	0	0	0
3	Teclado Mecánico	89.50	80	https://example.com/keyboard.jpg	t	1	f	\N	0	0	0
\.


--
-- TOC entry 4888 (class 0 OID 16423)
-- Dependencies: 225
-- Data for Name: productosxcategorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productosxcategorias (id, id_producto, id_categoria) FROM stdin;
1	1	1
2	1	2
3	2	1
4	2	3
5	3	1
6	3	3
7	4	4
8	5	4
9	6	5
10	7	5
\.


--
-- TOC entry 4890 (class 0 OID 16427)
-- Dependencies: 227
-- Data for Name: provincias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.provincias (id_provincia, nombre) FROM stdin;
1	Buenos Aires
2	Córdoba
3	Mendoza
4	Santa Fe
5	La Pampa
\.


--
-- TOC entry 4892 (class 0 OID 16431)
-- Dependencies: 229
-- Data for Name: tiendas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tiendas (id_tienda, nombre, slogan, telefono, direccion, id_duenio, id_provincia, color_primario, color_secundario, color_terciario, id_cuenta) FROM stdin;
1	Tienda Electrónica	Los mejores precios	1123456789	Avenida Principal 100	1	1	#FF0000	#00FF00	#0000FF	34
2	Tienda Ropa	Moda y estilo	1134567890	Calle Comercial 200	2	1	#FF69B4	#FFD700	#87CEEB	35
3	Tienda Hogar	Tu hogar, tu estilo	1145678901	Paseo del Bosque 300	3	2	#8B4513	#D2B48C	#F5DEB3	36
\.


--
-- TOC entry 4894 (class 0 OID 16437)
-- Dependencies: 231
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id_usuario, nombre, apellido, telefono, id_cuenta) FROM stdin;
1	Pedro	Sánchez	1156789012	1
2	Ana	Rodríguez	1167890123	2
3	Roberto	Fernández	1178901234	3
4	Laura	Gómez	1189012345	33
\.


--
-- TOC entry 4914 (class 0 OID 0)
-- Dependencies: 216
-- Name: categorias_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_categoria_seq', 5, true);


--
-- TOC entry 4915 (class 0 OID 0)
-- Dependencies: 233
-- Name: cuentas_id_cuenta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cuentas_id_cuenta_seq', 42, true);


--
-- TOC entry 4916 (class 0 OID 0)
-- Dependencies: 218
-- Name: detallepedidos_id_detallepedido_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detallepedidos_id_detallepedido_seq', 8, true);


--
-- TOC entry 4917 (class 0 OID 0)
-- Dependencies: 220
-- Name: duenios_id_duenio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.duenios_id_duenio_seq', 3, true);


--
-- TOC entry 4918 (class 0 OID 0)
-- Dependencies: 222
-- Name: pedidos_id_pedido_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedidos_id_pedido_seq', 4, true);


--
-- TOC entry 4919 (class 0 OID 0)
-- Dependencies: 224
-- Name: productos_id_producto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_id_producto_seq', 7, true);


--
-- TOC entry 4920 (class 0 OID 0)
-- Dependencies: 226
-- Name: productosxcategorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productosxcategorias_id_seq', 10, true);


--
-- TOC entry 4921 (class 0 OID 0)
-- Dependencies: 228
-- Name: provincias_id_provincia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.provincias_id_provincia_seq', 5, true);


--
-- TOC entry 4922 (class 0 OID 0)
-- Dependencies: 230
-- Name: tiendas_id_tienda_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tiendas_id_tienda_seq', 3, true);


--
-- TOC entry 4923 (class 0 OID 0)
-- Dependencies: 232
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 9, true);


--
-- TOC entry 4696 (class 2606 OID 16453)
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id_categoria);


--
-- TOC entry 4722 (class 2606 OID 16527)
-- Name: cuentas cuentas_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas
    ADD CONSTRAINT cuentas_email_key UNIQUE (email);


--
-- TOC entry 4724 (class 2606 OID 16525)
-- Name: cuentas cuentas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas
    ADD CONSTRAINT cuentas_pkey PRIMARY KEY (id_cuenta);


--
-- TOC entry 4698 (class 2606 OID 16455)
-- Name: detallepedidos detallepedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos
    ADD CONSTRAINT detallepedidos_pkey PRIMARY KEY (id_detallepedido);


--
-- TOC entry 4701 (class 2606 OID 16457)
-- Name: duenios duenios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.duenios
    ADD CONSTRAINT duenios_pkey PRIMARY KEY (id_duenio);


--
-- TOC entry 4704 (class 2606 OID 16459)
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id_pedido);


--
-- TOC entry 4707 (class 2606 OID 16461)
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id_producto);


--
-- TOC entry 4709 (class 2606 OID 16463)
-- Name: productosxcategorias productosxcategorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productosxcategorias
    ADD CONSTRAINT productosxcategorias_pkey PRIMARY KEY (id);


--
-- TOC entry 4711 (class 2606 OID 16465)
-- Name: provincias provincias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincias
    ADD CONSTRAINT provincias_pkey PRIMARY KEY (id_provincia);


--
-- TOC entry 4714 (class 2606 OID 16467)
-- Name: tiendas tiendas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas
    ADD CONSTRAINT tiendas_pkey PRIMARY KEY (id_tienda);


--
-- TOC entry 4716 (class 2606 OID 16541)
-- Name: tiendas uq_tienda_cuenta; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas
    ADD CONSTRAINT uq_tienda_cuenta UNIQUE (id_cuenta);


--
-- TOC entry 4718 (class 2606 OID 16534)
-- Name: usuarios uq_usuario_cuenta; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT uq_usuario_cuenta UNIQUE (id_cuenta);


--
-- TOC entry 4720 (class 2606 OID 16469)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4699 (class 1259 OID 16470)
-- Name: idx_detallepedidos_pedido; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_detallepedidos_pedido ON public.detallepedidos USING btree (id_pedido);


--
-- TOC entry 4702 (class 1259 OID 16471)
-- Name: idx_pedidos_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pedidos_usuario ON public.pedidos USING btree (id_usuario);


--
-- TOC entry 4705 (class 1259 OID 16472)
-- Name: idx_productos_tienda; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_productos_tienda ON public.productos USING btree (id_tienda);


--
-- TOC entry 4712 (class 1259 OID 16473)
-- Name: idx_tiendas_provincia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tiendas_provincia ON public.tiendas USING btree (id_provincia);


--
-- TOC entry 4725 (class 2606 OID 16474)
-- Name: detallepedidos detallepedidos_id_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos
    ADD CONSTRAINT detallepedidos_id_pedido_fkey FOREIGN KEY (id_pedido) REFERENCES public.pedidos(id_pedido);


--
-- TOC entry 4726 (class 2606 OID 16479)
-- Name: detallepedidos detallepedidos_id_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos
    ADD CONSTRAINT detallepedidos_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto);


--
-- TOC entry 4731 (class 2606 OID 16535)
-- Name: tiendas fk_tienda_cuenta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas
    ADD CONSTRAINT fk_tienda_cuenta FOREIGN KEY (id_cuenta) REFERENCES public.cuentas(id_cuenta) ON DELETE CASCADE;


--
-- TOC entry 4734 (class 2606 OID 16528)
-- Name: usuarios fk_usuario_cuenta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT fk_usuario_cuenta FOREIGN KEY (id_cuenta) REFERENCES public.cuentas(id_cuenta) ON DELETE CASCADE;


--
-- TOC entry 4727 (class 2606 OID 16484)
-- Name: pedidos pedidos_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 4728 (class 2606 OID 16489)
-- Name: productos productos_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias(id_categoria) ON DELETE SET NULL;


--
-- TOC entry 4729 (class 2606 OID 16494)
-- Name: productosxcategorias productosxcategorias_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productosxcategorias
    ADD CONSTRAINT productosxcategorias_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias(id_categoria);


--
-- TOC entry 4730 (class 2606 OID 16499)
-- Name: productosxcategorias productosxcategorias_id_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productosxcategorias
    ADD CONSTRAINT productosxcategorias_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto);


--
-- TOC entry 4732 (class 2606 OID 16504)
-- Name: tiendas tiendas_id_duenio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas
    ADD CONSTRAINT tiendas_id_duenio_fkey FOREIGN KEY (id_duenio) REFERENCES public.duenios(id_duenio);


--
-- TOC entry 4733 (class 2606 OID 16509)
-- Name: tiendas tiendas_id_provincia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas
    ADD CONSTRAINT tiendas_id_provincia_fkey FOREIGN KEY (id_provincia) REFERENCES public.provincias(id_provincia);


-- Completed on 2026-06-22 09:37:39

--
-- PostgreSQL database dump complete
--

