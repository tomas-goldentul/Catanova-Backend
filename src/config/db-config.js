import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const DBConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME
};

const db = new Pool(DBConfig);

console.log('--- Intentando conectar a la base de datos: ', DBConfig.database, '---');

export default db;