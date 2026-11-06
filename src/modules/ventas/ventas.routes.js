import { Router } from "express";
import * as ventasController from "./ventas.controller.js";
import { verificarToken } from "../auth/auth.middleware.js";

const router = Router();

// Errores con status explícito (401/403/404/400) se respetan; el resto usa el status por defecto de la ruta.
const responderError = (res, error, statusPorDefecto) => {
	res.status(error.status || statusPorDefecto).json({ message: error.message });
};

// --- Pública (la usa el catálogo) ---
router.get("/producto/:id/cantidad", async (req, res) => {
	try {
		const cantidad = await ventasController.getCantidadVentasProducto(req.params.id);
		res.json(cantidad);
	} catch (error) {
		responderError(res, error, 500);
	}
});

// --- Requieren token y ser dueño de la tienda ---

// Ventas de una tienda con nombre de producto
router.get("/tienda/:id", verificarToken, async (req, res) => {
	try {
		const ventas = await ventasController.getVentasPorTienda(req.params.id, req.user);
		res.json(ventas);
	} catch (error) {
		responderError(res, error, 400);
	}
});

// Registrar venta manual (descuenta stock en transacción)
router.post("/manual", verificarToken, async (req, res) => {
	try {
		const venta = await ventasController.registrarVentaManual(req.body, req.user);
		res.status(201).json(venta);
	} catch (error) {
		const status = error.message.includes("insuficiente") || error.message.includes("no existe") ? 400 : 500;
		responderError(res, error, status);
	}
});

router.get("/:id", verificarToken, async (req, res) => {
	try {
		const venta = await ventasController.getVenta(req.params.id, req.user);
		res.json(venta);
	} catch (error) {
		responderError(res, error, 500);
	}
});

router.post("/", verificarToken, async (req, res) => {
	try {
		const venta = await ventasController.insertVenta(req.body, req.user);
		res.status(201).json(venta);
	} catch (error) {
		responderError(res, error, 400);
	}
});

router.put("/", verificarToken, async (req, res) => {
	try {
		const venta = await ventasController.updateVenta(req.body, req.user);
		res.json(venta);
	} catch (error) {
		responderError(res, error, 400);
	}
});

router.delete("/:id", verificarToken, async (req, res) => {
	try {
		const venta = await ventasController.deleteVenta(req.params.id, req.user);
		res.json(venta);
	} catch (error) {
		responderError(res, error, 400);
	}
});

export default router;
