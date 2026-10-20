const MODEL = "gemini-3.5-flash-lite";

const corsHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json; charset=utf-8",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders,
  });
}

function buildPrompt(product) {
  return `Genera únicamente la descripción comercial en español para este producto.

Reglas:
- Si es genérico o simple, escribe una descripción breve y concisa de 1 o 2 líneas.
- Si tiene marca y modelo exactos o es tecnológico, escribe una descripción más amplia y estructurada.
- En productos tecnológicos o con modelo conocido, incluye especificaciones técnicas relevantes únicamente cuando sean conocidas con seguridad a partir del nombre y los datos proporcionados. No inventes características.
- No incluyas precio, stock, SKU, emojis, saludo, prefacio ni una lista de datos que no conozcas.
- Devuelve texto plano listo para guardarse en la columna descripcion.

Producto:
SKU: ${product.sku || "No disponible"}
Nombre: ${product.producto}
Categoría: ${product.categoria || "No disponible"}
Subcategoría: ${product.subcategoria || "No disponible"}
Stock: ${product.stock ?? "No disponible"}`;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    if (request.method !== "POST") return json({ error: "Método no permitido." }, 405);
    if (!env.GEMINI_API_KEY) return json({ error: "Falta configurar GEMINI_API_KEY en el Worker." }, 500);

    let product;
    try {
      product = await request.json();
    } catch {
      return json({ error: "El cuerpo debe ser JSON válido." }, 400);
    }

    if (!product || typeof product.producto !== "string" || !product.producto.trim()) {
      return json({ error: "El campo producto es obligatorio." }, 400);
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;
    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(product) }] }],
          generationConfig: { temperature: 0.35, maxOutputTokens: 500 },
        }),
      });
    } catch {
      return json({ error: "No fue posible conectar con Google AI Studio." }, 502);
    }

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return json({ error: payload.error?.message || "Google AI Studio rechazó la solicitud." }, response.status >= 500 ? 502 : response.status);
    }

    const description = payload.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();
    if (!description) return json({ error: "Google AI Studio no devolvió texto." }, 502);

    return json({ description });
  },
};
