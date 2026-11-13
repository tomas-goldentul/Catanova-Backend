import db from "../../config/db-config.js";

export const obtenerRepartidores = async ({ q, id_tienda, limit }) => {
    let query = `
        SELECT *
        FROM repartidores
        WHERE 1 = 1
    `;

    const values = [];

    if (id_tienda) {
        values.push(Number(id_tienda));
        query += ` AND id_tienda = $${values.length}`;
    }

    if (q) {
        values.push(`%${q}%`);
        query += ` AND (
            nombre ILIKE $${values.length}
            OR apellido ILIKE $${values.length}
            OR telefono ILIKE $${values.length}
        )`;
    }

    query += ` ORDER BY nombre ASC`;

    if (limit) {
        const limite = Number(limit);

        if (Number.isInteger(limite) && limite > 0) {
            values.push(limite);
            query += ` LIMIT $${values.length}`;
        }
    }

    const resultado = await db.query(query, values);
    return resultado.rows;
};

export const crearRepartidor = async ({ nombre, apellido, telefono, id_tienda }) => {
    const query = `
        INSERT INTO repartidores
            (nombre, apellido, telefono, id_tienda)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    const values = [
        nombre,
        apellido || null,
        telefono || null,
        Number(id_tienda)
    ];

    const resultado = await db.query(query, values);
    return resultado.rows[0];
};
