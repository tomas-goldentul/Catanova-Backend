import db from "../../config/db-config.js";

export const asociarUsuarioTienda = async (id_usuario, id_tienda) => {
    const query = `
        INSERT INTO usuariosxtiendas (id_usuario, id_tienda)
        VALUES ($1, $2)
        ON CONFLICT (id_usuario, id_tienda) DO NOTHING
        RETURNING *;
    `;
    const result = await db.query(query, [id_usuario, id_tienda]);
    return result.rows[0] || { id_usuario, id_tienda, ya_existia: true };
};

export const desasociarUsuarioTienda = async (id_usuario, id_tienda) => {
    const query = `
        DELETE FROM usuariosxtiendas
        WHERE id_usuario = $1 AND id_tienda = $2
        RETURNING *;
    `;
    const result = await db.query(query, [id_usuario, id_tienda]);
    return result.rows[0];
};

export const getUsuariosPorTienda = async (id_tienda) => {
    const query = `
        SELECT
            u.id_usuario,
            u.nombre,
            u.apellido,
            u.telefono,
            u.direccion,
            u.id_cuenta
        FROM usuarios u
        INNER JOIN usuariosxtiendas uxt
            ON u.id_usuario = uxt.id_usuario
        WHERE uxt.id_tienda = $1
        ORDER BY u.nombre, u.apellido;
    `;
    const result = await db.query(query, [id_tienda]);
    return result.rows;
};

export const getTiendasDeUsuario = async (id_usuario) => {
    const query = `
        SELECT
            t.id_tienda,
            t.nombre
        FROM tiendas t
        INNER JOIN usuariosxtiendas uxt
            ON t.id_tienda = uxt.id_tienda
        WHERE uxt.id_usuario = $1
        ORDER BY t.nombre;
    `;
    const result = await db.query(query, [id_usuario]);
    return result.rows;
};

export const verificarAsociacion = async (id_usuario, id_tienda) => {
    const query = `
        SELECT 1
        FROM usuariosxtiendas
        WHERE id_usuario = $1 AND id_tienda = $2;
    `;
    const result = await db.query(query, [id_usuario, id_tienda]);
    return result.rows.length > 0;
};
