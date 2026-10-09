import db from "../../config/db-config.js";

export const insertarPedidoBase = async (direccion, id_usuario, metodo_pago) => {
  const sql = `
    INSERT INTO pedidos (fecha, direccion, id_usuario, entregado, metodo_pago)
    VALUES (CURRENT_DATE, $1, $2, false, $3)
    RETURNING id_pedido;
  `;
  const result = await db.query(sql, [direccion, id_usuario, metodo_pago]);
  const id_pedido = result.rows[0].id_pedido;
  await registrarHistorialEstado(id_pedido, 'Pendiente');
  return id_pedido;
};  

export const getAllPedidosConDetalles = async () => {
  const sql = `
    SELECT
      p.id_pedido,
      p.fecha,
      p.direccion,
      p.id_usuario,
      p.entregado,
      p.estado,
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
      t.nombre AS nombre_tienda,
      e.id_envio,
      e.codigo_seguimiento,
      e.repartidor
    FROM pedidos p
    LEFT JOIN envios e
      ON p.id_pedido = e.id_pedido
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
      p.estado,
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
      t.nombre AS nombre_tienda,
      e.id_envio,
      e.codigo_seguimiento,
      e.repartidor
    FROM pedidos p
    LEFT JOIN envios e
      ON p.id_pedido = e.id_pedido
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
    SELECT id_pedido, fecha, direccion, id_usuario, entregado, estado, metodo_pago
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
      p.estado,
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
      prod.imagen AS imagen_producto,
      t.nombre AS nombre_tienda,
      e.id_envio,
      e.codigo_seguimiento,
      e.repartidor
    FROM pedidos p
    LEFT JOIN envios e
      ON p.id_pedido = e.id_pedido
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

export const getPedidosPendientesPorTienda = async (id_tienda) => {
  const sql = `
    SELECT
      p.id_pedido,
      p.fecha,
      p.direccion,
      p.id_usuario,
      p.entregado,
      p.estado,
      p.metodo_pago,
      u.nombre AS nombre_usuario,
      u.apellido AS apellido_usuario,
      dp.id_detallepedido,
      dp.id_producto,
      dp.cantidad,
      dp.precio_total,
      prod.nombre AS nombre_producto,
      prod.precio AS precio_unitario
    FROM pedidos p
    LEFT JOIN usuarios u
      ON p.id_usuario = u.id_usuario
    LEFT JOIN detallepedidos dp
      ON p.id_pedido = dp.id_pedido
    LEFT JOIN productos prod
      ON dp.id_producto = prod.id_producto
    WHERE prod.id_tienda = $1 AND p.entregado = false
    ORDER BY p.id_pedido ASC, dp.id_detallepedido ASC;
  `;
  const result = await db.query(sql, [id_tienda]);
  return result.rows;
};

export const getPedidosPorTienda = async (id_tienda) => {
  const sql = `
    SELECT
      p.id_pedido,
      p.fecha,
      p.direccion,
      p.id_usuario,
      p.entregado,
      p.estado,
      p.metodo_pago,
      u.nombre AS nombre_usuario,
      u.apellido AS apellido_usuario,
      dp.id_detallepedido,
      dp.id_producto,
      dp.cantidad,
      dp.precio_total,
      prod.nombre AS nombre_producto,
      prod.precio AS precio_unitario
    FROM pedidos p
    LEFT JOIN usuarios u
      ON p.id_usuario = u.id_usuario
    LEFT JOIN detallepedidos dp
      ON p.id_pedido = dp.id_pedido
    LEFT JOIN productos prod
      ON dp.id_producto = prod.id_producto
    WHERE prod.id_tienda = $1
    ORDER BY p.id_pedido ASC, dp.id_detallepedido ASC;
  `;
  const result = await db.query(sql, [id_tienda]);
  return result.rows;
};

export const cambiarEstadoEntregado = async (id_pedido, entregado) => {
  await cambiarEstado(id_pedido, entregado ? 'Entregado' : 'Pendiente');
};

// "entregado" se mantiene sincronizado con el estado por compatibilidad.
export const cambiarEstado = async (id_pedido, estado) => {
  const anterior = await db.query(`SELECT estado FROM pedidos WHERE id_pedido = $1;`, [id_pedido]);

  // Pedidos anteriores al historial: se guarda su estado actual con la fecha del pedido.
  if (anterior.rows[0] && anterior.rows[0].estado !== estado) {
    await db.query(`
      INSERT INTO pedidos_historial_estado (id_pedido, estado, fecha, solo_fecha)
      SELECT p.id_pedido, p.estado, p.fecha::timestamp, true
      FROM pedidos p
      WHERE p.id_pedido = $1
        AND NOT EXISTS (SELECT 1 FROM pedidos_historial_estado h WHERE h.id_pedido = p.id_pedido);
    `, [id_pedido]);
  }

  const sql = `
    UPDATE pedidos
    SET estado = $1, entregado = $2
    WHERE id_pedido = $3;
  `;
  await db.query(sql, [estado, estado === 'Entregado', id_pedido]);

  // Solo se registra en el historial si el estado realmente cambió.
  if (anterior.rows[0] && anterior.rows[0].estado !== estado) {
    await registrarHistorialEstado(id_pedido, estado);
  }
};

export const registrarHistorialEstado = async (id_pedido, estado) => {
  const sql = `
    INSERT INTO pedidos_historial_estado (id_pedido, estado)
    VALUES ($1, $2);
  `;
  await db.query(sql, [id_pedido, estado]);
};

export const getHistorialEstados = async (id_pedido) => {
  const sql = `
    SELECT estado, fecha, solo_fecha
    FROM pedidos_historial_estado
    WHERE id_pedido = $1
    ORDER BY fecha ASC, id_historial ASC;
  `;
  const result = await db.query(sql, [id_pedido]);
  return result.rows;
};

export const pedidoTieneProductosDeTienda = async (id_pedido, id_tienda) => {
  const sql = `
    SELECT 1
    FROM detallepedidos dp
    INNER JOIN productos prod
      ON dp.id_producto = prod.id_producto
    WHERE dp.id_pedido = $1 AND prod.id_tienda = $2
    LIMIT 1;
  `;
  const result = await db.query(sql, [id_pedido, id_tienda]);
  return result.rowCount > 0;
};