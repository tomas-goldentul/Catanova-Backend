// Uso: npm run seed:estadisticas [-- <id_tienda>]   (por defecto, tienda 1)
import fs from "fs";
import db from "../config/db-config.js";

const idTienda = Number(process.argv[2] || 1);
if (!Number.isInteger(idTienda) || idTienda <= 0) {
    console.error("id_tienda inválido:", process.argv[2]);
    process.exit(1);
}

const sql = fs.readFileSync(new URL("./seed_estadisticas.sql", import.meta.url), "utf8");
const client = await db.connect();
try {
    await client.query(`SELECT set_config('seed.id_tienda', $1, false)`, [String(idTienda)]);
    await client.query(sql);
    console.log(`Seed de estadísticas cargado para la tienda ${idTienda}.`);
} catch (error) {
    console.error("No se pudo cargar el seed:", error.message);
    process.exitCode = 1;
} finally {
    client.release();
    await db.end();
}
