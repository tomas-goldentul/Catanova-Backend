--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.0

-- Started on 2026-07-06 15:24:52

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id_categoria integer NOT NULL,
    nombre character varying(100) NOT NULL,
    id_tienda integer
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
-- TOC entry 4936 (class 0 OID 0)
-- Dependencies: 216
-- Name: categorias_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_categoria_seq OWNED BY public.categorias.id_categoria;


--
-- TOC entry 217 (class 1259 OID 16403)
-- Name: cuentas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuentas (
    id_cuenta integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tipo character varying(20) NOT NULL,
    foto_perfil character varying(255),
    CONSTRAINT cuentas_tipo_check CHECK (((tipo)::text = ANY (ARRAY[('usuario'::character varying)::text, ('tienda'::character varying)::text])))
);


ALTER TABLE public.cuentas OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16410)
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
-- TOC entry 4937 (class 0 OID 0)
-- Dependencies: 218
-- Name: cuentas_id_cuenta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cuentas_id_cuenta_seq OWNED BY public.cuentas.id_cuenta;


--
-- TOC entry 219 (class 1259 OID 16411)
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
-- TOC entry 220 (class 1259 OID 16414)
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
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 220
-- Name: detallepedidos_id_detallepedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detallepedidos_id_detallepedido_seq OWNED BY public.detallepedidos.id_detallepedido;


--
-- TOC entry 221 (class 1259 OID 16415)
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
-- TOC entry 222 (class 1259 OID 16418)
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
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 222
-- Name: duenios_id_duenio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.duenios_id_duenio_seq OWNED BY public.duenios.id_duenio;


--
-- TOC entry 223 (class 1259 OID 16419)
-- Name: etiquetas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.etiquetas (
    id_etiqueta integer NOT NULL,
    nombre character varying(50) NOT NULL,
    id_producto integer NOT NULL
);


ALTER TABLE public.etiquetas OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16422)
-- Name: etiquetas_id_etiqueta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.etiquetas_id_etiqueta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.etiquetas_id_etiqueta_seq OWNER TO postgres;

--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 224
-- Name: etiquetas_id_etiqueta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.etiquetas_id_etiqueta_seq OWNED BY public.etiquetas.id_etiqueta;


--
-- TOC entry 225 (class 1259 OID 16423)
-- Name: favoritos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favoritos (
    id_favorito integer NOT NULL,
    id_producto integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_usuario integer
);


ALTER TABLE public.favoritos OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16427)
-- Name: favoritos_id_favorito_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favoritos_id_favorito_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favoritos_id_favorito_seq OWNER TO postgres;

--
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 226
-- Name: favoritos_id_favorito_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favoritos_id_favorito_seq OWNED BY public.favoritos.id_favorito;


--
-- TOC entry 227 (class 1259 OID 16428)
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
-- TOC entry 228 (class 1259 OID 16431)
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
-- TOC entry 4942 (class 0 OID 0)
-- Dependencies: 228
-- Name: pedidos_id_pedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedidos_id_pedido_seq OWNED BY public.pedidos.id_pedido;


--
-- TOC entry 229 (class 1259 OID 16432)
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
    tipo character varying(50) DEFAULT 'General'::character varying
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16437)
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
-- TOC entry 4943 (class 0 OID 0)
-- Dependencies: 230
-- Name: productos_id_producto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_id_producto_seq OWNED BY public.productos.id_producto;


--
-- TOC entry 231 (class 1259 OID 16438)
-- Name: productosxcategorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productosxcategorias (
    id integer NOT NULL,
    id_producto integer NOT NULL,
    id_categoria integer NOT NULL
);


ALTER TABLE public.productosxcategorias OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16441)
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
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 232
-- Name: productosxcategorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productosxcategorias_id_seq OWNED BY public.productosxcategorias.id;


--
-- TOC entry 233 (class 1259 OID 16442)
-- Name: provincias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provincias (
    id_provincia integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.provincias OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16445)
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
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 234
-- Name: provincias_id_provincia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.provincias_id_provincia_seq OWNED BY public.provincias.id_provincia;


--
-- TOC entry 235 (class 1259 OID 16446)
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
    id_cuenta integer,
    rating numeric(2,1) DEFAULT 0.0,
    establecimiento integer,
    abierta boolean DEFAULT false NOT NULL,
    CONSTRAINT tiendas_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric)))
);


