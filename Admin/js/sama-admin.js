const client = window.supabaseClient;
const statusElement = document.querySelector("#connection-status");
const viewSelect = document.querySelector("#catalog-view");
const searchInput = document.querySelector("#catalog-search");
const tableHead = document.querySelector("#catalog-head");
const tableBody = document.querySelector("#catalog-body");
const emptyState = document.querySelector("#empty-state");
const emptyTitle = document.querySelector("#empty-title");
const emptyMessage = document.querySelector("#empty-message");
const viewLabel = document.querySelector("#view-label");
const resultCount = document.querySelector("#result-count");
const refreshButton = document.querySelector("#refresh-catalog");
const filterHint = document.querySelector("#filter-hint");
const languageSelect = document.querySelector("#admin-language");
const themeToggle = document.querySelector("#theme-toggle");
const importButton = document.querySelector("#import-excel");
const importInput = document.querySelector("#excel-import-input");
const importStatus = document.querySelector("#import-status");
const authPanel = document.querySelector("#auth-panel");
const workspace = document.querySelector(".workspace");
const signInForm = document.querySelector("#sign-in-form");
const signOutButton = document.querySelector("#sign-out");
const authMessage = document.querySelector("#auth-message");
const menuToggle = document.querySelector("#menu-toggle");
const adminNavigation = document.querySelector("#admin-navigation");
const statisticsPanel = document.querySelector("#statistics-panel");
const catalogPanel = document.querySelector(".catalog-panel");
const catalogHeading = document.querySelector("#catalog-heading");
const statsBody = document.querySelector("#stats-body");
const statsEmpty = document.querySelector("#stats-empty");
const totalTimer = document.querySelector("#total-timer");
const totalTimerState = document.querySelector("#total-timer-state");
const statsCompleted = document.querySelector("#stats-completed");
const statsFailures = document.querySelector("#stats-failures");
const individualTimer = document.querySelector("#individual-timer");
const individualTimerState = document.querySelector("#individual-timer-state");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
let manualTheme = false;
let language = navigator.language?.toLowerCase().startsWith("en") ? "en" : "es";
let connectionError = "";
let totalTimerStartedAt = 0;
let totalTimerStoppedAt = 0;
let individualTimerStartedAt = 0;
let individualTimerStoppedAt = 0;
let totalTimerInterval = null;
let statistics = { total: 0, completed: 0, failures: 0, rows: [] };

