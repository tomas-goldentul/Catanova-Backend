import express from "express";
import * as categoriasController from "./categorias.controller.js";
import { StatusCodes } from "http-status-codes";
import { Result } from "pg";
const router = express.Router();

router.post("/insert", async(req, res) =>{
   try{
     const {nombreTienda} = req.body;
    const result = await categoriasController.insertCategoria(nombreTienda);
    res.status(StatusCodes.CREATED).json(result);
   }
   catch(error){
     console.error("Error en la ruta insertCategoria:", error);
        if (error.message === "El nombre ingresado ya existe ") {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al agregar categoria", error: error.message });
   }
   
})



export default router;