ALTER TABLE public.tiendas OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16451)
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
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 236
-- Name: tiendas_id_tienda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tiendas_id_tienda_seq OWNED BY public.tiendas.id_tienda;


--
-- TOC entry 237 (class 1259 OID 16452)
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
-- TOC entry 238 (class 1259 OID 16455)
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
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 238
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- TOC entry 239 (class 1259 OID 16456)
-- Name: ventas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ventas (
    id_venta integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_producto integer NOT NULL,
    id_tienda integer NOT NULL,
    id_usuario integer,
    id_pedido integer,
    cantidad integer NOT NULL,
    precio_unitario numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    metodo_pago character varying(50),
    estado character varying(20) DEFAULT 'Completada'::character varying
);


ALTER TABLE public.ventas OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16461)
-- Name: ventas_id_venta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ventas_id_venta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ventas_id_venta_seq OWNER TO postgres;

--
-- TOC entry 4948 (class 0 OID 0)
-- Dependencies: 240
-- Name: ventas_id_venta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ventas_id_venta_seq OWNED BY public.ventas.id_venta;


--
-- TOC entry 241 (class 1259 OID 16462)
-- Name: vistas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vistas (
    id_vista integer NOT NULL,
    id_producto integer NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_usuario integer
);


ALTER TABLE public.vistas OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16466)
-- Name: vistas_id_vista_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vistas_id_vista_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vistas_id_vista_seq OWNER TO postgres;

--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 242
-- Name: vistas_id_vista_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vistas_id_vista_seq OWNED BY public.vistas.id_vista;


--
-- TOC entry 4699 (class 2604 OID 16467)
-- Name: categorias id_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id_categoria SET DEFAULT nextval('public.categorias_id_categoria_seq'::regclass);


--
-- TOC entry 4700 (class 2604 OID 16468)
-- Name: cuentas id_cuenta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas ALTER COLUMN id_cuenta SET DEFAULT nextval('public.cuentas_id_cuenta_seq'::regclass);


--
-- TOC entry 4702 (class 2604 OID 16469)
-- Name: detallepedidos id_detallepedido; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos ALTER COLUMN id_detallepedido SET DEFAULT nextval('public.detallepedidos_id_detallepedido_seq'::regclass);


--
-- TOC entry 4703 (class 2604 OID 16470)
-- Name: duenios id_duenio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.duenios ALTER COLUMN id_duenio SET DEFAULT nextval('public.duenios_id_duenio_seq'::regclass);


--
-- TOC entry 4704 (class 2604 OID 16471)
-- Name: etiquetas id_etiqueta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etiquetas ALTER COLUMN id_etiqueta SET DEFAULT nextval('public.etiquetas_id_etiqueta_seq'::regclass);


--
-- TOC entry 4705 (class 2604 OID 16472)
-- Name: favoritos id_favorito; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos ALTER COLUMN id_favorito SET DEFAULT nextval('public.favoritos_id_favorito_seq'::regclass);


--
-- TOC entry 4707 (class 2604 OID 16473)
-- Name: pedidos id_pedido; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos ALTER COLUMN id_pedido SET DEFAULT nextval('public.pedidos_id_pedido_seq'::regclass);


--
-- TOC entry 4708 (class 2604 OID 16474)
-- Name: productos id_producto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN id_producto SET DEFAULT nextval('public.productos_id_producto_seq'::regclass);


--
-- TOC entry 4711 (class 2604 OID 16475)
-- Name: productosxcategorias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productosxcategorias ALTER COLUMN id SET DEFAULT nextval('public.productosxcategorias_id_seq'::regclass);


--
-- TOC entry 4712 (class 2604 OID 16476)
-- Name: provincias id_provincia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincias ALTER COLUMN id_provincia SET DEFAULT nextval('public.provincias_id_provincia_seq'::regclass);


--
-- TOC entry 4713 (class 2604 OID 16477)
-- Name: tiendas id_tienda; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas ALTER COLUMN id_tienda SET DEFAULT nextval('public.tiendas_id_tienda_seq'::regclass);


--
-- TOC entry 4715 (class 2604 OID 16478)
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- TOC entry 4716 (class 2604 OID 16479)
-- Name: ventas id_venta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas ALTER COLUMN id_venta SET DEFAULT nextval('public.ventas_id_venta_seq'::regclass);


--
-- TOC entry 4719 (class 2604 OID 16480)
-- Name: vistas id_vista; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vistas ALTER COLUMN id_vista SET DEFAULT nextval('public.vistas_id_vista_seq'::regclass);


