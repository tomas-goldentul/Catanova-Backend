import { Router } from "express";
import * as favoritosController from "./favoritos.controller.js";

const router = Router();

router.get("/", async (req,res)=>{
    res.json(await favoritosController.getFavoritos());
});

router.get("/producto/:id/cantidad", async (req,res)=>{
    res.json(await favoritosController.getCantidadFavoritosProducto(req.params.id));
});

router.get("/ultimos/7dias", async (req,res)=>{
    res.json(await favoritosController.getCantidadFavoritosUltimos7Dias());
});

router.get("/ultimos/mes", async (req,res)=>{
    res.json(await favoritosController.getCantidadFavoritosUltimoMes());
});

router.get("/ultimos/ano", async (req,res)=>{
    res.json(await favoritosController.getCantidadFavoritosUltimoAno());
});

router.get("/ultimos/2anos", async (req,res)=>{
    res.json(await favoritosController.getCantidadFavoritosUltimos2Anios());
});

router.get("/producto/:id", async (req,res)=>{
    res.json(await favoritosController.getFavoritosProducto(req.params.id));
});

router.get("/:id", async (req,res)=>{
    res.json(await favoritosController.getFavorito(req.params.id));
});

router.post("/", async (req,res)=>{
    const favorito = await favoritosController.insertFavorito(req.body);
    res.status(201).json(favorito);
});

router.delete("/:id", async (req,res)=>{
    res.json(await favoritosController.deleteFavorito(req.params.id));
});

export default router;