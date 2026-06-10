import express from "express";
import { procesarNuevoPedido, getAllPedidos } from "./pedidos.controller.js";
import { StatusCodes } from "http-status-codes";
import { Result } from "pg";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const resultado = await procesarNuevoPedido(req.body);
    
    return res.status(StatusCodes.OK).json(resultado);
  } catch (error) {
    console.error("Error en la ruta POST /pedidos:", error.message);
    
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      message: error.message 
    });
  }
});

router.get("/getAll", async (req, res) =>{
  try{
    const resultados = await getAllPedidos();
 
    return res.status(StatusCodes.OK).json(resultados);
  }
  catch (error){
      console.error("Error en la ruta get /pedidos:", error.message);
    
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      message: error.message 
    });
  }
})

export default router;