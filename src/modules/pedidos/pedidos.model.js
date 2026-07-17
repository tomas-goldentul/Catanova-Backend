import db from "../../config/db-config.js";

export const insertarPedidoBase = async (direccion, id_usuario, metodo_pago) => {
  const sql = `
    INSERT INTO pedidos (fecha, direccion, id_usuario, entregado, metodo_pago)
    VALUES (CURRENT_DATE, $1, $2, false, $3)
    RETURNING id_pedido;
  `;
  const result = await db.query(sql, [direccion, id_usuario, metodo_pago]);
  return result.rows[0].id_pedido;
};  

export const getAllPedidosConDetalles = async () => {
  const sql = `
    SELECT
      p.*,
      dp.*
    FROM pedidos p
    INNER JOIN detallepedidos dp
      ON p.id_Pedido = dp.id_Pedido
  `;

  const result = await db.query(sql);
  return result.rows;
}
export const getAllPedidosConDetallesByIdUser = async (id_usuario) => {
  const sql = `
    SELECT
      p.*,
      dp.*
    FROM pedidos p
    INNER JOIN detallepedidos dp
      ON p.id_Pedido = dp.id_Pedido
    WHERE p.id_usuario = $1
  `;
const result = await db.query(sql, [id_usuario]);
  return result.rows;
}

export const getPedidoById = async (id_pedido) => {
  const sql = `
    SELECT id_pedido, fecha, direccion, id_usuario, entregado, metodo_pago 
    FROM pedidos 
    WHERE id_pedido = $1;
  `;
  const result = await db.query(sql, [id_pedido]);
  return result.rows[0];
};

export const getDetallesByPedidoId = async (id_pedido) => {
  const sql = `
    SELECT id_producto, cantidad 
    FROM detallepedidos 
    WHERE id_pedido = $1;
  `;
  const result = await db.query(sql, [id_pedido]);
  return result.rows;
};

export const actualizarPedidoBase = async (id_pedido, direccion, entregado, metodo_pago) => {
  const sql = `
    UPDATE pedidos 
    SET direccion = $1, entregado = $2, metodo_pago = $3
    WHERE id_pedido = $4;
  `;
  await db.query(sql, [direccion, entregado, metodo_pago, id_pedido]);
};

export const eliminarDetallesPedido = async (id_pedido) => {
  const sql = `
    DELETE FROM detallepedidos 
    WHERE id_pedido = $1;
  `;
  await db.query(sql, [id_pedido]);
};

export const getPedidoConDetallesById = async (id_pedido) => {
  const sql = `
    SELECT
      p.id_pedido,
      p.fecha,
      p.direccion,
      p.id_usuario,
      p.entregado,
      p.metodo_pago,
      dp.id_detallepedido,
      dp.id_producto,
      dp.cantidad,
      dp.precio_total
    FROM pedidos p
    INNER JOIN detallepedidos dp
      ON p.id_pedido = dp.id_pedido
    WHERE p.id_pedido = $1;
  `;
  const result = await db.query(sql, [id_pedido]);
  return result.rows;
};

export const cambiarEstadoEntregado = async (id_pedido, entregado) => {
  const sql = `
    UPDATE pedidos 
    SET entregado = $1 
    WHERE id_pedido = $2;
  `;
  await db.query(sql, [entregado, id_pedido]);
};