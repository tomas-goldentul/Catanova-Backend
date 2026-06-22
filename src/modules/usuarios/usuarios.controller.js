import * as usuariosModel from "./usuarios.model.js";

export const verificarExistenciaUsuario = async (id_usuario) => {

    const usuario = await usuariosModel.getUsuarioId(id_usuario);

    if (!usuario) {
        throw new Error("El usuario no existe");
    }

    return usuario;
};

export const insertUsuario = async ({
    nombre,
    apellido,
    telefono,
    id_cuenta
}) => {

    if (!nombre || !apellido || !id_cuenta) {
        throw new Error("Faltan completar campos obligatorios");
    }

    const usuario = {
        nombre,
        apellido,
        telefono,
        id_cuenta
    };

    return await usuariosModel.agregarUsuario(usuario);
};

export const getUsuarios = async () => {

    const usuarios = await usuariosModel.getAllUsuarios();

    if (usuarios.length === 0) {
        throw new Error("No hay usuarios cargados");
    }

    return usuarios;
};

export const updateUsuario = async ({
    id_usuario,
    nombre,
    apellido,
    telefono
}) => {

    await verificarExistenciaUsuario(id_usuario);

    const usuario = {
        id_usuario,
        nombre,
        apellido,
        telefono
    };

    return await usuariosModel.editarUsuario(usuario);
};

export const deleteUsuario = async (id_usuario) => {

    await verificarExistenciaUsuario(id_usuario);

    return await usuariosModel.eliminarUsuario(id_usuario);
};

export const getUsuario = async (id_usuario) => {

    return await verificarExistenciaUsuario(id_usuario);
};