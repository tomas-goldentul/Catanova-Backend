import jwt from "jsonwebtoken";
import { consultarGemini } from "./asistente.service.js";
import { getUsuarioPorCuenta } from "../usuarios/usuarios.model.js";

const MODOS_VALIDOS = ["vendedor", "comprador"];
const JWT_SECRET = process.env.JWT_SECRET || "catanova_secret";

const leerIdentidad = async (req, contexto) => {
  const identidad = { ...(contexto && typeof contexto === "object" ? contexto : {}) };
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      identidad.id_cuenta = payload.id_cuenta;
      identidad.tipo = payload.tipo;

      if (payload.tipo === "tienda" && payload.id_tienda) {
        identidad.id_tienda = Number(payload.id_tienda);
      }

      if (payload.tipo === "usuario") {
        const usuario = await getUsuarioPorCuenta(payload.id_cuenta);
        if (usuario?.id_usuario) {
          identidad.id_usuario = Number(usuario.id_usuario);
        }
      }
    } catch (e) {
      // Token inválido: no se bloquea el chat, pero no hay identidad verificada.
    }
  }

  if (identidad.id_tienda !== undefined) {
    identidad.id_tienda = Number(identidad.id_tienda);
  }
  if (identidad.id_usuario !== undefined) {
    identidad.id_usuario = Number(identidad.id_usuario);
  }

  return identidad;
};

export const chat = async (req, res) => {
  try {
    const { mensaje, modo, historial = [], contexto = {} } = req.body || {};

    if (!mensaje || typeof mensaje !== "string" || !mensaje.trim()) {
      return res.status(400).json({ message: "El campo 'mensaje' es obligatorio." });
    }

    const modoValido = MODOS_VALIDOS.includes(modo) ? modo : "comprador";
    const identidad = await leerIdentidad(req, contexto);

    const respuesta = await consultarGemini({
      mensaje: mensaje.trim(),
      modo: modoValido,
      historial: Array.isArray(historial) ? historial : [],
      contexto: identidad,
    });

    return res.status(200).json({ respuesta });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      message: error.message || "No se pudo procesar el mensaje con el asistente.",
    });
  }
};