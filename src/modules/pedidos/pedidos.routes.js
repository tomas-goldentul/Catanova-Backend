import express from "express";
import { procesarNuevoPedido, getAllPedidos, getAllPedidosByIdUser, actualizarPedido, getPedidoDetallado, actualizarEstadoPedido } from "./pedidos.controller.js";
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

router.put("/:id_pedido", async (req, res) => {
  const { id_pedido } = req.params;

  try {
    const resultado = await actualizarPedido(id_pedido, req.body);
    return res.status(StatusCodes.OK).json(resultado);
  } catch (error) {
    console.error(`[Error PUT /pedidos/${id_pedido}]:`, error.message);

    let statusCode = StatusCodes.BAD_REQUEST;

    if (error.message.includes("no existe")) {
      statusCode = StatusCodes.NOT_FOUND; 
    } else if (error.message.includes("ya ha sido entregado")) {
      statusCode = StatusCodes.CONFLICT; 
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/:id_pedido", async (req, res) => {
  const { id_pedido } = req.params;
  try {
    const pedido = await getPedidoDetallado(id_pedido);
    
    return res.status(StatusCodes.OK).json({ 
      success: true, 
      data: pedido 
    });
  } catch (error) {      
    console.error(`[Error GET /pedidos/${id_pedido}]:`, error.message);
    
    const status = error.message.includes("no existe") ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST;
    
    return res.status(status).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Endpoint exclusivo para cambiar el estado de entrega (Repartidores / Admin)
router.patch("/:id_pedido/estado", async (req, res) => {
  const { id_pedido } = req.params;
  const { entregado } = req.body;

  if (entregado === undefined || typeof entregado !== "boolean") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "El campo 'entregado' es obligatorio y debe ser un booleano (true/false)."
    });
  }

  try {
    const resultado = await actualizarEstadoPedido(id_pedido, entregado);
    return res.status(StatusCodes.OK).json(resultado);
  } catch (error) {
    console.error(`[Error PATCH /pedidos/${id_pedido}/estado]:`, error.message);
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
});

export default router;