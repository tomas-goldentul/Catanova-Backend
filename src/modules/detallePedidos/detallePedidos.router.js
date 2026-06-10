import express from "express";
import { obtenerDetallesPorPedidoId } from "./detallePedidos.controller.js";
import { StatusCodes } from "http-status-codes";
const router = express.Router();

router.get("/:id_pedido", async (req, res) => {
  try {
    const { id_pedido } = req.params;

    // Llamamos al controlador pasándole solo el dato que necesita
    const resultado = await obtenerDetallesPorPedidoId(id_pedido);
    
    return res.status(StatusCodes.OK).json(resultado);
  } catch (error) {
    // El router decide qué estado HTTP corresponde según el mensaje del error
    if (error.message.includes("obligatorio")) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
    if (error.message.includes("No se encontraron")) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
    
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error interno del servidor", error: error.message });
  }
});

export default router;