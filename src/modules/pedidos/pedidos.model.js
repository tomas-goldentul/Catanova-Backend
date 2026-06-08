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