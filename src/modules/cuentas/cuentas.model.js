import db from "../../config/db-config.js";

export const crearCuenta = async (cuenta) => {
    const { email, password, tipo, foto_perfil } = cuenta;
    const query = `INSERT INTO cuentas (email, password, fecha_creacion, tipo, foto_perfil) VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4) RETURNING *;`;

    const values = [email, password, tipo, foto_perfil];
    const result = await db.query(query, values);
    return result.rows[0];
};

export const editarCuenta = async (cuenta) => {
    const { id_cuenta, email, password, tipo, foto_perfil } = cuenta;
    const query = `UPDATE cuentas SET email = $1, password = $2, tipo = $3, foto_perfil = $4 WHERE id_cuenta = $5 RETURNING *;`;

    const values = [email, password, tipo, foto_perfil, id_cuenta];
    const result = await db.query(query, values);
    return result.rows[0];
};

export const buscarCuentaPorEmail = async (email) => {
    const query = `SELECT * FROM cuentas WHERE email = $1 LIMIT 1`;

    const result = await db.query(query, [email]);
    return result.rows[0];
};

export const getCuentaById = async (id_cuenta) => {
    const query = `SELECT * FROM cuentas WHERE id_cuenta = $1`;

    const result = await db.query(query, [id_cuenta]);
    return result.rows[0];
};