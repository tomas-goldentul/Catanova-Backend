import db from "../../config/db-config.js";

export const crearEnvio = async (envio) => {
  const { id_pedido, codigo_seguimiento, direccion, nombre_comprador, repartidor } = envio;
  const sql = `
    INSERT INTO envios (id_pedido, codigo_seguimiento, direccion, nombre_comprador, repartidor)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const result = await db.query(sql, [id_pedido, codigo_seguimiento, direccion, nombre_comprador, repartidor]);
  return result.rows[0];
};

export const getEnvioById = async (id_envio) => {
  const sql = `SELECT * FROM envios WHERE id_envio = $1;`;
  const result = await db.query(sql, [id_envio]);
  return result.rows[0];
};

export const getEnvioPorPedido = async (id_pedido) => {
  const sql = `SELECT * FROM envios WHERE id_pedido = $1 LIMIT 1;`;
  const result = await db.query(sql, [id_pedido]);
  return result.rows[0];
};

export const getEnvioPorCodigo = async (codigo_seguimiento) => {
  const sql = `SELECT * FROM envios WHERE codigo_seguimiento = $1 LIMIT 1;`;
  const result = await db.query(sql, [codigo_seguimiento]);
  return result.rows[0];
};

export const editarEnvio = async (envio) => {
  const { id_envio, direccion, nombre_comprador, repartidor } = envio;
  const sql = `
    UPDATE envios
    SET direccion = $1, nombre_comprador = $2, repartidor = $3
    WHERE id_envio = $4
    RETURNING *;
  `;
  const result = await db.query(sql, [direccion, nombre_comprador, repartidor, id_envio]);
  return result.rows[0];
};

// Cantidad y total cuentan solo los productos de la tienda indicada.
export const listarPedidosDeTienda = async (id_tienda) => {
  const sql = `
    SELECT
      p.id_pedido,
      p.estado,
      p.fecha AS fecha_pedido,
      e.id_envio,
      e.codigo_seguimiento,
      e.fecha_creacion,
      e.repartidor,
      COALESCE(e.nombre_comprador, TRIM(CONCAT(u.nombre, ' ', u.apellido))) AS nombre_comprador,
      COALESCE(e.direccion, p.direccion) AS direccion,
      SUM(dp.cantidad) AS cantidad_productos,
      SUM(dp.precio_total) AS total
    FROM pedidos p
    INNER JOIN detallepedidos dp
      ON p.id_pedido = dp.id_pedido
    INNER JOIN productos prod
      ON dp.id_producto = prod.id_producto AND prod.id_tienda = $1
    LEFT JOIN envios e
      ON p.id_pedido = e.id_pedido
    LEFT JOIN usuarios u
      ON p.id_usuario = u.id_usuario
    GROUP BY p.id_pedido, e.id_envio, u.nombre, u.apellido
    ORDER BY p.fecha DESC, p.id_pedido DESC;
  `;
  const result = await db.query(sql, [id_tienda]);
  return result.rows;
};

export const eliminarEnvio = async (id_envio) => {
  const sql = `DELETE FROM envios WHERE id_envio = $1 RETURNING *;`;
  const result = await db.query(sql, [id_envio]);
  return result.rows[0];
};
