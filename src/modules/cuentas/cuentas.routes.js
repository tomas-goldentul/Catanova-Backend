import { Router } from "express";
import * as cuentasController from "./cuentas.controller.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const cuenta = await cuentasController.crearCuenta(req.body);
        res.status(201).json(cuenta);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.put("/", async (req, res) => {
    try {
        const cuenta = await cuentasController.actualizarCuenta(req.body);
        res.status(200).json(cuenta);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.get("/email/:email", async (req, res) => {
    try {
        const cuenta = await cuentasController.obtenerCuentaPorEmail(
            req.params.email
        );

        res.status(200).json(cuenta);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});

export default router;