import { crearCuenta, obtenerCuentaPorEmail } from "../cuentas/cuentas.controller.js";
import { insertUsuario } from "../usuarios/usuarios.controller.js";
import { insertTienda } from "../tiendas/tiendas.controller.js";

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

    // Después reemplazar por bcrypt.compare()
    if (cuenta.password !== password) {
        throw new Error("Email o contraseña incorrectos");
    }

    return {
        id_cuenta: cuenta.id_cuenta,
        email: cuenta.email,
        tipo: cuenta.tipo
    };
};