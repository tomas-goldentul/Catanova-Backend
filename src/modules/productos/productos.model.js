import db from "../../config/db-config.js";

export const getProductosActivos = async () => {
  const result = await db.query("SELECT * FROM productos WHERE activo = true");
  return result.rows;
};

export const getAllProductos = async () => {
  const result = await db.query("SELECT * FROM productos");
  return result.rows;
}

export const getProductosId = async (id) => {
  const query = `SELECT * FROM productos where id_producto = $1;`
  const result = await db.query(query, [id]);
  return result.rows[0];
}

export const agregarProducto = async (producto) => {
  const { nombre, precio, stock, imagen, activo, id_tienda } = producto;

  const query = `
    INSERT INTO productos (nombre, precio, stock, imagen, activo, id_tienda)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [nombre, precio, stock, imagen, activo, id_tienda];
  const result = await db.query(query, values);
  return result.rows[0];
};

export const buscarProductoPorNombre = async (nombreBuscar) => {
  const nombre = nombreBuscar;
  const query = ` SELECT * FROM  productos WHERE nombre = $1 LIMIT 1`
  const values = [nombre];
  const result = await db.query(query, values);
  return result.rows.length > 0;
}

export const modificarEstado = async (id, activo) => {
  const query = `Update Productos set activo = $1 where id_producto = $2 RETURNING *`
  const values = [activo, id];
  const result = await db.query(query, values);
  return result.rows[0];
}

export const modificarProducto = async (producto) => {
  const {
    id_producto,
    nombre,
    precio,
    stock,
    imagen,
    activo,
    id_tienda
  } = producto;

  const query = `
    UPDATE productos 
    SET nombre = $1, 
        precio = $2, 
        stock = $3, 
        imagen = $4, 
        activo = $5, 
        id_tienda = $6
    WHERE id_producto = $7
    RETURNING *;
  `;

  const values = [
    nombre,
    precio,
    stock,
    imagen,
    activo,
    id_tienda,
    id_producto
  ];

  const result = await db.query(query, values);
  return result.rows[0];
}

export const eliminarProducto = async (id_producto) => {
  const query = `Update productos set eliminado = true WHERE id_producto = $1;`
  const values = [id_producto]
  const result = await db.query(query, values);
  return result.rows[0];

}