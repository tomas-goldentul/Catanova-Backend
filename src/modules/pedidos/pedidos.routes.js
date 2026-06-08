import express from "express";
import { procesarNuevoPedido } from "./pedidos.controller.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const resultado = await procesarNuevoPedido(req.body);
    
    return res.status(201).json(resultado);
  } catch (error) {
    console.error("Error en la ruta POST /pedidos:", error.message);
    
    return res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;