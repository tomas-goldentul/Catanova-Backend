import * as categoriasModel from "./categorias.model.js";
import * as tiendasModel from "../tiendas/tiendas.model.js";

export const insertCategoria = async (nombre, id_tienda, productos = []) => {
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

    // Si se proporcionan productos, asociarlos a la categoría
    if (Array.isArray(productos) && productos.length > 0) {
        for (const producto of productos) {
            const idProducto = Number(producto.id_producto || producto);
            if (Number.isInteger(idProducto) && idProducto > 0) {
                try {
                    await categoriasModel.insertProductoEnCategoria(categoriaCreada.id_categoria, idProducto);
                } catch (error) {
                    console.warn(`No se pudo asociar el producto ${idProducto}:`, error.message);
                }
            }
        }
    }

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

export const updateCategoria = async (id_categoria, nombre, productos = []) => {
    const idCategoria = Number(id_categoria);
    if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
        const error = new Error("Ingresa un id_categoria válido");
        error.status = 400;
        throw error;
    }

    const nombreLimpio = typeof nombre === "string" ? nombre.trim() : "";
    if (nombreLimpio === "") {
        const error = new Error("Ingresa un nombre");
        error.status = 400;
        throw error;
    }

    const categoriaExiste = await categoriasModel.getCategoriasByiD(idCategoria);
    if (!categoriaExiste) {
        const error = new Error(`Categoría con id ${idCategoria} no encontrada`);
        error.status = 404;
        throw error;
    }

    const categoriaActualizada = await categoriasModel.updateCategoria(idCategoria, nombreLimpio);

    // Si se proporcionan productos, actualizar la relación
    if (Array.isArray(productos)) {
        // Eliminar todos los productos actuales
        await categoriasModel.deleteAllProductosDeCategoria(idCategoria);

        // Asociar los nuevos productos
        for (const producto of productos) {
            const idProducto = Number(producto.id_producto || producto);
            if (Number.isInteger(idProducto) && idProducto > 0) {
                try {
                    await categoriasModel.insertProductoEnCategoria(idCategoria, idProducto);
                } catch (error) {
                    console.warn(`No se pudo asociar el producto ${idProducto}:`, error.message);
                }
            }
        }
    }

    return categoriaActualizada;
}

export const deleteCategoria = async (id_categoria) => {
    const idCategoria = Number(id_categoria);
    if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
        const error = new Error("Ingresa un id_categoria válido");
        error.status = 400;
        throw error;
    }

    const categoriaExiste = await categoriasModel.getCategoriasByiD(idCategoria);
    if (!categoriaExiste) {
        const error = new Error(`Categoría con id ${idCategoria} no encontrada`);
        error.status = 404;
        throw error;
    }

    // Eliminar todos los productos asociados a la categoría
    await categoriasModel.deleteAllProductosDeCategoria(idCategoria);

    const categoriaEliminada = await categoriasModel.deleteCategoria(idCategoria);
    return categoriaEliminada;
}

export const getProductosPorCategoria = async (id_categoria) => {
    const idCategoria = Number(id_categoria);
    if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
        const error = new Error("Ingresa un id_categoria válido");
        error.status = 400;
        throw error;
    }

    const categoriaExiste = await categoriasModel.getCategoriasByiD(idCategoria);
    if (!categoriaExiste) {
        const error = new Error(`Categoría con id ${idCategoria} no encontrada`);
        error.status = 404;
        throw error;
    }

    const productos = await categoriasModel.getProductosPorCategoria(idCategoria);
    return productos;
}

export const insertProductoEnCategoria = async (id_categoria, id_producto) => {
    const idCategoria = Number(id_categoria);
    const idProducto = Number(id_producto);

    if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
        const error = new Error("Ingresa un id_categoria válido");
        error.status = 400;
        throw error;
    }

    if (!Number.isInteger(idProducto) || idProducto <= 0) {
        const error = new Error("Ingresa un id_producto válido");
        error.status = 400;
        throw error;
    }

    const categoriaExiste = await categoriasModel.getCategoriasByiD(idCategoria);
    if (!categoriaExiste) {
        const error = new Error(`Categoría con id ${idCategoria} no encontrada`);
        error.status = 404;
        throw error;
    }

    // Aquí podrías validar que el producto exista si tienes acceso a su modelo
    // const productoExiste = await productosModel.getProductoById(idProducto);

    const productoYaExiste = await categoriasModel.getProductosCategoriaByiD(idCategoria, idProducto);
    if (productoYaExiste) {
        const error = new Error(`El producto con id ${idProducto} ya está asociado a esta categoría`);
        error.status = 400;
        throw error;
    }

    const relacion = await categoriasModel.insertProductoEnCategoria(idCategoria, idProducto);
    return relacion;
}

export const deleteProductoDeCategoria = async (id_categoria, id_producto) => {
    const idCategoria = Number(id_categoria);
    const idProducto = Number(id_producto);

    if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
        const error = new Error("Ingresa un id_categoria válido");
        error.status = 400;
        throw error;
    }

    if (!Number.isInteger(idProducto) || idProducto <= 0) {
        const error = new Error("Ingresa un id_producto válido");
        error.status = 400;
        throw error;
    }

    const categoriaExiste = await categoriasModel.getCategoriasByiD(idCategoria);
    if (!categoriaExiste) {
        const error = new Error(`Categoría con id ${idCategoria} no encontrada`);
        error.status = 404;
        throw error;
    }

    const productoYaExiste = await categoriasModel.getProductosCategoriaByiD(idCategoria, idProducto);
    if (!productoYaExiste) {
        const error = new Error(`El producto con id ${idProducto} no está asociado a esta categoría`);
        error.status = 404;
        throw error;
    }

    const relacion = await categoriasModel.deleteProductoDeCategoria(idCategoria, idProducto);
    return relacion;
}

export const checkProductoAsociado = async (id_categoria, id_producto) => {
    const idCategoria = Number(id_categoria);
    const idProducto = Number(id_producto);

    if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
        return null;
    }

    if (!Number.isInteger(idProducto) || idProducto <= 0) {
        return null;
    }

    const productoAsociado = await categoriasModel.getProductosCategoriaByiD(idCategoria, idProducto);
    return productoAsociado;
}