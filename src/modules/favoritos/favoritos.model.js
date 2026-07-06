import db from "../../config/db-config.js";

const normalizarFavorito = (row) => {
    if (!row) return row;
    return {
        ...row,
        id: row.id_favorito ?? row.id
    };
};

export const getAllFavoritos = async () => {
    const result = await db.query(
        "SELECT * FROM favoritos ORDER BY fecha DESC"
    );
    return result.rows.map(normalizarFavorito);
};

export const getFavoritoById = async (id) => {
    const result = await db.query(
        "SELECT * FROM favoritos WHERE id_favorito = $1",
        [id]
    );
    return normalizarFavorito(result.rows[0]);
};

export const agregarFavorito = async (favorito) => {
    const { id_producto, id_usuario } = favorito;

    const result = await db.query(
        `INSERT INTO favoritos(id_producto,id_usuario,fecha)
         VALUES($1,$2,NOW())
         RETURNING *`,
        [id_producto, id_usuario]
    );

    return result.rows[0];
};

export const eliminarFavorito = async (id) => {
    const result = await db.query(
        "DELETE FROM favoritos WHERE id_favorito=$1 RETURNING *",
        [id]
    );

    return normalizarFavorito(result.rows[0]);
};

export const getCantidadFavoritosProducto = async (id_producto) => {
    const result = await db.query(
        `SELECT COUNT(*) AS cantidad
         FROM favoritos
         WHERE id_producto=$1`,
        [id_producto]
    );

    return result.rows[0];
};

export const getCantidadFavoritosDesdeIntervalo = async (interval) => {
    const result = await db.query(
        `SELECT COUNT(*)::int AS cantidad
         FROM favoritos
         WHERE fecha >= NOW() - INTERVAL '${interval}'`
    );

    return result.rows[0];
};

export const getCantidadFavoritosUltimos7Dias = async () => {
    return await getCantidadFavoritosDesdeIntervalo("7 days");
};

export const getCantidadFavoritosUltimoMes = async () => {
    return await getCantidadFavoritosDesdeIntervalo("1 month");
};

export const getCantidadFavoritosUltimoAno = async () => {
    return await getCantidadFavoritosDesdeIntervalo("1 year");
};

export const getCantidadFavoritosUltimos2Anios = async () => {
    return await getCantidadFavoritosDesdeIntervalo("2 years");
};

export const getFavoritosProducto = async (id_producto) => {
    const result = await db.query(
        `SELECT *
         FROM favoritos
         WHERE id_producto=$1
         ORDER BY fecha DESC`,
        [id_producto]
    );

    return result.rows.map(normalizarFavorito);
};

export const existeFavorito = async (id_producto,id_usuario)=>{
    const result = await db.query(
        `SELECT *
         FROM favoritos
         WHERE id_producto=$1
         AND id_usuario=$2`,
        [id_producto,id_usuario]
    );

    return result.rows[0];
};