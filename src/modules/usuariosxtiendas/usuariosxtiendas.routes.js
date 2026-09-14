import { Router } from "express";
import * as controller from "./usuariosxtiendas.controller.js";

const router = Router();

router.get("/por-tienda/:id_tienda", async (req, res) => {
    try {
        const usuarios = await controller.listarUsuariosDeTienda(req.params.id_tienda);
        res.json(usuarios);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const resultado = await controller.agregarUsuarioATienda(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/", async (req, res) => {
    try {
        const resultado = await controller.quitarUsuarioDeTienda(req.body);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
