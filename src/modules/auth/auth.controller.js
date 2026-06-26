import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { crearCuenta, obtenerCuentaPorEmail } from "../cuentas/cuentas.controller.js";
import { insertUsuario } from "../usuarios/usuarios.controller.js";
import { insertTienda } from "../tiendas/tiendas.controller.js";

const JWT_SECRET = process.env.JWT_SECRET || "catanova_secret";

export const registrarUsuario = async ({ email, password, nombre, apellido, telefono, foto_perfil }) => {
    const cuenta = await crearCuenta({ email, password, tipo: "usuario", foto_perfil: foto_perfil || null });

    return await insertUsuario({ nombre, apellido, telefono, id_cuenta: cuenta.id_cuenta });
};

export const registrarTienda = async ({ email, password, nombre, slogan, telefono, direccion, id_duenio, id_provincia, color_primario, color_secundario, color_terciario, foto_perfil }) => {
    const cuenta = await crearCuenta({
        email,
        password,
        tipo: "tienda",
        foto_perfil: foto_perfil || null
    });

    return await insertTienda({ nombre, slogan, telefono, direccion, id_duenio, id_provincia, color_primario, color_secundario, color_terciario, id_cuenta: cuenta.id_cuenta });
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

    const token = jwt.sign(
        {
            id_cuenta: cuenta.id_cuenta,
            email: cuenta.email,
            tipo: cuenta.tipo
        },
        JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return {
        id_cuenta: cuenta.id_cuenta,
        email: cuenta.email,
        tipo: cuenta.tipo,
        token
    };
};