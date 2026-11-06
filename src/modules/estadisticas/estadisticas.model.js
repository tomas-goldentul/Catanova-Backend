import db from "../../config/db-config.js";

export const TZ = "America/Argentina/Buenos_Aires";

// ventas.fecha y vistas.fecha son "timestamp without time zone" y se graban con
// CURRENT_TIMESTAMP / NOW(), o sea en la zona horaria de la sesión de la base.
// Para compararlas con instantes reales (timestamptz) se pasa el límite a la hora
// local de la sesión, y para agrupar se pasa la fecha a la hora de Argentina.
const aSesion = (param) => `(${param}::timestamptz AT TIME ZONE current_setting('TimeZone'))`;
const aHoraArgentina = (col) => `((${col} AT TIME ZONE current_setting('TimeZone')) AT TIME ZONE '${TZ}')`;

// Rangos del período actual y del anterior (misma duración transcurrida), calculados en hora de Argentina.
// diasAtras: cuántos días antes de hoy empieza el período (0, 6 o 29).
// duracion: largo del período en días (1, 7 o 30), que es lo que se corre el período anterior.
export const getRangos = async (diasAtras, duracion) => {
    const sql = `
        SELECT
            now() AS hasta,
            to_char(now() AT TIME ZONE $1, 'YYYY-MM-DD') AS hoy,
            extract(hour FROM now() AT TIME ZONE $1)::int AS hora_actual,
            (((now() AT TIME ZONE $1)::date - $2::int)::timestamp AT TIME ZONE $1) AS desde,
            (((now() AT TIME ZONE $1)::date - $2::int - $3::int)::timestamp AT TIME ZONE $1) AS desde_anterior,
            (((now() AT TIME ZONE $1) - make_interval(days => $3::int)) AT TIME ZONE $1) AS hasta_anterior,
            ((date_trunc('month', now() AT TIME ZONE $1) - interval '5 months') AT TIME ZONE $1) AS desde_meses
    `;
    const result = await db.query(sql, [TZ, diasAtras, duracion]);
    return result.rows[0];
};

// Facturación, unidades y cantidad de ventas del período actual y del anterior.
export const getResumenVentas = async (id_tienda, r) => {
    const actual = `fecha >= ${aSesion("$2")} AND fecha <= ${aSesion("$3")}`;
    const anterior = `fecha >= ${aSesion("$4")} AND fecha < ${aSesion("$5")}`;
    const sql = `
        SELECT
            COALESCE(SUM(total) FILTER (WHERE ${actual}), 0)      AS facturacion_actual,
            COALESCE(SUM(cantidad) FILTER (WHERE ${actual}), 0)   AS unidades_actual,
            COUNT(*) FILTER (WHERE ${actual})                     AS ventas_actual,
            COALESCE(SUM(total) FILTER (WHERE ${anterior}), 0)    AS facturacion_anterior,
            COALESCE(SUM(cantidad) FILTER (WHERE ${anterior}), 0) AS unidades_anterior,
            COUNT(*) FILTER (WHERE ${anterior})                   AS ventas_anterior
        FROM ventas
        WHERE id_tienda = $1
          AND fecha >= ${aSesion("$4")}
          AND fecha <= ${aSesion("$3")}
    `;
    const result = await db.query(sql, [id_tienda, r.desde, r.hasta, r.desde_anterior, r.hasta_anterior]);
    return result.rows[0];
};

// Ventas agrupadas por una clave de fecha en hora de Argentina (formato de to_char).
// Se usa para la serie (por hora o por día) y para las ventas por mes.
export const getVentasAgrupadas = async (id_tienda, desde, hasta, formato) => {
    const sql = `
        SELECT
            to_char(${aHoraArgentina("fecha")}, $4) AS clave,
            COALESCE(SUM(total), 0)    AS facturacion,
            COALESCE(SUM(cantidad), 0) AS unidades,
            COUNT(*)                   AS ventas
        FROM ventas
        WHERE id_tienda = $1
          AND fecha >= ${aSesion("$2")}
          AND fecha <= ${aSesion("$3")}
        GROUP BY 1
    `;
    const result = await db.query(sql, [id_tienda, desde, hasta, formato]);
    return result.rows;
};

