import db from "../../config/db-config.js";

export const getProductosActivos = async () => {
  const query = `
    SELECT p.*
    FROM productos p
    JOIN tiendas t ON p.id_tienda = t.id_tienda
    WHERE p.activo = true
      AND p.eliminado = false
      AND t.abierta = true
  `;
  const result = await db.query(query);
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

export const restarStockProducto = async (id_producto, cantidad) => {
  const sql = `
    UPDATE productos 
    SET stock = stock - $1 
    WHERE id_producto = $2
    RETURNING *;
  `;
  const result = await db.query(sql, [cantidad, id_producto]);
  return result.rows[0];
};

export const getProductosPorCategoria = async (id_categoria, id_tienda = null) => {
  let query = `SELECT p.* FROM productos p INNER JOIN productosxcategorias pc ON p.id_producto = pc.id_producto WHERE pc.id_categoria = $1 AND p.activo = true AND p.eliminado = false`;
  const values = [id_categoria];

  if (id_tienda !== null && Number.isFinite(Number(id_tienda))) {
    query += ` AND p.id_tienda = $2`;
    values.push(Number(id_tienda));
  }

  const result = await db.query(query, values);
  return result.rows;
}

export const getProductosPorTienda = async (id_tienda) => {
  const query = `SELECT * FROM productos WHERE id_tienda = $1 AND activo = true AND eliminado = false`;
  const values = [id_tienda];
  const result = await db.query(query, values);
  return result.rows;
}

export const getTodosProductosPorTienda = async (id_tienda) => {
  const query = `SELECT * FROM productos WHERE id_tienda = $1`;
  const values = [id_tienda];
  const result = await db.query(query, values);
  return result.rows;
}

export const eliminarProductosPorTienda = async (id_tienda) => {
  const query = `UPDATE productos SET eliminado = true WHERE id_tienda = $1 RETURNING *`;
  const result = await db.query(query, [id_tienda]);
  return result.rows;
};

export const agregarStock = async (id_producto, cantidad) => {
  const query = `
    UPDATE productos 
    SET stock = stock + $1 
    WHERE id_producto = $2
    RETURNING *;
  `;
  const result = await db.query(query, [cantidad, id_producto]);
  return result.rows[0];
};

export const editarStock = async (id_producto, cantidad) => {
  const query = `
    UPDATE productos 
    SET stock = $1 
    WHERE id_producto = $2
    RETURNING *;
  `;
  const result = await db.query(query, [cantidad, id_producto]);
  return result.rows[0];
};

export const editarNombre = async (id_producto, nombre) => {
  const query = `
    UPDATE productos 
    SET nombre = $1 
    WHERE id_producto = $2
    RETURNING *;
  `;
  const result = await db.query(query, [nombre, id_producto]);
  return result.rows[0];
};

export const editarTipo = async (id_producto, tipo) => {
  const query = `
    UPDATE productos 
    SET tipo = $1 
    WHERE id_producto = $2
    RETURNING *;
  `;
  const result = await db.query(query, [tipo, id_producto]);
  return result.rows[0];
};

export const cambiarImagen = async (id_producto, imagen) => {
  const query = `
    UPDATE productos 
    SET imagen = $1 
    WHERE id_producto = $2
    RETURNING *;
  `;
  const result = await db.query(query, [imagen, id_producto]);
  return result.rows[0];
};

//funcionalidad para pedidos.model actualizar pedido
export const sumarStockProducto = async (id_producto, cantidad) => {
  const sql = `
    UPDATE productos 
    SET stock = stock + $1 
    WHERE id_producto = $2;
  `;
  await db.query(sql, [cantidad, id_producto]);
};