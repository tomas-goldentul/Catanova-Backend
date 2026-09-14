--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.0

-- Started on 2026-09-14 10:19:56

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
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16665)
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id_categoria integer NOT NULL,
    nombre character varying(100) NOT NULL,
    id_tienda integer
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16668)
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
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 217
-- Name: categorias_id_categoria_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_categoria_seq OWNED BY public.categorias.id_categoria;


--
-- TOC entry 218 (class 1259 OID 16669)
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
-- TOC entry 219 (class 1259 OID 16676)
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
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 219
-- Name: cuentas_id_cuenta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cuentas_id_cuenta_seq OWNED BY public.cuentas.id_cuenta;


--
-- TOC entry 220 (class 1259 OID 16677)
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
-- TOC entry 221 (class 1259 OID 16680)
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
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 221
-- Name: detallepedidos_id_detallepedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detallepedidos_id_detallepedido_seq OWNED BY public.detallepedidos.id_detallepedido;


--
-- TOC entry 222 (class 1259 OID 16681)
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
-- TOC entry 223 (class 1259 OID 16684)
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
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 223
-- Name: duenios_id_duenio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.duenios_id_duenio_seq OWNED BY public.duenios.id_duenio;


--
-- TOC entry 224 (class 1259 OID 16685)
-- Name: etiquetas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.etiquetas (
    id_etiqueta integer NOT NULL,
    nombre character varying(50) NOT NULL,
    id_producto integer NOT NULL
);


ALTER TABLE public.etiquetas OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16688)
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
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 225
-- Name: etiquetas_id_etiqueta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.etiquetas_id_etiqueta_seq OWNED BY public.etiquetas.id_etiqueta;


--
-- TOC entry 226 (class 1259 OID 16689)
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
-- TOC entry 227 (class 1259 OID 16693)
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
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 227
-- Name: favoritos_id_favorito_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favoritos_id_favorito_seq OWNED BY public.favoritos.id_favorito;


--
-- TOC entry 228 (class 1259 OID 16694)
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
-- TOC entry 229 (class 1259 OID 16697)
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
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 229
-- Name: pedidos_id_pedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedidos_id_pedido_seq OWNED BY public.pedidos.id_pedido;


--
-- TOC entry 230 (class 1259 OID 16698)
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
    tipo character varying(50) DEFAULT 'General'::character varying,
    descripcion text DEFAULT ''::text
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16703)
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
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 231
-- Name: productos_id_producto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_id_producto_seq OWNED BY public.productos.id_producto;


--
-- TOC entry 232 (class 1259 OID 16704)
-- Name: productosxcategorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productosxcategorias (
    id integer NOT NULL,
    id_producto integer NOT NULL,
    id_categoria integer NOT NULL
);


ALTER TABLE public.productosxcategorias OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16707)
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
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 233
-- Name: productosxcategorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productosxcategorias_id_seq OWNED BY public.productosxcategorias.id;


--
-- TOC entry 234 (class 1259 OID 16708)
-- Name: provincias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provincias (
    id_provincia integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.provincias OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16711)
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
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 235
-- Name: provincias_id_provincia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.provincias_id_provincia_seq OWNED BY public.provincias.id_provincia;


--
-- TOC entry 236 (class 1259 OID 16712)
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
-- TOC entry 237 (class 1259 OID 16718)
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
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 237
-- Name: tiendas_id_tienda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tiendas_id_tienda_seq OWNED BY public.tiendas.id_tienda;


--
-- TOC entry 238 (class 1259 OID 16719)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer NOT NULL,
    nombre character varying(50) NOT NULL,
    apellido character varying(50) NOT NULL,
    telefono character varying(20) NOT NULL,
    id_cuenta integer,
    direccion character varying(100)
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16722)
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
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 239
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_usuario_seq OWNED BY public.usuarios.id_usuario;


--
-- TOC entry 245 (class 1259 OID 16935)
-- Name: usuariosxtiendas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuariosxtiendas (
    id_usuariotienda integer NOT NULL,
    id_usuario integer NOT NULL,
    id_tienda integer NOT NULL
);


ALTER TABLE public.usuariosxtiendas OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 16934)
-- Name: usuariosxtiendas_id_usuariotienda_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuariosxtiendas_id_usuariotienda_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuariosxtiendas_id_usuariotienda_seq OWNER TO postgres;

--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 244
-- Name: usuariosxtiendas_id_usuariotienda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuariosxtiendas_id_usuariotienda_seq OWNED BY public.usuariosxtiendas.id_usuariotienda;


--
-- TOC entry 240 (class 1259 OID 16723)
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
-- TOC entry 241 (class 1259 OID 16728)
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
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 241
-- Name: ventas_id_venta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ventas_id_venta_seq OWNED BY public.ventas.id_venta;


--
-- TOC entry 242 (class 1259 OID 16729)
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
-- TOC entry 243 (class 1259 OID 16733)
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
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 243
-- Name: vistas_id_vista_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vistas_id_vista_seq OWNED BY public.vistas.id_vista;


--
-- TOC entry 4741 (class 2604 OID 16734)
-- Name: categorias id_categoria; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id_categoria SET DEFAULT nextval('public.categorias_id_categoria_seq'::regclass);


--
-- TOC entry 4742 (class 2604 OID 16735)
-- Name: cuentas id_cuenta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas ALTER COLUMN id_cuenta SET DEFAULT nextval('public.cuentas_id_cuenta_seq'::regclass);


--
-- TOC entry 4744 (class 2604 OID 16736)
-- Name: detallepedidos id_detallepedido; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos ALTER COLUMN id_detallepedido SET DEFAULT nextval('public.detallepedidos_id_detallepedido_seq'::regclass);


--
-- TOC entry 4745 (class 2604 OID 16737)
-- Name: duenios id_duenio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.duenios ALTER COLUMN id_duenio SET DEFAULT nextval('public.duenios_id_duenio_seq'::regclass);


--
-- TOC entry 4746 (class 2604 OID 16738)
-- Name: etiquetas id_etiqueta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etiquetas ALTER COLUMN id_etiqueta SET DEFAULT nextval('public.etiquetas_id_etiqueta_seq'::regclass);


--
-- TOC entry 4747 (class 2604 OID 16739)
-- Name: favoritos id_favorito; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos ALTER COLUMN id_favorito SET DEFAULT nextval('public.favoritos_id_favorito_seq'::regclass);


--
-- TOC entry 4749 (class 2604 OID 16740)
-- Name: pedidos id_pedido; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos ALTER COLUMN id_pedido SET DEFAULT nextval('public.pedidos_id_pedido_seq'::regclass);


--
-- TOC entry 4750 (class 2604 OID 16741)
-- Name: productos id_producto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN id_producto SET DEFAULT nextval('public.productos_id_producto_seq'::regclass);


--
-- TOC entry 4754 (class 2604 OID 16742)
-- Name: productosxcategorias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productosxcategorias ALTER COLUMN id SET DEFAULT nextval('public.productosxcategorias_id_seq'::regclass);


--
-- TOC entry 4755 (class 2604 OID 16743)
-- Name: provincias id_provincia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincias ALTER COLUMN id_provincia SET DEFAULT nextval('public.provincias_id_provincia_seq'::regclass);


--
-- TOC entry 4756 (class 2604 OID 16744)
-- Name: tiendas id_tienda; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas ALTER COLUMN id_tienda SET DEFAULT nextval('public.tiendas_id_tienda_seq'::regclass);


--
-- TOC entry 4759 (class 2604 OID 16745)
-- Name: usuarios id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuarios_id_usuario_seq'::regclass);


--
-- TOC entry 4765 (class 2604 OID 16938)
-- Name: usuariosxtiendas id_usuariotienda; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuariosxtiendas ALTER COLUMN id_usuariotienda SET DEFAULT nextval('public.usuariosxtiendas_id_usuariotienda_seq'::regclass);


--
-- TOC entry 4760 (class 2604 OID 16746)
-- Name: ventas id_venta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas ALTER COLUMN id_venta SET DEFAULT nextval('public.ventas_id_venta_seq'::regclass);


--
-- TOC entry 4763 (class 2604 OID 16747)
-- Name: vistas id_vista; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vistas ALTER COLUMN id_vista SET DEFAULT nextval('public.vistas_id_vista_seq'::regclass);


--
-- TOC entry 4984 (class 0 OID 16665)
-- Dependencies: 216
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categorias VALUES (1, 'Electrónica', 1);
INSERT INTO public.categorias VALUES (2, 'Indumentaria', 2);
INSERT INTO public.categorias VALUES (3, 'Hogar', 3);
INSERT INTO public.categorias VALUES (4, 'Deportes', 4);
INSERT INTO public.categorias VALUES (5, 'Belleza', 5);
INSERT INTO public.categorias VALUES (6, 'Libros', 6);
INSERT INTO public.categorias VALUES (7, 'Juguetes', 7);
INSERT INTO public.categorias VALUES (8, 'Alimentos', 8);
INSERT INTO public.categorias VALUES (9, 'Laptops', 1);
INSERT INTO public.categorias VALUES (10, 'Muebles', 2);
INSERT INTO public.categorias VALUES (11, 'Ventanas', 3);
INSERT INTO public.categorias VALUES (12, 'Atletismo', 4);
INSERT INTO public.categorias VALUES (13, 'Cuidado', 5);
INSERT INTO public.categorias VALUES (14, 'Peliculas', 6);
INSERT INTO public.categorias VALUES (15, 'Balones', 7);
INSERT INTO public.categorias VALUES (16, 'Bebidas', 8);
INSERT INTO public.categorias VALUES (17, 'Cuevas', 1);


--
-- TOC entry 4986 (class 0 OID 16669)
-- Dependencies: 218
-- Data for Name: cuentas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cuentas VALUES (1, 'lucas@email.com', '$2a$06$DydKx2Aw4W8//l9HfjFOm.BRlFfTN0pDtp5DVu/f0sjx4ZZ92MzU.', '2026-08-10 07:56:47.343047', 'usuario', 'imagenes/avatar1.jpg');
INSERT INTO public.cuentas VALUES (2, 'flor@email.com', '$2a$06$HENqEhdgQppy//4M3XCHheJOGs0BS5boInDGGZgeWu9EOGwjW4UC6', '2026-08-10 07:56:47.343047', 'usuario', 'imagenes/avatar2.jpg');
INSERT INTO public.cuentas VALUES (3, 'martin@email.com', '$2a$06$YYqx2YqUI9SjGHi39TMBAeGSZNA1hEQ1TJwWVNI1wfQ0O/BlNAmZq', '2026-08-10 07:56:47.343047', 'usuario', 'imagenes/avatar3.jpg');
INSERT INTO public.cuentas VALUES (4, 'julieta@email.com', '$2a$06$/qPLiVdbPYLoW7HMjcGK/.3yTZQ1fs2hymGQi4Vo/t56pvUB7/I/u', '2026-08-10 07:56:47.343047', 'usuario', 'imagenes/avatar4.jpg');
INSERT INTO public.cuentas VALUES (5, 'franco@email.com', '$2a$06$Y7DquEn4fO3BXo6hOH7NQOnLD7SVWne8T66EQQUclR6T0u34CAEcy', '2026-08-10 07:56:47.343047', 'usuario', 'imagenes/avatar5.jpg');
INSERT INTO public.cuentas VALUES (6, 'camila@email.com', '$2a$06$06eotWsY7KgOwNZbdUQ2UOOWPjuOgOHLmnHmUohA1E9qxn1Kpsaq2', '2026-08-10 07:56:47.343047', 'usuario', 'imagenes/avatar6.jpg');
INSERT INTO public.cuentas VALUES (7, 'nahuel@email.com', '$2a$06$uX9c.ffjj8ZxX6i.nx396uuVkM8DOev.U6/iWOYGk9IH8iS0O8meC', '2026-08-10 07:56:47.343047', 'usuario', 'imagenes/avatar7.jpg');
INSERT INTO public.cuentas VALUES (8, 'agustina@email.com', '$2a$06$q5wWpNBg8LHeFCS.FE2/AuzUZYFfKeMAdle7JQZFebr5Vw3k7Qsei', '2026-08-10 07:56:47.343047', 'usuario', 'imagenes/avatar8.jpg');
INSERT INTO public.cuentas VALUES (9, 'tomas@email.com', '$2a$06$lkS9BtKq19jYqE1i9/TDjOaiFhH/HyDN3Xqt0Pr1.NDzDWMPCfdmO', '2026-08-10 07:56:47.343047', 'usuario', 'imagenes/avatar9.jpg');
INSERT INTO public.cuentas VALUES (10, 'mora@email.com', '$2a$06$Aszw7xSH0b5RR2ZrbmnGPumg8RdMeTMo9M9vxHKWWTjCwmMIQQjtO', '2026-08-10 07:56:47.343047', 'usuario', 'imagenes/avatar10.jpg');
INSERT INTO public.cuentas VALUES (11, 'techstore@email.com', '$2a$06$MTiK0mIY0/2WYiXCW3z9I.Rstgj6j7rAeZkUEXkJcL/daSt9hCGSC', '2026-08-10 07:56:47.343047', 'tienda', 'imagenes/tech.jpg');
INSERT INTO public.cuentas VALUES (12, 'modaexpress@email.com', '$2a$06$xc6QJ8CQiWBRuXE4kLm8Fei5X59hTEd1OTNaTFlNJc4T3ZPoopWsK', '2026-08-10 07:56:47.343047', 'tienda', 'imagenes/moda.jpg');
INSERT INTO public.cuentas VALUES (13, 'casamoderna@email.com', '$2a$06$g0MDMBa40XVYxe/P.SKPWe1elh3kK4g7WwAzbe160qH/m.d16nWR.', '2026-08-10 07:56:47.343047', 'tienda', 'imagenes/casa.jpg');
INSERT INTO public.cuentas VALUES (14, 'gamerzone@email.com', '$2a$06$/pVM6xdyNuJ91ay8L6N6fuoXDdkt6eV0A2vgfoHbcQPV8R6a47MoG', '2026-08-10 07:56:47.343047', 'tienda', 'imagenes/gamer.jpg');
INSERT INTO public.cuentas VALUES (15, 'sportlife@email.com', '$2a$06$aDCT6BMcPZ6La910GqGf5.WRRLd0t7h6BRqQw64y3JIKv0/EGO.Ga', '2026-08-10 07:56:47.343047', 'tienda', 'imagenes/sport.jpg');
INSERT INTO public.cuentas VALUES (16, 'beautymarket@email.com', '$2a$06$EJWfH7GmiGp0JdLIGZAxZ.Tf9WjNHl.bpf.p9jsg4xUO9oybUsszq', '2026-08-10 07:56:47.343047', 'tienda', 'imagenes/beauty.jpg');
INSERT INTO public.cuentas VALUES (17, 'libreriacentral@email.com', '$2a$06$NEwtWuEC3SXyUUKHM8fe1eOpMPDVkRKY9NekPX7ij3PMhVp.5ckGC', '2026-08-10 07:56:47.343047', 'tienda', 'imagenes/libros.jpg');
INSERT INTO public.cuentas VALUES (18, 'decohome@email.com', '$2a$06$Usn7tfmk7312fb8iSfc2aeeI8OR2sLySO6RgalRDYuX7zOW1fxAHm', '2026-08-10 07:56:47.343047', 'tienda', 'imagenes/deco.jpg');
INSERT INTO public.cuentas VALUES (19, 'petshopplus@email.com', '$2a$06$boyuTHh1ORMtLM9P2Qxe2ePlIP3WX/gwu2uIG2vmBh8Qghxhtcq7C', '2026-08-10 07:56:47.343047', 'tienda', 'imagenes/pet.jpg');
INSERT INTO public.cuentas VALUES (20, 'mundocelular@email.com', '$2a$06$BB4kNRFjop5e2Q.yUC7/2ORxqN0ZxhGlSYfxvGSUhbwjYDsrvIZ9q', '2026-08-10 07:56:47.343047', 'tienda', 'imagenes/celular.jpg');