// Productos con sus ventas del período: los que tuvieron ventas (aunque hoy estén
// inactivos o eliminados) más todos los activos de la tienda (con 0 si no vendieron).
export const getProductosDelPeriodo = async (id_tienda, desde, hasta) => {
    const sql = `
        WITH vendidos AS (
            SELECT id_producto, SUM(cantidad) AS unidades, SUM(total) AS facturacion
            FROM ventas
            WHERE id_tienda = $1
              AND fecha >= ${aSesion("$2")}
              AND fecha <= ${aSesion("$3")}
            GROUP BY id_producto
        )
        SELECT
            p.id_producto,
            p.nombre,
            p.imagen,
            (p.id_tienda = $1 AND p.activo = true AND p.eliminado = false) AS activo,
            COALESCE(v.unidades, 0)    AS unidades,
            COALESCE(v.facturacion, 0) AS facturacion
        FROM productos p
        LEFT JOIN vendidos v ON v.id_producto = p.id_producto
        WHERE v.id_producto IS NOT NULL
           OR (p.id_tienda = $1 AND p.activo = true AND p.eliminado = false)
    `;
    const result = await db.query(sql, [id_tienda, desde, hasta]);
    return result.rows;
};

// Vistas de productos de la tienda en el período actual y en el anterior.
export const getResumenVistas = async (id_tienda, r) => {
    const actual = `vi.fecha >= ${aSesion("$2")} AND vi.fecha <= ${aSesion("$3")}`;
    const anterior = `vi.fecha >= ${aSesion("$4")} AND vi.fecha < ${aSesion("$5")}`;
    const sql = `
        SELECT
            COUNT(*) FILTER (WHERE ${actual})   AS actual,
            COUNT(*) FILTER (WHERE ${anterior}) AS anterior
        FROM vistas vi
        JOIN productos p ON p.id_producto = vi.id_producto
        WHERE p.id_tienda = $1
          AND vi.fecha >= ${aSesion("$4")}
          AND vi.fecha <= ${aSesion("$3")}
    `;
    const result = await db.query(sql, [id_tienda, r.desde, r.hasta, r.desde_anterior, r.hasta_anterior]);
    return result.rows[0];
};

// Vistas de productos de la tienda entre dos instantes, por producto.
export const getVistasPorProducto = async (id_tienda, desde, hasta) => {
    const sql = `
        SELECT vi.id_producto, p.nombre, COUNT(*) AS cantidad
        FROM vistas vi
        JOIN productos p ON p.id_producto = vi.id_producto
        WHERE p.id_tienda = $1
          AND vi.fecha >= ${aSesion("$2")}
          AND vi.fecha <= ${aSesion("$3")}
        GROUP BY vi.id_producto, p.nombre
        ORDER BY cantidad DESC, vi.id_producto
    `;
    const result = await db.query(sql, [id_tienda, desde, hasta]);
    return result.rows;
};

// Pedidos de la tienda (los que tienen al menos un producto suyo), agrupados por estado.
// pedidos.fecha es solo DATE, así que el momento de creación se toma del primer
// registro del historial de estados (que tiene hora). Para pedidos viejos sin
// historial con hora se usa la fecha del pedido a las 00:00 de Argentina.
// "monto" es solo la parte del pedido que corresponde a productos de esta tienda.
export const getPedidosPorEstado = async (id_tienda, r) => {
    const actual = `creado >= $2::timestamptz AND creado <= $3::timestamptz`;
    const anterior = `creado >= $4::timestamptz AND creado < $5::timestamptz`;
    const sql = `
        WITH ped AS (
            SELECT p.id_pedido, p.estado, p.fecha, SUM(dp.precio_total) AS monto
            FROM pedidos p
            JOIN detallepedidos dp ON dp.id_pedido = p.id_pedido
            JOIN productos prod ON prod.id_producto = dp.id_producto
            WHERE prod.id_tienda = $1
            GROUP BY p.id_pedido, p.estado, p.fecha
        ),
        cre AS (
            SELECT
                ped.estado,
                ped.monto,
                COALESCE(
                    CASE WHEN h.solo_fecha THEN NULL ELSE h.fecha END,
                    (ped.fecha::timestamp AT TIME ZONE $6)
                ) AS creado
            FROM ped
            LEFT JOIN LATERAL (
                SELECT fecha, solo_fecha
                FROM pedidos_historial_estado
                WHERE id_pedido = ped.id_pedido
                ORDER BY fecha ASC, id_historial ASC
                LIMIT 1
            ) h ON true
        )
        SELECT
            estado,
            COUNT(*) FILTER (WHERE ${actual})            AS actual,
            COUNT(*) FILTER (WHERE ${anterior})          AS anterior,
            COALESCE(SUM(monto) FILTER (WHERE ${actual}), 0) AS facturacion,
            COUNT(*)                                     AS historico
        FROM cre
        GROUP BY estado
    `;
    const result = await db.query(sql, [id_tienda, r.desde, r.hasta, r.desde_anterior, r.hasta_anterior, TZ]);
    return result.rows;
};
