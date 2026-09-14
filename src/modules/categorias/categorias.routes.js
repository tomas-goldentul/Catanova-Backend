import express from "express";
import * as categoriasController from "./categorias.controller.js";
import { StatusCodes } from "http-status-codes";
const router = express.Router();

router.post("/insert", async (req, res) => {
    try {
        const { nombre, id_tienda } = req.body;
        const result = await categoriasController.insertCategoria(nombre, id_tienda);
        res.status(StatusCodes.CREATED).json(result);
    }
    catch (error) {
        console.error("Error en la ruta insertCategoria:", error);
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al agregar categoria", error: error.message });
    }

})

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

export default router;