--
-- TOC entry 4988 (class 0 OID 16677)
-- Dependencies: 220
-- Data for Name: detallepedidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.detallepedidos VALUES (1, 1, 1599999.00, 1, 1);
INSERT INTO public.detallepedidos VALUES (2, 2, 999998.00, 1, 5);
INSERT INTO public.detallepedidos VALUES (3, 1, 14999.00, 1, 46);
INSERT INTO public.detallepedidos VALUES (4, 2, 59998.00, 2, 6);
INSERT INTO public.detallepedidos VALUES (5, 1, 129999.00, 2, 10);
INSERT INTO public.detallepedidos VALUES (8, 1, 699999.00, 4, 18);
INSERT INTO public.detallepedidos VALUES (9, 1, 189999.00, 4, 20);
INSERT INTO public.detallepedidos VALUES (10, 2, 91998.00, 5, 21);
INSERT INTO public.detallepedidos VALUES (11, 1, 84999.00, 5, 22);
INSERT INTO public.detallepedidos VALUES (14, 1, 19999.00, 7, 31);
INSERT INTO public.detallepedidos VALUES (15, 3, 26997.00, 7, 33);
INSERT INTO public.detallepedidos VALUES (16, 2, 45998.00, 8, 37);
INSERT INTO public.detallepedidos VALUES (17, 1, 69999.00, 8, 38);
INSERT INTO public.detallepedidos VALUES (18, 2, 89998.00, 9, 41);
INSERT INTO public.detallepedidos VALUES (19, 1, 19999.00, 9, 43);
INSERT INTO public.detallepedidos VALUES (20, 1, 249999.00, 10, 50);
INSERT INTO public.detallepedidos VALUES (21, 2, 19998.00, 10, 48);
INSERT INTO public.detallepedidos VALUES (25, 1, 69999.00, 12, 12);
INSERT INTO public.detallepedidos VALUES (26, 2, 79998.00, 12, 13);
INSERT INTO public.detallepedidos VALUES (27, 1, 249999.00, 13, 14);
INSERT INTO public.detallepedidos VALUES (28, 1, 89999.00, 13, 15);
INSERT INTO public.detallepedidos VALUES (31, 2, 169998.00, 15, 22);
INSERT INTO public.detallepedidos VALUES (32, 1, 1299999.00, 15, 25);
INSERT INTO public.detallepedidos VALUES (33, 1, 42999.00, 16, 29);
INSERT INTO public.detallepedidos VALUES (34, 2, 55998.00, 16, 30);
INSERT INTO public.detallepedidos VALUES (37, 1, 39999.00, 18, 39);
INSERT INTO public.detallepedidos VALUES (38, 1, 28999.00, 18, 40);
INSERT INTO public.detallepedidos VALUES (39, 2, 83998.00, 19, 42);
INSERT INTO public.detallepedidos VALUES (40, 1, 89999.00, 19, 45);
INSERT INTO public.detallepedidos VALUES (43, 1, 2499999.00, 21, 3);
INSERT INTO public.detallepedidos VALUES (44, 1, 1599999.00, 21, 1);
INSERT INTO public.detallepedidos VALUES (45, 2, 111998.00, 22, 9);
INSERT INTO public.detallepedidos VALUES (46, 1, 159999.00, 22, 8);
INSERT INTO public.detallepedidos VALUES (49, 1, 699999.00, 24, 18);
INSERT INTO public.detallepedidos VALUES (50, 1, 89999.00, 24, 16);
INSERT INTO public.detallepedidos VALUES (53, 1, 34999.00, 2, 27);
INSERT INTO public.detallepedidos VALUES (54, 2, 39998.00, 5, 31);
INSERT INTO public.detallepedidos VALUES (55, 1, 45999.00, 8, 36);
INSERT INTO public.detallepedidos VALUES (56, 2, 29998.00, 9, 44);
INSERT INTO public.detallepedidos VALUES (57, 1, 34999.00, 12, 47);
INSERT INTO public.detallepedidos VALUES (58, 1, 14999.00, 16, 46);
INSERT INTO public.detallepedidos VALUES (59, 2, 19998.00, 18, 48);
INSERT INTO public.detallepedidos VALUES (61, 2, 71998.00, 17, 35);
INSERT INTO public.detallepedidos VALUES (62, 1, 24999.00, 17, 32);
INSERT INTO public.detallepedidos VALUES (66, 1, 1399999.00, 11, 2);
INSERT INTO public.detallepedidos VALUES (67, 1, 34999.00, 11, 47);
INSERT INTO public.detallepedidos VALUES (68, 2, 29998.00, 11, 46);
INSERT INTO public.detallepedidos VALUES (69, 1, 89999.00, 26, 16);
INSERT INTO public.detallepedidos VALUES (70, 1, 89999.00, 27, 15);
INSERT INTO public.detallepedidos VALUES (71, 1, 1599999.00, 28, 1);
INSERT INTO public.detallepedidos VALUES (72, 11, 879989.00, 29, 49);


--
-- TOC entry 4990 (class 0 OID 16681)
-- Dependencies: 222
-- Data for Name: duenios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.duenios VALUES (1, 'Juan', 'Pérez', 'juan@techstore.com', '111111111');
INSERT INTO public.duenios VALUES (2, 'María', 'Gómez', 'maria@modaexpress.com', '222222222');
INSERT INTO public.duenios VALUES (3, 'Carlos', 'Ruiz', 'carlos@casamoderna.com', '333333333');
INSERT INTO public.duenios VALUES (4, 'Lucía', 'Fernández', 'lucia@gamerzone.com', '444444444');
INSERT INTO public.duenios VALUES (5, 'Matías', 'Suárez', 'matias@sportlife.com', '555555555');
INSERT INTO public.duenios VALUES (6, 'Valentina', 'López', 'valentina@beautymarket.com', '666666666');
INSERT INTO public.duenios VALUES (7, 'Pedro', 'Martínez', 'pedro@libreriacentral.com', '777777777');
INSERT INTO public.duenios VALUES (8, 'Camila', 'Sosa', 'camila@decohome.com', '888888888');
INSERT INTO public.duenios VALUES (9, 'Joaquín', 'Romero', 'joaquin@petshopplus.com', '999999999');
INSERT INTO public.duenios VALUES (10, 'Sofía', 'Benítez', 'sofia@mundocelular.com', '101010101');


--
-- TOC entry 4992 (class 0 OID 16685)
-- Dependencies: 224
-- Data for Name: etiquetas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.etiquetas VALUES (1, 'Nuevo', 1);
INSERT INTO public.etiquetas VALUES (2, 'Apple', 1);
INSERT INTO public.etiquetas VALUES (3, '5G', 1);
INSERT INTO public.etiquetas VALUES (4, 'Samsung', 2);
INSERT INTO public.etiquetas VALUES (5, 'Android', 2);
INSERT INTO public.etiquetas VALUES (6, 'Notebook', 3);
INSERT INTO public.etiquetas VALUES (7, 'Profesional', 3);
INSERT INTO public.etiquetas VALUES (8, 'Oferta', 4);
INSERT INTO public.etiquetas VALUES (9, 'Lenovo', 4);
INSERT INTO public.etiquetas VALUES (10, 'Bluetooth', 5);
INSERT INTO public.etiquetas VALUES (11, 'Inalámbrico', 5);
INSERT INTO public.etiquetas VALUES (12, 'Algodón', 6);
INSERT INTO public.etiquetas VALUES (13, 'Oversize', 6);
INSERT INTO public.etiquetas VALUES (14, 'Jean', 7);
INSERT INTO public.etiquetas VALUES (15, 'Slim Fit', 7);
INSERT INTO public.etiquetas VALUES (16, 'Invierno', 8);
INSERT INTO public.etiquetas VALUES (17, 'Abrigo', 9);
INSERT INTO public.etiquetas VALUES (18, 'Urbano', 10);
INSERT INTO public.etiquetas VALUES (19, 'Madera', 11);
INSERT INTO public.etiquetas VALUES (20, 'Escandinavo', 12);
INSERT INTO public.etiquetas VALUES (21, 'LED', 13);
INSERT INTO public.etiquetas VALUES (22, 'Moderno', 14);
INSERT INTO public.etiquetas VALUES (23, 'Decoración', 15);
INSERT INTO public.etiquetas VALUES (24, 'Gaming', 16);
INSERT INTO public.etiquetas VALUES (25, 'RGB', 17);
INSERT INTO public.etiquetas VALUES (26, '165Hz', 18);
INSERT INTO public.etiquetas VALUES (27, 'Ergonómica', 19);
INSERT INTO public.etiquetas VALUES (28, 'Xbox', 20);
INSERT INTO public.etiquetas VALUES (29, 'Fútbol', 21);
INSERT INTO public.etiquetas VALUES (30, 'Fitness', 22);
INSERT INTO public.etiquetas VALUES (31, 'Yoga', 23);
INSERT INTO public.etiquetas VALUES (32, 'Tenis', 24);
INSERT INTO public.etiquetas VALUES (33, 'MTB', 25);
INSERT INTO public.etiquetas VALUES (34, 'Perfume', 26);
INSERT INTO public.etiquetas VALUES (35, 'Maquillaje', 27);
INSERT INTO public.etiquetas VALUES (36, 'Labial', 28);
INSERT INTO public.etiquetas VALUES (37, 'Skincare', 29);
INSERT INTO public.etiquetas VALUES (38, 'Cabello', 30);
INSERT INTO public.etiquetas VALUES (39, 'Clásico', 31);
INSERT INTO public.etiquetas VALUES (40, 'Novela', 32);
INSERT INTO public.etiquetas VALUES (41, 'Escolar', 33);
INSERT INTO public.etiquetas VALUES (42, 'Agenda', 34);
INSERT INTO public.etiquetas VALUES (43, 'Premium', 35);
INSERT INTO public.etiquetas VALUES (44, 'Minimalista', 36);
INSERT INTO public.etiquetas VALUES (45, 'Nórdico', 37);
INSERT INTO public.etiquetas VALUES (46, 'Espejo', 38);
INSERT INTO public.etiquetas VALUES (47, 'Reloj', 39);
INSERT INTO public.etiquetas VALUES (48, 'Cerámica', 40);
INSERT INTO public.etiquetas VALUES (49, 'Perros', 41);
INSERT INTO public.etiquetas VALUES (50, 'Gatos', 42);
INSERT INTO public.etiquetas VALUES (51, 'Accesorio', 43);
INSERT INTO public.etiquetas VALUES (52, 'Mascotas', 44);
INSERT INTO public.etiquetas VALUES (53, 'Cucha', 45);
INSERT INTO public.etiquetas VALUES (54, 'iPhone', 46);
INSERT INTO public.etiquetas VALUES (55, 'Carga Rápida', 47);
INSERT INTO public.etiquetas VALUES (56, 'USB-C', 48);
INSERT INTO public.etiquetas VALUES (57, '20000mAh', 49);
INSERT INTO public.etiquetas VALUES (58, 'Smartwatch', 50);