const translations = {
  es: {
    title: "Administración de catálogo | SAMA", refresh: "Actualizar", backToCatalog: "Volver al catálogo",
    catalog: "CATÁLOGO", catalogAria: "Catálogo de SAMA", adminTitle: "Administración SAMA", adminDescription: "Consulta productos, categorías y marcas activas.",
    readOnly: "Consulta e importación", importExcel: "Importar Excel", signOut: "Cerrar sesión", menu: "Menú", catalogTab: "Catálogo", statisticsTab: "Estadísticas", statisticsEyebrow: "SEGUIMIENTO", statisticsTitle: "Estadísticas de generación", statisticsDescription: "Consulta el tiempo total y el tiempo empleado en cada producto.", totalTime: "Tiempo total", individualTimer: "Temporizador individual", completedProducts: "Productos procesados", notStarted: "Sin iniciar", running: "En progreso", finished: "Finalizado", sequence: "#", individualTime: "Tiempo individual", noStatistics: "Aún no hay estadísticas", statisticsHint: "Inicia una importación para registrar tiempos", success: "Completado", failure: "Error", errors: "errores", adminAccess: "ACCESO ADMINISTRADOR", signInTitle: "Iniciar sesión", signInDescription: "Accede para consultar e importar productos.", email: "Correo", password: "Contraseña", signIn: "Iniciar sesión", recordType: "Tipo de registro", products: "Productos", cleaning: "Limpieza", office: "Oficina", pharmacy: "Farmacia", appliances: "Electrodomésticos", covid19: "Covid-19",
    footerTitle: "SAMA · Catálogo", footerData: "Datos activos de Supabase", searchPlaceholder: "Buscar en el catálogo...",
    results: "registros", result: "registro",     loading: "Conectando a Supabase...", connected: "Conectado a Supabase", generatingDescriptions: "Generando descripciones:",
    clientUnavailable: "Cliente de Supabase no disponible", connectionError: "Error de conexión: {message}", authError: "No se pudo iniciar sesión: {message}", notAdmin: "La cuenta no tiene permisos de administrador.",
    noMatches: "No encontramos registros", noProducts: "Aún no hay productos", noCategories: "Aún no hay categorías", noBrands: "Aún no hay marcas",
    noActiveRecords: "No hay registros activos cargados en Supabase.", searchHint: "Prueba con otro término de búsqueda.",
    filterHint: "Pulsa un encabezado para añadir un filtro. Vuelve a pulsarlo para quitarlo.",
    filterColumn: "Filtrar por {column}", removeFilter: "Quitar filtro de {column}", columnPlaceholder: "Filtrar...",
    sku: "SKU", product: "Producto", category: "Categoría", brand: "Marca", subcategory: "Subcategoría", description: "Descripción", image: "Imagen", stock: "Existencias", featured: "Destacado", slug: "Identificador",
    yes: "Sí", no: "No", switchToDark: "Activar modo oscuro", switchToLight: "Activar modo claro", language: "Idioma",
  },
  en: {
    title: "Catalog administration | SAMA", refresh: "Refresh", backToCatalog: "Back to catalog",
    catalog: "CATALOG", catalogAria: "SAMA catalog", adminTitle: "SAMA administration", adminDescription: "View active products, categories, and brands.",
    readOnly: "View and import", importExcel: "Import Excel", signOut: "Sign out", menu: "Menu", catalogTab: "Catalog", statisticsTab: "Statistics", statisticsEyebrow: "TRACKING", statisticsTitle: "Generation statistics", statisticsDescription: "Review total time and time spent on each product.", totalTime: "Total time", individualTimer: "Individual timer", completedProducts: "Products processed", notStarted: "Not started", running: "In progress", finished: "Finished", sequence: "#", individualTime: "Individual time", noStatistics: "No statistics yet", statisticsHint: "Start an import to record timings", success: "Completed", failure: "Error", errors: "errors", adminAccess: "ADMIN ACCESS", signInTitle: "Sign in", signInDescription: "Sign in to view and import products.", email: "Email", password: "Password", signIn: "Sign in", recordType: "Record type", products: "Products", cleaning: "Cleaning", office: "Office", pharmacy: "Pharmacy", appliances: "Appliances", covid19: "Covid-19",
    footerTitle: "SAMA · Catalog", footerData: "Active Supabase data", searchPlaceholder: "Search the catalog...",
    results: "records", result: "record",     loading: "Connecting to Supabase...", connected: "Connected to Supabase", generatingDescriptions: "Generating descriptions:",
    clientUnavailable: "Supabase client unavailable", connectionError: "Connection error: {message}", authError: "Could not sign in: {message}", notAdmin: "This account does not have administrator permissions.",
    noMatches: "No records found", noProducts: "No products yet", noCategories: "No categories yet", noBrands: "No brands yet",
    noActiveRecords: "There are no active records in Supabase.", searchHint: "Try a different search term.",
    filterHint: "Click a column heading to add a filter. Click it again to remove it.",
    filterColumn: "Filter by {column}", removeFilter: "Remove {column} filter", columnPlaceholder: "Filter...",
    sku: "SKU", product: "Product", category: "Category", brand: "Brand", subcategory: "Subcategory", description: "Description", image: "Image", stock: "Stock", featured: "Featured", slug: "Identifier",
    yes: "Yes", no: "No", switchToDark: "Switch to dark mode", switchToLight: "Switch to light mode", language: "Language",
  },
};

function t(key, values = {}) {
  let message = translations[language][key] ?? translations.es[key] ?? key;
  for (const [name, value] of Object.entries(values)) message = message.replaceAll(`{${name}}`, String(value));
  return message;
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.title = t("title");
  languageSelect.value = language;
  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });
  searchInput.placeholder = t("searchPlaceholder");
  languageSelect.setAttribute("aria-label", t("language"));
  document.querySelector(".catalog-panel").setAttribute("aria-label", t("catalogAria"));
  if (statusElement.dataset.state === "connected") statusElement.textContent = t("connected");
  if (statusElement.dataset.state === "loading") statusElement.textContent = t("loading");
  if (statusElement.dataset.state === "error") {
    statusElement.textContent = client ? t("connectionError", { message: connectionError }) : t("clientUnavailable");
  }
  render();
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  const label = t(theme === "dark" ? "switchToLight" : "switchToDark");
  themeToggle.textContent = theme === "dark" ? "☀" : "☾";
  themeToggle.title = label;
  themeToggle.setAttribute("aria-label", label);
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.content = theme === "dark" ? "#0b1220" : "#f6f8f7";
}

