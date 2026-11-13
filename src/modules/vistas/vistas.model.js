import db from "../../config/db-config.js";

const normalizarVista = (row) => {
    if (!row) return row;
    return {
        ...row,
        id: row.id_vista ?? row.id
    };
};

export const getTiendaDeProducto = async (id_producto) => {
    const result = await db.query(
        "SELECT id_tienda FROM productos WHERE id_producto = $1",
        [id_producto]
    );
    return result.rows[0];
};

export const getVistaById = async (id) => {
    const result = await db.query(
        "SELECT * FROM vistas WHERE id_vista = $1",
        [id]
    );
    return normalizarVista(result.rows[0]);
};

export const agregarVista = async (vista) => {
    const { id_producto, id_usuario } = vista;

    const result = await db.query(
        `INSERT INTO vistas(id_producto,id_usuario,fecha)
         VALUES($1,$2,NOW())
         RETURNING *`,
        [id_producto, id_usuario ?? null]
    );

    return result.rows[0];
};

// fecha se graba con NOW() en la hora de reloj de la sesión, por eso se compara con LOCALTIMESTAMP.
export const existeVistaReciente = async (id_producto, id_usuario, minutos) => {
    const result = await db.query(
        `SELECT 1 FROM vistas
         WHERE id_producto = $1 AND id_usuario = $2
           AND fecha >= LOCALTIMESTAMP - make_interval(mins => $3::int)
         LIMIT 1`,
        [id_producto, id_usuario, minutos]
    );
    return result.rowCount > 0;
};

export const eliminarVista = async (id) => {
    const result = await db.query(
        "DELETE FROM vistas WHERE id_vista=$1 RETURNING *",
        [id]
    );

    return normalizarVista(result.rows[0]);
};

export const getCantidadVistasProducto = async (id_producto) => {
    const result = await db.query(
        `SELECT COUNT(*) AS cantidad
         FROM vistas
         WHERE id_producto=$1`,
        [id_producto]
    );

    return result.rows[0];
};

export const getVistasProducto = async (id_producto) => {
    const result = await db.query(
        `SELECT *
         FROM vistas
         WHERE id_producto=$1
         ORDER BY fecha DESC`,
        [id_producto]
    );

    return result.rows.map(normalizarVista);
};