--
-- TOC entry 4994 (class 0 OID 16689)
-- Dependencies: 226
-- Data for Name: favoritos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.favoritos VALUES (1, 1, '2024-06-08 11:48:02.956062', 4);
INSERT INTO public.favoritos VALUES (2, 34, '2026-05-09 21:33:24.739697', 9);
INSERT INTO public.favoritos VALUES (3, 13, '2024-08-04 23:36:47.26126', 9);
INSERT INTO public.favoritos VALUES (4, 6, '2026-01-25 13:37:38.525899', 9);
INSERT INTO public.favoritos VALUES (5, 39, '2024-08-16 19:35:50.899494', 2);
INSERT INTO public.favoritos VALUES (6, 52, '2026-01-15 06:41:00.022366', 9);
INSERT INTO public.favoritos VALUES (7, 53, '2026-06-18 02:10:58.684744', 6);
INSERT INTO public.favoritos VALUES (8, 38, '2025-08-16 04:47:40.528316', 9);
INSERT INTO public.favoritos VALUES (9, 53, '2026-02-22 20:54:54.117749', 7);
INSERT INTO public.favoritos VALUES (10, 52, '2026-06-22 15:06:41.451917', 8);
INSERT INTO public.favoritos VALUES (11, 3, '2024-02-26 00:46:30.539029', 4);
INSERT INTO public.favoritos VALUES (12, 52, '2025-06-02 22:53:16.700895', 1);
INSERT INTO public.favoritos VALUES (13, 23, '2024-08-04 03:16:00.716576', 8);
INSERT INTO public.favoritos VALUES (14, 51, '2025-07-24 05:01:30.932214', 5);
INSERT INTO public.favoritos VALUES (15, 3, '2025-06-02 01:25:25.369367', 7);
INSERT INTO public.favoritos VALUES (16, 43, '2024-12-25 19:24:28.782955', 1);
INSERT INTO public.favoritos VALUES (17, 45, '2026-01-23 04:39:56.166308', 7);
INSERT INTO public.favoritos VALUES (18, 19, '2024-05-08 03:37:52.093261', 9);
INSERT INTO public.favoritos VALUES (19, 21, '2025-06-27 00:17:52.766303', 7);
INSERT INTO public.favoritos VALUES (20, 6, '2026-01-23 10:54:38.598446', 3);
INSERT INTO public.favoritos VALUES (21, 47, '2025-03-22 11:22:18.906742', 4);
INSERT INTO public.favoritos VALUES (22, 44, '2025-10-24 19:00:02.615046', 3);
INSERT INTO public.favoritos VALUES (23, 12, '2026-03-10 11:20:36.350851', 1);
INSERT INTO public.favoritos VALUES (24, 4, '2026-04-07 21:55:14.384657', 9);
INSERT INTO public.favoritos VALUES (25, 9, '2025-07-01 05:54:57.868403', 2);
INSERT INTO public.favoritos VALUES (26, 32, '2025-10-15 01:52:38.025072', 9);
INSERT INTO public.favoritos VALUES (27, 37, '2024-03-07 06:43:30.431337', 10);
INSERT INTO public.favoritos VALUES (28, 34, '2025-01-02 02:47:36.405713', 2);
INSERT INTO public.favoritos VALUES (29, 10, '2024-03-24 23:22:50.042797', 3);
INSERT INTO public.favoritos VALUES (30, 54, '2025-07-02 02:09:14.818354', 4);
INSERT INTO public.favoritos VALUES (31, 40, '2024-05-02 17:03:27.252418', 6);
INSERT INTO public.favoritos VALUES (32, 30, '2025-12-14 21:16:57.7773', 5);
INSERT INTO public.favoritos VALUES (33, 37, '2026-06-02 10:12:58.233802', 4);
INSERT INTO public.favoritos VALUES (34, 46, '2024-03-04 22:52:37.727385', 5);
INSERT INTO public.favoritos VALUES (35, 14, '2025-06-29 03:07:23.429948', 4);
INSERT INTO public.favoritos VALUES (36, 44, '2025-06-18 16:03:08.501825', 1);
INSERT INTO public.favoritos VALUES (37, 11, '2026-03-30 20:05:24.157767', 8);
INSERT INTO public.favoritos VALUES (38, 34, '2024-05-30 07:12:04.580603', 4);
INSERT INTO public.favoritos VALUES (39, 11, '2024-05-14 12:53:13.938188', 2);
INSERT INTO public.favoritos VALUES (40, 6, '2025-04-04 01:10:39.854498', 1);
INSERT INTO public.favoritos VALUES (41, 41, '2025-11-29 21:33:09.988355', 2);
INSERT INTO public.favoritos VALUES (42, 18, '2025-03-30 03:39:50.050874', 6);
INSERT INTO public.favoritos VALUES (43, 9, '2024-04-20 05:50:44.1165', 5);
INSERT INTO public.favoritos VALUES (44, 7, '2026-04-03 06:11:36.704548', 6);
INSERT INTO public.favoritos VALUES (45, 1, '2024-12-09 03:40:58.187735', 6);
INSERT INTO public.favoritos VALUES (46, 10, '2024-09-07 12:42:47.821091', 9);
INSERT INTO public.favoritos VALUES (47, 30, '2024-09-24 15:21:26.90833', 10);
INSERT INTO public.favoritos VALUES (48, 31, '2025-12-03 00:32:24.256845', 8);
INSERT INTO public.favoritos VALUES (49, 13, '2024-08-05 23:32:16.558949', 3);
INSERT INTO public.favoritos VALUES (50, 14, '2025-05-04 07:10:30.999882', 6);
INSERT INTO public.favoritos VALUES (51, 15, '2024-12-23 02:56:52.693858', 3);
INSERT INTO public.favoritos VALUES (52, 32, '2026-02-21 04:12:24.799541', 5);
INSERT INTO public.favoritos VALUES (53, 23, '2024-04-12 17:48:08.566484', 4);
INSERT INTO public.favoritos VALUES (54, 7, '2024-10-21 19:26:49.891131', 4);
INSERT INTO public.favoritos VALUES (55, 18, '2026-04-10 04:56:54.796795', 9);
INSERT INTO public.favoritos VALUES (56, 29, '2025-02-22 17:56:17.660173', 3);
INSERT INTO public.favoritos VALUES (57, 13, '2024-12-17 21:04:17.741946', 4);
INSERT INTO public.favoritos VALUES (58, 24, '2024-08-06 04:56:20.983334', 2);
INSERT INTO public.favoritos VALUES (59, 38, '2025-06-15 23:30:31.553349', 2);
INSERT INTO public.favoritos VALUES (60, 49, '2025-03-09 23:24:36.237818', 10);
INSERT INTO public.favoritos VALUES (61, 26, '2025-05-07 15:10:46.699157', 8);
INSERT INTO public.favoritos VALUES (62, 19, '2025-07-16 03:55:20.249702', 4);
INSERT INTO public.favoritos VALUES (63, 53, '2026-02-15 13:10:24.726502', 5);
INSERT INTO public.favoritos VALUES (64, 30, '2026-05-12 09:01:17.517961', 3);
INSERT INTO public.favoritos VALUES (65, 6, '2024-03-09 14:19:29.585154', 4);
INSERT INTO public.favoritos VALUES (66, 2, '2025-02-02 11:42:40.649087', 8);
INSERT INTO public.favoritos VALUES (67, 41, '2025-08-18 15:21:17.967327', 3);
INSERT INTO public.favoritos VALUES (68, 5, '2024-07-12 01:31:31.906157', 9);
INSERT INTO public.favoritos VALUES (69, 14, '2024-08-17 17:07:02.398409', 7);
INSERT INTO public.favoritos VALUES (70, 5, '2026-05-03 17:22:00.229608', 1);
INSERT INTO public.favoritos VALUES (71, 50, '2024-07-02 01:42:50.534423', 9);
INSERT INTO public.favoritos VALUES (72, 21, '2026-02-21 00:31:48.395862', 9);
INSERT INTO public.favoritos VALUES (73, 2, '2025-07-13 10:01:21.132857', 4);
INSERT INTO public.favoritos VALUES (74, 7, '2025-01-07 01:29:07.218634', 3);
INSERT INTO public.favoritos VALUES (75, 45, '2025-06-30 19:21:09.123095', 10);
INSERT INTO public.favoritos VALUES (76, 20, '2026-04-18 14:11:44.552622', 10);
INSERT INTO public.favoritos VALUES (77, 37, '2026-06-30 13:27:23.190651', 8);
INSERT INTO public.favoritos VALUES (78, 40, '2024-10-06 11:42:15.474343', 3);
INSERT INTO public.favoritos VALUES (79, 36, '2025-10-31 23:52:35.203704', 4);
INSERT INTO public.favoritos VALUES (80, 22, '2026-06-16 03:45:50.064246', 9);
INSERT INTO public.favoritos VALUES (81, 29, '2024-06-26 22:35:08.27657', 8);
INSERT INTO public.favoritos VALUES (82, 43, '2026-06-06 17:11:17.710087', 6);
INSERT INTO public.favoritos VALUES (83, 49, '2024-06-03 10:13:22.713544', 8);
INSERT INTO public.favoritos VALUES (84, 8, '2025-06-09 19:37:43.717325', 3);
INSERT INTO public.favoritos VALUES (85, 51, '2024-10-20 20:59:37.019637', 1);
INSERT INTO public.favoritos VALUES (86, 34, '2025-07-14 22:38:50.942539', 7);
INSERT INTO public.favoritos VALUES (87, 25, '2025-05-10 10:16:36.082614', 4);
INSERT INTO public.favoritos VALUES (88, 20, '2024-04-05 04:36:49.425712', 5);
INSERT INTO public.favoritos VALUES (89, 10, '2024-02-18 04:57:02.164035', 1);
INSERT INTO public.favoritos VALUES (90, 48, '2024-07-01 03:33:34.33411', 4);
INSERT INTO public.favoritos VALUES (91, 2, '2025-09-08 09:23:00.805619', 2);
INSERT INTO public.favoritos VALUES (92, 16, '2025-03-18 15:40:36.888484', 10);
INSERT INTO public.favoritos VALUES (93, 16, '2024-05-18 05:47:43.529993', 4);
INSERT INTO public.favoritos VALUES (94, 50, '2026-05-24 07:30:43.995833', 10);
INSERT INTO public.favoritos VALUES (95, 51, '2024-04-12 18:22:23.055797', 8);
INSERT INTO public.favoritos VALUES (96, 31, '2024-01-28 12:50:30.378337', 10);
INSERT INTO public.favoritos VALUES (97, 10, '2025-11-03 23:00:03.905141', 2);
INSERT INTO public.favoritos VALUES (98, 7, '2024-11-16 21:10:28.291242', 8);
INSERT INTO public.favoritos VALUES (99, 38, '2026-01-01 06:58:23.714604', 1);
INSERT INTO public.favoritos VALUES (100, 16, '2026-04-08 02:36:48.34252', 8);
INSERT INTO public.favoritos VALUES (101, 50, '2025-03-07 04:28:18.137988', 3);
INSERT INTO public.favoritos VALUES (102, 13, '2024-01-30 04:19:18.041255', 7);
INSERT INTO public.favoritos VALUES (103, 40, '2024-07-15 23:28:26.213771', 5);
INSERT INTO public.favoritos VALUES (104, 28, '2024-10-23 05:20:46.41388', 4);
INSERT INTO public.favoritos VALUES (105, 14, '2024-01-05 07:32:01.74881', 5);
INSERT INTO public.favoritos VALUES (106, 22, '2024-10-12 12:06:06.145338', 1);
INSERT INTO public.favoritos VALUES (107, 43, '2024-03-22 14:11:21.861954', 3);
INSERT INTO public.favoritos VALUES (108, 22, '2026-02-10 13:08:02.178797', 2);
INSERT INTO public.favoritos VALUES (109, 21, '2026-05-04 09:01:04.019202', 2);
INSERT INTO public.favoritos VALUES (110, 11, '2026-06-15 15:41:33.528722', 1);
INSERT INTO public.favoritos VALUES (111, 16, '2024-01-13 23:58:14.139918', 5);
INSERT INTO public.favoritos VALUES (112, 12, '2024-09-28 10:17:43.659003', 8);
INSERT INTO public.favoritos VALUES (113, 29, '2025-01-12 20:03:59.282581', 4);
INSERT INTO public.favoritos VALUES (114, 16, '2025-11-29 11:20:19.729568', 9);
INSERT INTO public.favoritos VALUES (115, 35, '2025-11-19 05:14:16.196805', 1);
INSERT INTO public.favoritos VALUES (116, 20, '2025-12-07 11:01:36.661245', 8);
INSERT INTO public.favoritos VALUES (117, 28, '2026-01-06 19:31:51.019005', 1);
INSERT INTO public.favoritos VALUES (118, 39, '2026-03-07 17:52:42.932835', 5);
INSERT INTO public.favoritos VALUES (119, 17, '2024-04-26 15:54:57.851309', 8);
INSERT INTO public.favoritos VALUES (120, 32, '2024-10-22 01:56:38.585143', 10);
INSERT INTO public.favoritos VALUES (121, 40, '2024-05-18 00:57:44.122508', 1);
INSERT INTO public.favoritos VALUES (122, 51, '2025-12-01 05:42:23.511466', 7);
INSERT INTO public.favoritos VALUES (123, 15, '2026-04-13 12:12:25.865877', 4);
INSERT INTO public.favoritos VALUES (124, 1, '2024-12-22 12:16:09.298467', 5);
INSERT INTO public.favoritos VALUES (125, 50, '2025-08-02 22:50:33.743564', 6);
INSERT INTO public.favoritos VALUES (126, 25, '2025-10-01 17:46:27.319763', 2);
INSERT INTO public.favoritos VALUES (127, 27, '2024-10-31 23:29:06.619602', 3);
INSERT INTO public.favoritos VALUES (128, 30, '2025-10-20 19:44:28.918781', 1);
INSERT INTO public.favoritos VALUES (129, 1, '2024-12-23 07:39:49.792215', 8);
INSERT INTO public.favoritos VALUES (130, 17, '2025-07-13 13:16:33.675452', 9);
INSERT INTO public.favoritos VALUES (131, 8, '2024-02-14 07:57:01.681812', 2);
INSERT INTO public.favoritos VALUES (132, 23, '2025-11-30 13:29:40.779035', 1);
INSERT INTO public.favoritos VALUES (133, 18, '2025-11-02 02:25:31.869621', 8);
INSERT INTO public.favoritos VALUES (134, 35, '2024-01-22 12:00:02.054029', 8);
INSERT INTO public.favoritos VALUES (135, 24, '2025-11-02 19:36:04.609927', 3);
INSERT INTO public.favoritos VALUES (136, 15, '2024-03-27 15:19:15.622018', 6);
INSERT INTO public.favoritos VALUES (137, 1, '2024-03-06 16:49:57.112745', 3);
INSERT INTO public.favoritos VALUES (138, 30, '2025-05-29 10:25:25.005548', 2);
INSERT INTO public.favoritos VALUES (139, 15, '2025-09-02 15:54:51.999375', 8);
INSERT INTO public.favoritos VALUES (140, 52, '2024-08-28 07:06:04.305835', 6);
INSERT INTO public.favoritos VALUES (141, 4, '2026-02-17 19:12:53.207105', 2);
INSERT INTO public.favoritos VALUES (142, 22, '2025-01-08 06:45:51.784682', 7);
INSERT INTO public.favoritos VALUES (143, 32, '2026-04-25 17:10:00.482796', 1);
INSERT INTO public.favoritos VALUES (144, 33, '2024-11-20 14:45:19.815831', 2);
INSERT INTO public.favoritos VALUES (145, 36, '2024-03-21 08:03:30.485102', 3);
INSERT INTO public.favoritos VALUES (146, 49, '2025-05-14 02:47:01.722625', 7);
INSERT INTO public.favoritos VALUES (147, 27, '2024-05-03 01:17:51.473083', 7);
INSERT INTO public.favoritos VALUES (148, 33, '2025-05-07 05:19:18.069684', 6);
INSERT INTO public.favoritos VALUES (149, 26, '2025-08-24 20:18:11.549604', 3);
INSERT INTO public.favoritos VALUES (150, 18, '2025-10-19 12:30:47.662163', 5);
INSERT INTO public.favoritos VALUES (151, 48, '2025-11-03 09:09:18.44328', 9);
INSERT INTO public.favoritos VALUES (152, 8, '2024-07-14 11:23:05.899606', 9);
INSERT INTO public.favoritos VALUES (153, 35, '2025-01-30 16:46:29.816857', 2);
INSERT INTO public.favoritos VALUES (154, 53, '2024-04-01 10:13:25.842899', 8);
INSERT INTO public.favoritos VALUES (155, 52, '2024-01-17 16:20:29.807578', 4);
INSERT INTO public.favoritos VALUES (156, 22, '2025-08-03 23:32:08.244794', 3);
INSERT INTO public.favoritos VALUES (157, 8, '2024-10-30 05:01:05.048848', 10);
INSERT INTO public.favoritos VALUES (158, 53, '2024-01-10 04:54:47.133158', 9);
INSERT INTO public.favoritos VALUES (159, 38, '2024-01-30 05:11:43.380143', 4);
INSERT INTO public.favoritos VALUES (160, 29, '2024-03-26 05:55:37.648531', 7);
INSERT INTO public.favoritos VALUES (161, 4, '2024-08-17 02:10:30.022526', 6);
INSERT INTO public.favoritos VALUES (162, 41, '2024-11-30 19:36:28.320323', 10);
INSERT INTO public.favoritos VALUES (163, 19, '2024-12-29 08:29:23.459542', 2);
INSERT INTO public.favoritos VALUES (164, 20, '2024-05-09 17:33:39.524516', 6);
INSERT INTO public.favoritos VALUES (165, 46, '2024-08-14 12:29:44.954121', 4);
INSERT INTO public.favoritos VALUES (166, 5, '2025-06-28 19:23:44.279011', 3);
INSERT INTO public.favoritos VALUES (167, 41, '2024-06-25 18:08:17.394998', 7);
INSERT INTO public.favoritos VALUES (168, 37, '2024-01-24 14:20:49.421456', 2);
INSERT INTO public.favoritos VALUES (169, 28, '2026-01-17 07:33:08.629959', 7);
INSERT INTO public.favoritos VALUES (170, 44, '2024-08-06 07:01:10.385886', 2);
INSERT INTO public.favoritos VALUES (171, 38, '2025-09-20 20:00:46.501949', 6);
INSERT INTO public.favoritos VALUES (172, 49, '2025-03-01 16:29:32.818344', 9);
INSERT INTO public.favoritos VALUES (173, 39, '2024-03-21 00:02:42.938276', 1);
INSERT INTO public.favoritos VALUES (174, 2, '2026-04-29 17:14:07.736912', 9);
INSERT INTO public.favoritos VALUES (175, 52, '2025-06-30 12:00:50.024385', 7);
INSERT INTO public.favoritos VALUES (176, 21, '2024-11-08 16:16:19.615383', 3);
INSERT INTO public.favoritos VALUES (177, 33, '2025-02-24 21:43:30.425882', 1);
INSERT INTO public.favoritos VALUES (178, 17, '2024-01-18 12:31:26.415262', 3);
INSERT INTO public.favoritos VALUES (179, 39, '2024-05-21 19:40:43.7385', 10);
INSERT INTO public.favoritos VALUES (180, 47, '2025-03-17 17:48:12.589661', 7);
INSERT INTO public.favoritos VALUES (181, 31, '2025-11-06 20:37:21.719095', 3);
INSERT INTO public.favoritos VALUES (182, 44, '2026-02-10 10:54:30.203067', 10);
INSERT INTO public.favoritos VALUES (183, 13, '2024-12-05 01:51:11.234786', 5);
INSERT INTO public.favoritos VALUES (184, 32, '2024-08-02 23:09:48.769924', 4);
INSERT INTO public.favoritos VALUES (185, 15, '2024-12-12 20:53:03.833768', 7);
INSERT INTO public.favoritos VALUES (186, 50, '2025-12-06 19:49:20.865756', 4);
INSERT INTO public.favoritos VALUES (187, 5, '2024-01-29 22:32:47.533647', 10);
INSERT INTO public.favoritos VALUES (188, 7, '2024-12-04 14:13:29.116587', 5);
INSERT INTO public.favoritos VALUES (189, 17, '2026-02-25 08:56:25.04503', 4);
INSERT INTO public.favoritos VALUES (190, 43, '2025-10-20 02:19:45.262497', 10);
INSERT INTO public.favoritos VALUES (191, 51, '2024-04-10 11:09:27.763563', 9);
INSERT INTO public.favoritos VALUES (192, 41, '2024-08-03 05:36:35.533067', 5);
INSERT INTO public.favoritos VALUES (193, 19, '2024-02-28 10:25:30.169674', 5);
INSERT INTO public.favoritos VALUES (194, 50, '2025-12-04 11:37:10.401499', 7);
INSERT INTO public.favoritos VALUES (195, 37, '2025-07-27 02:44:49.897639', 3);
INSERT INTO public.favoritos VALUES (196, 22, '2024-02-22 11:09:54.555648', 5);
INSERT INTO public.favoritos VALUES (197, 3, '2026-04-14 06:48:14.471514', 3);
INSERT INTO public.favoritos VALUES (198, 37, '2025-11-07 13:34:47.772709', 6);
INSERT INTO public.favoritos VALUES (199, 42, '2024-07-09 21:42:47.617414', 5);
INSERT INTO public.favoritos VALUES (200, 12, '2025-11-20 17:52:17.467872', 6);
INSERT INTO public.favoritos VALUES (201, 20, '2024-05-28 22:23:41.688649', 1);
INSERT INTO public.favoritos VALUES (202, 9, '2025-08-14 07:22:22.748523', 7);
INSERT INTO public.favoritos VALUES (203, 6, '2024-10-30 19:20:58.626012', 10);
INSERT INTO public.favoritos VALUES (204, 7, '2026-06-06 11:36:24.202572', 9);
INSERT INTO public.favoritos VALUES (205, 17, '2024-02-07 21:00:07.161516', 10);
INSERT INTO public.favoritos VALUES (206, 37, '2025-11-29 10:12:00.091896', 9);
INSERT INTO public.favoritos VALUES (207, 22, '2024-10-10 10:56:13.394968', 10);
INSERT INTO public.favoritos VALUES (208, 46, '2025-03-21 12:51:55.337135', 1);
INSERT INTO public.favoritos VALUES (209, 46, '2024-02-14 13:28:12.999479', 6);
INSERT INTO public.favoritos VALUES (210, 54, '2025-12-26 02:47:55.546585', 1);
INSERT INTO public.favoritos VALUES (211, 8, '2026-04-05 02:30:21.134413', 7);
INSERT INTO public.favoritos VALUES (212, 15, '2024-06-15 03:36:10.109423', 2);
INSERT INTO public.favoritos VALUES (213, 32, '2024-12-24 11:14:22.725553', 2);
INSERT INTO public.favoritos VALUES (214, 35, '2026-06-06 20:55:16.400173', 3);
INSERT INTO public.favoritos VALUES (215, 14, '2025-04-21 06:49:17.845801', 8);
INSERT INTO public.favoritos VALUES (216, 15, '2024-09-30 11:05:15.447632', 10);
INSERT INTO public.favoritos VALUES (217, 50, '2025-05-08 03:52:30.396743', 2);
INSERT INTO public.favoritos VALUES (218, 39, '2025-12-28 12:19:54.324691', 6);
INSERT INTO public.favoritos VALUES (219, 2, '2025-06-07 11:02:35.838329', 6);
INSERT INTO public.favoritos VALUES (220, 43, '2025-11-17 11:32:50.102656', 7);
INSERT INTO public.favoritos VALUES (221, 13, '2025-03-23 05:06:29.521057', 2);
INSERT INTO public.favoritos VALUES (222, 50, '2025-04-23 01:55:58.202619', 1);
INSERT INTO public.favoritos VALUES (223, 8, '2024-07-05 08:46:57.586014', 5);
INSERT INTO public.favoritos VALUES (224, 20, '2024-01-20 05:32:52.047002', 3);
INSERT INTO public.favoritos VALUES (225, 37, '2025-06-02 16:39:24.083451', 7);
INSERT INTO public.favoritos VALUES (226, 52, '2024-11-14 17:08:49.409773', 10);
INSERT INTO public.favoritos VALUES (227, 35, '2026-04-13 00:34:00.45452', 7);
INSERT INTO public.favoritos VALUES (228, 36, '2024-12-19 21:30:04.593127', 10);
INSERT INTO public.favoritos VALUES (229, 2, '2026-02-09 11:55:51.632735', 7);
INSERT INTO public.favoritos VALUES (230, 33, '2024-07-11 21:09:50.77764', 10);
INSERT INTO public.favoritos VALUES (231, 11, '2026-05-19 20:50:55.485107', 4);
INSERT INTO public.favoritos VALUES (232, 27, '2025-11-28 03:48:14.58947', 9);
INSERT INTO public.favoritos VALUES (233, 22, '2026-02-01 04:56:02.193091', 8);
INSERT INTO public.favoritos VALUES (234, 37, '2024-01-18 00:20:30.28277', 1);
INSERT INTO public.favoritos VALUES (235, 30, '2026-03-11 03:18:23.58867', 8);
INSERT INTO public.favoritos VALUES (236, 30, '2025-06-19 11:04:17.143679', 7);
INSERT INTO public.favoritos VALUES (237, 51, '2024-10-18 11:23:53.187449', 2);
INSERT INTO public.favoritos VALUES (238, 2, '2025-01-10 08:31:31.734926', 10);
INSERT INTO public.favoritos VALUES (239, 17, '2026-05-12 19:27:29.23058', 1);
INSERT INTO public.favoritos VALUES (240, 25, '2025-09-23 02:12:57.808937', 6);
INSERT INTO public.favoritos VALUES (241, 2, '2025-03-13 06:21:29.634608', 5);
INSERT INTO public.favoritos VALUES (242, 45, '2025-07-25 06:21:30.054182', 5);
INSERT INTO public.favoritos VALUES (243, 25, '2026-03-04 18:28:20.945199', 5);
INSERT INTO public.favoritos VALUES (244, 24, '2025-10-09 01:19:17.226748', 10);
INSERT INTO public.favoritos VALUES (245, 45, '2025-09-14 11:54:20.373414', 8);
INSERT INTO public.favoritos VALUES (246, 32, '2026-02-28 02:14:22.245002', 8);
INSERT INTO public.favoritos VALUES (247, 11, '2026-04-24 11:43:56.927671', 3);
INSERT INTO public.favoritos VALUES (248, 51, '2025-02-06 13:52:11.461996', 4);
INSERT INTO public.favoritos VALUES (249, 52, '2025-06-04 05:31:15.88172', 2);
INSERT INTO public.favoritos VALUES (250, 12, '2026-05-17 15:40:27.837505', 2);


