import express from "express";
import { insertTienda, updateTienda, getNombreTienda, getSloganTienda } from "./tiendas.controller.js";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

//crear tienda
router.post('/insert', async (req, res) => {
    try {
        const datosTienda = req.body;

        if (!datosTienda.nombre) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "El campo 'nombre' es obligatorio." });
        }

        const result = await insertTienda(datosTienda);
        res.status(StatusCodes.CREATED).json({
            message: "Tienda creada con éxito",
            data: result
        });

    } catch (error) {
        console.error("Error en la ruta insertTienda:", error);
        if (error.message === "La tienda ya existe") {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al agregar tienda", error: error.message });
    }
});

//actualizar tienda
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const datosCompletos = {
            id_tienda: Number(id),
            ...req.body
        };

        const result = await updateTienda(datosCompletos);

        res.status(StatusCodes.OK).json({
            message: "Tienda actualizada con éxito",
            data: result
        });
    }
    catch (error) {
        if (
            error.message.includes("Faltan completar campos") ||
            error.message.includes("La tienda no existe") ||
            error.message.includes("El nuevo nombre ya")
        ) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
        }

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error interno del servidor", error: error.message });
    }
});



router.get('/get/nombre/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const nombre = await getNombreTienda(id);

        if (!nombre) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Nombre de tienda no encontrado" });
        }
        res.status(StatusCodes.OK).json({
            message: "Nombre de tienda encontrado",
            data: { nombre }
        });
    } catch (error) {
        console.error("Error en la ruta getNombreTienda:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al obtener nombre de tienda", error: error.message });
    }
});

router.get('/get/slogan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const slogan = await getSloganTienda(id);

        if (!slogan) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Slogan de tienda no encontrado" });
        }
        res.status(StatusCodes.OK).json({
            message: "Slogan de tienda encontrado",
            data: { slogan }
        });
    } catch (error) {
        console.error("Error en la ruta getSloganTienda:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al obtener slogan de tienda", error: error.message });
    }
});

export default router;