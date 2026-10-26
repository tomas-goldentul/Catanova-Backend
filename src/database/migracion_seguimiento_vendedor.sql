-- Fecha estimada de entrega (la acuerda el vendedor; también sirve para retiro en el local).
ALTER TABLE public.pedidos
    ADD COLUMN IF NOT EXISTS fecha_entrega_estimada date NULL;

-- Notas e incidencias que carga la tienda sobre un pedido.
CREATE TABLE IF NOT EXISTS public.pedido_notas (
    id_nota SERIAL PRIMARY KEY,
    id_pedido integer NOT NULL REFERENCES public.pedidos(id_pedido) ON DELETE CASCADE,
    id_tienda integer NOT NULL REFERENCES public.tiendas(id_tienda) ON DELETE CASCADE,
    tipo character varying(20) NOT NULL CHECK (tipo IN ('nota', 'incidencia')),
    texto character varying(500) NOT NULL CHECK (length(btrim(texto)) > 0),
    fecha_creacion timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pedido_notas_pedido ON public.pedido_notas (id_pedido, id_tienda);
