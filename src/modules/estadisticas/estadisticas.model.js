import db from "../../config/db-config.js";

export const TZ = "America/Argentina/Buenos_Aires";

// ventas.fecha y vistas.fecha son "timestamp without time zone" y se graban con
// CURRENT_TIMESTAMP / NOW(), o sea con la hora de reloj de la zona de la sesión de la base.
// Para compararlas con instantes reales (timestamptz) se pasa el límite a la hora de la sesión,
// y para convertirlas a instante se interpretan en la zona de la sesión.
const aSesion = (param) => `(${param}::timestamptz AT TIME ZONE current_setting('TimeZone'))`;
const aInstante = (col) => `(${col} AT TIME ZONE current_setting('TimeZone'))`;

// hoy: desde las 00:00. semana: desde el lunes 00:00. mes: desde el día 1 00:00 (hora de Argentina).
const PERIODOS_SQL = {
    hoy: { trunc: "day", paso: "1 day" },
    semana: { trunc: "week", paso: "7 days" }, // date_trunc('week') arranca el lunes
    mes: { trunc: "month", paso: "1 month" },
};

// Período actual = [inicio, ahora]. Período anterior = el mismo tramo corrido un día/semana/mes:
// [inicio - paso, ahora - paso). Para el mes, Postgres recorta al último día si el mes anterior
// es más corto (31/03 15:00 -> 28/02 15:00).
export const getRangos = async (periodo) => {
    const { trunc, paso } = PERIODOS_SQL[periodo];
    const sql = `
        WITH b AS (
            SELECT
                now() AS ahora,
                (now() AT TIME ZONE $1) AS local,
                date_trunc($2, now() AT TIME ZONE $1) AS inicio_local,
                $3::interval AS paso
        )
        SELECT
            ahora AS hasta,
            (inicio_local AT TIME ZONE $1) AS desde,
            ((inicio_local - paso) AT TIME ZONE $1) AS desde_anterior,
            ((local - paso) AT TIME ZONE $1) AS hasta_anterior,
            to_char(inicio_local, 'YYYY-MM-DD') AS dia_inicio,
            to_char(local, 'YYYY-MM-DD') AS hoy,
            extract(hour FROM local)::int AS hora_actual,
            extract(day FROM (date_trunc('month', local) + interval '1 month - 1 day'))::int AS dias_mes
        FROM b
    `;
    const result = await db.query(sql, [TZ, trunc, paso]);
    return result.rows[0];
};

// Todas las operaciones de la tienda entre desde y hasta (instantes), una fila por producto vendido:
//  - origen 'manual': filas de ventas SIN id_pedido (las de POST /ventas/manual). Se excluyen las
//    ventas con id_pedido porque duplican el detalle del pedido (solo existen en el seed), y las
//    marcadas como anuladas/canceladas en ventas.estado.
//  - origen 'pedido': filas de detallepedidos de productos de la tienda. El momento del pedido es el
//    primer registro del historial (con hora); si no hay, la primera venta asociada al pedido; si
//    tampoco, pedidos.fecha (solo día) a las 00:00 de Argentina.
export const getOperaciones = async (id_tienda, desde, hasta) => {
    const sql = `
        WITH manuales AS (
            SELECT
                'manual'::text AS origen,
                'v' || v.id_venta AS id_operacion,
                NULL::int AS id_pedido,
                NULL::text AS estado_pedido,
                v.id_producto,
                v.cantidad,
                v.total AS monto,
                ${aInstante("v.fecha")} AS instante
            FROM ventas v
            WHERE v.id_tienda = $1
              AND v.id_pedido IS NULL
              AND lower(COALESCE(v.estado, 'Completada')) NOT IN ('anulada', 'cancelada')
              AND v.fecha >= ${aSesion("$2")}
              AND v.fecha <= ${aSesion("$3")}
        ),
        ped AS (
            SELECT DISTINCT p.id_pedido, p.estado, p.fecha
            FROM pedidos p
            JOIN detallepedidos dp ON dp.id_pedido = p.id_pedido
            JOIN productos prod ON prod.id_producto = dp.id_producto
            WHERE prod.id_tienda = $1
        ),
        ped_creado AS (
            SELECT
                ped.id_pedido,
                ped.estado,
                COALESCE(
                    CASE WHEN h.solo_fecha THEN NULL ELSE h.fecha END,
                    ${aInstante("vt.primera_venta")},
                    (ped.fecha::timestamp AT TIME ZONE $4)
                ) AS creado
            FROM ped
            LEFT JOIN LATERAL (
                SELECT fecha, solo_fecha
                FROM pedidos_historial_estado
                WHERE id_pedido = ped.id_pedido
                ORDER BY fecha ASC, id_historial ASC
                LIMIT 1
            ) h ON true
            LEFT JOIN LATERAL (
                SELECT MIN(fecha) AS primera_venta FROM ventas WHERE id_pedido = ped.id_pedido
            ) vt ON true
        ),
        items_pedido AS (
            SELECT
                'pedido'::text,
                'p' || pc.id_pedido,
                pc.id_pedido,
                pc.estado::text,
                dp.id_producto,
                dp.cantidad,
                dp.precio_total,
                pc.creado
            FROM ped_creado pc
            JOIN detallepedidos dp ON dp.id_pedido = pc.id_pedido
            JOIN productos prod ON prod.id_producto = dp.id_producto AND prod.id_tienda = $1
            WHERE pc.creado >= $2::timestamptz
              AND pc.creado <= $3::timestamptz
        )
        SELECT
            ops.*,
            to_char(ops.instante AT TIME ZONE $4, 'YYYY-MM-DD') AS dia_local,
            to_char(ops.instante AT TIME ZONE $4, 'HH24') AS hora_local
        FROM (SELECT * FROM manuales UNION ALL SELECT * FROM items_pedido) ops
    `;
    const result = await db.query(sql, [id_tienda, desde, hasta, TZ]);
    return result.rows;
};

// Todos los productos de la tienda (también inactivos y eliminados, para poder nombrar lo vendido).
export const getProductosTienda = async (id_tienda) => {
    const sql = `
        SELECT id_producto, nombre, imagen, (activo = true AND eliminado = false) AS activo
        FROM productos
        WHERE id_tienda = $1
    `;
    const result = await db.query(sql, [id_tienda]);
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
