import * as vistasModel from "./vistas.model.js";
import { crearError, verificarDuenioTienda } from "../auth/auth.middleware.js";
import { getUsuarioPorCuenta } from "../usuarios/usuarios.model.js";

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

// Minutos en los que una nueva vista del mismo usuario al mismo producto no se vuelve a contar.
const MINUTOS_SIN_REPETIR = 30;

// Registra la vista de un producto. Con token de usuario, el id_usuario sale del token.
// No se cuenta: la tienda dueña mirando su propio producto, ni el mismo usuario dentro de 30 min.
export const insertVista = async (vista, usuarioToken) => {
    const id_producto = Number(vista?.id_producto);
    if (!id_producto) throw crearError("Falta el producto", 400);

    const producto = await vistasModel.getTiendaDeProducto(id_producto);
    if (!producto) throw crearError("El producto no existe", 404);

    if (usuarioToken?.tipo === "tienda" && Number(usuarioToken.id_tienda) === Number(producto.id_tienda)) {
        return { registrada: false, motivo: "propia" };
    }

    let id_usuario = vista.id_usuario ? Number(vista.id_usuario) : null;
    if (usuarioToken?.tipo === "usuario") {
        const usuario = await getUsuarioPorCuenta(usuarioToken.id_cuenta);
        if (usuario?.id_usuario) id_usuario = Number(usuario.id_usuario);
    }

    if (id_usuario && await vistasModel.existeVistaReciente(id_producto, id_usuario, MINUTOS_SIN_REPETIR)) {
        return { registrada: false, motivo: "repetida" };
    }

    const nueva = await vistasModel.agregarVista({ id_producto, id_usuario });
    return { registrada: true, ...nueva };
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