--
-- TOC entry 4996 (class 0 OID 16694)
-- Dependencies: 228
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.pedidos VALUES (1, '2026-06-01', 'Av. Corrientes 1234, CABA', 1, true, 'Tarjeta de Crédito');
INSERT INTO public.pedidos VALUES (2, '2026-06-02', 'San Martín 455, Córdoba', 2, true, 'Mercado Pago');
INSERT INTO public.pedidos VALUES (4, '2026-06-04', 'Mitre 234, Mendoza', 4, true, 'Efectivo');
INSERT INTO public.pedidos VALUES (5, '2026-06-05', 'Rivadavia 987, Paraná', 5, true, 'Débito');
INSERT INTO public.pedidos VALUES (7, '2026-06-07', 'España 654, Salta', 7, true, 'Mercado Pago');
INSERT INTO public.pedidos VALUES (9, '2026-06-09', 'Colón 876, Tucumán', 9, true, 'Débito');
INSERT INTO public.pedidos VALUES (10, '2026-06-10', '25 de Mayo 321, Trelew', 10, true, 'Efectivo');
INSERT INTO public.pedidos VALUES (12, '2026-06-12', 'Mitre 876, Córdoba', 2, true, 'Tarjeta de Crédito');
INSERT INTO public.pedidos VALUES (13, '2026-06-13', 'San Luis 789, Rosario', 3, true, 'Transferencia');
INSERT INTO public.pedidos VALUES (15, '2026-06-15', 'French 888, Paraná', 5, true, 'Mercado Pago');
INSERT INTO public.pedidos VALUES (16, '2026-06-16', 'Brown 999, Neuquén', 6, true, 'Tarjeta de Crédito');
INSERT INTO public.pedidos VALUES (18, '2026-06-18', 'Junín 654, Posadas', 8, true, 'Débito');
INSERT INTO public.pedidos VALUES (19, '2026-06-19', 'Libertad 777, Tucumán', 9, true, 'Mercado Pago');
INSERT INTO public.pedidos VALUES (21, '2026-06-21', 'Callao 852, CABA', 1, true, 'Efectivo');
INSERT INTO public.pedidos VALUES (22, '2026-06-22', 'Perú 369, Córdoba', 4, true, 'Mercado Pago');
INSERT INTO public.pedidos VALUES (24, '2026-06-24', 'Alem 951, Mendoza', 8, true, 'Tarjeta de Crédito');
INSERT INTO public.pedidos VALUES (3, '2026-06-03', 'Belgrano 888, Rosarioaaaaa', 3, false, 'Transferencia');
INSERT INTO public.pedidos VALUES (14, '2026-06-14', 'Moreno 432, Mendozaan', 4, false, 'Débito');
INSERT INTO public.pedidos VALUES (6, '2026-06-06', 'Sarmiento 999, Neuquén', 6, false, 'Tarjeta de Crédito');
INSERT INTO public.pedidos VALUES (8, '2026-06-08', 'Urquiza 123, Posadas', 8, true, 'Transferencia');
INSERT INTO public.pedidos VALUES (17, '2026-06-17', 'Buenos Aires 222, Salta', 7, false, 'Transferencia');
INSERT INTO public.pedidos VALUES (11, '2026-06-11', 'Lavalle 345, CABA', 1, false, 'Mercado Pago');
INSERT INTO public.pedidos VALUES (25, '2026-06-25', 'Pellegrini 753, Paranáaaa', 10, true, 'Débito');
INSERT INTO public.pedidos VALUES (23, '2026-06-23', 'Italia 159, Rosarioaaaa', 6, true, 'Transferencia');
INSERT INTO public.pedidos VALUES (20, '2026-06-20', 'Yrigoyen 147, Trelewwww', 10, true, 'Tarjeta de Crédito');
INSERT INTO public.pedidos VALUES (27, '2026-09-14', 'Yatay', 3, true, 'efectivo');
INSERT INTO public.pedidos VALUES (26, '2026-09-14', 'Yatay', 4, true, 'efectivo');
INSERT INTO public.pedidos VALUES (28, '2026-09-14', 'Corrientes 1234', 1, true, 'efectivo');
INSERT INTO public.pedidos VALUES (29, '2026-09-14', 'Yatay 999', 11, false, 'efectivo');


