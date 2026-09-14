import db from "../../config/db-config.js";

export const agregarUsuario = async (usuario) => {
    const {
        nombre,
        apellido,
        telefono,
        direccion,
        id_cuenta
    } = usuario;

    const query = `
        INSERT INTO usuarios
        (
            nombre,
            apellido,
            telefono,
            direccion,
            id_cuenta
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5
        )
        RETURNING *;
    `;

    const values = [
        nombre,
        apellido,
        telefono,
        direccion || null,
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

export const getUsuarioPorCuenta = async (id_cuenta) => {
    const query = `
        SELECT *
        FROM usuarios
        WHERE id_cuenta = $1
        LIMIT 1
    `;

    const result = await db.query(query, [id_cuenta]);
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
        telefono,
        direccion
    } = usuario;

    const query = `
        UPDATE usuarios
        SET
            nombre = $1,
            apellido = $2,
            telefono = $3,
            direccion = $4
        WHERE id_usuario = $5
        RETURNING *;
    `;

    const values = [
        nombre,
        apellido,
        telefono,
        direccion,
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