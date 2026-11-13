-- =====================================================================
-- Seed para la pantalla de Estadísticas (GET /estadisticas/tienda/:id).
-- Carga ventas manuales, pedidos (con detalle e historial) y vistas para UNA tienda,
-- repartidos en: hoy (antes de la hora actual), esta semana, la semana pasada,
-- este mes y el mes pasado (~62 días hacia atrás), a distintas horas.
-- Todo es relativo a now() en hora de Argentina, así que sirve cualquier día que se corra.
--
-- Correr:  npm run seed:estadisticas            (tienda 1)
--          npm run seed:estadisticas -- 3       (otra tienda)
-- Se puede volver a correr: primero borra las ventas y pedidos que cargó antes
-- (marcados con metodo_pago 'Seed estadísticas' / direccion 'SEED-ESTADISTICAS ...').
-- Las vistas no tienen columna para marcarlas: cada corrida agrega ~300 vistas más.
-- El último producto activo de la tienda queda SIN ventas a propósito (para "menos vendidos").
-- No toca el stock de los productos.
-- =====================================================================
DO $$
DECLARE
    v_tienda    int := COALESCE(NULLIF(current_setting('seed.id_tienda', true), ''), '1')::int;
    tz          text := 'America/Argentina/Buenos_Aires';
    sesion      text := current_setting('TimeZone');
    local_ahora timestamp := now() AT TIME ZONE 'America/Argentina/Buenos_Aires';
    hoy_local   timestamp := date_trunc('day', now() AT TIME ZONE 'America/Argentina/Buenos_Aires');
    prods       int[];
    usuarios    int[];
    vendibles   int;
    d int; n int; i int;
    v_local timestamp; v_inst timestamptz; v_prod int; v_cant int; v_precio numeric;
    v_pedido int; v_estado text;
