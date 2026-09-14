import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../../config/db-config.js";
import { crearCuenta, obtenerCuentaPorEmail } from "../cuentas/cuentas.controller.js";
import { insertUsuario } from "../usuarios/usuarios.controller.js";
import { insertTienda, getTiendaPorCuenta } from "../tiendas/tiendas.controller.js";

const JWT_SECRET = process.env.JWT_SECRET || "catanova_secret";

async function crearDuenioSiFalta({ id_duenio, nombre, apellido, email, telefono }) {
    if (id_duenio) return Number(id_duenio);

    const result = await db.query(
        `INSERT INTO duenios (nombre, apellido, email, telefono)
         VALUES ($1, $2, $3, $4)
         RETURNING id_duenio;`,
        [nombre || "Dueño", apellido || "", email || "", telefono || ""]
    );

    return result.rows[0].id_duenio;
}

async function obtenerProvinciaPorDefecto(id_provincia) {
    if (id_provincia) return Number(id_provincia);

    const result = await db.query(
        `SELECT id_provincia FROM provincias ORDER BY id_provincia ASC LIMIT 1;`
    );

    return result.rows[0]?.id_provincia ?? 1;
}

export const registrarUsuario = async ({ email, password, nombre, apellido, telefono, foto_perfil }) => {
    const cuenta = await crearCuenta({ email, password, tipo: "usuario", foto_perfil: foto_perfil || null });

    return await insertUsuario({ nombre, apellido, telefono, id_cuenta: cuenta.id_cuenta });
};

export const registrarTienda = async ({ email, password, nombre, apellido, telefono, foto_perfil, nombre_tienda, slogan, descripcion, descripcion_tienda, direccion, direccion_tienda, id_duenio, id_provincia }) => {
    const cuenta = await crearCuenta({
        email,
        password,
        tipo: "tienda",
        foto_perfil: foto_perfil || null
    });

    const idDuenio = await crearDuenioSiFalta({ id_duenio, nombre, apellido, email, telefono });

    return await insertTienda({
        nombre: nombre_tienda || nombre,
        slogan: slogan || descripcion || descripcion_tienda || "",
        telefono: telefono || "",
        direccion: direccion || direccion_tienda || "",
        id_duenio: idDuenio,
        id_provincia: await obtenerProvinciaPorDefecto(id_provincia),
        color_primario: null,
        color_secundario: null,
        color_terciario: null,
        id_cuenta: cuenta.id_cuenta,
        abierta: true
    });
};

export const login = async ({ email, password }) => {
    const cuenta = await obtenerCuentaPorEmail(email);

    if (!cuenta) {
        throw new Error("Email o contraseña incorrectos");
    }

    const passwordValido = await bcrypt.compare(password, cuenta.password);
    if (!passwordValido) {
        throw new Error("Email o contraseña incorrectos");
    }

    let id_tienda = null;
    if (cuenta.tipo === "tienda") {
        const tienda = await getTiendaPorCuenta(cuenta.id_cuenta);
        if (tienda?.id_tienda) {
            id_tienda = tienda.id_tienda;
        }
    }

    const tokenPayload = {
        id_cuenta: cuenta.id_cuenta,
        email: cuenta.email,
        tipo: cuenta.tipo,
        id_tienda
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
        expiresIn: "1h"
    });

    return {
        id_cuenta: cuenta.id_cuenta,
        email: cuenta.email,
        tipo: cuenta.tipo,
        id_tienda,
        token
    };
};