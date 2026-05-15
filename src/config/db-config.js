import pg from 'pg';

const { Pool } = pg;

// 1. Definimos el objeto de configuración
const DBConfig = {
    host: 'localhost',
    database: 'Catanova_DB', // Asegúrate de que este sea el nombre exacto en pgAdmin
    user: 'postgres',
    password: 'root',
    port: 5432
};

// 2. Creamos la instancia del Pool (esto es lo que realmente hace las consultas)
const db = new Pool(DBConfig);

// 3. Log para confirmar que cargó
console.log('--- Intentando conectar a la base de datos: ', DBConfig.database, '---');

// IMPORTANTE: Exportamos 'db', que es el Pool, no solo el texto de configuración
export default db;