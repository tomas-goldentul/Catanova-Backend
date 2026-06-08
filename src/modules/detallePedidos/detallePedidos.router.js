import express from "express";
import { obtenerDetallesPorPedidoId } from "./detallePedidos.controller.js";

const router = express.Router();

router.get("/:id_pedido", async (req, res) => {
  try {
    const { id_pedido } = req.params;

    // Llamamos al controlador pasándole solo el dato que necesita
    const resultado = await obtenerDetallesPorPedidoId(id_pedido);
    
    return res.status(200).json(resultado);
  } catch (error) {
    // El router decide qué estado HTTP corresponde según el mensaje del error
    if (error.message.includes("obligatorio")) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes("No se encontraron")) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
});

export default router;