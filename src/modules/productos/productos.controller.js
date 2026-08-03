import * as productosModel from "./productos.model.js";
import { getTiendaId } from "../tiendas/tiendas.controller.js"

// ==========================================
// Modulos de ayuda que se pueden reutilizar
// ==========================================
export const verificarExistenciaTienda = async (id_tienda) => {
    const existeTienda = await getTiendaId(id_tienda);
    if (!existeTienda) throw new Error("El id tienda no existe");
}

const verificarExistenciaProducto = async (id_producto) => {
    const productoActual = await productosModel.getProductosId(id_producto);
    if (!productoActual) throw new Error("El producto no existe");
    return productoActual;
};

export const GetProductosActivos = async (req, res) => {
    try {
        const filasModificadas = await productosModel.getProductosActivos();
        if (!filasModificadas || filasModificadas.length === 0) {
            return res.json([]);
        }

        res.json(filasModificadas);
    } catch (error) {
        console.error("Error en getProductos:", error);
        res.status(500).json({ message: "Error al obtener productos", error: error.message });
    }
};

export const insertProducto = async ({ nombre, precio, stock, imagen, activo, id_tienda }) => {

    const existe = await productosModel.buscarProductoPorNombre(nombre);
    if (existe) {
        throw new Error("El producto ya existe");
    }
    await verificarExistenciaTienda(id_tienda);
    const producto = {
        nombre,
        precio: Number(precio),
        stock: Number(stock),
        imagen,
        activo: Boolean(activo),
        id_tienda: Number(id_tienda),
    };

    return await productosModel.agregarProducto(producto);
};

export const getProductos = async () => {
    const listaProductos = await productosModel.getAllProductos();
    if (listaProductos.length === 0) {
        throw new Error("No hay productos cargados");
    }

    return listaProductos;
}

export const updateEstadoProducto = async (id, estado) => {
    await verificarExistenciaProducto(id);
    const productoActualizado = await productosModel.modificarEstado(id, estado);
    return productoActualizado;
}

export const actualizarProducto = async (datosProducto) => {
    const { id_producto, nombre, precio, stock, imagen, activo, id_tienda } = datosProducto;
    if (!id_producto) throw new Error("El ID del producto es obligatorio.");
    if (!nombre || precio === undefined || stock === undefined || id_tienda === undefined) {
        throw new Error("Faltan completar campos obligatorios");
    }

    const productoActual = await verificarExistenciaProducto(id_producto);

    if (productoActual.nombre !== nombre) {
        const nombreDuplicado = await productosModel.buscarProductoPorNombre(nombre);
        if (nombreDuplicado) {
            throw new Error("El nuevo nombre ya está en uso");
        }
    }
    await verificarExistenciaTienda(id_tienda);

    const productoFormateado = {
        id_producto: Number(id_producto),
        nombre,
        precio: Number(precio),
        stock: Number(stock),
        imagen: imagen || "",
        activo: Boolean(activo),
        id_tienda: Number(id_tienda),
    };

    return await productosModel.modificarProducto(productoFormateado);
};

export const eliminarProducto = async (id_producto) => {
    if (!id_producto) {
        throw new Error("El id_producto es obligatorio")
    }
    await verificarExistenciaProducto(id_producto);
    return await productosModel.eliminarProducto(id_producto)
}

export const verDetalleProducto = async (id_producto) => {
    const producto = await productosModel.getProductosId(id_producto);
    if (!producto) {
        throw new Error(`El producto con id: ${id_producto} no existe`);
    }
    return producto;
}

export const getProductosPorCategoria = async (id_categoria, id_tienda = null) => {
    return await productosModel.getProductosPorCategoria(id_categoria, id_tienda);
}

export const getProductosPorTienda = async (id_tienda) => {
    await verificarExistenciaTienda(id_tienda);
    return await productosModel.getProductosPorTienda(id_tienda);
}

export const getTodosProductosPorTienda = async (id_tienda) => {
    await verificarExistenciaTienda(id_tienda);
    return await productosModel.getTodosProductosPorTienda(id_tienda);
}

export const agregarStockProducto = async (id_producto, cantidad) => {
    if (!id_producto) throw new Error("El id_producto es obligatorio");
    if (!cantidad || cantidad <= 0) throw new Error("La cantidad debe ser mayor a 0");
    
    await verificarExistenciaProducto(id_producto);
    return await productosModel.agregarStock(id_producto, Number(cantidad));
};

export const editarStockProducto = async (id_producto, cantidad) => {
    if (!id_producto) throw new Error("El id_producto es obligatorio");
    if (cantidad === undefined || cantidad < 0) throw new Error("La cantidad no puede ser negativa");
    
    await verificarExistenciaProducto(id_producto);
    return await productosModel.editarStock(id_producto, Number(cantidad));
};

export const editarNombreProducto = async (id_producto, nombre) => {
    if (!id_producto) throw new Error("El id_producto es obligatorio");
    if (!nombre || !nombre.trim()) throw new Error("El nombre es obligatorio");
    
    const nombreExistente = await productosModel.buscarProductoPorNombre(nombre.trim());
    if (nombreExistente) throw new Error("El nombre ya existe en otro producto");
    
    await verificarExistenciaProducto(id_producto);
    return await productosModel.editarNombre(id_producto, nombre.trim());
};

export const editarTipoProducto = async (id_producto, tipo) => {
    if (!id_producto) throw new Error("El id_producto es obligatorio");
    if (!tipo || !tipo.trim()) throw new Error("El tipo es obligatorio");
    
    await verificarExistenciaProducto(id_producto);
    return await productosModel.editarTipo(id_producto, tipo.trim());
};

export const cambiarImagenProducto = async (id_producto, imagen) => {
    if (!id_producto) throw new Error("El id_producto es obligatorio");
    if (!imagen || !imagen.trim()) throw new Error("La URL de imagen es obligatoria");
    
    await verificarExistenciaProducto(id_producto);
    return await productosModel.cambiarImagen(id_producto, imagen.trim());
};