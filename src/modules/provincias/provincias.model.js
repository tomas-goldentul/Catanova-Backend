import db from "../../config/db-config.js";
export const getProvinciassId = async(id_Provincia) => {
    const query = `SELECT * FROM provincias where id_provincia = $1;`
    const result = await db.query(query, [id_Provincia]);
    return result.rows[0];
}