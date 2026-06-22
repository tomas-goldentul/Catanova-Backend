import * as cuentasModel from "./cuentas.model.js";

export const verificarExistenciaCuenta = async (id_cuenta) => {
    const cuenta = await cuentasModel.getCuentaById(id_cuenta);

    if (!cuenta) {
        throw new Error("La cuenta no existe");
    }

    return cuenta;
};

export const crearCuenta = async ({ email, password, tipo, foto_perfil }) => {

    const cuentaExistente = await cuentasModel.buscarCuentaPorEmail(email);

    if (cuentaExistente) {
        throw new Error("Ya existe una cuenta con ese email");
    }

    const cuenta = { email, password, tipo, foto_perfil: foto_perfil || null };

    return await cuentasModel.crearCuenta(cuenta);
};

export const actualizarCuenta = async ({ id_cuenta, email, password, tipo, foto_perfil }) => {

    if (!id_cuenta) {
        throw new Error("El id_cuenta es obligatorio");
    }

    const cuentaActual = await verificarExistenciaCuenta(id_cuenta);

    if (cuentaActual.email !== email) {
        const emailDuplicado = await cuentasModel.buscarCuentaPorEmail(email);

        if (emailDuplicado) {
            throw new Error("El email ya está en uso");
        }
    }

    const cuenta = { id_cuenta: Number(id_cuenta), email, password, tipo, foto_perfil };

    return await cuentasModel.editarCuenta(cuenta);
};

export const obtenerCuentaPorEmail = async (email) => {

    const cuenta = await cuentasModel.buscarCuentaPorEmail(email);

    if (!cuenta) {
        throw new Error("Cuenta no encontrada");
    }

    return cuenta;
};