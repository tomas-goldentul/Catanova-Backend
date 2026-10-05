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
        const error = new Error("Ingresa un id_tienda válido");
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
        const error = new Error(`Ya existe una categoría llamada "${nombreLimpio}" en esta tienda`);
        error.status = 400;
        throw error;
    }

    const categoriaCreada = await categoriasModel.insertCategoria(nombreLimpio, idTienda);

    if (Array.isArray(productos) && productos.length > 0) {
        for (const producto of productos) {
            const idProducto = Number(producto.id_producto ?? producto.id ?? producto);

            if (!Number.isInteger(idProducto) || idProducto <= 0) continue;

            try {
                await categoriasModel.insertProductoEnCategoria(
                    categoriaCreada.id_categoria,
                    idProducto
                );
            } catch (error) {
                console.warn(`No se pudo asociar el producto ${idProducto}:`, error.message);
            }
        }
    }

    return categoriaCreada;
};

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

export const updateCategoria = async (id_categoria, nombre, id_tienda, productos = []) => {
    const idCategoria = Number(id_categoria);
    const idTienda = Number(id_tienda);

    if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
        const error = new Error("Ingresa un id_categoria válido");
        error.status = 400;
        throw error;
    }

    if (!Number.isInteger(idTienda) || idTienda <= 0) {
        const error = new Error("Ingresa un id_tienda válido");
        error.status = 400;
        throw error;
    }

    const nombreLimpio = typeof nombre === "string" ? nombre.trim() : "";
    if (nombreLimpio === "") {
        const error = new Error("Ingresa un nombre");
        error.status = 400;
        throw error;
    }

    const categoriaExiste = await categoriasModel.getCategoriaByIdYTienda(idCategoria, idTienda);
    if (!categoriaExiste) {
        const error = new Error(`Categoría con id ${idCategoria} no encontrada en la tienda ${idTienda}`);
        error.status = 404;
        throw error;
    }

    const duplicado = await categoriasModel.getCategoriaPorNombre(nombreLimpio, idTienda);
    if (duplicado && duplicado.id_categoria !== idCategoria) {
        const error = new Error(`Ya existe otra categoría llamada "${nombreLimpio}" en esta tienda`);
        error.status = 400;
        throw error;
    }

    const categoriaActualizada = await categoriasModel.updateCategoria(idCategoria, nombreLimpio, idTienda);

    await categoriasModel.deleteAllProductosDeCategoria(idCategoria);

    if (Array.isArray(productos) && productos.length > 0) {
        for (const producto of productos) {
            const idProducto = Number(producto.id_producto ?? producto.id ?? producto);

            if (!Number.isInteger(idProducto) || idProducto <= 0) continue;

            try {
                await categoriasModel.insertProductoEnCategoria(
                    idCategoria,
                    idProducto,
                );
            } catch (error) {
                console.warn(`No se pudo actualizar el producto ${idProducto}:`, error.message);
            }
        }
    }

    return categoriaActualizada;
};

export const deleteCategoria = async (id_categoria, id_tienda) => {
    const idCategoria = Number(id_categoria);
    const idTienda = Number(id_tienda);

    if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
        const error = new Error("Ingresa un id_categoria válido");
        error.status = 400;
        throw error;
    }

    if (!Number.isInteger(idTienda) || idTienda <= 0) {
        const error = new Error("Ingresa un id_tienda válido");
        error.status = 400;
        throw error;
    }

    const categoriaExiste = await categoriasModel.getCategoriaByIdYTienda(idCategoria, idTienda);
    if (!categoriaExiste) {
        const error = new Error(`Categoría con id ${idCategoria} no encontrada en la tienda ${idTienda}`);
        error.status = 404;
        throw error;
    }

    await categoriasModel.deleteAllProductosDeCategoria(idCategoria);

    const categoriaEliminada = await categoriasModel.deleteCategoria(idCategoria, idTienda);
    return categoriaEliminada;
};

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