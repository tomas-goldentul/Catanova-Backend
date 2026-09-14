import { HERRAMIENTAS, ejecutarHerramienta } from "./asistente.tools.js";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const MAX_PASOS = 8;

export const PROMPTS = {
  vendedor: `Sos "Catanova", el asistente virtual de la plataforma Catanova, especializado en ayudar a vendedores de indumentaria a gestionar su negocio.
Conocés todo sobre: gestionar productos y stock, fijar precios, crear categorías, administrar pedidos y ventas, armar promociones y mejorar la presencia de la tienda.
TENÉS ACCESO A DATOS REALES: podés listar los productos de la tienda del usuario (listarProductosTienda), crear productos (crearProducto), listar categorías (listarCategorias), ver los pedidos pendientes de entrega (listarPedidosPendientes) y marcar pedidos como entregados (marcarPedidoEntregado).
Cuando el usuario te pida algo que requiera esos datos, USÁ las herramientas correspondientes en vez de inventar información.
Ante una consulta sobre el catálogo: listá los productos, y si hay muchos, resumí los más relevantes mostrando nombre, precio y stock.
Ante una consulta sobre pedidos: listá los pendientes y si hay muchos, resumí mostrando id_pedido, fecha, cliente y total.
Respondé siempre en español rioplatense, con tono cercano, breve y accionable. Cuando hagas falta, proponé pasos concretos.`,
  comprador: `Sos "Catanova", el asistente virtual de la plataforma Catanova, especializado en ayudar a compradores a elegir y seguir sus compras de indumentaria.
Ayudás con: encontrar productos (podés usar listarProductosActivos), elegir talles, recomendaciones de prendas, consultas sobre envíos y seguimiento de pedidos.
SI EL USUARIO ESTÁ LOGEADO podés listar sus propios pedidos (listarMisPedidos) para decirle el estado y seguimiento de sus compras.
Cuando el usuario te pida consultar sus pedidos, usá la herramienta listarMisPedidos en vez de inventar información. Si el usuario no tiene pedidos o no está logueado, decile cómo iniciar sesión o cómo ver sus compras en la plataforma.
Respondé siempre en español rioplatense, con tono cercano, breve y útil. Si no sabés la respuesta, orientá al usuario sobre cómo encontrarla dentro de la plataforma.`,
};

const mapearContenido = (historial = []) =>
  (historial || [])
    .filter((item) => item && typeof item.contenido === "string" && item.contenido.trim())
    .map((item) => {
      const rol = item.rol === "user" || item.rol === "usuario" ? "user" : "model";
      return { role: rol, parts: [{ text: item.contenido.trim() }] };
    });

async function llamarGemini({ modelo, apiKey, system, contenido, tools }) {
  const url = `${GEMINI_API_URL}/${encodeURIComponent(modelo)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: contenido,
      tools: tools || HERRAMIENTAS,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detalle = payload?.error?.message || `Gemini respondió con el estado ${response.status}`;
    const error = new Error(detalle);
    error.status = response.status;
    throw error;
  }

  return payload;
}

export async function consultarGemini({ mensaje, modo, historial = [], contexto = {} }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    throw new Error("Falta la clave de Gemini (GEMINI_API_KEY) configurada en el servidor.");
  }

  const modelo = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const system = PROMPTS[modo] || PROMPTS.comprador;
  const contenido = mapearContenido(historial);
  contenido.push({ role: "user", parts: [{ text: String(mensaje).trim() }] });

  for (let paso = 0; paso < MAX_PASOS; paso++) {
    const payload = await llamarGemini({ modelo, apiKey, system, contenido });

    const candidato = payload?.candidates?.[0];
    const partes = candidato?.content?.parts || [];
    const llamada = partes.find((parte) => parte?.functionCall);

    if (llamada?.functionCall) {
      const { name, args } = llamada.functionCall;

      contenido.push({ role: "model", parts: [{ functionCall: { name, args: args || {} } }] });

      const resultado = await ejecutarHerramienta(name, args || {}, contexto || {});
      contenido.push({
        role: "function",
        parts: [{ functionResponse: { name, response: resultado } }],
      });
      continue;
    }

    const texto = partes
      .map((parte) => (typeof parte?.text === "string" ? parte.text : ""))
      .join("")
      .trim();

    if (texto.length > 0) {
      return texto;
    }

    throw new Error("Gemini no devolvió contenido.");
  }

  throw new Error("Demasiados pasos para resolver la consulta. Intentá reformular la pregunta.");
}