--
-- TOC entry 4998 (class 0 OID 16698)
-- Dependencies: 230
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.productos VALUES (16, 'Mouse Logitech G502', 89999.00, 44, 'imagenes/MouseLogitechG502.jpg', true, 4, false, 1, 'Gaming', '');
INSERT INTO public.productos VALUES (57, 'aaa', 1222.00, 12, '/uploads/elprincipito-1789388225111.jpg', true, 1, true, 1, 'aaa', 'remera');
INSERT INTO public.productos VALUES (55, 'remera linda', 12222.00, 12, '', true, 1, true, 1, 'remera', 'remera negra');
INSERT INTO public.productos VALUES (2, 'Samsung Galaxy S25', 1399999.00, 30, 'imagenes/SamsungGalaxyS25.jpg', true, 1, true, 1, 'Celular', '');
INSERT INTO public.productos VALUES (15, 'Alfombra Decorativa', 89999.00, 34, 'imagenes/AlfombraDecorativa.jpg', true, 3, false, 3, 'Decoración', '');
INSERT INTO public.productos VALUES (1, 'iPhone 15', 1599999.00, 28, 'imagenes/Iphone15.jpg', true, 1, true, 1, 'Celular', '');
INSERT INTO public.productos VALUES (4, 'Notebook Lenovo IdeaPad', 1199999.00, 18, 'imagenes/NotebookLenovoIdeapad.jpg', true, 1, false, 1, 'Notebook', '');
INSERT INTO public.productos VALUES (6, 'Remera Oversize Negra', 29999.00, 120, 'imagenes/RemeraOversizeNegra.jpg', true, 2, false, 2, 'Remera', '');
INSERT INTO public.productos VALUES (7, 'Jean Slim Fit', 69999.00, 65, 'imagenes/JeanSlimFit.jpg', true, 2, false, 2, 'Jean', '');
INSERT INTO public.productos VALUES (8, 'Campera Inflable', 159999.00, 28, 'imagenes/CamperaInflable.jpg', true, 2, false, 2, 'Campera', '');
INSERT INTO public.productos VALUES (9, 'Buzo Canguro', 55999.00, 55, 'imagenes/BuzoCanguro.jpg', true, 2, false, 2, 'Buzo', '');
INSERT INTO public.productos VALUES (10, 'Zapatillas Urban', 129999.00, 40, 'imagenes/ZapatillasUrban.jpg', true, 2, false, 2, 'Calzado', '');
INSERT INTO public.productos VALUES (13, 'Lámpara LED', 39999.00, 80, 'imagenes/LamparaLed.jpg', true, 3, false, 3, 'Iluminación', '');
INSERT INTO public.productos VALUES (14, 'Biblioteca Moderna', 249999.00, 10, 'imagenes/BibliotecaModerna.jpg', true, 3, false, 3, 'Mueble', '');
INSERT INTO public.productos VALUES (18, 'Monitor 27 165Hz', 699999.00, 14, 'imagenes/Monitor27165hz.jpg', true, 4, false, 1, 'Gaming', '');
INSERT INTO public.productos VALUES (3, 'MacBook Air M3', 2499999.00, 13, 'imagenes/MacbookAirM3.jpg', true, 1, false, 1, 'Notebook', '');
INSERT INTO public.productos VALUES (5, 'AirPods Pro', 499999.00, 46, 'imagenes/AirpodsPro.jpg', true, 1, false, 1, 'Auriculares', '');
INSERT INTO public.productos VALUES (11, 'Mesa de Comedor', 329999.00, 13, 'imagenes/MesaDeComedor.jpg', true, 3, false, 3, 'Mueble', '');
INSERT INTO public.productos VALUES (12, 'Silla Escandinava', 69999.00, 52, 'imagenes/SillaEscandinava.jpg', true, 3, false, 3, 'Mueble', '');
INSERT INTO public.productos VALUES (17, 'Teclado Mecánico Redragon', 129999.00, 36, 'imagenes/TecladoMecanicoRedragon.jpg', true, 4, false, 1, 'Gaming', '');
INSERT INTO public.productos VALUES (19, 'Silla Gamer RGB', 599999.00, 10, 'imagenes/SillaGamerRgb.jpg', true, 4, false, 1, 'Gaming', '');
INSERT INTO public.productos VALUES (20, 'Joystick Xbox', 189999.00, 38, 'imagenes/JoystickXbox.jpg', true, 4, false, 1, 'Gaming', '');
INSERT INTO public.productos VALUES (21, 'Pelota Adidas', 45999.00, 60, 'imagenes/PelotaAdidas.jpg', true, 5, false, 4, 'Fútbol', '');
INSERT INTO public.productos VALUES (22, 'Mancuernas 10kg', 84999.00, 34, 'imagenes/Mancuernas10kg.jpg', true, 5, false, 4, 'Fitness', '');
INSERT INTO public.productos VALUES (25, 'Bicicleta MTB Rodado 29', 1299999.00, 8, 'imagenes/BicicletaMtbRodado29.jpg', true, 5, false, 4, 'Ciclismo', '');
INSERT INTO public.productos VALUES (27, 'Base Líquida', 34999.00, 75, 'imagenes/BaseLiquida.jpg', true, 6, false, 5, 'Maquillaje', '');
INSERT INTO public.productos VALUES (29, 'Crema Facial', 42999.00, 62, 'imagenes/CremaFacial.jpg', true, 6, false, 5, 'Cuidado Facial', '');
INSERT INTO public.productos VALUES (30, 'Shampoo Profesional', 27999.00, 95, 'imagenes/ShampooProfesional.jpg', true, 6, false, 5, 'Cabello', '');
INSERT INTO public.productos VALUES (31, 'El Principito', 19999.00, 80, 'imagenes/ElPrincipito.jpg', true, 7, false, 6, 'Libro', '');
INSERT INTO public.productos VALUES (33, 'Cuaderno Universitario', 8999.00, 200, 'imagenes/CuadernoUniversitario.jpg', true, 7, false, 6, 'Librería', '');
INSERT INTO public.productos VALUES (34, 'Agenda 2026', 17999.00, 95, 'imagenes/Agenda2026.jpg', true, 7, false, 6, 'Papelería', '');
INSERT INTO public.productos VALUES (36, 'Cuadro Decorativo', 45999.00, 40, 'imagenes/CuadroDecorativo.jpg', true, 8, false, 3, 'Decoración', '');
INSERT INTO public.productos VALUES (37, 'Almohadón Nórdico', 22999.00, 90, 'imagenes/AlmohadonNordico.jpg', true, 8, false, 3, 'Decoración', '');
INSERT INTO public.productos VALUES (38, 'Espejo Redondo', 69999.00, 35, 'imagenes/EspejoRedondo.jpg', true, 8, false, 3, 'Decoración', '');
INSERT INTO public.productos VALUES (39, 'Reloj de Pared', 39999.00, 48, 'imagenes/RelojDePared.jpg', true, 8, false, 3, 'Decoración', '');
INSERT INTO public.productos VALUES (40, 'Florero Cerámica', 28999.00, 52, 'imagenes/FloreroCeramica.jpg', true, 8, false, 3, 'Decoración', '');
INSERT INTO public.productos VALUES (41, 'Alimento Balanceado Perro', 44999.00, 110, 'imagenes/AlimentoBalanceadoPerro.jpg', true, 9, false, 8, 'Mascotas', '');
INSERT INTO public.productos VALUES (42, 'Alimento Balanceado Gato', 41999.00, 95, 'imagenes/AlimentoBalanceadoGato.jpg', true, 9, false, 8, 'Mascotas', '');
INSERT INTO public.productos VALUES (43, 'Correa Premium', 19999.00, 80, 'imagenes/CorreaPremium.jpg', true, 9, false, 8, 'Accesorio', '');
INSERT INTO public.productos VALUES (44, 'Juguete Mordillo', 14999.00, 140, 'imagenes/JugueteMordillo.jpg', true, 9, false, 7, 'Juguete', '');
INSERT INTO public.productos VALUES (45, 'Cucha Mediana', 89999.00, 18, 'imagenes/CuchaMediana.jpg', true, 9, false, 8, 'Mascotas', '');
INSERT INTO public.productos VALUES (48, 'Cable USB-C', 9999.00, 180, 'imagenes/CableUsbC.jpg', true, 10, false, 1, 'Accesorio', '');
INSERT INTO public.productos VALUES (51, 'Collar Premium', 24999.00, 75, 'imagenes/CollarPremium.jpg', true, 9, false, 9, 'Accesorio', '');
INSERT INTO public.productos VALUES (52, 'Rascador para Gatos', 79999.00, 20, 'imagenes/RascadorParaGatos.jpg', true, 9, false, 9, 'Mascotas', '');
INSERT INTO public.productos VALUES (53, 'Mouse Pad XL RGB', 39999.00, 45, 'imagenes/MousePadXlRgb.jpg', true, 4, false, 17, 'Gaming', '');
INSERT INTO public.productos VALUES (54, 'Auriculares Gamer Pro', 159999.00, 18, 'imagenes/AuricularesGamerPro.jpg', true, 4, false, 17, 'Gaming', '');
INSERT INTO public.productos VALUES (24, 'Raqueta Tenis Wilson', 189999.00, 16, 'imagenes/RaquetaTenisWilson.jpg', true, 5, false, 4, 'Tenis', '');
INSERT INTO public.productos VALUES (23, 'Colchoneta Yoga', 39999.00, 71, 'imagenes/ColchonetaYoga.jpg', true, 5, false, 4, 'Fitness', '');
INSERT INTO public.productos VALUES (50, 'Smartwatch Fit Pro', 249999.00, 27, 'imagenes/SmartwatchFitPro.jpg', true, 10, false, 1, 'Wearable', '');
INSERT INTO public.productos VALUES (26, 'Perfume Importado', 189999.00, 29, 'imagenes/PerfumeImportado.jpg', true, 6, false, 5, 'Perfume', '');
INSERT INTO public.productos VALUES (28, 'Labial Mate', 19999.00, 122, 'imagenes/LabialMate.jpg', true, 6, false, 5, 'Maquillaje', '');
INSERT INTO public.productos VALUES (56, 'efer', 1243434.00, 3, '/uploads/1984-1789386823028-1789387651417-1789387875979.jpg', false, 1, true, 1, 'rewer', 'werwerr');
INSERT INTO public.productos VALUES (35, 'Lapicera Parker', 35999.00, 55, 'imagenes/LapiceraParker.jpg', true, 7, false, 6, 'Papelería', '');
INSERT INTO public.productos VALUES (32, '1984', 24999.00, 60, 'imagenes/1984.jpg', true, 7, false, 6, 'Libro', '');
INSERT INTO public.productos VALUES (58, 'Remera prueba', 12000.00, 12, '/uploads/avatar3-1789389113509.jpg', true, 1, false, 1, 'Remera', 'Remera negra');
INSERT INTO public.productos VALUES (49, 'Power Bank 20000mAh', 79999.00, 32, 'imagenes/PowerBank20000mah.jpg', true, 10, false, 1, 'Accesorio', '');
INSERT INTO public.productos VALUES (47, 'Cargador USB-C 45W', 34999.00, 92, 'imagenes/CargadorUsbC45w.jpg', true, 10, false, 1, 'Accesorio', '');
INSERT INTO public.productos VALUES (46, 'Funda iPhone 15', 14999.00, 150, 'imagenes/FundaIphone15.jpg', true, 10, false, 1, 'Accesorio', '');


--
-- TOC entry 5000 (class 0 OID 16704)
-- Dependencies: 232
-- Data for Name: productosxcategorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.productosxcategorias VALUES (1, 1, 1);
INSERT INTO public.productosxcategorias VALUES (2, 2, 1);
INSERT INTO public.productosxcategorias VALUES (3, 3, 1);
INSERT INTO public.productosxcategorias VALUES (4, 4, 1);
INSERT INTO public.productosxcategorias VALUES (5, 5, 1);
INSERT INTO public.productosxcategorias VALUES (6, 6, 2);
INSERT INTO public.productosxcategorias VALUES (7, 7, 2);
INSERT INTO public.productosxcategorias VALUES (8, 8, 2);
INSERT INTO public.productosxcategorias VALUES (9, 9, 2);
INSERT INTO public.productosxcategorias VALUES (10, 10, 2);
INSERT INTO public.productosxcategorias VALUES (11, 11, 3);
INSERT INTO public.productosxcategorias VALUES (12, 12, 3);
INSERT INTO public.productosxcategorias VALUES (13, 13, 3);
INSERT INTO public.productosxcategorias VALUES (14, 14, 3);
INSERT INTO public.productosxcategorias VALUES (15, 15, 3);
INSERT INTO public.productosxcategorias VALUES (16, 16, 1);
INSERT INTO public.productosxcategorias VALUES (17, 17, 1);
INSERT INTO public.productosxcategorias VALUES (18, 18, 1);
INSERT INTO public.productosxcategorias VALUES (19, 19, 1);
INSERT INTO public.productosxcategorias VALUES (20, 20, 1);
INSERT INTO public.productosxcategorias VALUES (21, 21, 4);
INSERT INTO public.productosxcategorias VALUES (22, 22, 4);
INSERT INTO public.productosxcategorias VALUES (23, 23, 4);
INSERT INTO public.productosxcategorias VALUES (24, 24, 4);
INSERT INTO public.productosxcategorias VALUES (25, 25, 4);
INSERT INTO public.productosxcategorias VALUES (26, 26, 5);
INSERT INTO public.productosxcategorias VALUES (27, 27, 5);
INSERT INTO public.productosxcategorias VALUES (28, 28, 5);
INSERT INTO public.productosxcategorias VALUES (29, 29, 5);
INSERT INTO public.productosxcategorias VALUES (30, 30, 5);
INSERT INTO public.productosxcategorias VALUES (31, 31, 6);
INSERT INTO public.productosxcategorias VALUES (32, 32, 6);
INSERT INTO public.productosxcategorias VALUES (33, 33, 6);
INSERT INTO public.productosxcategorias VALUES (34, 34, 6);
INSERT INTO public.productosxcategorias VALUES (35, 35, 6);
INSERT INTO public.productosxcategorias VALUES (36, 36, 3);
INSERT INTO public.productosxcategorias VALUES (37, 37, 3);
INSERT INTO public.productosxcategorias VALUES (38, 38, 3);
INSERT INTO public.productosxcategorias VALUES (39, 39, 3);
INSERT INTO public.productosxcategorias VALUES (40, 40, 3);
INSERT INTO public.productosxcategorias VALUES (41, 41, 8);
INSERT INTO public.productosxcategorias VALUES (42, 42, 8);
INSERT INTO public.productosxcategorias VALUES (43, 43, 8);
INSERT INTO public.productosxcategorias VALUES (44, 44, 7);
INSERT INTO public.productosxcategorias VALUES (45, 45, 8);
INSERT INTO public.productosxcategorias VALUES (46, 46, 1);
INSERT INTO public.productosxcategorias VALUES (47, 47, 1);
INSERT INTO public.productosxcategorias VALUES (48, 48, 1);
INSERT INTO public.productosxcategorias VALUES (49, 49, 1);
INSERT INTO public.productosxcategorias VALUES (50, 50, 1);
INSERT INTO public.productosxcategorias VALUES (51, 51, 9);
INSERT INTO public.productosxcategorias VALUES (52, 52, 9);
INSERT INTO public.productosxcategorias VALUES (53, 53, 17);
INSERT INTO public.productosxcategorias VALUES (54, 54, 17);


