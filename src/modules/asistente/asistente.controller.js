import { consultarGemini } from "./asistente.service.js";

const MODOS_VALIDOS = ["vendedor", "comprador"];

export const chat = async (req, res) => {
  try {
    const { mensaje, modo, historial = [], contexto = {} } = req.body || {};

    if (!mensaje || typeof mensaje !== "string" || !mensaje.trim()) {
      return res.status(400).json({ message: "El campo 'mensaje' es obligatorio." });
    }

    const modoValido = MODOS_VALIDOS.includes(modo) ? modo : "comprador";

    const respuesta = await consultarGemini({
      mensaje: mensaje.trim(),
      modo: modoValido,
      historial: Array.isArray(historial) ? historial : [],
    });

    return res.status(200).json({ respuesta });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message || "No se pudo procesar el mensaje con el asistente.",
    });
  }
};