function setAuthenticatedUI(user) {
  const authenticated = Boolean(user);
  authPanel.hidden = authenticated;
  workspace.hidden = !authenticated;
  signOutButton.hidden = !authenticated;
  refreshButton.hidden = !authenticated;
}

async function openAdminSession() {
  if (!client) {
    authMessage.textContent = t("clientUnavailable");
    return;
  }
  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  const user = data.session?.user;
  if (!user) {
    setAuthenticatedUI(null);
    return;
  }
  if (user.app_metadata?.role !== "admin") {
    await client.auth.signOut();
    throw new Error(t("notAdmin"));
  }
  setAuthenticatedUI(user);
  await loadView();
}

const views = {
  products: {
    labelKey: "products",
    columns: [
      ["Sku", "sku"],
      ["Producto", "product"],
      ["Categoria", "category"],
      ["Subcategoria", "subcategory"],
      ["descripcion", "description"],
      ["Image(url)", "image"],
      ["stock", "stock"],
    ],
    load: () => client.from("products")
      .select("*")
      .eq("is_active", true)
      .order("Producto"),
  },
};

const productCategoryViews = {
  cleaning: ["Limpieza"],
  office: ["Oficina"],
  pharmacy: ["Farmacia", "farmacia"],
  appliances: ["Electrodomésticos", "Electrodomesticos"],
  covid19: ["Covid-19", "COVID-19", "COVID.19"],
};

for (const [viewKey, categoryNames] of Object.entries(productCategoryViews)) {
  views[viewKey] = {
    ...views.products,
    labelKey: viewKey,
    emptyTitleKey: "noProducts",
    load: () => client.from("products")
      .select("*")
      .eq("is_active", true)
      .or(categoryNames.map(categoryName => `Categoria.ilike.%${categoryName}%`).join(","))
      .order("Producto"),
  };
}

let records = [];
const columnFilters = new Map();

function normalizeHeader(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function excelValue(row, names) {
  const entry = Object.entries(row).find(([key]) => names.includes(normalizeHeader(key)));
  return entry ? entry[1] : "";
}

function toStock(value) {
  if (value == null || value === "") return null;
  const stock = Number(value);
  if (!Number.isInteger(stock) || stock < 0) throw new Error(`Existencias inválidas: ${value}`);
  return stock;
}

function toProductRow(row) {
  const sku = String(excelValue(row, ["sku"])).trim();
  const name = String(excelValue(row, ["producto", "product", "name"])).trim();
  if (!sku || !name) throw new Error("Cada fila debe tener SKU y Producto.");

  const categoryText = String(excelValue(row, ["categoria", "category"])).trim();
  return {
    sku,
    producto: name,
    stock: toStock(excelValue(row, ["stock", "existencias"])),
    categoria: categoryText,
    subcategoria: String(excelValue(row, ["subcategoria", "subcategory"])).trim(),
    descripcion: excelValue(row, ["descripcion", "description"]),
    imagen_url: String(excelValue(row, ["imagenurl", "imagen", "imageurl", "image"])).trim(),
  };
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, milliseconds) / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const tenths = Math.floor((milliseconds % 1000) / 100);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[character]));
}

