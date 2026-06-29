import { Router } from "express";
import * as ventasController from "./ventas.controller.js";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const ventas = await ventasController.getVentas();
		res.json(ventas);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.get("/ultimos/7dias", async (req, res) => {
	try {
		const ventas = await ventasController.getVentasUltimos7Dias();
		res.json(ventas);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.get("/ultimos/mes", async (req, res) => {
	try {
		const ventas = await ventasController.getVentasUltimoMes();
		res.json(ventas);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.get("/ultimos/ano", async (req, res) => {
	try {
		const ventas = await ventasController.getVentasUltimoAno();
		res.json(ventas);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.get("/ultimos/2anos", async (req, res) => {
	try {
		const ventas = await ventasController.getVentasUltimos2Anios();
		res.json(ventas);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const venta = await ventasController.getVenta(req.params.id);
		res.json(venta);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
});

router.post("/", async (req, res) => {
	try {
		const venta = await ventasController.insertVenta(req.body);
		res.status(201).json(venta);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.put("/", async (req, res) => {
	try {
		const venta = await ventasController.updateVenta(req.body);
		res.json(venta);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const venta = await ventasController.deleteVenta(req.params.id);
		res.json(venta);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

export default router;

