import db from "../../config/db-config.js";

export const getAllpedidos = async () => {
  const result = await db.query("SELECT * FROM pedidos");
  return result.rows;
}