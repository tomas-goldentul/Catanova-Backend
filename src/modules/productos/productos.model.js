import db from "../../config/database.js";

export const getAllProductos = () => {
  return db.query("SELECT * FROM productos");
};