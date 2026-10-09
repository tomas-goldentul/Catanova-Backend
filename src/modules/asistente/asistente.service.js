import { HERRAMIENTAS, ejecutarHerramienta } from "./asistente.tools.js";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const MAX_PASOS = 8;
const TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 60000;

// Estados ante los que conviene probar el siguiente modelo:
// 404 = modelo inexistente/no disponible, 429 = cuota agotada, 5xx = saturación o error del servidor.
const ESTADOS_REINTENTABLES = new Set([404, 429, 500, 502, 503, 504]);
const MODELOS_POR_DEFECTO = ["gemini-flash-latest", "gemini-3.8-flash", "gemini-3.5-flash-lite"];

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

const parsearLista = (valor) =>
  String(valor || "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

const obtenerModelos = () => {
  const lista = [
    ...parsearLista(process.env.GEMINI_MODEL),
    ...parsearLista(process.env.GEMINI_MODEL_FALLBACKS),
    ...MODELOS_POR_DEFECTO,
  ];
  return [...new Set(lista)];
};

// Las herramientas se envían salvo que GEMINI_ENABLE_TOOLS sea exactamente "false".
const toolsHabilitadas = () =>
  String(process.env.GEMINI_ENABLE_TOOLS ?? "true").toLowerCase() !== "false";

const esReintentable = (error) =>
  ESTADOS_REINTENTABLES.has(Number(error?.status)) || !error?.status;

async function llamarGemini({ modelo, apiKey, system, contenido }) {
  const url = `${GEMINI_API_URL}/${encodeURIComponent(modelo)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    system_instruction: { parts: [{ text: system }] },
    contents: contenido,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
    },
  };

  if (toolsHabilitadas()) {
    body.tools = HERRAMIENTAS;
  }

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (e) {
    const motivo =
      e?.name === "TimeoutError" || e?.name === "AbortError"
        ? `tiempo de espera agotado (${TIMEOUT_MS} ms)`
        : e?.message || "error de red";
    const error = new Error(`No se pudo conectar con Gemini: ${motivo}.`);
    error.status = 504;
    throw error;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detalle = payload?.error?.message || `Gemini respondió con el estado ${response.status}`;
    const error = new Error(detalle);
    error.status = response.status;
    throw error;
  }

  return payload;
}

async function conversar({ modelo, apiKey, system, historial, mensaje, contexto }) {
  const contenido = mapearContenido(historial);
  contenido.push({ role: "user", parts: [{ text: String(mensaje).trim() }] });

  for (let paso = 0; paso < MAX_PASOS; paso++) {
    const payload = await llamarGemini({ modelo, apiKey, system, contenido });

    const candidato = payload?.candidates?.[0];
    const partes = candidato?.content?.parts || [];
    const llamada = partes.find((parte) => parte?.functionCall);

    if (llamada?.functionCall) {
      const { name, args, id } = llamada.functionCall;

      // Reenviamos el turno COMPLETO del modelo (incluye thoughtSignature).
      // Gemini 3.x exige el thoughtSignature en los functionCall; si se omite, la API responde 400.
      contenido.push({ role: "model", parts: candidato.content.parts });

      const resultado = await ejecutarHerramienta(name, args || {}, contexto || {});

      const functionResponse = { name, response: resultado };
      if (id) functionResponse.id = id;

      // La respuesta a una función viaja con rol "user".
      contenido.push({ role: "user", parts: [{ functionResponse }] });
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

export async function consultarGemini({ mensaje, modo, historial = [], contexto = {} }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    throw new Error("Falta la clave de Gemini (GEMINI_API_KEY) configurada en el servidor.");
  }

  const system = PROMPTS[modo] || PROMPTS.comprador;
  const modelos = obtenerModelos();

  let ultimoError;
  for (const modelo of modelos) {
    try {
      return await conversar({ modelo, apiKey, system, historial, mensaje, contexto });
    } catch (error) {
      ultimoError = error;
      if (!esReintentable(error)) {
        throw error;
      }
      console.warn(
        `[asistente] El modelo "${modelo}" falló (${error.status || "sin estado"}): ${error.message}. Probando el siguiente.`
      );
    }
  }

  throw ultimoError || new Error("No se pudo obtener respuesta del asistente.");
}
