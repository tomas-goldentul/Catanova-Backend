import pg from 'pg';
import 'dotenv/config';

const { Pool, types } = pg;

const DBConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME
};

// --- Zona horaria de las columnas "timestamp without time zone" ---
// ventas.fecha, vistas.fecha, favoritos.fecha, cuentas.fecha_creacion se graban con
// CURRENT_TIMESTAMP / NOW(), o sea con la hora "de reloj" de la zona de la sesión de
// Postgres, sin indicar la zona. Por defecto pg las interpreta en la zona del proceso
// Node, y si Node y Postgres están en zonas distintas las fechas salen corridas.
// Acá se interpretan en la zona de la base (detectada al arrancar), así la API
// devuelve siempre el instante correcto en ISO UTC.
let zonaHorariaBase = 'UTC';
let offsetFijoSegundos = null; // solo si Intl no reconoce el nombre de zona que da Postgres
const formateadores = new Map();

const formateadorDeZona = (zona) => {
    if (!formateadores.has(zona)) {
        formateadores.set(zona, new Intl.DateTimeFormat('en-US', {
            timeZone: zona,
            hourCycle: 'h23',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        }));
    }
    return formateadores.get(zona);
};

// Diferencia en ms entre la hora de reloj de la zona y UTC en un instante dado.
const offsetEnZonaMs = (instanteMs) => {
    if (offsetFijoSegundos !== null) return offsetFijoSegundos * 1000;
    const partes = Object.fromEntries(
        formateadorDeZona(zonaHorariaBase).formatToParts(new Date(instanteMs)).map((p) => [p.type, p.value])
    );
    const relojComoUTC = Date.UTC(partes.year, partes.month - 1, partes.day, partes.hour, partes.minute, partes.second);
    return relojComoUTC - Math.floor(instanteMs / 1000) * 1000;
};

const parsearTimestampSinZona = (texto) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(\.\d+)?$/.exec(texto);
    if (!m) return texto; // infinity, fechas AC, etc.: se devuelven tal cual
    const ms = m[7] ? Math.round(Number(m[7]) * 1000) : 0;
    const reloj = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6], ms);
    let instante = reloj - offsetEnZonaMs(reloj);
    const offsetReal = offsetEnZonaMs(instante); // segunda pasada por si hay cambio de horario
    instante = reloj - offsetReal;
    return new Date(instante);
};

types.setTypeParser(types.builtins.TIMESTAMP, parsearTimestampSinZona);

const db = new Pool(DBConfig);

console.log('--- Intentando conectar a la base de datos: ', DBConfig.database, '---');

// Se llama una vez al arrancar, antes de atender requests.
export const detectarZonaHorariaBase = async () => {
    const { rows } = await db.query(
        `SELECT current_setting('TimeZone') AS zona, EXTRACT(TIMEZONE FROM now())::int AS offset_segundos`
    );
    const { zona, offset_segundos } = rows[0];
    zonaHorariaBase = zona;
    try {
        formateadorDeZona(zona);
        offsetFijoSegundos = null;
    } catch {
        offsetFijoSegundos = Number(offset_segundos);
    }
    return { zona, offsetSegundos: Number(offset_segundos) };
};

export default db;
