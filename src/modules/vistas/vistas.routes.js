import { Router } from "express";
import * as vistasController from "./vistas.controller.js";
import { verificarToken, leerTokenOpcional } from "../auth/auth.middleware.js";
import { getVistasTienda } from "../estadisticas/estadisticas.controller.js";

const router = Router();

const responderError = (res, error, statusPorDefecto = 500) => {
    res.status(error.status || statusPorDefecto).json({ message: error.message });
};

// --- Públicas (las usa el catálogo) ---
router.get("/producto/:id/cantidad", async (req, res) => {
    try {
        res.json(await vistasController.getCantidadVistasProducto(req.params.id));
    } catch (error) {
        responderError(res, error);
    }
});

// Token opcional: con sesión de usuario se toma su id; la tienda dueña del producto no suma vistas.
// 201 si se registró; 200 con { registrada: false, motivo } si no se cuenta ("propia" o "repetida").
router.post("/", async (req, res) => {
    try {
        const vista = await vistasController.insertVista(req.body || {}, leerTokenOpcional(req));
        res.status(vista.registrada ? 201 : 200).json(vista);
    } catch (error) {
        responderError(res, error, 400);
    }
});

// --- Requieren token y ser dueño de la tienda ---

// Vistas de los productos de la tienda logueada. ?desde=ISO&hasta=ISO (por defecto, últimos 30 días).
router.get("/tienda/:id_tienda", verificarToken, async (req, res) => {
    try {
        const data = await getVistasTienda(req.params.id_tienda, req.query, req.user);
        res.json({ success: true, data });
    } catch (error) {
        responderError(res, error);
    }
});

router.get("/producto/:id", verificarToken, async (req, res) => {
    try {
        res.json(await vistasController.getVistasProducto(req.params.id, req.user));
    } catch (error) {
        responderError(res, error);
    }
});

router.get("/:id", verificarToken, async (req, res) => {
    try {
        res.json(await vistasController.getVista(req.params.id, req.user));
    } catch (error) {
        responderError(res, error);
    }
});

router.delete("/:id", verificarToken, async (req, res) => {
    try {
        res.json(await vistasController.deleteVista(req.params.id, req.user));
    } catch (error) {
        responderError(res, error);
    }
});

export default router;