--
-- TOC entry 5002 (class 0 OID 16708)
-- Dependencies: 234
-- Data for Name: provincias; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.provincias VALUES (1, 'Buenos Aires');
INSERT INTO public.provincias VALUES (2, 'Córdoba');
INSERT INTO public.provincias VALUES (3, 'Santa Fe');
INSERT INTO public.provincias VALUES (4, 'Mendoza');
INSERT INTO public.provincias VALUES (5, 'Entre Ríos');
INSERT INTO public.provincias VALUES (6, 'Neuquén');
INSERT INTO public.provincias VALUES (7, 'Salta');
INSERT INTO public.provincias VALUES (8, 'Misiones');
INSERT INTO public.provincias VALUES (9, 'Tucumán');
INSERT INTO public.provincias VALUES (10, 'Chubut');


--
-- TOC entry 5004 (class 0 OID 16712)
-- Dependencies: 236
-- Data for Name: tiendas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tiendas VALUES (3, 'Casa Moderna', 'Todo para tu hogar', '3414000003', 'Belgrano 120', 3, 3, '#795548', '#FFFFFF', '#D7CCC8', 13, 4.6, 2017, false);
INSERT INTO public.tiendas VALUES (4, 'Gamer Zone', 'Gaming sin límites', '2614000004', 'Las Heras 222', 4, 4, '#00E676', '#000000', '#424242', 14, 4.9, 2019, false);
INSERT INTO public.tiendas VALUES (5, 'Sport Life', 'Viví el deporte', '3434000005', '25 de Mayo 800', 5, 5, '#1976D2', '#FFFFFF', '#F44336', 15, 4.5, 2016, false);
INSERT INTO public.tiendas VALUES (6, 'Beauty Market', 'Belleza para todos', '2994000006', 'Mitre 512', 6, 6, '#E91E63', '#FFFFFF', '#F8BBD0', 16, 4.3, 2021, false);
INSERT INTO public.tiendas VALUES (7, 'Librería Central', 'Un libro, una aventura', '3874000007', 'Rivadavia 700', 7, 7, '#3F51B5', '#FFFFFF', '#9FA8DA', 17, 4.7, 2015, false);
INSERT INTO public.tiendas VALUES (8, 'Deco Home', 'Decorá tus espacios', '3764000008', 'España 321', 8, 8, '#8D6E63', '#FFFFFF', '#BCAAA4', 18, 4.4, 2018, false);
INSERT INTO public.tiendas VALUES (9, 'Pet Shop Plus', 'Todo para tu mascota', '3814000009', 'Urquiza 111', 9, 9, '#4CAF50', '#FFFFFF', '#A5D6A7', 19, 4.8, 2022, false);
INSERT INTO public.tiendas VALUES (10, 'Mundo Celular', 'Conectados siempre', '2804000010', '9 de Julio 900', 10, 10, '#1565C0', '#FFFFFF', '#90CAF9', 20, 4.9, 2014, false);
INSERT INTO public.tiendas VALUES (1, 'Tech Store', 'Lo último en tecnología', '1140000001', 'Av. Corrientes 1234', 1, 1, '#0057FF', '#FFFFFF', '#222222', 11, 4.8, 2018, false);
INSERT INTO public.tiendas VALUES (2, 'Moda Express', 'Vestite con estilo', '3514000002', 'San Martín 456', 2, 2, '#FF0066', '#FFFFFF', '#000000', 12, 4.4, 2020, false);


--
-- TOC entry 5006 (class 0 OID 16719)
-- Dependencies: 238
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuarios VALUES (1, 'Lucas', 'Rodríguez', '111111111', 1, NULL);
INSERT INTO public.usuarios VALUES (2, 'Florencia', 'Fernández', '222222222', 2, NULL);
INSERT INTO public.usuarios VALUES (3, 'Martín', 'Paz', '333333333', 3, NULL);
INSERT INTO public.usuarios VALUES (4, 'Julieta', 'Moreno', '444444444', 4, NULL);
INSERT INTO public.usuarios VALUES (5, 'Franco', 'Castro', '555555555', 5, NULL);
INSERT INTO public.usuarios VALUES (6, 'Camila', 'Herrera', '666666666', 6, NULL);
INSERT INTO public.usuarios VALUES (7, 'Nahuel', 'Torres', '777777777', 7, NULL);
INSERT INTO public.usuarios VALUES (8, 'Agustina', 'Silva', '888888888', 8, NULL);
INSERT INTO public.usuarios VALUES (9, 'Tomás', 'Ramos', '999999999', 9, NULL);
INSERT INTO public.usuarios VALUES (10, 'Mora', 'Navarro', '101010101', 10, NULL);
INSERT INTO public.usuarios VALUES (11, 'Usuario Prueba', 'apellido prueba', '118888-8888', NULL, 'Yatay 999');


--
-- TOC entry 5013 (class 0 OID 16935)
-- Dependencies: 245
-- Data for Name: usuariosxtiendas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuariosxtiendas VALUES (1, 11, 1);


