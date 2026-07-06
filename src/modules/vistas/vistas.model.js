import db from "../../config/db-config.js";

const normalizarVista = (row) => {
    if (!row) return row;
    return {
        ...row,
        id: row.id_vista ?? row.id
    };
};

export const getAllVistas = async () => {
    const result = await db.query(
        "SELECT * FROM vistas ORDER BY fecha DESC"
    );
    return result.rows.map(normalizarVista);
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
        [id_producto, id_usuario]
    );

    return result.rows[0];
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

export const getCantidadVistasDesdeIntervalo = async (interval) => {
    const result = await db.query(
        `SELECT COUNT(*)::int AS cantidad
         FROM vistas
         WHERE fecha >= NOW() - INTERVAL '${interval}'`
    );

    return result.rows[0];
};

export const getCantidadVistasUltimos7Dias = async () => {
    return await getCantidadVistasDesdeIntervalo("7 days");
};

export const getCantidadVistasUltimoMes = async () => {
    return await getCantidadVistasDesdeIntervalo("1 month");
};

export const getCantidadVistasUltimoAno = async () => {
    return await getCantidadVistasDesdeIntervalo("1 year");
};

export const getCantidadVistasUltimos2Anios = async () => {
    return await getCantidadVistasDesdeIntervalo("2 years");
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