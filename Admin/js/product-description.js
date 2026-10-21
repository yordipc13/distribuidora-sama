(function configureProductDescriptions(global) {
  const DEFAULT_DELAY_MS = 3500;
  const DEFAULT_MAX_RETRIES = 3;
  const DEFAULT_RETRY_DELAY_MS = 3000;

  function isEmptyDescription(value) {
    return value == null
      || value === 0
      || (typeof value === "string" && (value.trim() === "" || value.trim() === "0"));
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
    const maxRetries = Number.isInteger(options.maxRetries) ? Math.max(0, options.maxRetries) : DEFAULT_MAX_RETRIES;
    const retryDelayMs = Number.isFinite(options.retryDelayMs) ? Math.max(0, options.retryDelayMs) : DEFAULT_RETRY_DELAY_MS;
    const requestBody = JSON.stringify({
      sku: product.sku ?? "",
      producto: product.producto ?? product.name ?? "",
      categoria: product.categoria ?? product.category ?? "",
      subcategoria: product.subcategoria ?? product.subcategory ?? "",
      stock: product.stock ?? null,
    });

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      let response;
      try {
        response = await fetch(getWorkerUrl(options), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        });
      } catch (error) {
        if (attempt === maxRetries) throw error;
        await wait(retryDelayMs * (attempt + 1));
        continue;
      }

      const payload = await response.json().catch(() => ({}));
      if (response.ok) {
        if (!payload.description || typeof payload.description !== "string") {
          throw new Error("El Worker no devolvió una descripción válida.");
        }
        return payload.description.trim();
      }

      const message = payload.error || `El Worker respondió con HTTP ${response.status}.`;
      const retryable = response.status === 429 || response.status >= 500
        || /unavailable|temporarily|overloaded|rate.?limit/i.test(message);
      if (!retryable || attempt === maxRetries) throw new Error(message);
      await wait(retryDelayMs * (attempt + 1));
    }
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
      options.onProductStart?.(product, { completed: prepared.length, total: products.length });
      try {
        let preparedProduct;
        if (!isEmptyDescription(descriptionValue(product))) {
          preparedProduct = { ...product };
        } else {
          if (generatedCount > 0) await wait(delayMs);
          preparedProduct = await prepareProductForSync(product, options);
          generatedCount += 1;
        }
        prepared.push(preparedProduct);
        options.onDescriptionReady?.(preparedProduct);
        if (typeof options.onPrepared === "function") {
          await options.onPrepared(preparedProduct, {
            completed: prepared.length,
            total: products.length,
          });
        }
      } catch (error) {
        if (typeof options.onError !== "function") throw error;
        options.onError(product, error, {
          completed: prepared.length,
          total: products.length,
        });
      }
      options.onProgress?.({
        completed: prepared.length + (typeof options.onError === "function" ? 1 : 0),
        total: products.length,
        sku: product.sku ?? "",
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
