(function configureProductDescriptions(global) {
  const DEFAULT_DELAY_MS = 3500;

  function isEmptyDescription(value) {
    return value == null || (typeof value === "string" && value.trim() === "");
  }

  function descriptionField(product) {
    return Object.prototype.hasOwnProperty.call(product, "descripcion") ? "descripcion" : "description";
  }

  function descriptionValue(product) {
    return product.descripcion ?? product.description;
  }

  function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  function getWorkerUrl(options = {}) {
    const workerUrl = options.workerUrl || global.SAMA_DESCRIPTION_WORKER_URL;
    if (!workerUrl) {
      throw new Error("Configura SAMA_DESCRIPTION_WORKER_URL con la URL del Cloudflare Worker.");
    }
    return workerUrl;
  }

  async function generateDescription(product, options = {}) {
    const response = await fetch(getWorkerUrl(options), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sku: product.sku ?? "",
        producto: product.producto ?? product.name ?? "",
        categoria: product.categoria ?? product.category ?? "",
        subcategoria: product.subcategoria ?? product.subcategory ?? "",
        stock: product.stock ?? null,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || `El Worker respondió con HTTP ${response.status}.`);
    }
    if (!payload.description || typeof payload.description !== "string") {
      throw new Error("El Worker no devolvió una descripción válida.");
    }
    return payload.description.trim();
  }

  async function prepareProductForSync(product, options = {}) {
    if (!product || typeof product !== "object") {
      throw new TypeError("Cada producto debe ser un objeto.");
    }

    // Una descripción no vacía, incluso si fue escrita manualmente, nunca se reemplaza.
    if (!isEmptyDescription(descriptionValue(product))) return { ...product };

    const description = await generateDescription(product, options);
    return { ...product, [descriptionField(product)]: description };
  }

  async function prepareProductsForSync(products, options = {}) {
    if (!Array.isArray(products)) throw new TypeError("La lista de productos debe ser un arreglo.");

    const delayMs = Number.isFinite(options.delayMs) ? Math.max(0, options.delayMs) : DEFAULT_DELAY_MS;
    const prepared = [];
    let generatedCount = 0;

    for (const product of products) {
      if (!product || typeof product !== "object") {
        throw new TypeError("Cada producto debe ser un objeto.");
      }
      if (!isEmptyDescription(descriptionValue(product))) {
        prepared.push({ ...product });
        continue;
      }

      if (generatedCount > 0) await wait(delayMs);
      const preparedProduct = await prepareProductForSync(product, options);
      prepared.push(preparedProduct);
      generatedCount += 1;
      options.onProgress?.({
        completed: prepared.length,
        total: products.length,
        sku: preparedProduct.sku ?? "",
      });
    }

    return prepared;
  }

  global.SamaProductDescriptions = Object.freeze({
    DEFAULT_DELAY_MS,
    isEmptyDescription,
    descriptionValue,
    generateDescription,
    prepareProductForSync,
    prepareProductsForSync,
  });
})(window);
