import db from "../../config/db-config.js";

export const agregarEtiqueta = async (nombre, id_producto) => {
  const query = `
    INSERT INTO etiquetas (nombre, id_producto)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [nombre, id_producto];
  const result = await db.query(query, values);
  return result.rows[0];
};

export const borrarEtiqueta = async (id_etiqueta) => {
  const query = `DELETE FROM etiquetas WHERE id_etiqueta = $1 RETURNING *;`;
  const result = await db.query(query, [id_etiqueta]);
  return result.rows[0];
};

export const obtenerEtiquetasPorProducto = async (id_producto) => {
  const query = `SELECT * FROM etiquetas WHERE id_producto = $1 ORDER BY id_etiqueta ASC;`;
  const result = await db.query(query, [id_producto]);
  return result.rows;
};

export const obtenerEtiquetaId = async (id_etiqueta) => {
  const query = `SELECT * FROM etiquetas WHERE id_etiqueta = $1;`;
  const result = await db.query(query, [id_etiqueta]);
  return result.rows[0];
};

export const verificarEtiquetaDuplicada = async (nombre, id_producto) => {
  const query = `SELECT * FROM etiquetas WHERE nombre = $1 AND id_producto = $2;`;
  const result = await db.query(query, [nombre, id_producto]);
  return result.rows.length > 0;
};
