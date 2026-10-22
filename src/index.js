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
  return `Escribe una descripción provisional, breve y factual, en español, para este producto.

Instrucciones obligatorias:
- Escribe entre 8 y 20 palabras, en una sola oración breve.
- Describe directamente qué es el producto y sus atributos explícitos en el nombre.
- Comienza directamente con el sustantivo o tipo de artículo; no empieces con "el", "la", "los", "las", "un" ni "una".
- Incluye la marca y el modelo cuando aparezcan en el nombre.
- Conserva los atributos explícitos del nombre, como tipo, marca, modelo, material, color, medida o conexión.
- Usa la categoría y subcategoría solo para entender el tipo de artículo; nunca las menciones en la descripción.
- No inventes medidas, materiales, funciones, compatibilidades, contenido, beneficios, usos ni especificaciones.
- No uses lenguaje publicitario o de comercio electrónico. No escribas frases como "ideal para", "diseñado para", "perfecto para", "excelente opción", "ofrece", "permite", "brinda", "disfruta", "lleva tu", "la mejor opción" ni frases equivalentes.
- No uses recomendaciones, beneficios, llamados a la acción ni opiniones.
- No menciones la categoría, subcategoría, stock ni el SKU. No uses frases como "perteneciente a", "clasificado como", "correspondiente a", "de la categoría" o "subcategoría".
- No incluyas precio, emojis, saludo, prefacio, encabezados, viñetas, Markdown ni las palabras "descripción" o "producto".
- Devuelve únicamente el texto final, sin comillas.

Producto:
SKU: ${product.sku || "No disponible"}
Nombre: ${product.producto}
Categoría: ${product.categoria || "No disponible"}
Subcategoría: ${product.subcategoria || "No disponible"}
Stock: ${product.stock ?? "No disponible"}`;
}

const commercialLanguage = /\b(ideal para|diseñado para|perfecto para|excelente opción|ofrece|permite|brinda|disfruta|lleva tu|la mejor opción|solución ideal|perteneciente a|clasificado como|correspondiente a|de la categoría|subcategoría|categoría de)\b/i;

function fallbackDescription(product) {
  const name = String(product.producto || "").trim().replace(/[.!?]+$/, "");
  return name ? `${removeLeadingArticle(name)}.` : "Producto sin descripción disponible.";
}

function removeLeadingArticle(description) {
  return String(description || "")
    .trim()
    .replace(/^(el|la|los|las|un|una)\s+/i, "")
    .trim()
    .replace(/^(\p{L})/u, character => character.toLocaleUpperCase("es"));
}

