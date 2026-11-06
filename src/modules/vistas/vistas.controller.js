import * as vistasModel from "./vistas.model.js";
import { crearError, verificarDuenioTienda } from "../auth/auth.middleware.js";

// Devuelve la vista solo si es de un producto de la tienda del token.
const obtenerVistaPropia = async (id, usuarioToken) => {
    verificarDuenioTienda(usuarioToken, usuarioToken?.id_tienda);
    const vista = await vistasModel.getVistaById(id);
    if (!vista) throw crearError("La vista no existe", 404);
    const producto = await vistasModel.getTiendaDeProducto(vista.id_producto);
    verificarDuenioTienda(usuarioToken, producto?.id_tienda);
    return vista;
};

export const getVista = async (id, usuarioToken) => {
    return await obtenerVistaPropia(id, usuarioToken);
};

export const insertVista = async (vista) => {
    if (!vista.id_producto)
        throw crearError("Falta el producto", 400);

    if (!vista.id_usuario)
        throw crearError("Falta el usuario", 400);

    return await vistasModel.agregarVista(vista);
};

export const deleteVista = async (id, usuarioToken) => {
    await obtenerVistaPropia(id, usuarioToken);
    return await vistasModel.eliminarVista(id);
};

export const getCantidadVistasProducto = async (id_producto) => {
    return await vistasModel.getCantidadVistasProducto(id_producto);
};

// Detalle de vistas (incluye id_usuario): solo para la tienda dueña del producto.
export const getVistasProducto = async (id_producto, usuarioToken) => {
    verificarDuenioTienda(usuarioToken, usuarioToken?.id_tienda);
    const producto = await vistasModel.getTiendaDeProducto(id_producto);
    if (!producto) throw crearError("El producto no existe", 404);
    verificarDuenioTienda(usuarioToken, producto.id_tienda);
    return await vistasModel.getVistasProducto(id_producto);
};
