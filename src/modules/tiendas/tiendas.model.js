import db from "../../config/db-config.js";

export const crearTienda = async (tienda) => {
  const { nombre, email, slogan, telefono, direccion, fecha_creacion, id_duenio, id_provincia, color_primario, color_secundario, color_terciario } = tienda;

  const query = `
    INSERT INTO tiendas (nombre, email, slogan, telefono, direccion, fecha_creacion, id_duenio, id_provincia, color_primario, color_secundario, color_terciario )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
  `;
  const values = [nombre, email, slogan, telefono, direccion, fecha_creacion, id_duenio, id_provincia, color_primario, color_secundario, color_terciario];
  const result = await db.query(query, values);
  return result.rows[0];
}

export const buscarTiendaPorNombre = async (nombreBuscar) => {
  const nombre = nombreBuscar;
  const query = ` SELECT * FROM  tiendas WHERE nombre = $1 LIMIT 1`
  const values = [nombre];
  const result = await db.query(query, values);
  return result.rows.length > 0;
}
export const editarTienda = async (tienda) => {
 const {
    nombre_original, // El nombre actual en la BD para buscarla
    nombre,          // El nuevo nombre (puede ser igual o distinto)
    email,
    slogan,
    telefono,
    direccion,
    color_primario,
    color_secundario,
    color_terciario
  } = tienda;

  const query = `
    UPDATE tiendas 
    SET nombre = $1, 
        email = $2, 
        slogan = $3, 
        telefono = $4, 
        direccion = $5, 
        color_primario = $6, 
        color_secundario = $7, 
        color_terciario = $8
    WHERE nombre = $9
    RETURNING *;
  `;

const values = [
    nombre,
    email,
    slogan,
    telefono,
    direccion,
    color_primario,
    color_secundario,
    color_terciario,
    nombre_original 
  ];

  const result = await db.query(query, values);
  return result.rows[0]; 
};
