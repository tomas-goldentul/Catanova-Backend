import { Router } from "express";
import * as usuariosController from "./usuarios.controller.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const usuarios = await usuariosController.getUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const usuario = await usuariosController.getUsuario(
            req.params.id
        );

        res.json(usuario);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const usuario = await usuariosController.insertUsuario(
            req.body
        );

        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.put("/", async (req, res) => {
    try {
        const usuario = await usuariosController.updateUsuario(
            req.body
        );

        res.json(usuario);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const usuario = await usuariosController.deleteUsuario(
            req.params.id
        );

        res.json(usuario);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

export default router;