function renderStatistics() {
  const elapsed = totalTimerStartedAt
    ? (totalTimerStoppedAt || performance.now()) - totalTimerStartedAt
    : 0;
  const individualElapsed = individualTimerStartedAt
    ? (individualTimerStoppedAt || performance.now()) - individualTimerStartedAt
    : 0;
  totalTimer.textContent = formatDuration(elapsed);
  individualTimer.textContent = formatDuration(individualElapsed);
  statsCompleted.textContent = `${statistics.completed} / ${statistics.total}`;
  statsFailures.textContent = `${statistics.failures} ${t("errors")}`;
  statsEmpty.hidden = statistics.rows.length > 0;
  statsBody.innerHTML = statistics.rows.map((row, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(row.sku)}</td>
      <td>${escapeHtml(row.producto)}</td>
      <td>${formatDuration(row.duration)}</td>
      <td class="${row.success ? "success" : "failure"}">${row.success ? t("success") : `${t("failure")}: ${escapeHtml(row.error)}`}</td>
    </tr>
  `).join("");
}

function resetStatistics(total) {
  statistics = { total, completed: 0, failures: 0, rows: [] };
  totalTimerStartedAt = performance.now();
  totalTimerStoppedAt = 0;
  individualTimerStartedAt = 0;
  individualTimerStoppedAt = 0;
  individualTimerState.textContent = t("notStarted");
  totalTimerState.textContent = t("running");
  clearInterval(totalTimerInterval);
  totalTimerInterval = setInterval(renderStatistics, 100);
  renderStatistics();
}

function finishStatistics() {
  totalTimerStoppedAt = performance.now();
  totalTimerState.textContent = t("finished");
  clearInterval(totalTimerInterval);
  totalTimerInterval = null;
  renderStatistics();
}

async function importExcelFile(file) {
  if (!window.XLSX) throw new Error("La biblioteca de Excel todavía no está disponible. Recarga el panel e inténtalo de nuevo.");
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", bookVBA: true, cellDates: true });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!firstSheet) throw new Error("El archivo no contiene una primera hoja válida.");
  const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
  if (!rows.length) throw new Error("La primera hoja no contiene productos.");

  const products = rows.map(toProductRow);
  let savedCount = 0;
  const startedProducts = new Map();
  const descriptionDurations = new Map();
  resetStatistics(products.length);
  try {
    await window.SamaProductDescriptions.prepareProductsForSync(products, {
    delayMs: 4500,
    onProgress: progress => {
      importStatus.textContent = `${t("generatingDescriptions")} ${progress.completed}/${progress.total} (${progress.sku})`;
    },
    onPrepared: async (product, progress) => {
      const payload = {
        Sku: product.sku,
        Producto: product.producto,
        Categoria: product.categoria || null,
        Subcategoria: product.subcategoria || null,
        descripcion: product.descripcion || null,
        "Image(url)": product.imagen_url || null,
        stock: product.stock,
        is_active: true,
      };
      const { error } = await client.from("products").upsert(payload, { onConflict: "Sku" });
      if (error) throw error;
      const startedAt = startedProducts.get(product.sku) || performance.now();
      const descriptionDuration = descriptionDurations.get(product.sku) || (performance.now() - startedAt);
      individualTimerState.textContent = `${t("finished")} (${product.sku})`;
      savedCount += 1;
      statistics.completed += 1;
      statistics.rows.push({ sku: product.sku, producto: product.producto, duration: descriptionDuration, success: true });
      renderStatistics();
      importStatus.textContent = `Guardados ${savedCount}/${progress.total} (${product.sku})`;
    },
    onProductStart: product => {
      startedProducts.set(product.sku, performance.now());
      individualTimerStartedAt = startedProducts.get(product.sku);
      individualTimerStoppedAt = 0;
      individualTimerState.textContent = `${t("running")} (${product.sku})`;
      renderStatistics();
    },
    onDescriptionReady: product => {
      const duration = performance.now() - (startedProducts.get(product.sku) || performance.now());
      descriptionDurations.set(product.sku, duration);
      individualTimerStoppedAt = performance.now();
      individualTimerState.textContent = `${t("finished")} (${product.sku})`;
      renderStatistics();
    },
    onError: (product, error) => {
      individualTimerStoppedAt = performance.now();
      statistics.completed += 1;
      statistics.failures += 1;
      statistics.rows.push({
        sku: product.sku,
        producto: product.producto,
        duration: descriptionDurations.get(product.sku)
          || (performance.now() - (startedProducts.get(product.sku) || performance.now())),
        success: false,
        error: error.message || "Error desconocido",
      });
      individualTimerState.textContent = `${t("finished")} (${product.sku})`;
      renderStatistics();
      importStatus.textContent = `Se omitió ${product.sku}: ${error.message || "Error desconocido"}`;
    },
    });
    return { count: savedCount, failures: statistics.failures };
  } finally {
    finishStatistics();
  }
}

function valueFor(record, field) {
  const value = record[field];
  if (value && typeof value === "object") return value.name || "—";
  if (typeof value === "boolean") return value ? t("yes") : t("no");
  return value == null || value === "" ? "—" : String(value);
}

function categoryViewKey(categoryName) {
  return `category-${normalizeHeader(categoryName)}`;
}

function addDiscoveredCategoryViews() {
  const discovered = new Set(records.flatMap(record => String(record.Categoria ?? "")
    .split(",")
    .map(category => category.trim())
    .filter(Boolean)));

  for (const categoryName of discovered) {
    const viewKey = categoryViewKey(categoryName);
    if (!views[viewKey]) {
      views[viewKey] = {
        ...views.products,
        label: categoryName,
        labelKey: "",
        load: () => client.from("products")
          .select("*")
          .eq("is_active", true)
          .ilike("Categoria", `%${categoryName}%`)
          .order("Producto"),
      };
    }
    if (![...viewSelect.options].some(option => option.value === viewKey)) {
      const option = document.createElement("option");
      option.value = viewKey;
      option.textContent = categoryName;
      viewSelect.append(option);
    }
  }
}

function render() {
  const view = views[viewSelect.value];
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  const activeColumnFilters = [...columnFilters].filter(([, value]) => value.trim());
  const filtered = records.filter(record => {
    const globalMatch = !query || view.columns.some(([field]) =>
      valueFor(record, field).toLocaleLowerCase("es").includes(query),
    );
    const columnMatch = activeColumnFilters.every(([field, value]) =>
      valueFor(record, field).toLocaleLowerCase("es").includes(value.trim().toLocaleLowerCase("es")),
    );
    return globalMatch && columnMatch;
  });

  viewLabel.textContent = view.label || t(view.labelKey);
  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? t("result") : t("results")}`;
  tableHead.replaceChildren();
  tableBody.replaceChildren();
  filterHint.textContent = t("filterHint");

  const headerRow = document.createElement("tr");
  for (const [field, labelKey] of view.columns) {
    const header = document.createElement("th");
    header.scope = "col";
    const label = t(labelKey);
    const toggle = document.createElement("button");
    const hasFilter = columnFilters.has(field);
    toggle.type = "button";
    toggle.className = `column-filter-toggle${hasFilter ? " is-active" : ""}`;
    toggle.textContent = label;
    toggle.setAttribute("aria-pressed", String(hasFilter));
    toggle.setAttribute("aria-label", t(hasFilter ? "removeFilter" : "filterColumn", { column: label }));
    toggle.addEventListener("click", () => {
      if (columnFilters.has(field)) {
        columnFilters.delete(field);
        render();
        return;
      }
      columnFilters.set(field, "");
      render();
      tableHead.querySelector(`[data-column-filter="${field}"]`)?.focus();
    });
    header.append(toggle);

    if (hasFilter) {
      const input = document.createElement("input");
      input.type = "search";
      input.className = "column-filter-input";
      input.placeholder = t("columnPlaceholder");
      input.value = columnFilters.get(field);
      input.dataset.columnFilter = field;
      input.setAttribute("aria-label", t("filterColumn", { column: label }));
      input.addEventListener("input", event => {
        const { selectionStart, selectionEnd } = event.currentTarget;
        columnFilters.set(field, event.currentTarget.value);
        render();
        const nextInput = tableHead.querySelector(`[data-column-filter="${field}"]`);
        nextInput?.focus();
        nextInput?.setSelectionRange(selectionStart, selectionEnd);
      });
      header.append(input);
    }
    headerRow.append(header);
  }
  tableHead.append(headerRow);

  for (const record of filtered) {
    const row = document.createElement("tr");
    for (const [field] of view.columns) {
      const cell = document.createElement("td");
      cell.textContent = valueFor(record, field);
      row.append(cell);
    }
    tableBody.append(row);
  }

  emptyState.hidden = filtered.length > 0;
  emptyTitle.textContent = query ? t("noMatches") : t(view.emptyTitleKey || `no${view.labelKey[0].toUpperCase()}${view.labelKey.slice(1)}`);
  emptyMessage.textContent = query ? t("searchHint") : t("noActiveRecords");
}

async function loadView() {
  if (!client) {
    statusElement.textContent = t("clientUnavailable");
    statusElement.dataset.state = "error";
    records = [];
    render();
    return;
  }

  statusElement.textContent = t("loading");
  statusElement.dataset.state = "loading";
  refreshButton.disabled = true;
  try {
    const { data, error } = await views[viewSelect.value].load();
    if (error) throw error;
    records = data || [];
    if (viewSelect.value === "products") addDiscoveredCategoryViews();
    statusElement.textContent = t("connected");
    statusElement.dataset.state = "connected";
    render();
    renderStatistics();
  } catch (error) {
    records = [];
    connectionError = error.message || "Unknown error";
    statusElement.textContent = t("connectionError", { message: connectionError });
    statusElement.dataset.state = "error";
    render();
  } finally {
    refreshButton.disabled = false;
  }
}

languageSelect.addEventListener("change", () => {
  language = languageSelect.value;
  applyLanguage();
});
themeToggle.addEventListener("click", () => {
  manualTheme = true;
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});
systemTheme.addEventListener("change", event => {
  if (!manualTheme) applyTheme(event.matches ? "dark" : "light");
});
applyLanguage();
applyTheme(document.documentElement.dataset.theme || (systemTheme.matches ? "dark" : "light"));
viewSelect.addEventListener("change", () => {
  columnFilters.clear();
  loadView();
});
searchInput.addEventListener("input", render);
refreshButton.addEventListener("click", loadView);
importButton.addEventListener("click", () => importInput.click());
menuToggle.addEventListener("click", () => {
  const isOpen = adminNavigation.hidden;
  adminNavigation.hidden = !isOpen;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll("[data-admin-view]").forEach(button => {
  button.addEventListener("click", () => {
    const statisticsView = button.dataset.adminView === "statistics";
    catalogPanel.hidden = statisticsView;
    catalogHeading.hidden = statisticsView;
    statisticsPanel.hidden = !statisticsView;
    document.querySelectorAll("[data-admin-view]").forEach(item => item.classList.toggle("is-active", item === button));
    adminNavigation.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    if (statisticsView) renderStatistics();
  });
});
importInput.addEventListener("change", async event => {
  const [file] = event.currentTarget.files;
  event.currentTarget.value = "";
  if (!file) return;

  importButton.disabled = true;
  importStatus.textContent = `${t("loading")} ${file.name}`;
  try {
    const result = await importExcelFile(file);
    importStatus.textContent = `${result.count} productos importados${result.failures ? `; ${result.failures} con error, revisa Estadísticas.` : "."}`;
    await loadView();
  } catch (error) {
    importStatus.textContent = `Error de importación: ${error.message || "Error desconocido."}`;
  } finally {
    importButton.disabled = false;
  }
});
signInForm.addEventListener("submit", async event => {
  event.preventDefault();
  authMessage.textContent = "";
  const submitButton = signInForm.querySelector("button[type=submit]");
  submitButton.disabled = true;
  try {
    if (!client) throw new Error(t("clientUnavailable"));
    const { data, error } = await client.auth.signInWithPassword({
      email: document.querySelector("#auth-email").value.trim(),
      password: document.querySelector("#auth-password").value,
    });
    if (error) throw error;
    if (data.user?.app_metadata?.role !== "admin") {
      await client.auth.signOut();
      throw new Error(t("notAdmin"));
    }
    setAuthenticatedUI(data.user);
    await loadView();
  } catch (error) {
    authMessage.textContent = t("authError", { message: error.message || t("notAdmin") });
    setAuthenticatedUI(null);
  } finally {
    submitButton.disabled = false;
  }
});
signOutButton.addEventListener("click", async () => {
  const { error } = await client.auth.signOut();
  if (error) {
    statusElement.textContent = t("connectionError", { message: error.message });
    statusElement.dataset.state = "error";
    return;
  }
  records = [];
  setAuthenticatedUI(null);
  render();
});
openAdminSession().catch(error => {
  setAuthenticatedUI(null);
  authMessage.textContent = t("authError", { message: error.message || t("notAdmin") });
});
