import * as categoriasModel from "./categorias.model.js";
import * as tiendasModel from "../tiendas/tiendas.model.js";

export const insertCategoria = async (nombre, id_tienda) => {
    const nombreLimpio = typeof nombre === "string" ? nombre.trim() : "";
    if (nombreLimpio === "") {
        const error = new Error("Ingresa un nombre");
        error.status = 400;
        throw error;
    }

    const idTienda = Number(id_tienda);
    if (!Number.isInteger(idTienda) || idTienda <= 0) {
        const error = new Error("Ingresa un id_tienda valido");
        error.status = 400;
        throw error;
    }

    const tienda = await tiendasModel.getTiendaById(idTienda);
    if (!tienda) {
        const error = new Error(`No existe la tienda con id: ${idTienda}`);
        error.status = 404;
        throw error;
    }

    const existeNombreCategoria = await categoriasModel.getCategoriaPorNombre(nombreLimpio, idTienda);
    if (existeNombreCategoria) {
        const error = new Error(`Ya existe el nombre de categoria: ${nombreLimpio}`);
        error.status = 400;
        throw error;
    }

    const categoriaCreada = await categoriasModel.insertCategoria(nombreLimpio, idTienda);
    return categoriaCreada;

}

export const getAllCategorias = async () => {
    const categorias = await categoriasModel.getAllCategorias();
    return categorias;
}

export const getCategoriasByiD = async (id_categoria) => {
    const categoria = await categoriasModel.getCategoriasByiD(id_categoria);
    if (!categoria) {
        const error = new Error("Categoría no encontrada");
        error.status = 404;
        throw error;
    }
    return categoria;
}

export const getCategoriasPorTienda = async (id_tienda) => {
    const categorias = await categoriasModel.getCategoriasPorTienda(id_tienda);
    return categorias;
}