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
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
let manualTheme = false;
let language = navigator.language?.toLowerCase().startsWith("en") ? "en" : "es";
let connectionError = "";

const translations = {
  es: {
    title: "Administración de catálogo | SAMA", refresh: "Actualizar", backToCatalog: "Volver al catálogo",
    catalog: "CATÁLOGO", catalogAria: "Catálogo de SAMA", adminTitle: "Administración SAMA", adminDescription: "Consulta productos, categorías y marcas activas.",
    readOnly: "Solo lectura", recordType: "Tipo de registro", products: "Productos", categories: "Categorías", brands: "Marcas",
    footerTitle: "SAMA · Catálogo", footerData: "Datos activos de Supabase", searchPlaceholder: "Buscar en el catálogo...",
    results: "registros", result: "registro", loading: "Conectando a Supabase...", connected: "Conectado a Supabase",
    clientUnavailable: "Cliente de Supabase no disponible", connectionError: "Error de conexión: {message}",
    noMatches: "No encontramos registros", noProducts: "Aún no hay productos", noCategories: "Aún no hay categorías", noBrands: "Aún no hay marcas",
    noActiveRecords: "No hay registros activos cargados en Supabase.", searchHint: "Prueba con otro término de búsqueda.",
    filterHint: "Pulsa un encabezado para añadir un filtro. Vuelve a pulsarlo para quitarlo.",
    filterColumn: "Filtrar por {column}", removeFilter: "Quitar filtro de {column}", columnPlaceholder: "Filtrar...",
    sku: "SKU", product: "Producto", category: "Categoría", brand: "Marca", subcategory: "Subcategoría", stock: "Existencias", featured: "Destacado", slug: "Identificador",
    yes: "Sí", no: "No", switchToDark: "Activar modo oscuro", switchToLight: "Activar modo claro", language: "Idioma",
  },
  en: {
    title: "Catalog administration | SAMA", refresh: "Refresh", backToCatalog: "Back to catalog",
    catalog: "CATALOG", catalogAria: "SAMA catalog", adminTitle: "SAMA administration", adminDescription: "View active products, categories, and brands.",
    readOnly: "Read only", recordType: "Record type", products: "Products", categories: "Categories", brands: "Brands",
    footerTitle: "SAMA · Catalog", footerData: "Active Supabase data", searchPlaceholder: "Search the catalog...",
    results: "records", result: "record", loading: "Connecting to Supabase...", connected: "Connected to Supabase",
    clientUnavailable: "Supabase client unavailable", connectionError: "Connection error: {message}",
    noMatches: "No records found", noProducts: "No products yet", noCategories: "No categories yet", noBrands: "No brands yet",
    noActiveRecords: "There are no active records in Supabase.", searchHint: "Try a different search term.",
    filterHint: "Click a column heading to add a filter. Click it again to remove it.",
    filterColumn: "Filter by {column}", removeFilter: "Remove {column} filter", columnPlaceholder: "Filter...",
    sku: "SKU", product: "Product", category: "Category", brand: "Brand", subcategory: "Subcategory", stock: "Stock", featured: "Featured", slug: "Identifier",
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

const views = {
  products: {
    labelKey: "products",
    columns: [
      ["sku", "sku"],
      ["name", "product"],
      ["category", "category"],
      ["brand", "brand"],
      ["subcategory", "subcategory"],
      ["stock", "stock"],
      ["is_featured", "featured"],
    ],
    load: () => client.from("products")
      .select("sku,name,category:categories(name),brand:brands(name),subcategory,stock,is_featured")
      .eq("is_active", true)
      .order("name"),
  },
  categories: {
    labelKey: "categories",
    columns: [["name", "category"], ["slug", "slug"]],
    load: () => client.from("categories").select("name,slug").eq("is_active", true).order("name"),
  },
  brands: {
    labelKey: "brands",
    columns: [["name", "brand"], ["slug", "slug"]],
    load: () => client.from("brands").select("name,slug").eq("is_active", true).order("name"),
  },
};

let records = [];
const columnFilters = new Map();

function valueFor(record, field) {
  const value = record[field];
  if (value && typeof value === "object") return value.name || "—";
  if (typeof value === "boolean") return value ? t("yes") : t("no");
  return value == null || value === "" ? "—" : String(value);
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

  viewLabel.textContent = t(view.labelKey);
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
  emptyTitle.textContent = query ? t("noMatches") : t(`no${view.labelKey[0].toUpperCase()}${view.labelKey.slice(1)}`);
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
    statusElement.textContent = t("connected");
    statusElement.dataset.state = "connected";
    render();
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
loadView();
