import express from "express";
import * as categoriasController from "./categorias.controller.js";
import { StatusCodes } from "http-status-codes";
import { Result } from "pg";
const router = express.Router();

router.post("/insert", async (req, res) => {
    try {
        const { nombreTienda } = req.body;
        const result = await categoriasController.insertCategoria(nombreTienda);
        res.status(StatusCodes.CREATED).json(result);
    }
    catch (error) {
        console.error("Error en la ruta insertCategoria:", error);
        if (error.message === "El nombre ingresado ya existe ") {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al agregar categoria", error: error.message });
    }

})

router.get("/all", async (req, res) => {
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

export default router;