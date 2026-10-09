import db from "../../config/db-config.js";

export const getCategoriaPorNombre = async (nombre, id_tienda) => {
    const query = `SELECT * FROM categorias
                   WHERE LOWER(nombre) = LOWER($1) AND id_tienda = $2 LIMIT 1;`;
    const values = [nombre, id_tienda];
    const result = await db.query(query, values);
    return result.rows[0];
}

export const insertCategoria = async (nombre, id_tienda) => {
    const query = `INSERT INTO categorias (nombre, id_tienda)
                   VALUES ($1, $2) RETURNING *;`;

    const values = [nombre, id_tienda];
    const result = await db.query(query, values);
    return result.rows[0];
}

export const getAllCategorias = async () => {
    const query = `SELECT * FROM categorias;`
    const result = await db.query(query);
    return result.rows;
}


export const getCategoriasByiD = async (id_categoria) => {
    const query = `SELECT * FROM categorias where id_categoria = $1 LIMIT 1;`;
    const values = [id_categoria];
    const result = await db.query(query, values);
    return result.rows[0];
}

export const getCategoriasPorTienda = async (id_tienda) => {
    const query = `SELECT c.* FROM categorias c
                   JOIN tiendas t ON c.id_tienda = t.id_tienda
                   WHERE t.id_tienda = $1;`;
    const values = [id_tienda];
    const result = await db.query(query, values);
    return result.rows;
};

export const updateCategoria = async (id_categoria, nombre, id_tienda) => {
    const query = `
        UPDATE categorias
        SET nombre = $1
        WHERE id_categoria = $2
          AND id_tienda = $3
        RETURNING *;
    `;
    const values = [nombre, id_categoria, id_tienda];
    const result = await db.query(query, values);
    return result.rows[0];
};


export const deleteCategoria = async (id_categoria, id_tienda) => {
    const query = `
        DELETE FROM categorias
        WHERE id_categoria = $1
          AND id_tienda = $2
        RETURNING *;
    `;
    const values = [id_categoria, id_tienda];
    const result = await db.query(query, values);
    return result.rows[0];
};

export const getProductosPorCategoria = async (id_categoria) => {
    const query = `
        SELECT p.*
        FROM productosxcategorias pc
        INNER JOIN productos p ON p.id_producto = pc.id_producto
        WHERE pc.id_categoria = $1;
    `;
    const values = [id_categoria];
    const result = await db.query(query, values);
    return result.rows;
};

export const insertProductoEnCategoria = async (id_categoria, id_producto) => {
    const query = `
        INSERT INTO productosxcategorias (id_categoria, id_producto)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING *;
    `;
    const values = [id_categoria, id_producto];
    const result = await db.query(query, values);

    return result.rows[0];
};

export const deleteProductoDeCategoria = async (id_categoria, id_producto) => {
    const query = `DELETE FROM productosxcategorias
                   WHERE id_categoria = $1 AND id_producto = $2
                   RETURNING *;`;
    const values = [id_categoria, id_producto];
    const result = await db.query(query, values);

    return result.rows[0];
};

export const deleteAllProductosDeCategoria = async (id_categoria) => {
    const query = `
        DELETE FROM productosxcategorias
        WHERE id_categoria = $1;
    `;
    const values = [id_categoria];
    await db.query(query, values);

    // Desasociar los productos de esta categoría
    await db.query(
        `UPDATE productos SET id_categoria = NULL WHERE id_categoria = $1`,
        [id_categoria]
    );
};

export const getProductosCategoriaByiD = async (id_categoria, id_producto) => {
    const query = `SELECT * FROM productosxcategorias
                   WHERE id_categoria = $1 AND id_producto = $2;`;
    const values = [id_categoria, id_producto];
    const result = await db.query(query, values);
    return result.rows[0];
};

export const getCategoriaByIdYTienda = async (id_categoria, id_tienda) => {
    const query = `
        SELECT *
        FROM categorias
        WHERE id_categoria = $1
          AND id_tienda = $2
        LIMIT 1;
    `;
    const values = [id_categoria, id_tienda];
    const result = await db.query(query, values);
    return result.rows[0];
};