--
-- TOC entry 4724 (class 2606 OID 16482)
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id_categoria);


--
-- TOC entry 4726 (class 2606 OID 16484)
-- Name: cuentas cuentas_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas
    ADD CONSTRAINT cuentas_email_key UNIQUE (email);


--
-- TOC entry 4728 (class 2606 OID 16486)
-- Name: cuentas cuentas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas
    ADD CONSTRAINT cuentas_pkey PRIMARY KEY (id_cuenta);


--
-- TOC entry 4730 (class 2606 OID 16488)
-- Name: detallepedidos detallepedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos
    ADD CONSTRAINT detallepedidos_pkey PRIMARY KEY (id_detallepedido);


--
-- TOC entry 4733 (class 2606 OID 16490)
-- Name: duenios duenios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.duenios
    ADD CONSTRAINT duenios_pkey PRIMARY KEY (id_duenio);


--
-- TOC entry 4735 (class 2606 OID 16492)
-- Name: etiquetas etiquetas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etiquetas
    ADD CONSTRAINT etiquetas_pkey PRIMARY KEY (id_etiqueta);


--
-- TOC entry 4738 (class 2606 OID 16494)
-- Name: favoritos favoritos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_pkey PRIMARY KEY (id_favorito);


--
-- TOC entry 4743 (class 2606 OID 16496)
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id_pedido);


--
-- TOC entry 4746 (class 2606 OID 16498)
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id_producto);


--
-- TOC entry 4748 (class 2606 OID 16500)
-- Name: productosxcategorias productosxcategorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productosxcategorias
    ADD CONSTRAINT productosxcategorias_pkey PRIMARY KEY (id);


--
-- TOC entry 4750 (class 2606 OID 16502)
-- Name: provincias provincias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincias
    ADD CONSTRAINT provincias_pkey PRIMARY KEY (id_provincia);


--
-- TOC entry 4753 (class 2606 OID 16504)
-- Name: tiendas tiendas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas
    ADD CONSTRAINT tiendas_pkey PRIMARY KEY (id_tienda);


--
-- TOC entry 4740 (class 2606 OID 16506)
-- Name: favoritos uq_favoritos_producto_usuario; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT uq_favoritos_producto_usuario UNIQUE (id_producto, id_usuario);


--
-- TOC entry 4755 (class 2606 OID 16508)
-- Name: tiendas uq_tienda_cuenta; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas
    ADD CONSTRAINT uq_tienda_cuenta UNIQUE (id_cuenta);


--
-- TOC entry 4757 (class 2606 OID 16510)
-- Name: usuarios uq_usuario_cuenta; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT uq_usuario_cuenta UNIQUE (id_cuenta);


--
-- TOC entry 4759 (class 2606 OID 16512)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4765 (class 2606 OID 16514)
-- Name: ventas ventas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_pkey PRIMARY KEY (id_venta);


--
-- TOC entry 4767 (class 2606 OID 16516)
-- Name: vistas vistas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vistas
    ADD CONSTRAINT vistas_pkey PRIMARY KEY (id_vista);


--
-- TOC entry 4731 (class 1259 OID 16517)
-- Name: idx_detallepedidos_pedido; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_detallepedidos_pedido ON public.detallepedidos USING btree (id_pedido);


--
-- TOC entry 4736 (class 1259 OID 16518)
-- Name: idx_etiquetas_producto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_etiquetas_producto ON public.etiquetas USING btree (id_producto);


--
-- TOC entry 4741 (class 1259 OID 16519)
-- Name: idx_pedidos_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pedidos_usuario ON public.pedidos USING btree (id_usuario);


--
-- TOC entry 4744 (class 1259 OID 16520)
-- Name: idx_productos_tienda; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_productos_tienda ON public.productos USING btree (id_tienda);


--
-- TOC entry 4751 (class 1259 OID 16521)
-- Name: idx_tiendas_provincia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tiendas_provincia ON public.tiendas USING btree (id_provincia);


--
-- TOC entry 4760 (class 1259 OID 16522)
-- Name: idx_ventas_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ventas_fecha ON public.ventas USING btree (fecha);


--
-- TOC entry 4761 (class 1259 OID 16523)
-- Name: idx_ventas_producto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ventas_producto ON public.ventas USING btree (id_producto);


--
-- TOC entry 4762 (class 1259 OID 16524)
-- Name: idx_ventas_tienda; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ventas_tienda ON public.ventas USING btree (id_tienda);