BEGIN
    SELECT array_agg(id_producto ORDER BY id_producto) INTO prods
    FROM productos WHERE id_tienda = v_tienda AND activo = true AND eliminado = false;
    SELECT array_agg(id_usuario ORDER BY id_usuario) INTO usuarios FROM usuarios;

    IF prods IS NULL OR array_length(prods, 1) < 2 THEN
        RAISE EXCEPTION 'La tienda % necesita al menos 2 productos activos para el seed.', v_tienda;
    END IF;
    IF usuarios IS NULL THEN
        RAISE EXCEPTION 'No hay usuarios cargados.';
    END IF;
    vendibles := array_length(prods, 1) - 1; -- el último queda sin ventas

    -- Limpieza de una corrida anterior
    DELETE FROM ventas WHERE id_tienda = v_tienda AND metodo_pago = 'Seed estadísticas';
    DELETE FROM detallepedidos WHERE id_pedido IN (SELECT id_pedido FROM pedidos WHERE direccion LIKE 'SEED-ESTADISTICAS t' || v_tienda || ' %');
    DELETE FROM pedidos WHERE direccion LIKE 'SEED-ESTADISTICAS t' || v_tienda || ' %';

    PERFORM setseed(0.42);

    -- Ventas manuales: 0 a 3 por día durante 62 días. Hoy, solo antes de la hora actual.
    FOR d IN 0..62 LOOP
        FOR n IN 1..3 LOOP
            CONTINUE WHEN random() < 0.35;
            v_local := (hoy_local - make_interval(days => d))
                + random() * CASE WHEN d = 0 THEN local_ahora - hoy_local ELSE interval '24 hours' END;
            v_prod := prods[1 + floor(random() * vendibles)::int];
            v_cant := 1 + floor(random() * 3)::int;
            SELECT precio INTO v_precio FROM productos WHERE id_producto = v_prod;
            INSERT INTO ventas (fecha, id_producto, id_tienda, id_usuario, id_pedido, cantidad, precio_unitario, total, metodo_pago, estado)
            VALUES ((v_local AT TIME ZONE tz) AT TIME ZONE sesion, v_prod, v_tienda,
                    CASE WHEN random() < 0.5 THEN usuarios[1 + floor(random() * array_length(usuarios, 1))::int] END,
                    NULL, v_cant, v_precio, v_cant * v_precio, 'Seed estadísticas', 'Completada');
        END LOOP;
    END LOOP;

    -- Una venta anulada hoy (NO debe sumar en las estadísticas)
    INSERT INTO ventas (fecha, id_producto, id_tienda, id_usuario, id_pedido, cantidad, precio_unitario, total, metodo_pago, estado)
    SELECT (hoy_local AT TIME ZONE tz) AT TIME ZONE sesion, prods[1], v_tienda, NULL, NULL, 10, precio, 10 * precio, 'Seed estadísticas', 'Anulada'
    FROM productos WHERE id_producto = prods[1];

    -- Pedidos: uno cada 2 días (más uno extra hoy). Los recientes quedan en estados intermedios.
    FOR i IN 0..31 LOOP
        d := CASE WHEN i = 31 THEN 0 ELSE i * 2 END;
        v_local := (hoy_local - make_interval(days => d))
            + random() * CASE WHEN d = 0 THEN local_ahora - hoy_local ELSE interval '24 hours' END;
        v_inst := v_local AT TIME ZONE tz;
        v_estado := CASE
            WHEN d = 0 THEN 'Pendiente'
            WHEN d <= 2 THEN 'En preparación'
            WHEN d <= 6 THEN 'Enviado'
            ELSE 'Entregado' END;

        INSERT INTO pedidos (fecha, direccion, id_usuario, entregado, metodo_pago, estado)
        VALUES (v_local::date, 'SEED-ESTADISTICAS t' || v_tienda || ' #' || i,
                usuarios[1 + (i % array_length(usuarios, 1))], v_estado = 'Entregado', 'Mercado Pago', v_estado)
        RETURNING id_pedido INTO v_pedido;

        FOR n IN 1..(1 + floor(random() * 2)::int) LOOP
            v_prod := prods[1 + ((i + n) % vendibles)];
            v_cant := 1 + floor(random() * 2)::int;
            SELECT precio INTO v_precio FROM productos WHERE id_producto = v_prod;
            INSERT INTO detallepedidos (cantidad, precio_total, id_pedido, id_producto)
            VALUES (v_cant, v_cant * v_precio, v_pedido, v_prod);
        END LOOP;

        INSERT INTO pedidos_historial_estado (id_pedido, estado, fecha, solo_fecha) VALUES (v_pedido, 'Pendiente', v_inst, false);
        IF v_estado <> 'Pendiente' THEN
            INSERT INTO pedidos_historial_estado (id_pedido, estado, fecha, solo_fecha) VALUES (v_pedido, 'En preparación', v_inst + interval '2 hours', false);
        END IF;
        IF v_estado IN ('Enviado', 'Entregado') THEN
            INSERT INTO pedidos_historial_estado (id_pedido, estado, fecha, solo_fecha) VALUES (v_pedido, 'Enviado', v_inst + interval '1 day', false);
        END IF;
        IF v_estado = 'Entregado' THEN
            INSERT INTO pedidos_historial_estado (id_pedido, estado, fecha, solo_fecha) VALUES (v_pedido, 'Entregado', v_inst + interval '3 days', false);
        END IF;
    END LOOP;

    -- Vistas: ~5 por día en todos los productos activos (incluido el que no se vende).
    FOR d IN 0..62 LOOP
        FOR n IN 1..5 LOOP
            v_local := (hoy_local - make_interval(days => d))
                + random() * CASE WHEN d = 0 THEN local_ahora - hoy_local ELSE interval '24 hours' END;
            INSERT INTO vistas (id_producto, id_usuario, fecha)
            VALUES (prods[1 + floor(random() * array_length(prods, 1))::int],
                    CASE WHEN random() < 0.6 THEN usuarios[1 + floor(random() * array_length(usuarios, 1))::int] END,
                    (v_local AT TIME ZONE tz) AT TIME ZONE sesion);
        END LOOP;
    END LOOP;

    RAISE NOTICE 'Seed de estadísticas cargado para la tienda %.', v_tienda;
END $$;
