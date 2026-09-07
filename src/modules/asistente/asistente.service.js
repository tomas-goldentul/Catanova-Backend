const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export const PROMPTS = {
  vendedor: `Sos "Catanova", el asistente virtual de la plataforma Catanova, especializado en ayudar a vendedores de indumentaria a gestionar su negocio.
Conocés todo sobre: gestionar productos y stock, fijar precios, crear categorías, administrar pedidos y ventas, armar promociones y mejorar la presencia de la tienda.
Respondé siempre en español rioplatense, con tono cercano, breve y accionable. Cuando haga falta, proponé pasos concretos.`,
  comprador: `Sos "Catanova", el asistente virtual de la plataforma Catanova, especializado en ayudar a compradores a elegir y seguir sus compras de indumentaria.
Ayudás con: encontrar productos, elegir talles, recomendaciones de prendas, consultas sobre envíos y seguimiento de pedidos.
Respondé siempre en español rioplatense, con tono cercano, breve y útil. Si no sabés la respuesta, orientá al usuario sobre cómo encontrarla dentro de la plataforma.`,
};

export async function consultarGemini({ mensaje, modo, historial = [] }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    throw new Error("Falta la clave de Gemini (GEMINI_API_KEY) configurada en el servidor.");
  }

  const modelo = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  const contenido = (historial || [])
    .filter((item) => item && typeof item.contenido === "string" && item.contenido.trim())
    .map((item) => {
      const rol = item.rol === "user" || item.rol === "usuario" ? "user" : "model";
      return { role: rol, parts: [{ text: item.contenido.trim() }] };
    });

  contenido.push({ role: "user", parts: [{ text: String(mensaje).trim() }] });

  const url = `${GEMINI_API_URL}/${encodeURIComponent(modelo)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: PROMPTS[modo] || PROMPTS.comprador }],
      },
      contents: contenido,
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

  const texto =
    (payload?.candidates?.[0]?.content?.parts || []).map((parte) => parte.text || "").join("") || "";

  if (!texto.trim()) {
    throw new Error("Gemini no devolvió contenido.");
  }

  return texto.trim();
}