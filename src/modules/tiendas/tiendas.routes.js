import express from "express";
import { insertTienda, updateTienda } from "./tiendas.controller.js";

const router = express.Router();
//crear tienda
router.post('/insert', async (req, res) => {
    try {
        const datosTienda = req.body;

        if (!datosTienda.nombre) {
            return res.status(400).json({ message: "El campo 'nombre' es obligatorio." });
        }

        const result = await insertTienda(datosTienda);
        res.status(201).json({
            message: "Tienda creada con éxito",
            data: result
        });

    } catch (error) {
        console.error("Error en la ruta insertTienda:", error);
        if (error.message === "La tienda ya existe") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Error al agregar tienda", error: error.message });
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

        res.json({
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
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}
)
export default router;