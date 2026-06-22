import db from "../../config/db-config.js";

export const crearTienda = async (tienda) => {
  const { nombre, slogan, telefono, direccion, id_duenio, id_provincia, color_primario, color_secundario, color_terciario, id_cuenta } = tienda;

  const query = `
    INSERT INTO tiendas (nombre, slogan, telefono, direccion, id_duenio, id_provincia, color_primario, color_secundario, color_terciario, id_cuenta )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;
  const values = [nombre, slogan, telefono, direccion, id_duenio, id_provincia, color_primario, color_secundario, color_terciario, id_cuenta];
  const result = await db.query(query, values);
  return result.rows[0];
}

export const buscarTiendaPorNombre = async (nombreBuscar) => {
  const nombre = nombreBuscar;
  const query = ` SELECT * FROM  tiendas WHERE nombre = $1 LIMIT 1`
  const values = [nombre];
  const result = await db.query(query, values);
  return result.rows[0];
}

export const getTiendaById = async (id) => {
  const query = `SELECT * FROM tiendas WHERE id_tienda = $1`;
  const result = await db.query(query, [id]);
  return result.rows[0];
}

export const editarTienda = async (tienda) => {
 const {
    id_tienda, 
    nombre,
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
        slogan = $2, 
        telefono = $3, 
        direccion = $4, 
        color_primario = $5, 
        color_secundario = $6, 
        color_terciario = $7
    WHERE id_tienda = $8
    RETURNING *;
  `;

  const values = [
    nombre,
    slogan,
    telefono,
    direccion,
    color_primario,
    color_secundario,
    color_terciario,
    id_tienda 
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

export const getNombreTiendaById = async (id) => {
  const query = `SELECT nombre FROM tiendas WHERE id_tienda = $1`;
  const result = await db.query(query, [id]);
  return result.rows[0] ? result.rows[0].nombre : null;
}
export const getSloganTiendaById = async (id) => {
  const query = `SELECT slogan FROM tiendas WHERE id_tienda = $1`;
  const result = await db.query(query, [id]);
  return result.rows[0] ? result.rows[0].slogan : null;
}