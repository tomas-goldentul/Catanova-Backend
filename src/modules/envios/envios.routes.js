import express from "express";
import { StatusCodes } from "http-status-codes";
import { crearEnvio, getEnvioPorPedido, eliminarEnvio, listarEnviosTienda, editarEnvio } from "./envios.controller.js";
import { verificarToken } from "../auth/auth.middleware.js";

const router = express.Router();

// Pedidos de la tienda logueada, con o sin envío.
router.get("/", verificarToken, async (req, res) => {
  try {
    const envios = await listarEnviosTienda(req.user);
    return res.status(StatusCodes.OK).json({ success: true, data: envios });
  } catch (error) {
    console.error("[Error GET /envios]:", error.message);
    return res.status(error.status || StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
  }
});

router.put("/:id_envio", verificarToken, async (req, res) => {
  const { id_envio } = req.params;
  try {
    const envio = await editarEnvio(id_envio, req.body, req.user);
    return res.status(StatusCodes.OK).json({ success: true, data: envio });
  } catch (error) {
    console.error(`[Error PUT /envios/${id_envio}]:`, error.message);
    return res.status(error.status || StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
  }
});

router.post("/", verificarToken, async (req, res) => {
  try {
    const envio = await crearEnvio(req.body, req.user);
    return res.status(StatusCodes.CREATED).json({ success: true, estado: "Enviado", data: envio });
  } catch (error) {
    console.error("[Error POST /envios]:", error.message);
    return res.status(error.status || StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
  }
});

router.get("/pedido/:id_pedido", verificarToken, async (req, res) => {
  const { id_pedido } = req.params;
  try {
    const envio = await getEnvioPorPedido(id_pedido, req.user);
    return res.status(StatusCodes.OK).json({ success: true, data: envio });
  } catch (error) {
    console.error(`[Error GET /envios/pedido/${id_pedido}]:`, error.message);
    return res.status(error.status || StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
  }
});

router.delete("/:id_envio", verificarToken, async (req, res) => {
  const { id_envio } = req.params;
  try {
    const resultado = await eliminarEnvio(id_envio, req.user);
    return res.status(StatusCodes.OK).json(resultado);
  } catch (error) {
    console.error(`[Error DELETE /envios/${id_envio}]:`, error.message);
    return res.status(error.status || StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
  }
});

export default router;
