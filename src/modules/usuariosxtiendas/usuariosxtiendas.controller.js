import * as model from "./usuariosxtiendas.model.js";
import * as usuariosModel from "../usuarios/usuarios.model.js";

export const listarUsuariosDeTienda = async (id_tienda) => {
    if (!id_tienda) {
        throw new Error("El id_tienda es obligatorio.");
    }
    return await model.getUsuariosPorTienda(id_tienda);
};

export const agregarUsuarioATienda = async ({ id_usuario, id_tienda }) => {
    if (!id_usuario || !id_tienda) {
        throw new Error("Se requieren id_usuario e id_tienda.");
    }

    const usuario = await usuariosModel.getUsuarioId(id_usuario);
    if (!usuario) {
        throw new Error(`El usuario con ID ${id_usuario} no existe.`);
    }

    return await model.asociarUsuarioTienda(id_usuario, id_tienda);
};

export const quitarUsuarioDeTienda = async ({ id_usuario, id_tienda }) => {
    if (!id_usuario || !id_tienda) {
        throw new Error("Se requieren id_usuario e id_tienda.");
    }

    const eliminado = await model.desasociarUsuarioTienda(id_usuario, id_tienda);
    if (!eliminado) {
        throw new Error("Esa asociación no existe.");
    }

    return eliminado;
};
