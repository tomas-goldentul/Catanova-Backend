import { Router } from "express";
import * as vistasController from "./vistas.controller.js";

const router = Router();

router.get("/", async (req,res)=>{
    res.json(await vistasController.getVistas());
});

router.get("/producto/:id/cantidad", async (req,res)=>{
    res.json(await vistasController.getCantidadVistasProducto(req.params.id));
});

router.get("/ultimos/7dias", async (req,res)=>{
    res.json(await vistasController.getCantidadVistasUltimos7Dias());
});

router.get("/ultimos/mes", async (req,res)=>{
    res.json(await vistasController.getCantidadVistasUltimoMes());
});

router.get("/ultimos/ano", async (req,res)=>{
    res.json(await vistasController.getCantidadVistasUltimoAno());
});

router.get("/ultimos/2anos", async (req,res)=>{
    res.json(await vistasController.getCantidadVistasUltimos2Anios());
});

router.get("/producto/:id", async (req,res)=>{
    res.json(await vistasController.getVistasProducto(req.params.id));
});

router.get("/:id", async (req,res)=>{
    res.json(await vistasController.getVista(req.params.id));
});

router.post("/", async (req,res)=>{
    const vista = await vistasController.insertVista(req.body);
    res.status(201).json(vista);
});

router.delete("/:id", async (req,res)=>{
    res.json(await vistasController.deleteVista(req.params.id));
});

export default router;