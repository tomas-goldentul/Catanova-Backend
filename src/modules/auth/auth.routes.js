import { Router } from "express";
import * as authController from "./auth.controller.js";

const router = Router();

router.post("/register/usuario", async (req, res) => {
    try {
        const usuario = await authController.registrarUsuario(req.body);

        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.post("/register/tienda", async (req, res) => {
    try {
        const tienda = await authController.registrarTienda(req.body);

        res.status(201).json(tienda);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const resultado = await authController.login(req.body);

        res.status(200).json(resultado);
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
});

export default router;