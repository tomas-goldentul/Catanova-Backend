-- Agrega 'Cancelado' como estado válido en la tabla pedidos.
-- Ejecutar una sola vez contra la base de datos.

ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_estado_check;

ALTER TABLE public.pedidos
    ADD CONSTRAINT pedidos_estado_check
    CHECK (estado IN ('Pendiente', 'En preparación', 'Enviado', 'Entregado', 'Cancelado'));
