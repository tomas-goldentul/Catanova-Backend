import db from "../../config/db-config.js";

export const insertarDetallePedido = async (cantidad, precio_total, id_pedido, id_producto) => {
  const sql = `
    INSERT INTO detallepedidos (cantidad, precio_total, id_pedido, id_producto)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [cantidad, precio_total, id_pedido, id_producto];
  const result = await db.query(sql, values);
  return result.rows[0];
};

export const obtenerDetallesPorPedido = async (id_pedido) => {
  const sql = `
    SELECT 
      dp.id_detallepedido,
      dp.cantidad,
      dp.precio_total,
      p.nombre AS producto_nombre,
      p.imagen AS producto_imagen
    FROM detallepedidos dp
    INNER JOIN productos p ON dp.id_producto = p.id_producto
    WHERE dp.id_pedido = $1;
  `;
  const result = await db.query(sql, [id_pedido]);
  return result.rows;
};

