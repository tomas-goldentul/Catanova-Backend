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
      p.id_pedido,
      p.fecha,
      p.direccion,
      p.id_usuario,
      p.entregado,
      p.metodo_pago,
      u.nombre AS nombre_usuario,
      u.apellido AS apellido_usuario,
      dp.id_detallepedido,
      dp.id_producto,
      dp.cantidad,
      dp.precio_total,
      prod.nombre AS nombre_producto,
      prod.precio AS precio_unitario,
      prod.id_tienda AS id_tienda_producto,
      t.nombre AS nombre_tienda
    FROM pedidos p
    LEFT JOIN usuarios u
      ON p.id_usuario = u.id_usuario
    LEFT JOIN detallepedidos dp
      ON p.id_pedido = dp.id_pedido
    LEFT JOIN productos prod
      ON dp.id_producto = prod.id_producto
    LEFT JOIN tiendas t
      ON prod.id_tienda = t.id_tienda
    ORDER BY p.id_pedido ASC, dp.id_detallepedido ASC;
  `;

  const result = await db.query(sql);
  return result.rows;
};

export const getAllPedidosConDetallesByIdUser = async (id_usuario) => {
  const sql = `
    SELECT
      p.id_pedido,
      p.fecha,
      p.direccion,
      p.id_usuario,
      p.entregado,
      p.metodo_pago,
      u.nombre AS nombre_usuario,
      u.apellido AS apellido_usuario,
      dp.id_detallepedido,
      dp.id_producto,
      dp.cantidad,
      dp.precio_total,
      prod.nombre AS nombre_producto,
      prod.precio AS precio_unitario,
      prod.id_tienda AS id_tienda_producto,
      t.nombre AS nombre_tienda
    FROM pedidos p
    LEFT JOIN usuarios u
      ON p.id_usuario = u.id_usuario
    LEFT JOIN detallepedidos dp
      ON p.id_pedido = dp.id_pedido
    LEFT JOIN productos prod
      ON dp.id_producto = prod.id_producto
    LEFT JOIN tiendas t
      ON prod.id_tienda = t.id_tienda
    WHERE p.id_usuario = $1
    ORDER BY p.id_pedido ASC, dp.id_detallepedido ASC;
  `;
  const result = await db.query(sql, [id_usuario]);
  return result.rows;
};

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
      u.nombre AS nombre_usuario,
      u.apellido AS apellido_usuario,
      dp.id_detallepedido,
      dp.id_producto,
      dp.cantidad,
      dp.precio_total,
      prod.nombre AS nombre_producto,
      prod.precio AS precio_unitario,
      prod.id_tienda AS id_tienda_producto,
      t.nombre AS nombre_tienda
    FROM pedidos p
    LEFT JOIN usuarios u
      ON p.id_usuario = u.id_usuario
    LEFT JOIN detallepedidos dp
      ON p.id_pedido = dp.id_pedido
    LEFT JOIN productos prod
      ON dp.id_producto = prod.id_producto
    LEFT JOIN tiendas t
      ON prod.id_tienda = t.id_tienda
    WHERE p.id_pedido = $1
    ORDER BY dp.id_detallepedido ASC;
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