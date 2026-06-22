import db from "../../config/db-config.js";

export const agregarUsuario = async (usuario) => {
    const {
        nombre,
        apellido,
        telefono,
        id_cuenta
    } = usuario;

    const query = `
        INSERT INTO usuarios
        (
            nombre,
            apellido,
            telefono,
            id_cuenta
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4
        )
        RETURNING *;
    `;

    const values = [
        nombre,
        apellido,
        telefono,
        id_cuenta
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

export const getUsuarioId = async (id_usuario) => {
    const query = `
        SELECT *
        FROM usuarios
        WHERE id_usuario = $1
    `;

    const result = await db.query(query, [id_usuario]);
    return result.rows[0];
};

export const getAllUsuarios = async () => {
    const query = `
        SELECT *
        FROM usuarios
        ORDER BY id_usuario
    `;

    const result = await db.query(query);
    return result.rows;
};

export const editarUsuario = async (usuario) => {
    const {
        id_usuario,
        nombre,
        apellido,
        telefono
    } = usuario;

    const query = `
        UPDATE usuarios
        SET
            nombre = $1,
            apellido = $2,
            telefono = $3
        WHERE id_usuario = $4
        RETURNING *;
    `;

    const values = [
        nombre,
        apellido,
        telefono,
        id_usuario
    ];

    const result = await db.query(query, values);
    return result.rows[0];
};

export const eliminarUsuario = async (id_usuario) => {
    const query = `
        DELETE FROM usuarios
        WHERE id_usuario = $1
        RETURNING *;
    `;

    const result = await db.query(query, [id_usuario]);
    return result.rows[0];
};