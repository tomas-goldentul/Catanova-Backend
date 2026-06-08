import { getProductosActivos, agregarProducto, buscarProductoPorNombre, getAllProductos, modificarEstado, getProductosId, modificarProducto } from "./productos.model.js";
import { getTiendaId } from "../tiendas/tiendas.controller.js"

// ==========================================
// Modulos de ayuda que se pueden reutilizar
// ==========================================
export const verificarExistenciaTienda = async (id_tienda) => {
    const existeTienda = await getTiendaId(id_tienda);
    if (!existeTienda) throw new Error("El id tienda no existe");
}

const verificarExistenciaProducto = async (id_producto) => {
    const productoActual = await getProductosId(id_producto);
    if (!productoActual) throw new Error("El producto no existe");
    return productoActual;
};

export const GetProductosActivos = async (req, res) => {
    try {
        const filasModificadas = await getProductosActivos();
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

    const existe = await buscarProductoPorNombre(nombre);
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

    return await agregarProducto(producto);
};

export const getProductos = async () => {
    const listaProductos = await getAllProductos();
    if (listaProductos.length === 0) {
        throw new Error("No hay productos cargados");
    }

    return listaProductos;
}

export const updateEstadoProducto = async (id, estado) => {
    await verificarExistenciaProducto(id);
    const productoActualizado = await modificarEstado(id, estado);
    return productoActualizado;
}

export const actualizarProducto = async (datosProducto) => {
    const { id_producto, nombre, precio, stock, imagen, activo, id_tienda } = datosProducto;
    if (!id_producto) throw new Error("El ID del producto es obligatorio.");
    if (!nombre || precio === undefined || stock === undefined || id_tienda === undefined) {
        throw new Error("Faltan completar campos obligatorios");
    }

    const productoActual = await getProductosId(id_producto);
    if (!productoActual) {
        throw new Error("El producto no existe");
    }

    if (productoActual.nombre !== nombre) {
        const nombreDuplicado = await buscarProductoPorNombre(nombre);
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

    return await modificarProducto(productoFormateado);
};