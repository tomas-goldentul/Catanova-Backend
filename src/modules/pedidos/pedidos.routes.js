import express from "express";
import { procesarNuevoPedido, getAllPedidos, getAllPedidosByIdUser } from "./pedidos.controller.js";
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

router.get("/getAll/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const resultados = await getAllPedidosByIdUser(id_usuario);
    return res.status(StatusCodes.OK).json({ success: true, data: resultados });
  } catch (error) {      
    console.error("Error en la ruta get /pedidos:", error.message);
    
    // Si usas un 404 para cuando no hay datos, queda más semántico que un BAD_REQUEST (400)
    const status = error.message.includes("No hay pedidos") ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST;
    
    return res.status(status).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;