--
-- TOC entry 4763 (class 1259 OID 16525)
-- Name: idx_ventas_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ventas_usuario ON public.ventas USING btree (id_usuario);


--
-- TOC entry 4769 (class 2606 OID 16526)
-- Name: detallepedidos detallepedidos_id_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos
    ADD CONSTRAINT detallepedidos_id_pedido_fkey FOREIGN KEY (id_pedido) REFERENCES public.pedidos(id_pedido);


--
-- TOC entry 4770 (class 2606 OID 16531)
-- Name: detallepedidos detallepedidos_id_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos
    ADD CONSTRAINT detallepedidos_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto);


--
-- TOC entry 4768 (class 2606 OID 16621)
-- Name: categorias fk_categorias_tiendas; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT fk_categorias_tiendas FOREIGN KEY (id_tienda) REFERENCES public.tiendas(id_tienda);


--
-- TOC entry 4771 (class 2606 OID 16536)
-- Name: etiquetas fk_etiquetas_producto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etiquetas
    ADD CONSTRAINT fk_etiquetas_producto FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto) ON DELETE CASCADE;


--
-- TOC entry 4772 (class 2606 OID 16541)
-- Name: favoritos fk_favoritos_producto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT fk_favoritos_producto FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto) ON DELETE CASCADE;


--
-- TOC entry 4773 (class 2606 OID 16546)
-- Name: favoritos fk_favoritos_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT fk_favoritos_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 4778 (class 2606 OID 16551)
-- Name: tiendas fk_tienda_cuenta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas
    ADD CONSTRAINT fk_tienda_cuenta FOREIGN KEY (id_cuenta) REFERENCES public.cuentas(id_cuenta) ON DELETE CASCADE;


--
-- TOC entry 4781 (class 2606 OID 16556)
-- Name: usuarios fk_usuario_cuenta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT fk_usuario_cuenta FOREIGN KEY (id_cuenta) REFERENCES public.cuentas(id_cuenta) ON DELETE CASCADE;


--
-- TOC entry 4782 (class 2606 OID 16561)
-- Name: ventas fk_venta_pedido; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT fk_venta_pedido FOREIGN KEY (id_pedido) REFERENCES public.pedidos(id_pedido);


--
-- TOC entry 4783 (class 2606 OID 16566)
-- Name: ventas fk_venta_producto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT fk_venta_producto FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto);


--
-- TOC entry 4784 (class 2606 OID 16571)
-- Name: ventas fk_venta_tienda; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT fk_venta_tienda FOREIGN KEY (id_tienda) REFERENCES public.tiendas(id_tienda);


--
-- TOC entry 4785 (class 2606 OID 16576)
-- Name: ventas fk_venta_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT fk_venta_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 4786 (class 2606 OID 16581)
-- Name: vistas fk_vistas_producto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vistas
    ADD CONSTRAINT fk_vistas_producto FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto) ON DELETE CASCADE;


--
-- TOC entry 4787 (class 2606 OID 16586)
-- Name: vistas fk_vistas_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vistas
    ADD CONSTRAINT fk_vistas_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 4774 (class 2606 OID 16591)
-- Name: pedidos pedidos_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 4775 (class 2606 OID 16596)
-- Name: productos productos_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias(id_categoria) ON DELETE SET NULL;


--
-- TOC entry 4776 (class 2606 OID 16601)
-- Name: productosxcategorias productosxcategorias_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productosxcategorias
    ADD CONSTRAINT productosxcategorias_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias(id_categoria);


--
-- TOC entry 4777 (class 2606 OID 16606)
-- Name: productosxcategorias productosxcategorias_id_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productosxcategorias
    ADD CONSTRAINT productosxcategorias_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto);


--
-- TOC entry 4779 (class 2606 OID 16611)
-- Name: tiendas tiendas_id_duenio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas
    ADD CONSTRAINT tiendas_id_duenio_fkey FOREIGN KEY (id_duenio) REFERENCES public.duenios(id_duenio);


--
-- TOC entry 4780 (class 2606 OID 16616)
-- Name: tiendas tiendas_id_provincia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas
    ADD CONSTRAINT tiendas_id_provincia_fkey FOREIGN KEY (id_provincia) REFERENCES public.provincias(id_provincia);


-- Completed on 2026-07-06 15:24:52

--
-- PostgreSQL database dump complete
--