function isAcceptableDescription(description) {
  const text = removeLeadingArticle(description);
  const words = text.split(/\s+/).filter(Boolean);
  return text
    && words.length <= 20
    && !commercialLanguage.test(text)
    && !/[#*_`[\]{}]/.test(text);
}

function normalizeTranslationProduct(product) {
  return {
    sku: String(product.sku || "").trim(),
    name: String(product.name || "").trim().slice(0, 300),
    description: String(product.description || "").trim().slice(0, 2000),
    category: String(product.category || "").trim().slice(0, 300),
    subcategory: String(product.subcategory || "").trim().slice(0, 300),
  };
}

function translationSourceMatches(translation, product) {
  return translation.source_name === product.name
    && translation.source_description === product.description
    && translation.source_category === product.category
    && translation.source_subcategory === product.subcategory;
}

function supabaseHeaders(env, additionalHeaders = {}) {
  return {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...additionalHeaders,
  };
}

async function translateProduct(product, env) {
  if (!env.GEMINI_API_KEY) return json({ error: "Falta configurar GEMINI_API_KEY en el Worker." }, 500);
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return json({ error: "Falta configurar el acceso privado de Supabase en el Worker." }, 500);
  }

  const sku = String(product?.sku || "").trim().slice(0, 100);
  if (!/^[\p{L}\p{N}._-]+$/u.test(sku)) return json({ error: "El SKU del producto no es válido." }, 400);

  const productUrl = new URL("/rest/v1/products", env.SUPABASE_URL);
  productUrl.search = new URLSearchParams({
    select: "Sku,Producto,descripcion,Categoria,Subcategoria",
    Sku: `eq.${sku}`,
    is_active: "eq.true",
    limit: "1",
  });
  const productResponse = await fetch(productUrl, { headers: supabaseHeaders(env) });
  if (!productResponse.ok) return json({ error: "No se pudo consultar el producto en Supabase." }, 502);
  const [productRecord] = await productResponse.json();
  if (!productRecord) return json({ error: "El producto no está disponible." }, 404);

  const source = normalizeTranslationProduct({
    sku: productRecord.Sku,
    name: productRecord.Producto,
    description: productRecord.descripcion,
    category: productRecord.Categoria ?? "Sin categoría",
    subcategory: productRecord.Subcategoria,
  });

  const translationsUrl = new URL("/rest/v1/product_translations", env.SUPABASE_URL);
  translationsUrl.search = new URLSearchParams({
    select: "sku,name_en,description_en,category_en,subcategory_en,source_name,source_description,source_category,source_subcategory",
    sku: `eq.${source.sku}`,
    limit: "1",
  });
  try {
    const savedResponse = await fetch(translationsUrl, { headers: supabaseHeaders(env) });
    if (savedResponse.ok) {
      const [savedTranslation] = await savedResponse.json();
      if (savedTranslation && translationSourceMatches(savedTranslation, source)) {
        return json(savedTranslation);
      }
    }
  } catch {
    // Translation generation can proceed without the optional cache.
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;
  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: "Translate the supplied Spanish product fields into natural, concise English. Preserve brands, model names, SKUs, numbers, measurements, and factual meaning. Do not add claims or specifications. Return only a JSON object with string fields name_en, description_en, category_en, and subcategory_en. If an input field is empty, return an empty string for its translation.",
          }],
        },
        contents: [{ parts: [{ text: JSON.stringify(source) }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 600, responseMimeType: "application/json" },
      }),
    });
  } catch {
    return json({ error: "No fue posible conectar con Google AI Studio." }, 502);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    return json({ error: payload.error?.message || "Google AI Studio rechazó la traducción." }, response.status >= 500 ? 502 : response.status);
  }
  const output = payload.candidates?.[0]?.content?.parts?.map(part => part.text || "").join("").trim();
  let translated;
  try {
    translated = JSON.parse(output);
  } catch {
    return json({ error: "Gemini no devolvió una traducción válida." }, 502);
  }

  const translation = {
    sku: source.sku,
    name_en: String(translated.name_en || "").trim(),
    description_en: String(translated.description_en || "").trim(),
    category_en: String(translated.category_en || "").trim(),
    subcategory_en: String(translated.subcategory_en || "").trim(),
    source_name: source.name,
    source_description: source.description,
    source_category: source.category,
    source_subcategory: source.subcategory,
    updated_at: new Date().toISOString(),
  };
  if (!translation.name_en) return json({ error: "Gemini no devolvió el nombre traducido." }, 502);

  const upsertUrl = new URL("/rest/v1/product_translations", env.SUPABASE_URL);
  upsertUrl.searchParams.set("on_conflict", "sku");
  try {
    await fetch(upsertUrl, {
      method: "POST",
      headers: supabaseHeaders(env, { Prefer: "resolution=merge-duplicates,return=representation" }),
      body: JSON.stringify(translation),
    });
  } catch {
    // A cache write failure must not hide a valid translation from the catalog.
  }
  return json(translation);
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    if (request.method !== "POST") return json({ error: "Método no permitido." }, 405);

    if (new URL(request.url).pathname === "/translate") {
      let product;
      try {
        product = await request.json();
      } catch {
        return json({ error: "El cuerpo debe ser JSON válido." }, 400);
      }
      return translateProduct(product, env);
    }

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
          systemInstruction: {
            parts: [{
              text: "Responde con una sola oración factual de 8 a 20 palabras que identifique directamente el artículo. Comienza con el sustantivo o tipo de artículo, nunca con un artículo como el, la, los, las, un o una. Usa solo atributos explícitos del nombre. No menciones categoría o subcategoría. No uses lenguaje publicitario.",
            }],
          },
          contents: [{ parts: [{ text: buildPrompt(product) }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 120 },
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

    const normalizedDescription = removeLeadingArticle(description);
    return json({
      description: isAcceptableDescription(normalizedDescription)
        ? normalizedDescription
        : fallbackDescription(product),
    });
  },
};