--
-- TOC entry 5008 (class 0 OID 16723)
-- Dependencies: 240
-- Data for Name: ventas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ventas VALUES (1, '2026-06-01 10:15:00', 1, 1, 1, 1, 1, 1599999.00, 1599999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (2, '2026-06-01 10:16:00', 5, 1, 1, 1, 2, 499999.00, 999998.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (3, '2026-06-01 10:17:00', 46, 10, 1, 1, 1, 14999.00, 14999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (4, '2026-06-02 15:30:00', 6, 2, 2, 2, 2, 29999.00, 59998.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (5, '2026-06-02 15:31:00', 10, 2, 2, 2, 1, 129999.00, 129999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (6, '2026-06-03 12:10:00', 3, 1, 3, 3, 1, 2499999.00, 2499999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (7, '2026-06-03 12:11:00', 5, 1, 3, 3, 1, 499999.00, 499999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (8, '2026-06-04 09:50:00', 18, 4, 4, 4, 1, 699999.00, 699999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (9, '2026-06-04 09:51:00', 20, 4, 4, 4, 1, 189999.00, 189999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (10, '2026-06-05 17:45:00', 21, 5, 5, 5, 2, 45999.00, 91998.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (11, '2026-06-05 17:46:00', 22, 5, 5, 5, 1, 84999.00, 84999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (12, '2026-06-06 11:05:00', 26, 6, 6, 6, 1, 189999.00, 189999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (13, '2026-06-06 11:06:00', 28, 6, 6, 6, 2, 19999.00, 39998.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (14, '2026-06-07 14:20:00', 31, 7, 7, 7, 1, 19999.00, 19999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (15, '2026-06-07 14:21:00', 33, 7, 7, 7, 3, 8999.00, 26997.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (16, '2026-06-08 18:10:00', 37, 8, 8, 8, 2, 22999.00, 45998.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (17, '2026-06-08 18:11:00', 38, 8, 8, 8, 1, 69999.00, 69999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (18, '2026-06-09 13:40:00', 41, 9, 9, 9, 2, 44999.00, 89998.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (19, '2026-06-09 13:41:00', 43, 9, 9, 9, 1, 19999.00, 19999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (20, '2026-06-10 16:55:00', 50, 10, 10, 10, 1, 249999.00, 249999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (21, '2026-06-10 16:56:00', 48, 10, 10, 10, 2, 9999.00, 19998.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (22, '2026-06-11 11:30:00', 2, 1, 1, 11, 1, 1399999.00, 1399999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (23, '2026-06-11 11:31:00', 47, 10, 1, 11, 1, 34999.00, 34999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (24, '2026-06-12 10:25:00', 12, 3, 2, 12, 1, 69999.00, 69999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (25, '2026-06-12 10:26:00', 13, 3, 2, 12, 2, 39999.00, 79998.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (26, '2026-06-13 15:00:00', 14, 3, 3, 13, 1, 249999.00, 249999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (27, '2026-06-13 15:01:00', 15, 3, 3, 13, 1, 89999.00, 89999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (28, '2026-06-14 09:40:00', 17, 4, 4, 14, 1, 129999.00, 129999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (29, '2026-06-14 09:41:00', 19, 4, 4, 14, 1, 599999.00, 599999.00, NULL, 'Completada');
INSERT INTO public.ventas VALUES (30, '2026-06-15 18:30:00', 25, 5, 5, 15, 1, 1299999.00, 1299999.00, NULL, 'Completada');


--
-- TOC entry 5010 (class 0 OID 16729)
-- Dependencies: 242
-- Data for Name: vistas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vistas VALUES (1, 47, '2024-02-26 17:19:59.66175', 2);
INSERT INTO public.vistas VALUES (2, 43, '2025-11-17 06:59:16.071898', 5);
INSERT INTO public.vistas VALUES (3, 16, '2025-08-16 22:35:42.997407', 8);
INSERT INTO public.vistas VALUES (4, 10, '2026-06-30 05:41:00.309023', 4);
INSERT INTO public.vistas VALUES (5, 31, '2025-07-08 04:31:29.445148', 6);
INSERT INTO public.vistas VALUES (6, 18, '2025-06-30 22:25:19.448282', 6);
INSERT INTO public.vistas VALUES (7, 6, '2025-05-09 11:02:24.138704', 8);
INSERT INTO public.vistas VALUES (8, 35, '2026-01-06 06:35:58.132151', 4);
INSERT INTO public.vistas VALUES (9, 4, '2026-01-09 06:31:43.150426', 2);
INSERT INTO public.vistas VALUES (10, 17, '2024-03-08 08:12:30.861766', 7);
INSERT INTO public.vistas VALUES (11, 21, '2024-07-10 17:58:32.0426', 5);
INSERT INTO public.vistas VALUES (12, 18, '2025-08-06 23:38:38.157518', 8);
INSERT INTO public.vistas VALUES (13, 39, '2025-02-16 06:57:11.407841', 4);
INSERT INTO public.vistas VALUES (14, 28, '2026-01-06 17:26:54.897982', 8);
INSERT INTO public.vistas VALUES (15, 30, '2026-01-07 17:52:24.979954', 3);
INSERT INTO public.vistas VALUES (16, 37, '2024-07-09 13:11:58.519688', 1);
INSERT INTO public.vistas VALUES (17, 22, '2024-12-04 05:54:13.452774', 4);
INSERT INTO public.vistas VALUES (18, 32, '2026-03-22 02:20:51.463997', 9);
INSERT INTO public.vistas VALUES (19, 43, '2024-08-18 19:43:09.976189', 9);
INSERT INTO public.vistas VALUES (20, 42, '2025-07-23 02:47:02.1913', 3);
INSERT INTO public.vistas VALUES (21, 24, '2024-07-28 10:07:42.238551', 2);
INSERT INTO public.vistas VALUES (22, 47, '2025-11-21 04:55:31.156189', 2);
INSERT INTO public.vistas VALUES (23, 26, '2024-09-10 19:16:01.883531', 4);
INSERT INTO public.vistas VALUES (24, 37, '2026-02-02 07:25:34.510845', 8);
INSERT INTO public.vistas VALUES (25, 27, '2026-03-10 12:04:04.542025', 4);
INSERT INTO public.vistas VALUES (26, 40, '2024-05-27 03:00:56.377028', 3);
INSERT INTO public.vistas VALUES (27, 49, '2024-12-31 04:16:34.090392', 9);
INSERT INTO public.vistas VALUES (28, 1, '2025-03-31 16:13:19.449239', 3);
INSERT INTO public.vistas VALUES (29, 20, '2025-11-16 00:39:12.469552', 1);
INSERT INTO public.vistas VALUES (30, 39, '2024-04-23 21:00:22.517522', 2);
INSERT INTO public.vistas VALUES (31, 1, '2025-03-13 03:08:34.508767', 9);
INSERT INTO public.vistas VALUES (32, 9, '2024-09-06 22:23:50.104568', 2);
INSERT INTO public.vistas VALUES (33, 48, '2025-01-08 05:03:17.039217', 5);
INSERT INTO public.vistas VALUES (34, 16, '2025-03-09 15:55:59.154374', 8);
INSERT INTO public.vistas VALUES (35, 31, '2025-10-22 21:39:25.115917', 9);
INSERT INTO public.vistas VALUES (36, 7, '2026-01-29 13:47:11.042345', 3);
INSERT INTO public.vistas VALUES (37, 48, '2025-08-23 10:01:59.550889', 10);
INSERT INTO public.vistas VALUES (38, 26, '2025-01-16 11:18:18.19853', 2);
INSERT INTO public.vistas VALUES (39, 12, '2024-05-30 01:25:18.195804', 7);
INSERT INTO public.vistas VALUES (40, 17, '2024-12-21 07:45:03.190691', 1);
INSERT INTO public.vistas VALUES (41, 38, '2025-07-03 02:52:44.681039', 1);
INSERT INTO public.vistas VALUES (42, 42, '2026-03-16 04:57:32.999006', 4);
INSERT INTO public.vistas VALUES (43, 1, '2024-06-16 16:18:11.059884', 7);
INSERT INTO public.vistas VALUES (44, 40, '2025-02-20 06:11:40.46327', 7);
INSERT INTO public.vistas VALUES (45, 17, '2025-09-12 23:05:33.430177', 7);
INSERT INTO public.vistas VALUES (46, 29, '2026-05-01 14:42:12.511079', 8);
INSERT INTO public.vistas VALUES (47, 12, '2024-08-24 03:49:55.844695', 5);
INSERT INTO public.vistas VALUES (48, 39, '2025-03-13 13:19:49.821714', 8);
INSERT INTO public.vistas VALUES (49, 39, '2025-07-06 11:16:58.268341', 10);
INSERT INTO public.vistas VALUES (50, 26, '2024-10-06 02:08:58.171266', 8);
INSERT INTO public.vistas VALUES (51, 41, '2024-02-19 05:32:09.796324', 8);
INSERT INTO public.vistas VALUES (52, 4, '2024-01-13 11:56:36.994232', 4);
INSERT INTO public.vistas VALUES (53, 38, '2024-03-02 17:39:57.097123', 3);
INSERT INTO public.vistas VALUES (54, 14, '2026-01-31 20:47:47.321444', 9);
INSERT INTO public.vistas VALUES (55, 26, '2024-11-23 22:47:07.469532', 8);
INSERT INTO public.vistas VALUES (56, 35, '2024-04-15 23:13:42.918273', 2);
INSERT INTO public.vistas VALUES (57, 15, '2025-11-16 12:40:45.280944', 10);
INSERT INTO public.vistas VALUES (58, 1, '2024-07-29 13:52:57.177368', 4);
INSERT INTO public.vistas VALUES (59, 10, '2024-05-25 23:11:10.249362', 4);
INSERT INTO public.vistas VALUES (60, 5, '2024-04-03 15:31:21.22125', 8);
INSERT INTO public.vistas VALUES (61, 43, '2025-10-29 23:53:16.855382', 9);
INSERT INTO public.vistas VALUES (62, 36, '2024-10-24 17:49:34.851614', 3);
INSERT INTO public.vistas VALUES (63, 22, '2026-06-25 05:53:18.003947', 9);
INSERT INTO public.vistas VALUES (64, 17, '2026-04-08 18:44:54.89485', 2);
INSERT INTO public.vistas VALUES (65, 46, '2026-06-23 04:15:54.268471', 10);
INSERT INTO public.vistas VALUES (66, 19, '2025-10-03 08:19:03.097307', 6);
INSERT INTO public.vistas VALUES (67, 8, '2025-04-24 03:46:14.379872', 5);
INSERT INTO public.vistas VALUES (68, 40, '2025-10-28 16:26:54.659342', 4);
INSERT INTO public.vistas VALUES (69, 37, '2026-05-31 12:27:33.832178', 7);
INSERT INTO public.vistas VALUES (70, 36, '2025-06-16 22:51:51.251879', 3);
INSERT INTO public.vistas VALUES (71, 21, '2025-11-26 02:17:57.187911', 6);
INSERT INTO public.vistas VALUES (72, 45, '2026-02-04 20:10:06.859314', 5);
INSERT INTO public.vistas VALUES (73, 27, '2025-08-04 06:39:42.983955', 3);
INSERT INTO public.vistas VALUES (74, 11, '2024-06-14 00:43:04.275657', 10);
INSERT INTO public.vistas VALUES (75, 15, '2025-07-04 11:19:41.524318', 6);
INSERT INTO public.vistas VALUES (76, 6, '2025-10-16 01:00:26.645002', 10);
INSERT INTO public.vistas VALUES (77, 21, '2026-02-17 14:17:14.15333', 6);
INSERT INTO public.vistas VALUES (78, 9, '2025-03-02 05:26:35.097994', 2);
INSERT INTO public.vistas VALUES (79, 37, '2024-03-03 23:36:21.760008', 8);
INSERT INTO public.vistas VALUES (80, 23, '2024-11-18 18:05:45.968222', 7);
INSERT INTO public.vistas VALUES (81, 45, '2025-01-26 06:21:25.233293', 2);
INSERT INTO public.vistas VALUES (82, 35, '2025-05-25 16:04:11.533843', 6);
INSERT INTO public.vistas VALUES (83, 26, '2025-09-25 17:20:23.836211', 9);
INSERT INTO public.vistas VALUES (84, 12, '2026-04-29 23:47:16.649286', 4);
INSERT INTO public.vistas VALUES (85, 13, '2024-02-25 05:31:59.696725', 10);
INSERT INTO public.vistas VALUES (86, 20, '2024-01-09 06:21:15.37809', 1);
INSERT INTO public.vistas VALUES (87, 24, '2025-05-11 13:49:20.260945', 3);
INSERT INTO public.vistas VALUES (88, 25, '2024-07-19 11:49:37.008503', 4);
INSERT INTO public.vistas VALUES (89, 48, '2025-09-23 04:50:09.453111', 3);
INSERT INTO public.vistas VALUES (90, 23, '2026-05-02 09:36:48.637955', 8);
INSERT INTO public.vistas VALUES (91, 14, '2025-04-16 23:14:34.397451', 8);
INSERT INTO public.vistas VALUES (92, 37, '2024-08-21 02:42:58.334485', 4);
INSERT INTO public.vistas VALUES (93, 34, '2025-08-20 16:54:51.274969', 2);
INSERT INTO public.vistas VALUES (94, 44, '2024-10-12 22:24:46.009577', 10);
INSERT INTO public.vistas VALUES (95, 19, '2024-10-18 20:11:34.493276', 8);
INSERT INTO public.vistas VALUES (96, 38, '2025-01-02 04:18:20.381195', 9);
INSERT INTO public.vistas VALUES (97, 5, '2025-04-18 05:46:23.758624', 4);
INSERT INTO public.vistas VALUES (98, 17, '2025-02-06 23:28:39.475765', 6);
INSERT INTO public.vistas VALUES (99, 22, '2024-06-04 21:28:58.173964', 9);
INSERT INTO public.vistas VALUES (100, 10, '2024-04-16 13:17:17.844736', 1);
INSERT INTO public.vistas VALUES (101, 1, '2024-03-14 14:11:50.789538', 4);
INSERT INTO public.vistas VALUES (102, 22, '2025-06-09 18:34:45.435112', 3);
INSERT INTO public.vistas VALUES (103, 15, '2025-10-16 20:47:14.861568', 1);
INSERT INTO public.vistas VALUES (104, 48, '2026-03-16 03:15:15.804381', 9);
INSERT INTO public.vistas VALUES (105, 10, '2024-08-28 23:07:26.113502', 4);
INSERT INTO public.vistas VALUES (106, 34, '2025-04-04 01:46:49.912402', 6);
INSERT INTO public.vistas VALUES (107, 2, '2024-03-16 17:58:50.147107', 2);
INSERT INTO public.vistas VALUES (108, 27, '2024-06-24 04:12:12.449567', 9);
INSERT INTO public.vistas VALUES (109, 19, '2024-08-10 08:32:50.63898', 10);
INSERT INTO public.vistas VALUES (110, 12, '2025-01-17 03:35:21.282054', 7);
INSERT INTO public.vistas VALUES (111, 48, '2025-12-15 01:16:32.190177', 9);
INSERT INTO public.vistas VALUES (112, 21, '2024-10-25 18:06:37.667923', 4);
INSERT INTO public.vistas VALUES (113, 29, '2024-11-22 18:59:22.199202', 9);
INSERT INTO public.vistas VALUES (114, 14, '2025-05-15 20:48:10.348188', 9);
INSERT INTO public.vistas VALUES (115, 21, '2024-07-15 05:27:39.879121', 1);
INSERT INTO public.vistas VALUES (116, 32, '2025-03-01 17:41:33.841144', 5);
INSERT INTO public.vistas VALUES (117, 8, '2026-05-12 05:04:58.118216', 5);
INSERT INTO public.vistas VALUES (118, 10, '2026-01-07 08:59:52.446289', 3);
INSERT INTO public.vistas VALUES (119, 12, '2024-06-10 17:55:56.081112', 4);
INSERT INTO public.vistas VALUES (120, 13, '2024-08-07 02:52:01.047375', 9);
INSERT INTO public.vistas VALUES (121, 4, '2024-05-21 06:37:42.964086', 5);
INSERT INTO public.vistas VALUES (122, 3, '2024-08-14 01:54:47.917899', 8);
INSERT INTO public.vistas VALUES (123, 31, '2025-01-12 07:56:29.109562', 3);
INSERT INTO public.vistas VALUES (124, 40, '2024-03-02 09:38:57.27752', 7);
INSERT INTO public.vistas VALUES (125, 47, '2024-12-31 00:04:43.344257', 9);
INSERT INTO public.vistas VALUES (126, 30, '2025-07-16 16:24:46.00891', 6);
INSERT INTO public.vistas VALUES (127, 35, '2024-05-15 10:03:11.066813', 8);
INSERT INTO public.vistas VALUES (128, 31, '2025-08-05 14:15:59.137519', 10);
INSERT INTO public.vistas VALUES (129, 24, '2026-02-05 02:28:38.715328', 1);
INSERT INTO public.vistas VALUES (130, 42, '2025-01-30 07:21:32.246622', 1);
INSERT INTO public.vistas VALUES (131, 33, '2025-04-05 19:12:38.274182', 1);
INSERT INTO public.vistas VALUES (132, 5, '2025-05-28 14:04:27.290223', 7);
INSERT INTO public.vistas VALUES (133, 15, '2025-05-03 14:49:47.854533', 10);
INSERT INTO public.vistas VALUES (134, 26, '2025-09-02 17:20:20.531586', 9);
INSERT INTO public.vistas VALUES (135, 22, '2025-12-21 23:41:51.877449', 9);
INSERT INTO public.vistas VALUES (136, 11, '2024-03-09 23:26:15.951035', 10);
INSERT INTO public.vistas VALUES (137, 39, '2025-09-26 10:21:19.370813', 8);
INSERT INTO public.vistas VALUES (138, 49, '2025-08-13 05:42:56.247145', 3);
INSERT INTO public.vistas VALUES (139, 43, '2024-12-13 04:07:52.001749', 2);
INSERT INTO public.vistas VALUES (140, 30, '2024-07-17 16:18:51.901278', 4);
INSERT INTO public.vistas VALUES (141, 15, '2025-08-21 21:28:44.385874', 2);
INSERT INTO public.vistas VALUES (142, 47, '2024-08-28 05:12:02.368112', 7);
INSERT INTO public.vistas VALUES (143, 48, '2025-11-13 18:19:07.542557', 4);
INSERT INTO public.vistas VALUES (144, 4, '2025-03-31 08:20:42.458628', 10);
INSERT INTO public.vistas VALUES (145, 31, '2026-05-24 15:58:41.853314', 3);
INSERT INTO public.vistas VALUES (146, 41, '2025-02-28 22:21:24.70141', 9);
INSERT INTO public.vistas VALUES (147, 37, '2026-02-17 07:57:00.646434', 10);
INSERT INTO public.vistas VALUES (148, 20, '2026-04-25 03:50:17.079626', 5);
INSERT INTO public.vistas VALUES (149, 41, '2024-12-24 14:21:04.905909', 10);
INSERT INTO public.vistas VALUES (150, 38, '2024-07-14 02:25:04.627885', 9);
INSERT INTO public.vistas VALUES (151, 33, '2025-06-16 18:58:04.935102', 6);
INSERT INTO public.vistas VALUES (152, 19, '2024-07-02 02:36:23.047751', 7);
INSERT INTO public.vistas VALUES (153, 33, '2025-09-22 18:34:19.386305', 3);
INSERT INTO public.vistas VALUES (154, 50, '2024-08-18 06:08:03.401672', 5);
INSERT INTO public.vistas VALUES (155, 2, '2025-12-16 04:21:20.407233', 10);
INSERT INTO public.vistas VALUES (156, 34, '2025-11-07 20:26:54.975924', 1);
INSERT INTO public.vistas VALUES (157, 5, '2025-03-21 05:43:17.232694', 6);
INSERT INTO public.vistas VALUES (158, 22, '2025-12-19 18:16:23.842915', 5);
INSERT INTO public.vistas VALUES (159, 21, '2025-10-27 00:51:17.726662', 7);
INSERT INTO public.vistas VALUES (160, 43, '2024-11-03 00:49:38.149597', 5);
INSERT INTO public.vistas VALUES (161, 20, '2024-02-05 18:26:25.87603', 4);
INSERT INTO public.vistas VALUES (162, 45, '2025-06-01 12:53:14.148742', 3);
INSERT INTO public.vistas VALUES (163, 50, '2026-02-16 06:41:42.265512', 7);
INSERT INTO public.vistas VALUES (164, 46, '2024-02-18 12:01:35.162961', 9);
INSERT INTO public.vistas VALUES (165, 18, '2025-01-27 16:16:55.246477', 1);
INSERT INTO public.vistas VALUES (166, 8, '2024-04-29 23:51:48.245062', 7);
INSERT INTO public.vistas VALUES (167, 26, '2024-01-05 03:59:03.412842', 2);
INSERT INTO public.vistas VALUES (168, 47, '2026-06-18 18:53:51.366347', 4);
INSERT INTO public.vistas VALUES (169, 17, '2025-03-16 23:36:01.620504', 4);
INSERT INTO public.vistas VALUES (170, 50, '2024-11-20 02:44:58.201053', 8);
INSERT INTO public.vistas VALUES (171, 10, '2024-04-17 19:42:21.598696', 8);
INSERT INTO public.vistas VALUES (172, 2, '2024-11-07 15:32:11.840203', 6);
INSERT INTO public.vistas VALUES (173, 14, '2025-05-17 01:20:53.372541', 6);
INSERT INTO public.vistas VALUES (174, 48, '2024-12-29 01:48:49.712502', 1);
INSERT INTO public.vistas VALUES (175, 45, '2025-01-16 00:21:32.354699', 4);
INSERT INTO public.vistas VALUES (176, 15, '2026-05-22 18:57:07.859543', 7);
INSERT INTO public.vistas VALUES (177, 31, '2025-02-20 16:33:51.471106', 4);
INSERT INTO public.vistas VALUES (178, 38, '2024-10-25 17:54:10.971203', 2);
INSERT INTO public.vistas VALUES (179, 19, '2024-10-07 03:34:19.860432', 9);
INSERT INTO public.vistas VALUES (180, 18, '2025-02-11 05:20:05.427559', 9);
INSERT INTO public.vistas VALUES (181, 34, '2025-07-16 09:33:10.26501', 6);
INSERT INTO public.vistas VALUES (182, 19, '2024-12-25 11:45:07.337711', 1);
INSERT INTO public.vistas VALUES (183, 31, '2024-12-06 23:18:17.610676', 8);
INSERT INTO public.vistas VALUES (184, 50, '2024-04-14 10:14:49.104856', 4);
INSERT INTO public.vistas VALUES (185, 4, '2024-11-22 03:18:02.449377', 3);
INSERT INTO public.vistas VALUES (186, 37, '2025-06-28 22:52:13.216068', 9);
INSERT INTO public.vistas VALUES (187, 19, '2024-02-06 02:26:45.062972', 1);
INSERT INTO public.vistas VALUES (188, 30, '2025-02-15 16:33:54.810877', 6);
INSERT INTO public.vistas VALUES (189, 39, '2026-03-07 22:42:21.218155', 10);
INSERT INTO public.vistas VALUES (190, 39, '2024-07-28 18:10:49.332569', 2);
INSERT INTO public.vistas VALUES (191, 44, '2026-03-19 12:00:37.893442', 4);
INSERT INTO public.vistas VALUES (192, 48, '2026-03-04 04:32:15.760978', 4);
INSERT INTO public.vistas VALUES (193, 49, '2026-06-30 00:42:12.732735', 10);
INSERT INTO public.vistas VALUES (194, 16, '2024-06-12 07:22:00.559988', 8);
INSERT INTO public.vistas VALUES (195, 40, '2024-04-17 14:57:45.183109', 5);
INSERT INTO public.vistas VALUES (196, 38, '2026-01-25 08:37:08.446522', 10);
INSERT INTO public.vistas VALUES (197, 29, '2024-06-04 05:06:16.5104', 3);
INSERT INTO public.vistas VALUES (198, 37, '2024-12-29 13:28:51.039746', 1);
INSERT INTO public.vistas VALUES (199, 41, '2026-06-20 14:37:51.811131', 5);
INSERT INTO public.vistas VALUES (200, 42, '2026-03-01 17:05:01.862629', 3);


--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 217
-- Name: categorias_id_categoria_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_categoria_seq', 17, true);


--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 219
-- Name: cuentas_id_cuenta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cuentas_id_cuenta_seq', 20, true);


--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 221
-- Name: detallepedidos_id_detallepedido_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detallepedidos_id_detallepedido_seq', 72, true);


--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 223
-- Name: duenios_id_duenio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.duenios_id_duenio_seq', 10, true);


--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 225
-- Name: etiquetas_id_etiqueta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.etiquetas_id_etiqueta_seq', 58, true);


--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 227
-- Name: favoritos_id_favorito_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favoritos_id_favorito_seq', 250, true);


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 229
-- Name: pedidos_id_pedido_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedidos_id_pedido_seq', 29, true);


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 231
-- Name: productos_id_producto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_id_producto_seq', 58, true);


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 233
-- Name: productosxcategorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productosxcategorias_id_seq', 54, true);


--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 235
-- Name: provincias_id_provincia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.provincias_id_provincia_seq', 10, true);


--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 237
-- Name: tiendas_id_tienda_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tiendas_id_tienda_seq', 10, true);


--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 239
-- Name: usuarios_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_usuario_seq', 11, true);


--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 244
-- Name: usuariosxtiendas_id_usuariotienda_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuariosxtiendas_id_usuariotienda_seq', 1, true);


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 241
-- Name: ventas_id_venta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ventas_id_venta_seq', 30, true);


--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 243
-- Name: vistas_id_vista_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vistas_id_vista_seq', 200, true);


--
-- TOC entry 4769 (class 2606 OID 16749)
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id_categoria);


--
-- TOC entry 4771 (class 2606 OID 16751)
-- Name: cuentas cuentas_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas
    ADD CONSTRAINT cuentas_email_key UNIQUE (email);


--
-- TOC entry 4773 (class 2606 OID 16753)
-- Name: cuentas cuentas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuentas
    ADD CONSTRAINT cuentas_pkey PRIMARY KEY (id_cuenta);


--
-- TOC entry 4775 (class 2606 OID 16755)
-- Name: detallepedidos detallepedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos
    ADD CONSTRAINT detallepedidos_pkey PRIMARY KEY (id_detallepedido);


--
-- TOC entry 4778 (class 2606 OID 16757)
-- Name: duenios duenios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.duenios
    ADD CONSTRAINT duenios_pkey PRIMARY KEY (id_duenio);


--
-- TOC entry 4780 (class 2606 OID 16759)
-- Name: etiquetas etiquetas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etiquetas
    ADD CONSTRAINT etiquetas_pkey PRIMARY KEY (id_etiqueta);


--
-- TOC entry 4783 (class 2606 OID 16761)
-- Name: favoritos favoritos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_pkey PRIMARY KEY (id_favorito);


--
-- TOC entry 4788 (class 2606 OID 16763)
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (id_pedido);


--
-- TOC entry 4791 (class 2606 OID 16765)
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id_producto);


--
-- TOC entry 4793 (class 2606 OID 16767)
-- Name: productosxcategorias productosxcategorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productosxcategorias
    ADD CONSTRAINT productosxcategorias_pkey PRIMARY KEY (id);


--
-- TOC entry 4795 (class 2606 OID 16769)
-- Name: provincias provincias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincias
    ADD CONSTRAINT provincias_pkey PRIMARY KEY (id_provincia);


--
-- TOC entry 4798 (class 2606 OID 16771)
-- Name: tiendas tiendas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas
    ADD CONSTRAINT tiendas_pkey PRIMARY KEY (id_tienda);


--
-- TOC entry 4785 (class 2606 OID 16773)
-- Name: favoritos uq_favoritos_producto_usuario; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT uq_favoritos_producto_usuario UNIQUE (id_producto, id_usuario);


--
-- TOC entry 4800 (class 2606 OID 16775)
-- Name: tiendas uq_tienda_cuenta; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas
    ADD CONSTRAINT uq_tienda_cuenta UNIQUE (id_cuenta);


--
-- TOC entry 4802 (class 2606 OID 16777)
-- Name: usuarios uq_usuario_cuenta; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT uq_usuario_cuenta UNIQUE (id_cuenta);


--
-- TOC entry 4816 (class 2606 OID 16942)
-- Name: usuariosxtiendas uq_usuario_tienda; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuariosxtiendas
    ADD CONSTRAINT uq_usuario_tienda UNIQUE (id_usuario, id_tienda);


--
-- TOC entry 4804 (class 2606 OID 16779)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4818 (class 2606 OID 16940)
-- Name: usuariosxtiendas usuariosxtiendas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuariosxtiendas
    ADD CONSTRAINT usuariosxtiendas_pkey PRIMARY KEY (id_usuariotienda);


--
-- TOC entry 4810 (class 2606 OID 16781)
-- Name: ventas ventas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_pkey PRIMARY KEY (id_venta);


--
-- TOC entry 4812 (class 2606 OID 16783)
-- Name: vistas vistas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vistas
    ADD CONSTRAINT vistas_pkey PRIMARY KEY (id_vista);


--
-- TOC entry 4776 (class 1259 OID 16784)
-- Name: idx_detallepedidos_pedido; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_detallepedidos_pedido ON public.detallepedidos USING btree (id_pedido);


--
-- TOC entry 4781 (class 1259 OID 16785)
-- Name: idx_etiquetas_producto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_etiquetas_producto ON public.etiquetas USING btree (id_producto);


--
-- TOC entry 4786 (class 1259 OID 16786)
-- Name: idx_pedidos_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pedidos_usuario ON public.pedidos USING btree (id_usuario);


--
-- TOC entry 4789 (class 1259 OID 16787)
-- Name: idx_productos_tienda; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_productos_tienda ON public.productos USING btree (id_tienda);


--
-- TOC entry 4796 (class 1259 OID 16788)
-- Name: idx_tiendas_provincia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tiendas_provincia ON public.tiendas USING btree (id_provincia);


--
-- TOC entry 4813 (class 1259 OID 16954)
-- Name: idx_uxt_tienda; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_uxt_tienda ON public.usuariosxtiendas USING btree (id_tienda);


--
-- TOC entry 4814 (class 1259 OID 16953)
-- Name: idx_uxt_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_uxt_usuario ON public.usuariosxtiendas USING btree (id_usuario);


--
-- TOC entry 4805 (class 1259 OID 16789)
-- Name: idx_ventas_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ventas_fecha ON public.ventas USING btree (fecha);


--
-- TOC entry 4806 (class 1259 OID 16790)
-- Name: idx_ventas_producto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ventas_producto ON public.ventas USING btree (id_producto);


--
-- TOC entry 4807 (class 1259 OID 16791)
-- Name: idx_ventas_tienda; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ventas_tienda ON public.ventas USING btree (id_tienda);


--
-- TOC entry 4808 (class 1259 OID 16792)
-- Name: idx_ventas_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ventas_usuario ON public.ventas USING btree (id_usuario);


--
-- TOC entry 4820 (class 2606 OID 16793)
-- Name: detallepedidos detallepedidos_id_pedido_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos
    ADD CONSTRAINT detallepedidos_id_pedido_fkey FOREIGN KEY (id_pedido) REFERENCES public.pedidos(id_pedido);


--
-- TOC entry 4821 (class 2606 OID 16798)
-- Name: detallepedidos detallepedidos_id_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detallepedidos
    ADD CONSTRAINT detallepedidos_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto);


--
-- TOC entry 4819 (class 2606 OID 16803)
-- Name: categorias fk_categorias_tiendas; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT fk_categorias_tiendas FOREIGN KEY (id_tienda) REFERENCES public.tiendas(id_tienda);


--
-- TOC entry 4822 (class 2606 OID 16808)
-- Name: etiquetas fk_etiquetas_producto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etiquetas
    ADD CONSTRAINT fk_etiquetas_producto FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto) ON DELETE CASCADE;


--
-- TOC entry 4823 (class 2606 OID 16813)
-- Name: favoritos fk_favoritos_producto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT fk_favoritos_producto FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto) ON DELETE CASCADE;


--
-- TOC entry 4824 (class 2606 OID 16818)
-- Name: favoritos fk_favoritos_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT fk_favoritos_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 4829 (class 2606 OID 16823)
-- Name: tiendas fk_tienda_cuenta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas
    ADD CONSTRAINT fk_tienda_cuenta FOREIGN KEY (id_cuenta) REFERENCES public.cuentas(id_cuenta) ON DELETE CASCADE;


--
-- TOC entry 4832 (class 2606 OID 16828)
-- Name: usuarios fk_usuario_cuenta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT fk_usuario_cuenta FOREIGN KEY (id_cuenta) REFERENCES public.cuentas(id_cuenta) ON DELETE CASCADE;


--
-- TOC entry 4839 (class 2606 OID 16948)
-- Name: usuariosxtiendas fk_uxt_tienda; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuariosxtiendas
    ADD CONSTRAINT fk_uxt_tienda FOREIGN KEY (id_tienda) REFERENCES public.tiendas(id_tienda) ON DELETE CASCADE;


--
-- TOC entry 4840 (class 2606 OID 16943)
-- Name: usuariosxtiendas fk_uxt_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuariosxtiendas
    ADD CONSTRAINT fk_uxt_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4833 (class 2606 OID 16833)
-- Name: ventas fk_venta_pedido; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT fk_venta_pedido FOREIGN KEY (id_pedido) REFERENCES public.pedidos(id_pedido);


--
-- TOC entry 4834 (class 2606 OID 16838)
-- Name: ventas fk_venta_producto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT fk_venta_producto FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto);


--
-- TOC entry 4835 (class 2606 OID 16843)
-- Name: ventas fk_venta_tienda; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT fk_venta_tienda FOREIGN KEY (id_tienda) REFERENCES public.tiendas(id_tienda);


--
-- TOC entry 4836 (class 2606 OID 16848)
-- Name: ventas fk_venta_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT fk_venta_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 4837 (class 2606 OID 16853)
-- Name: vistas fk_vistas_producto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vistas
    ADD CONSTRAINT fk_vistas_producto FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto) ON DELETE CASCADE;


--
-- TOC entry 4838 (class 2606 OID 16858)
-- Name: vistas fk_vistas_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vistas
    ADD CONSTRAINT fk_vistas_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 4825 (class 2606 OID 16863)
-- Name: pedidos pedidos_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario);


--
-- TOC entry 4826 (class 2606 OID 16868)
-- Name: productos productos_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias(id_categoria) ON DELETE SET NULL;


--
-- TOC entry 4827 (class 2606 OID 16873)
-- Name: productosxcategorias productosxcategorias_id_categoria_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productosxcategorias
    ADD CONSTRAINT productosxcategorias_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES public.categorias(id_categoria);


--
-- TOC entry 4828 (class 2606 OID 16878)
-- Name: productosxcategorias productosxcategorias_id_producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productosxcategorias
    ADD CONSTRAINT productosxcategorias_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.productos(id_producto);


--
-- TOC entry 4830 (class 2606 OID 16883)
-- Name: tiendas tiendas_id_duenio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas
    ADD CONSTRAINT tiendas_id_duenio_fkey FOREIGN KEY (id_duenio) REFERENCES public.duenios(id_duenio);


--
-- TOC entry 4831 (class 2606 OID 16888)
-- Name: tiendas tiendas_id_provincia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiendas
    ADD CONSTRAINT tiendas_id_provincia_fkey FOREIGN KEY (id_provincia) REFERENCES public.provincias(id_provincia);


-- Completed on 2026-09-14 10:19:56

--
-- PostgreSQL database dump complete
--

