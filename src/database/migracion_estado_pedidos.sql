-- Agrega el estado del pedido (Pendiente / En preparación / Enviado / Entregado).
-- "entregado" se mantiene sincronizado (entregado = estado 'Entregado') por compatibilidad.

ALTER TABLE public.pedidos
    ADD COLUMN IF NOT EXISTS estado character varying(20) NOT NULL DEFAULT 'Pendiente';

UPDATE public.pedidos SET estado = 'Entregado' WHERE entregado = true;

ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_estado_check;
ALTER TABLE public.pedidos
    ADD CONSTRAINT pedidos_estado_check
    CHECK (estado IN ('Pendiente', 'En preparación', 'Enviado', 'Entregado'));

-- Historial de cambios de estado (fechas de la línea de tiempo del seguimiento).
CREATE TABLE IF NOT EXISTS public.pedidos_historial_estado (
    id_historial SERIAL PRIMARY KEY,
    id_pedido integer NOT NULL REFERENCES public.pedidos(id_pedido) ON DELETE CASCADE,
    estado character varying(20) NOT NULL,
    fecha timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_historial_pedido ON public.pedidos_historial_estado (id_pedido);
-- true en registros de pedidos viejos: solo se conoce el día (fecha del pedido), no la hora.
ALTER TABLE public.pedidos_historial_estado ADD COLUMN IF NOT EXISTS solo_fecha boolean NOT NULL DEFAULT false;

-- Envío de un pedido (un envío por pedido).
CREATE TABLE IF NOT EXISTS public.envios (
    id_envio SERIAL PRIMARY KEY,
    id_pedido integer NOT NULL UNIQUE REFERENCES public.pedidos(id_pedido) ON DELETE CASCADE,
    codigo_seguimiento character varying(20) NOT NULL UNIQUE,
    direccion character varying(100) NOT NULL,
    nombre_comprador character varying(100) NOT NULL,
    repartidor character varying(100) NOT NULL,
    fecha_creacion timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bases creadas con la versión anterior: pasar las fechas a timestamptz (hora de Argentina).
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pedidos_historial_estado'
               AND column_name = 'fecha' AND data_type = 'timestamp without time zone') THEN
        ALTER TABLE public.pedidos_historial_estado
            ALTER COLUMN fecha TYPE timestamp with time zone USING fecha AT TIME ZONE 'America/Argentina/Buenos_Aires';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'envios'
               AND column_name = 'fecha_creacion' AND data_type = 'timestamp without time zone') THEN
        ALTER TABLE public.envios
            ALTER COLUMN fecha_creacion TYPE timestamp with time zone USING fecha_creacion AT TIME ZONE 'America/Argentina/Buenos_Aires';
    END IF;
END $$;
