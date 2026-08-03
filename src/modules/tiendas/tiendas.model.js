import db from "../../config/db-config.js";

export const crearTienda = async (tienda) => {
  const { nombre, slogan, telefono, direccion, id_duenio, id_provincia, color_primario, color_secundario, color_terciario, id_cuenta, abierta } = tienda;

  const query = `
    INSERT INTO tiendas (nombre, slogan, telefono, direccion, id_duenio, id_provincia, color_primario, color_secundario, color_terciario, id_cuenta, abierta)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
  `;
  const values = [nombre, slogan, telefono, direccion, id_duenio, id_provincia, color_primario, color_secundario, color_terciario, id_cuenta, abierta];
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

export const getTiendaPorCuentaId = async (id_cuenta) => {
  const query = `SELECT * FROM tiendas WHERE id_cuenta = $1 LIMIT 1`;
  const result = await db.query(query, [id_cuenta]);
  return result.rows[0];
}

export const eliminarTiendaPorCuentaId = async (id_cuenta) => {
  const query = `DELETE FROM tiendas WHERE id_cuenta = $1 RETURNING *`;
  const result = await db.query(query, [id_cuenta]);
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
    color_terciario,
    abierta
  } = tienda;

  const query = `
    UPDATE tiendas 
    SET nombre = $1, 
        slogan = $2, 
        telefono = $3, 
        direccion = $4, 
        color_primario = $5, 
        color_secundario = $6, 
        color_terciario = $7,
        abierta = $8
    WHERE id_tienda = $9
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
    abierta,
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