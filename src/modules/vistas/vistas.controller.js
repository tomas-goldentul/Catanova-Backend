import * as vistasModel from "./vistas.model.js";

export const getVistas = async () => {
    return await vistasModel.getAllVistas();
};

export const getVista = async (id) => {
    const vista = await vistasModel.getVistaById(id);

    if (!vista)
        throw new Error("La vista no existe");

    return vista;
};

export const insertVista = async (vista) => {

    if (!vista.id_producto)
        throw new Error("Falta el producto");

    if (!vista.id_usuario)
        throw new Error("Falta el usuario");

    return await vistasModel.agregarVista(vista);
};

export const deleteVista = async (id) => {

    const vista = await vistasModel.getVistaById(id);

    if (!vista)
        throw new Error("La vista no existe");

    return await vistasModel.eliminarVista(id);
};

export const getCantidadVistasProducto = async (id_producto) => {
    return await vistasModel.getCantidadVistasProducto(id_producto);
};

export const getVistasProducto = async (id_producto) => {
    return await vistasModel.getVistasProducto(id_producto);
};

export const getCantidadVistasUltimos7Dias = async () => {
    return await vistasModel.getCantidadVistasUltimos7Dias();
};

export const getCantidadVistasUltimoMes = async () => {
    return await vistasModel.getCantidadVistasUltimoMes();
};

export const getCantidadVistasUltimoAno = async () => {
    return await vistasModel.getCantidadVistasUltimoAno();
};

export const getCantidadVistasUltimos2Anios = async () => {
    return await vistasModel.getCantidadVistasUltimos2Anios();
};