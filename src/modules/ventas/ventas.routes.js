
import { Router } from "express";
import * as ventasController from "./ventas.controller.js";
import { verificarToken } from "../auth/auth.middleware.js";

const router = Router();

const responderError = (res, error, statusPorDefecto = 500) => {
	res.status(error.status || statusPorDefecto).json({
		message: error.message,
	});
};

// Pública: cantidad de unidades vendidas de un producto.
router.get("/producto/:id/cantidad", async (req, res) => {
	try {
		const cantidad = await ventasController.getCantidadVentasProducto(
			req.params.id
		);
		res.json(cantidad);
	} catch (error) {
		responderError(res, error);
	}
});

// Ventas de una tienda.
router.get("/tienda/:id", verificarToken, async (req, res) => {
	try {
		const ventas = await ventasController.getVentasPorTienda(
			req.params.id,
			req.user,
			{
				desde: req.query.desde,
				hasta: req.query.hasta,
			}
		);

		res.json(ventas);
	} catch (error) {
		responderError(res, error);
	}
});

// Registrar venta manual.
router.post("/manual", verificarToken, async (req, res) => {
	try {
		const venta = await ventasController.registrarVentaManual(
			req.body,
			req.user
		);

		res.status(201).json(venta);
	} catch (error) {
		responderError(res, error);
	}
});

// Obtener una venta.
router.get("/:id", verificarToken, async (req, res) => {
	try {
		const venta = await ventasController.getVenta(
			req.params.id,
			req.user
		);

		res.json(venta);
	} catch (error) {
		responderError(res, error);
	}
});

// Registrar venta por la ruta general.
router.post("/", verificarToken, async (req, res) => {
	try {
		const venta = await ventasController.insertVenta(
			req.body,
			req.user
		);

		res.status(201).json(venta);
	} catch (error) {
		responderError(res, error);
	}
});

// Modificar datos generales.
router.put("/", verificarToken, async (req, res) => {
	try {
		const venta = await ventasController.updateVenta(
			req.body,
			req.user
		);

		res.json(venta);
	} catch (error) {
		responderError(res, error);
	}
});

// Crear/asociar un pedido a una venta sin pedido (no modifica stock).
router.post("/:id/pedido", verificarToken, async (req, res) => {
	try {
		const resultado = await ventasController.crearPedidoDesdeVenta(
			req.params.id,
			req.body,
			req.user
		);
		res.status(201).json(resultado);
	} catch (error) {
		responderError(res, error);
	}
});

// Eliminar venta.
router.delete("/:id", verificarToken, async (req, res) => {
	try {
		const venta = await ventasController.deleteVenta(
			req.params.id,
			req.user
		);

		res.json(venta);
	} catch (error) {
		responderError(res, error);
	}
});

export default router;
