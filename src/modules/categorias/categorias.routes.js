import express from "express";
import * as categoriasController from "./categorias.controller.js";
import { StatusCodes } from "http-status-codes";
const router = express.Router();

router.post("/insert", async (req, res) => {
    try {
        const { nombre, id_tienda, productos = [] } = req.body;

        const result = await categoriasController.insertCategoria(nombre, id_tienda, productos);

        res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
        console.error("Error en la ruta insertCategoria:", error);
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error al agregar categoria",
            error: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const result = await categoriasController.getAllCategorias();
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error("Error en la ruta get all categorias:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al ver categorias", error: error.message });
    }
})


router.get("/:id_categoria", async (req, res) => {
    try {
        const { id_categoria } = req.params
        const result = await categoriasController.getCategoriasByiD(id_categoria);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error("Error en la ruta get categoria id:", error);

        const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;

        return res.status(status).json({
            message: error.message || "Error al ver categorias",
        });
    }
})

router.get("/tienda/:id_tienda", async (req, res) => {
    try {
        const { id_tienda } = req.params;
        const result = await categoriasController.getCategoriasPorTienda(id_tienda);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error("Error en la ruta get categorias por tienda:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al ver categorias por tienda", error: error.message });
    }
});

// PUT - Actualizar categoría
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, productos = [], id_tienda } = req.body;

        const result = await categoriasController.updateCategoria(id, nombre, id_tienda, productos);

        res.status(StatusCodes.OK).json({
            message: "Categoría actualizada con éxito",
            data: result
        });
    } catch (error) {
        console.error("Error en la ruta updateCategoria:", error);
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error al actualizar categoría",
            error: error.message
        });
    }
});

// DELETE - Eliminar categoría
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { id_tienda } = req.query;

        const result = await categoriasController.deleteCategoria(id, id_tienda);

        res.status(StatusCodes.OK).json({
            message: "Categoría eliminada con éxito",
            data: result
        });
    } catch (error) {
        console.error("Error en la ruta deleteCategoria:", error);
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error al eliminar categoría",
            error: error.message
        });
    }
});

// GET - Obtener productos de una categoría
router.get("/:id/productos", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await categoriasController.getProductosPorCategoria(id);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        console.error("Error en la ruta getProductosPorCategoria:", error);
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al obtener productos de la categoría", error: error.message });
    }
});

// POST - Asociar producto a categoría
router.post("/:id/productos", async (req, res) => {
    try {
        const { id } = req.params;
        const { id_producto } = req.body;

        if (!id_producto) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "El campo 'id_producto' es obligatorio" });
        }

        const result = await categoriasController.insertProductoEnCategoria(id, id_producto);
        res.status(StatusCodes.CREATED).json({
            message: "Producto asociado a la categoría con éxito",
            data: result
        });
    } catch (error) {
        console.error("Error en la ruta insertProductoEnCategoria:", error);
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al asociar producto a la categoría", error: error.message });
    }
});

// DELETE - Desasociar producto de categoría
router.delete("/:id/productos/:id_producto", async (req, res) => {
    try {
        const { id, id_producto } = req.params;

        const result = await categoriasController.deleteProductoDeCategoria(id, id_producto);
        res.status(StatusCodes.OK).json({
            message: "Producto desasociado de la categoría con éxito",
            data: result
        });
    } catch (error) {
        console.error("Error en la ruta deleteProductoDeCategoria:", error);
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al desasociar producto de la categoría", error: error.message });
    }
});

// PUT - Asociar/Actualizar producto en categoría (upsert)
router.put("/:id/productos/:id_producto", async (req, res) => {
    try {
        const { id, id_producto } = req.params;

        // Verificar si el producto ya está asociado
        const existe = await categoriasController.checkProductoAsociado(id, id_producto);
        
        if (existe) {
            // Ya existe, retornar mensaje informativo
            return res.status(StatusCodes.OK).json({
                message: "El producto ya está asociado a esta categoría",
                data: existe
            });
        }

        // Si no existe, asociarlo
        const result = await categoriasController.insertProductoEnCategoria(id, id_producto);
        res.status(StatusCodes.CREATED).json({
            message: "Producto asociado a la categoría con éxito",
            data: result
        });
    } catch (error) {
        console.error("Error en la ruta PUT producto a categoría:", error);
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al procesar asociación de producto", error: error.message });
    }
});

export default router;