import pg from 'pg';
import 'dotenv/config';
const { Pool } = pg;

// 1. Definimos el objeto de configuración
const DBConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME
};

// 2. Creamos la instancia del Pool (esto es lo que realmente hace las consultas)
const db = new Pool(DBConfig);

// 3. Log para confirmar que cargó
console.log('--- Intentando conectar a la base de datos: ', DBConfig.database, '---');

// IMPORTANTE: Exportamos 'db', que es el Pool, no solo el texto de configuración
export default db;