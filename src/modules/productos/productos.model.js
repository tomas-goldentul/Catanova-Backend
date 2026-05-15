import db from "../../config/db-config.js";

export const getAllProductos = async () => {
  const result = await db.query("SELECT * FROM productos WHERE activo = true");
  return result.rows; 
};