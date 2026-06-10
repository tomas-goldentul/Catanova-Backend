import db from "../../config/db-config.js";

export const getCategoriaPorNombre = async (nombre) => {
    const query = `SELECT * FROM CATEGORIAS WHERE nombre = $1;`
    const values = [nombre];
    const result = await db.query(query, values);
    return result.rows[0];
}

export const insertCategoria = async(nombre) =>{
    const query =`INSERT INTO CATEGORIAS (nombre) 
                    VALUES ($1)     RETURNING *;   `

    const values = [nombre];
    const result = await db.query(query, values);
    return result.rows[0];
}

export const getAllCategorias = async () => {
    const query = `SELECT * FROM categorias;`
    const result = await db.query(query);
    return result.rows;
}


export const getCategoriasByiD = async (id_categoria) => {
    const query = `SELECT * FROM categorias where id_categoria = $1;`
    const values = [id_categoria]
    const result = await db.query(query, values);
    return result.rows[0];
}