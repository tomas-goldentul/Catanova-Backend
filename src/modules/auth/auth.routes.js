import { Router } from "express";
import * as authController from "./auth.controller.js";
import { hashPassword, verificarToken } from "./auth.middleware.js";

const router = Router();

router.post("/register/usuario", hashPassword, async (req, res) => {
    try {
        const usuario = await authController.registrarUsuario(req.body);

        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.post("/register/tienda", hashPassword, async (req, res) => {
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

router.get("/perfil", verificarToken, (req, res) => {
    res.status(200).json({
        message: "Acceso concedido",
        usuario: req.user 
    });
});

export default router;