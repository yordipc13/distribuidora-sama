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
const activityLogList = document.querySelector("#activity-log-list");
const activityLogEmpty = document.querySelector("#activity-log-empty");
const activityLogButton = document.querySelector("#open-activity-log");
const activityLogCount = document.querySelector("#activity-log-count");
const activityLogDialog = document.querySelector("#activity-log-dialog");
const closeActivityLogButton = document.querySelector("#close-activity-log");
const refreshButton = document.querySelector("#refresh-catalog");
const filterHint = document.querySelector("#filter-hint");
const languageSelect = document.querySelector("#admin-language");
const themeToggle = document.querySelector("#theme-toggle");
const importButton = document.querySelector("#import-excel");
const generateDescriptionsButton = document.querySelector("#generate-descriptions");
const importInput = document.querySelector("#excel-import-input");
const importStatus = document.querySelector("#import-status");
const addProductButton = document.querySelector("#add-product");
const deleteMenuButton = document.querySelector("#delete-menu-button");
const deleteMenu = document.querySelector("#delete-menu");
const productDialog = document.querySelector("#product-dialog");
const productPreviewDialog = document.querySelector("#product-preview-dialog");
const productPreviewTitle = document.querySelector("#product-preview-title");
const productPreviewImage = document.querySelector("#product-preview-image");
const productPreviewImageEmpty = document.querySelector("#product-preview-image-empty");
const productPreviewDetails = document.querySelector("#product-preview-details");
const productForm = document.querySelector("#product-form");
const productDialogTitle = document.querySelector("#product-dialog-title");
const productDialogError = document.querySelector("#product-dialog-error");
const cancelProductButton = document.querySelector("#cancel-product");
const closeProductPreviewButton = document.querySelector("#close-product-preview");
const productContextMenu = document.querySelector("#product-context-menu");
const categoryDeleteDialog = document.querySelector("#category-delete-dialog");
const categoryDeleteForm = document.querySelector("#category-delete-form");
const deleteCategorySelect = document.querySelector("#delete-category-select");
const categoryDeleteError = document.querySelector("#category-delete-error");
const cancelCategoryDeleteButton = document.querySelector("#cancel-category-delete");
const confirmCategoryDeleteButton = document.querySelector("#confirm-category-delete");
const authPanel = document.querySelector("#auth-panel");
const workspace = document.querySelector(".workspace");
const signInForm = document.querySelector("#sign-in-form");
const signOutButton = document.querySelector("#sign-out");
const authMessage = document.querySelector("#auth-message");
const menuToggle = document.querySelector("#menu-toggle");
const adminNavigation = document.querySelector("#admin-navigation");
const statisticsPanel = document.querySelector("#statistics-panel");
const imagesPanel = document.querySelector("#images-panel");
const imageProgress = document.querySelector("#image-progress");
const imageProductName = document.querySelector("#image-product-name");
const imageProductSku = document.querySelector("#image-product-sku");
const imageQuery = document.querySelector("#image-query");
const searchImagesButton = document.querySelector("#search-images");
const skipImageButton = document.querySelector("#skip-image");
const stopImageProcessButton = document.querySelector("#stop-image-process");
const saveSelectedImagesButton = document.querySelector("#save-selected-images");
const chooseImageFolderButton = document.querySelector("#choose-image-folder");
const imageSelectionCount = document.querySelector("#image-selection-count");
const imageResultsGrid = document.querySelector("#image-results-grid");
const imageEmpty = document.querySelector("#image-empty");
const imageStatus = document.querySelector("#image-status");
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
const cancelGenerationButton = document.querySelector("#cancel-generation");
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
let generationController = null;
let imageProducts = [];
let imageIndex = 0;
let imageResults = [];
let imageProcessStopped = false;
let imageDirectoryHandle = null;
const selectedProductSkus = new Set();
const activityLogStorageKey = "sama-admin-product-activity";
const activityLogLimit = 30;
let activityLogEntries = loadActivityLog();
let editingProductSku = null;

const translations = {
  es: {
    title: "Administración de catálogo | SAMA", refresh: "Actualizar", backToCatalog: "Volver al catálogo",
    catalog: "CATÁLOGO", catalogAria: "Catálogo de SAMA", adminTitle: "Administración SAMA", adminDescription: "Consulta productos, categorías y marcas activas.",
    readOnly: "Consulta e importación", importExcel: "Importar Excel", generateDescriptions: "Generar descripciones", addProduct: "Agregar", delete: "Borrar", deleteSelected: "Borrar seleccionados", deleteCategory: "Borrar categoría actual", deleteCategoryTitle: "Borrar categoría", deleteCategoryDescription: "Selecciona la categoría cuyos productos deseas borrar.", selectCategory: "Selecciona una categoría", deleteDescriptions: "Borrar todas las descripciones", deleteAll: "Borrar todos los productos", deleteOne: "Borrar producto", edit: "Editar", save: "Guardar", cancel: "Cancelar", cancelGeneration: "Cancelar generación", signOut: "Cerrar sesión", menu: "Menú", catalogTab: "Catálogo", statisticsTab: "Estadísticas", imagesTab: "Imágenes", imagesEyebrow: "IMÁGENES", imagesTitle: "Buscador asistido de imágenes", imagesDescription: "Selecciona imágenes para productos que todavía no tienen una.", pendingImage: "PENDIENTE", imageSearchPlaceholder: "Buscar imágenes...", searchImages: "Buscar imágenes", skipImage: "Omitir", stopImages: "Detener", chooseImageFolder: "Elegir carpeta Galería", downloadImages: "Descargar seleccionadas", saveImages: "Descargar seleccionadas", noImageResults: "Busca imágenes para comenzar", imageResultsHint: "Las imágenes solo se guardan después de tu selección.", statisticsEyebrow: "SEGUIMIENTO", statisticsTitle: "Estadísticas de generación", statisticsDescription: "Consulta el tiempo total y el tiempo empleado en cada producto.", totalTime: "Tiempo total", individualTimer: "Temporizador individual", completedProducts: "Productos procesados", notStarted: "Sin iniciar", running: "En progreso", finished: "Finalizado", canceled: "Cancelado", sequence: "#", individualTime: "Tiempo individual", generatedDescription: "Descripción generada", noStatistics: "Aún no hay estadísticas", statisticsHint: "Inicia una importación para registrar tiempos", success: "Completado", failure: "Error", errors: "errores", adminAccess: "ACCESO ADMINISTRADOR", signInTitle: "Iniciar sesión", signInDescription: "Accede para consultar e importar productos.", email: "Correo", password: "Contraseña", signIn: "Iniciar sesión", recordType: "Tipo de registro", products: "Productos", cleaning: "Limpieza", office: "Oficina", pharmacy: "Farmacia", appliances: "Electrodomésticos", covid19: "Covid-19",
    footerTitle: "SAMA · Catálogo", footerData: "Datos activos de Supabase", searchPlaceholder: "Buscar en el catálogo...",
    results: "registros", result: "registro",     loading: "Conectando a Supabase...", connected: "Conectado a Supabase", generatingDescriptions: "Generando descripciones:",
    clientUnavailable: "Cliente de Supabase no disponible", connectionError: "Error de conexión: {message}", authError: "No se pudo iniciar sesión: {message}", notAdmin: "La cuenta no tiene permisos de administrador.",
    noMatches: "No encontramos registros", noProducts: "Aún no hay productos", noCategories: "Aún no hay categorías", noBrands: "Aún no hay marcas",
    noActiveRecords: "No hay registros activos cargados en Supabase.", searchHint: "Prueba con otro término de búsqueda.",
    filterHint: "Selecciona uno o varios encabezados y escribe en la barra de búsqueda. Sin selección, busca en todas las columnas.",
    filterColumn: "Buscar en {column}", removeFilter: "Dejar de buscar en {column}",
    sku: "SKU", product: "Producto", category: "Categoría", brand: "Marca", subcategory: "Subcategoría", description: "Descripción", image: "Imagen", stock: "Existencias", featured: "Destacado", slug: "Identificador",
    yes: "Sí", no: "No", switchToDark: "Activar modo oscuro", switchToLight: "Activar modo claro", language: "Idioma",
  },
  en: {
    title: "Catalog administration | SAMA", refresh: "Refresh", backToCatalog: "Back to catalog",
    catalog: "CATALOG", catalogAria: "SAMA catalog", adminTitle: "SAMA administration", adminDescription: "View active products, categories, and brands.",
    readOnly: "View and import", importExcel: "Import Excel", generateDescriptions: "Generate descriptions", addProduct: "Add", delete: "Delete", deleteSelected: "Delete selected", deleteCategory: "Delete category", deleteCategoryTitle: "Delete category", deleteCategoryDescription: "Select the category whose products you want to delete.", selectCategory: "Select a category", deleteDescriptions: "Delete all descriptions", deleteAll: "Delete all products", deleteOne: "Delete product", edit: "Edit", save: "Save", cancel: "Cancel", cancelGeneration: "Cancel generation", signOut: "Sign out", menu: "Menu", catalogTab: "Catalog", statisticsTab: "Statistics", imagesTab: "Images", imagesEyebrow: "IMAGES", imagesTitle: "Assisted image search", imagesDescription: "Select images for products that do not have one yet.", pendingImage: "PENDING", imageSearchPlaceholder: "Search images...", searchImages: "Search images", skipImage: "Skip", stopImages: "Stop", chooseImageFolder: "Choose Gallery folder", downloadImages: "Download selected", saveImages: "Download selected", noImageResults: "Search images to begin", imageResultsHint: "Images are saved only after your selection.", statisticsEyebrow: "TRACKING", statisticsTitle: "Generation statistics", statisticsDescription: "Review total time and time spent on each product.", totalTime: "Total time", individualTimer: "Individual timer", completedProducts: "Products processed", notStarted: "Not started", running: "In progress", finished: "Finished", canceled: "Canceled", sequence: "#", individualTime: "Individual time", generatedDescription: "Generated description", noStatistics: "No statistics yet", statisticsHint: "Start an import to record timings", success: "Completed", failure: "Error", errors: "errors", adminAccess: "ADMIN ACCESS", signInTitle: "Sign in", signInDescription: "Sign in to view and import products.", email: "Email", password: "Password", signIn: "Sign in", recordType: "Record type", products: "Products", cleaning: "Cleaning", office: "Office", pharmacy: "Pharmacy", appliances: "Appliances", covid19: "Covid-19",
    footerTitle: "SAMA · Catalog", footerData: "Active Supabase data", searchPlaceholder: "Search the catalog...",
    results: "records", result: "record",     loading: "Connecting to Supabase...", connected: "Connected to Supabase", generatingDescriptions: "Generating descriptions:",
    clientUnavailable: "Supabase client unavailable", connectionError: "Connection error: {message}", authError: "Could not sign in: {message}", notAdmin: "This account does not have administrator permissions.",
    noMatches: "No records found", noProducts: "No products yet", noCategories: "No categories yet", noBrands: "No brands yet",
    noActiveRecords: "There are no active records in Supabase.", searchHint: "Try a different search term.",
    filterHint: "Select one or more headings and type in the search bar. With none selected, search all columns.",
    filterColumn: "Search in {column}", removeFilter: "Stop searching in {column}",
    sku: "SKU", product: "Product", category: "Category", brand: "Brand", subcategory: "Subcategory", description: "Description", image: "Image", stock: "Stock", featured: "Featured", slug: "Identifier",
    yes: "Yes", no: "No", switchToDark: "Switch to dark mode", switchToLight: "Switch to light mode", language: "Language",
  },
};

Object.assign(translations.es, { close: "Cerrar", productDetails: "Detalle del producto", noProductImage: "Sin imagen disponible", productImageError: "No se pudo cargar la imagen" });
Object.assign(translations.en, { close: "Close", productDetails: "Product details", noProductImage: "No image available", productImageError: "Could not load image" });
Object.assign(translations.es, {
  activityLogButton: "Cambios", activityLogButtonAria: "Ver cambios recientes ({count})",
  activityLogTitle: "Cambios recientes", activityLogNote: "Registro guardado en este navegador",
  activityLogEmpty: "Todavía no hay cambios registrados.", activityAdded: "Añadido",
  activityUpdated: "Actualizado", activityOutOfStock: "Agotado", activityRemoved: "Retirado",
  activityAddedDetails: "Producto añadido al catálogo", activityRemovedDetails: "Producto retirado del catálogo",
});
Object.assign(translations.en, {
  activityLogButton: "Changes", activityLogButtonAria: "View recent changes ({count})",
  activityLogTitle: "Recent changes", activityLogNote: "History saved in this browser",
  activityLogEmpty: "No changes have been recorded yet.", activityAdded: "Added",
  activityUpdated: "Updated", activityOutOfStock: "Out of stock", activityRemoved: "Removed",
  activityAddedDetails: "Product added to catalog", activityRemovedDetails: "Product removed from catalog",
});

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
  imageQuery.placeholder = t("imageSearchPlaceholder");
  languageSelect.setAttribute("aria-label", t("language"));
  document.querySelector(".catalog-panel").setAttribute("aria-label", t("catalogAria"));
  if (statusElement.dataset.state === "connected") statusElement.textContent = t("connected");
  if (statusElement.dataset.state === "loading") statusElement.textContent = t("loading");
  if (statusElement.dataset.state === "error") {
    statusElement.textContent = client ? t("connectionError", { message: connectionError }) : t("clientUnavailable");
  }
  render();
  renderActivityLog();
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
      ["slug", "slug"],
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
const selectedSearchFields = new Set();

function normalizeHeader(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function excelValue(row, names) {
  const entry = Object.entries(row).find(([key]) => names.includes(normalizeHeader(key)));
  return entry ? entry[1] : "";
}

const slugStopWords = new Set([
  "a", "al", "con", "de", "del", "e", "el", "en", "la", "las",
  "los", "para", "por", "un", "una", "y",
]);

function slugifyText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .join("-");
}

function createProductSlug(productName, sku = "") {
  const words = String(productName ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(word => word && !slugStopWords.has(word))
    .slice(0, 5);
  const base = words.join("-");
  return base || `producto-${slugifyText(sku) || "sin-sku"}`;
}

function reserveUniqueSlug(baseSlug, sku, takenSlugs) {
  const normalizedSku = String(sku ?? "").trim();
  let candidate = baseSlug;
  if (!takenSlugs.has(candidate)) {
    takenSlugs.set(candidate, normalizedSku);
    return candidate;
  }
  if (takenSlugs.get(candidate) === normalizedSku) return candidate;

  const skuSuffix = slugifyText(normalizedSku);
  candidate = skuSuffix ? `${baseSlug}-${skuSuffix}` : `${baseSlug}-2`;
  let suffix = 2;
  while (takenSlugs.has(candidate) && takenSlugs.get(candidate) !== normalizedSku) {
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
  takenSlugs.set(candidate, normalizedSku);
  return candidate;
}

async function loadProductSlugs() {
  const { data, error } = await client.from("products").select("*");
  if (error) throw error;
  const bySku = new Map();
  const descriptionsBySku = new Map();
  const productsBySku = new Map();
  const takenSlugs = new Map();
  for (const record of data || []) {
    const sku = String(record.Sku ?? "").trim();
    const slug = String(record.slug ?? "").trim();
    if (sku) bySku.set(sku, slug);
    if (sku) descriptionsBySku.set(sku, record.descripcion ?? null);
    if (sku) productsBySku.set(sku, record);
    if (slug) takenSlugs.set(slug, sku);
  }
  return { bySku, descriptionsBySku, productsBySku, takenSlugs };
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

function loadActivityLog() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(activityLogStorageKey) || "[]");
    return Array.isArray(saved) ? saved.slice(0, activityLogLimit) : [];
  } catch {
    return [];
  }
}

function renderActivityLog() {
  activityLogList.replaceChildren();
  activityLogCount.textContent = String(activityLogEntries.length);
  activityLogButton.setAttribute("aria-label", t("activityLogButtonAria", { count: activityLogEntries.length }));
  activityLogEmpty.hidden = activityLogEntries.length > 0;
  for (const entry of activityLogEntries) {
    const item = document.createElement("li");
    item.className = `activity-log-item is-${entry.type}`;
    const label = document.createElement("span");
    label.className = "activity-log-type";
    label.textContent = t({ added: "activityAdded", updated: "activityUpdated", outOfStock: "activityOutOfStock", removed: "activityRemoved" }[entry.type] || "activityUpdated");
    const content = document.createElement("div");
    content.className = "activity-log-content";
    const title = document.createElement("strong");
    title.textContent = entry.product || entry.sku || t("product");
    const details = document.createElement("p");
    details.textContent = `${entry.sku ? `${entry.sku} · ` : ""}${entry.details}`;
    const timestamp = document.createElement("time");
    timestamp.dateTime = entry.createdAt;
    timestamp.textContent = new Date(entry.createdAt).toLocaleString(language === "en" ? "en" : "es", { dateStyle: "short", timeStyle: "short" });
    content.append(title, details);
    item.append(label, content, timestamp);
    activityLogList.append(item);
  }
}

function saveActivityLog(entry) {
  activityLogEntries.unshift({ ...entry, createdAt: new Date().toISOString() });
  activityLogEntries = activityLogEntries.slice(0, activityLogLimit);
  try {
    window.localStorage.setItem(activityLogStorageKey, JSON.stringify(activityLogEntries));
  } catch {
    // Keep the current-page history if browser storage is unavailable.
  }
  renderActivityLog();
}

function activityValue(field, value) {
  if (value === null || value === undefined || value === "") return "—";
  if (field === "is_active") return value ? t("yes") : t("no");
  const text = String(value);
  return text.length > 80 ? `${text.slice(0, 77)}...` : text;
}

function logProductChange(previous, next) {
  const sku = next.Sku || previous?.Sku || "";
  const product = next.Producto || previous?.Producto || sku;
  if (!previous) {
    saveActivityLog({ type: "added", sku, product, details: t("activityAddedDetails") });
    return;
  }

  const fields = [
    ["Producto", t("product")], ["Categoria", t("category")], ["Subcategoria", t("subcategory")],
    ["descripcion", t("description")], ["Image(url)", t("image")], ["stock", t("stock")],
    ["is_active", language === "es" ? "Activo" : "Active"],
  ];
  const changes = fields.filter(([field]) => String(previous[field] ?? "") !== String(next[field] ?? ""));
  if (!changes.length) return;

  const stockOut = Number(previous.stock) > 0 && Number(next.stock) === 0;
  saveActivityLog({
    type: stockOut ? "outOfStock" : "updated",
    sku,
    product,
    details: changes.map(([field, label]) => `${label}: ${activityValue(field, previous[field])} -> ${activityValue(field, next[field])}`).join("; "),
  });
}

function logProductRemoval(record) {
  saveActivityLog({
    type: "removed",
    sku: record.Sku || "",
    product: record.Producto || record.Sku || "",
    details: t("activityRemovedDetails"),
  });
}

function productFieldLabel(field) {
  const labels = {
    Sku: t("sku"), Producto: t("product"), Categoria: t("category"), Marca: t("brand"),
    Subcategoria: t("subcategory"), descripcion: t("description"), "Image(url)": t("image"),
    stock: t("stock"), is_active: language === "es" ? "Activo" : "Active", slug: t("slug"),
  };
  return labels[field] || field;
}

function openProductPreview(record) {
  productPreviewTitle.textContent = record.Producto || record.Sku || t("product");
  productPreviewDetails.replaceChildren();
  for (const [field, value] of Object.entries(record)) {
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = productFieldLabel(field);
    description.textContent = value === null || value === undefined || value === ""
      ? "—"
      : typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
    productPreviewDetails.append(term, description);
  }

  const imageUrl = [record["Image(url)"], record.imagen_url, record.image_url, record.imagen, record.image]
    .find(value => typeof value === "string" && value.trim());
  productPreviewImage.hidden = !imageUrl;
  productPreviewImageEmpty.hidden = Boolean(imageUrl);
  productPreviewImageEmpty.textContent = t("noProductImage");
  productPreviewImage.alt = record.Producto || record.Sku || t("product");
  productPreviewImage.onerror = () => {
    productPreviewImage.hidden = true;
    productPreviewImageEmpty.hidden = false;
    productPreviewImageEmpty.textContent = t("productImageError");
  };
  if (imageUrl) productPreviewImage.src = imageUrl.trim();
  else productPreviewImage.removeAttribute("src");
  productPreviewDialog.showModal();
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
      <td>${escapeHtml(row.description || "—")}</td>
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
  cancelGenerationButton.disabled = false;
  clearInterval(totalTimerInterval);
  totalTimerInterval = setInterval(renderStatistics, 100);
  renderStatistics();
}

function finishStatistics(state = t("finished")) {
  totalTimerStoppedAt = performance.now();
  totalTimerState.textContent = state;
  cancelGenerationButton.disabled = true;
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
  const { bySku, descriptionsBySku, productsBySku, takenSlugs } = await loadProductSlugs();
  let savedCount = 0;
  for (const product of products) {
    const previous = productsBySku.get(product.sku) || null;
    const existingSlug = bySku.get(product.sku);
    const slug = existingSlug || reserveUniqueSlug(
      createProductSlug(product.producto, product.sku),
      product.sku,
      takenSlugs,
    );
    const payload = {
      Sku: product.sku,
      Producto: product.producto,
      slug,
      Categoria: product.categoria || null,
      Subcategoria: product.subcategoria || null,
      descripcion: String(product.descripcion ?? "").trim()
        ? product.descripcion
        : (descriptionsBySku.get(product.sku) ?? null),
      "Image(url)": product.imagen_url || null,
      stock: product.stock,
      is_active: true,
    };
    const { error } = await client.from("products").upsert(payload, { onConflict: "Sku" });
    if (error) throw error;
    logProductChange(previous, payload);
    bySku.set(product.sku, slug);
    descriptionsBySku.set(product.sku, payload.descripcion);
    productsBySku.set(product.sku, payload);
    savedCount += 1;
    importStatus.textContent = `Guardados ${savedCount}/${products.length} (${product.sku})`;
  }
  return { count: savedCount };
}

function databaseProductToDescriptionProduct(record) {
  return {
    sku: record.Sku,
    producto: record.Producto,
    categoria: record.Categoria || "",
    subcategoria: record.Subcategoria || "",
    descripcion: record.descripcion,
    stock: record.stock,
    imagen_url: record["Image(url)"] || "",
  };
}

async function generateMissingDescriptions() {
  const { data, error } = await client.from("products").select("*").eq("is_active", true).order("Producto");
  if (error) throw error;
  const products = (data || [])
    .map(databaseProductToDescriptionProduct)
    .filter(product => window.SamaProductDescriptions.isEmptyDescription(product.descripcion));
  if (!products.length) {
    importStatus.textContent = "No hay productos con descripción vacía.";
    return { count: 0, failures: 0 };
  }

  const startedProducts = new Map();
  const descriptionDurations = new Map();
  resetStatistics(products.length);
  generationController = new AbortController();
  const signal = generationController.signal;
  let savedCount = 0;
  try {
    await window.SamaProductDescriptions.prepareProductsForSync(products, {
      delayMs: 4500,
      signal,
      onProgress: progress => {
        importStatus.textContent = `${t("generatingDescriptions")} ${progress.completed}/${progress.total} (${progress.sku})`;
      },
      onPrepared: async (product, progress) => {
        const { error: upsertError } = await client.from("products")
          .update({ descripcion: product.descripcion })
          .eq("Sku", product.sku);
        if (upsertError) throw upsertError;
        logProductChange(
          { Sku: product.sku, Producto: product.producto, descripcion: null },
          { Sku: product.sku, Producto: product.producto, descripcion: product.descripcion },
        );
        savedCount += 1;
        statistics.completed += 1;
        statistics.rows.push({
          sku: product.sku,
          producto: product.producto,
          duration: descriptionDurations.get(product.sku) || 0,
          success: true,
          description: product.descripcion,
        });
        renderStatistics();
        importStatus.textContent = `Guardadas ${savedCount}/${progress.total} (${product.sku})`;
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
      onError: (product, generationError) => {
        if (generationError.name === "AbortError") throw generationError;
        individualTimerStoppedAt = performance.now();
        statistics.completed += 1;
        statistics.failures += 1;
        statistics.rows.push({
          sku: product.sku,
          producto: product.producto,
          duration: performance.now() - (startedProducts.get(product.sku) || performance.now()),
          success: false,
          error: generationError.message || "Error desconocido",
          description: "",
        });
        renderStatistics();
        importStatus.textContent = `Se omitió ${product.sku}: ${generationError.message || "Error desconocido"}`;
      },
    });
    return { count: savedCount, failures: statistics.failures };
  } catch (generationError) {
    if (generationError.name === "AbortError") {
      importStatus.textContent = "Generación cancelada. Las descripciones guardadas antes de cancelar se conservaron.";
      return { count: savedCount, failures: statistics.failures, canceled: true };
    }
    throw generationError;
  } finally {
    finishStatistics(signal.aborted ? t("canceled") : t("finished"));
    generationController = null;
  }
}

function imageWorkerUrl() {
  const url = String(window.SAMA_IMAGE_WORKER_URL || "").trim();
  if (!url) throw new Error("Configura SAMA_IMAGE_WORKER_URL en Admin/admin.html después de desplegar el Worker.");
  return url;
}

async function imageWorkerRequest(body) {
  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  if (sessionError || !sessionData.session?.access_token) throw new Error("La sesión administrativa expiró. Inicia sesión nuevamente.");
  const response = await fetch(imageWorkerUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionData.session.access_token}`,
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `El Worker respondió con HTTP ${response.status}.`);
  return payload;
}

async function imageWorkerDownloadRequest(body) {
  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  if (sessionError || !sessionData.session?.access_token) throw new Error("La sesión administrativa expiró. Inicia sesión nuevamente.");
  const response = await fetch(imageWorkerUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionData.session.access_token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `El Worker respondió con HTTP ${response.status}.`);
  }
  return response;
}

function renderImageResults() {
  imageResultsGrid.replaceChildren();
  imageEmpty.hidden = imageResults.length > 0;
  for (const [index, result] of imageResults.entries()) {
    const card = document.createElement("label");
    card.className = "image-result-card";
    card.innerHTML = `<input type="checkbox" data-image-index="${index}" ${result.selected ? "checked" : ""}><img src="${escapeHtml(result.thumbnailUrl || result.imageUrl)}" alt="${escapeHtml(result.title)}"><strong>${escapeHtml(result.title || "Imagen")}</strong><small>${escapeHtml(result.sourcePageUrl || "Origen no disponible")}</small>`;
    card.querySelector("input").addEventListener("change", event => {
      result.selected = event.currentTarget.checked;
      const selectedCount = imageResults.filter(item => item.selected).length;
      imageSelectionCount.textContent = `${selectedCount} seleccionadas`;
      saveSelectedImagesButton.disabled = selectedCount === 0;
    });
    imageResultsGrid.append(card);
  }
}

async function loadImageProducts() {
  const { data, error } = await client.from("products")
    .select('Sku,Producto,"Image(url)"')
    .eq("is_active", true)
    .order("Producto");
  if (error) throw error;
  imageProducts = (data || []).filter(product => !String(product["Image(url)"] || "").trim());
  imageIndex = 0;
  imageProcessStopped = false;
  renderCurrentImageProduct();
}

function renderCurrentImageProduct() {
  const product = imageProducts[imageIndex];
  imageProgress.textContent = imageProducts.length
    ? `${Math.min(imageIndex + 1, imageProducts.length)} / ${imageProducts.length}`
    : "0 / 0";
  imageProductName.textContent = product?.Producto || "—";
  imageProductSku.textContent = `SKU: ${product?.Sku || "—"}`;
  imageQuery.value = product?.Producto || "";
  searchImagesButton.disabled = !product;
  skipImageButton.disabled = !product;
  stopImageProcessButton.disabled = !product;
  imageResults = [];
  imageSelectionCount.textContent = "0 seleccionadas";
  saveSelectedImagesButton.disabled = true;
  renderImageResults();
}

async function searchCurrentProductImages() {
  const product = imageProducts[imageIndex];
  if (!product) return;
  const query = imageQuery.value.trim() || product.Producto;
  const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
  const searchWindow = window.open(
    searchUrl,
    "sama-image-search",
    "popup,width=1100,height=850,left=500,top=80",
  );
  if (!searchWindow) {
    imageStatus.textContent = "El navegador bloqueó la ventana. Permite ventanas emergentes para este sitio.";
    return;
  }
  searchWindow.focus();
  imageStatus.textContent = "Google Imágenes abierto. Arrastra o pega las imágenes aquí.";
}

async function chooseImageFolder() {
  if (!window.showDirectoryPicker) {
    imageStatus.textContent = "Tu navegador no permite elegir una carpeta. Las imágenes se descargarán normalmente.";
    return;
  }
  imageDirectoryHandle = await window.showDirectoryPicker({ mode: "readwrite", startIn: "downloads" });
  imageStatus.textContent = "Carpeta seleccionada. Las imágenes se guardarán allí.";
}

function imageExtension(contentType) {
  return ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" })[contentType] || "jpg";
}

async function downloadImageBlob(image, filename) {
  const response = await imageWorkerDownloadRequest({ action: "download", imageUrl: image.imageUrl, filename });
  return {
    blob: await response.blob(),
    contentType: response.headers.get("content-type") || "image/jpeg",
  };
}

async function saveCurrentProductImages() {
  const product = imageProducts[imageIndex];
  const selected = imageResults.filter(item => item.selected);
  if (!product || !selected.length) return;
  saveSelectedImagesButton.disabled = true;
  imageStatus.textContent = "Descargando imágenes...";
  try {
    for (const [index, image] of selected.entries()) {
      const downloaded = await downloadImageBlob(image, `${product.Sku}-${index === 0 ? "primary" : `secondary-${String(index).padStart(2, "0")}`}`);
      const filename = `${product.Sku}-${index === 0 ? "primary" : `secondary-${String(index).padStart(2, "0")}`}.${imageExtension(downloaded.contentType)}`;
      if (imageDirectoryHandle) {
        const fileHandle = await imageDirectoryHandle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(downloaded.blob);
        await writable.close();
      } else {
        const url = URL.createObjectURL(downloaded.blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      }
    }
    imageStatus.textContent = `${selected.length} imagen(es) descargada(s) en Galería.`;
    imageProducts.splice(imageIndex, 1);
    if (imageIndex >= imageProducts.length) imageIndex = Math.max(0, imageProducts.length - 1);
    renderCurrentImageProduct();
  } catch (error) {
    imageStatus.textContent = `Error: ${error.message}`;
    saveSelectedImagesButton.disabled = false;
  }
}

function skipCurrentImageProduct() {
  if (!imageProducts.length) return;
  imageProducts.splice(imageIndex, 1);
  if (imageIndex >= imageProducts.length) imageIndex = Math.max(0, imageProducts.length - 1);
  renderCurrentImageProduct();
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
  const searchFields = selectedSearchFields.size
    ? view.columns.filter(([field]) => selectedSearchFields.has(field)).map(([field]) => field)
    : view.columns.map(([field]) => field);
  const filtered = records.filter(record => {
    const globalMatch = !query || searchFields.some(field =>
      valueFor(record, field).toLocaleLowerCase("es").includes(query),
    );
    return globalMatch;
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
    const isSelected = selectedSearchFields.has(field);
    toggle.type = "button";
    toggle.className = `column-filter-toggle${isSelected ? " is-active" : ""}`;
    header.classList.toggle("is-filter-active", isSelected);
    toggle.textContent = label;
    toggle.setAttribute("aria-pressed", String(isSelected));
    toggle.setAttribute("aria-label", t(isSelected ? "removeFilter" : "filterColumn", { column: label }));
    toggle.addEventListener("click", () => {
      if (selectedSearchFields.has(field)) selectedSearchFields.delete(field);
      else selectedSearchFields.add(field);
      render();
    });
    header.append(toggle);
    headerRow.append(header);
  }
  tableHead.append(headerRow);

  for (const record of filtered) {
    const row = document.createElement("tr");
    row.dataset.sku = record.Sku;
    row.classList.toggle("is-selected", selectedProductSkus.has(record.Sku));
    row.addEventListener("click", () => {
      if (selectedProductSkus.has(record.Sku)) selectedProductSkus.delete(record.Sku);
      else selectedProductSkus.add(record.Sku);
      row.classList.toggle("is-selected", selectedProductSkus.has(record.Sku));
    });
    row.addEventListener("dblclick", () => openProductPreview(record));
    row.addEventListener("contextmenu", event => {
      event.preventDefault();
      selectedProductSkus.add(record.Sku);
      render();
      productContextMenu.style.left = `${Math.min(event.clientX, window.innerWidth - 180)}px`;
      productContextMenu.style.top = `${Math.min(event.clientY, window.innerHeight - 90)}px`;
      productContextMenu.hidden = false;
      productContextMenu.dataset.sku = record.Sku;
    });
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

function openProductDialog(record = null) {
  editingProductSku = record?.Sku || null;
  productDialogTitle.textContent = record ? t("edit") : t("addProduct");
  productDialogError.textContent = "";
  for (const field of ["sku", "producto", "categoria", "subcategoria", "descripcion", "imagen_url", "stock"]) {
    productForm.elements[field].value = record
      ? (field === "sku" ? record.Sku : field === "imagen_url" ? record["Image(url)"] || "" : record[field === "producto" ? "Producto" : field === "categoria" ? "Categoria" : field === "subcategoria" ? "Subcategoria" : field] ?? "")
      : "";
  }
  productForm.elements.sku.disabled = Boolean(record);
  productDialog.showModal();
}

async function deleteProducts(skus) {
  if (!skus.length) throw new Error("Selecciona al menos un producto.");
  const { data: removedProducts, error: selectError } = await client.from("products").select("*").in("Sku", skus);
  if (selectError) throw selectError;
  const { error } = await client.from("products").delete().in("Sku", skus);
  if (error) throw error;
  (removedProducts || []).forEach(logProductRemoval);
  skus.forEach(sku => selectedProductSkus.delete(sku));
}

async function availableCategories() {
  const { data, error } = await client.from("products").select("Categoria");
  if (error) throw error;
  return [...new Set((data || []).flatMap(record => String(record.Categoria || "")
    .split(",")
    .map(category => category.trim())
    .filter(Boolean)))].sort((a, b) => a.localeCompare(b, "es"));
}

async function openCategoryDeleteDialog() {
  categoryDeleteError.textContent = "";
  deleteCategorySelect.replaceChildren();
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = t("selectCategory");
  deleteCategorySelect.append(placeholder);
  for (const category of await availableCategories()) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    deleteCategorySelect.append(option);
  }
  confirmCategoryDeleteButton.disabled = true;
  categoryDeleteDialog.showModal();
}

async function deleteCategoryProducts(category) {
  const { data, error: selectError } = await client.from("products").select("*");
  if (selectError) throw selectError;
  const normalizedCategory = category.toLocaleLowerCase("es");
  const skus = (data || [])
    .filter(record => String(record.Categoria || "").split(",")
      .map(value => value.trim().toLocaleLowerCase("es"))
      .includes(normalizedCategory))
    .map(record => record.Sku)
    .filter(Boolean);
  if (!skus.length) throw new Error("No se encontraron productos para esa categoría.");
  const removedProducts = (data || []).filter(record => skus.includes(record.Sku));
  const { error: deleteError } = await client.from("products").delete().in("Sku", skus);
  if (deleteError) throw deleteError;
  removedProducts.forEach(logProductRemoval);
  skus.forEach(sku => selectedProductSkus.delete(sku));
  await loadView();
}

async function executeDeleteAction(action) {
  let skus = [];
  if (action === "selected") skus = [...selectedProductSkus];
  if (action === "category") {
    await openCategoryDeleteDialog();
    return;
  }
  if (action === "all") {
    if (!window.confirm("¿Borrar absolutamente todos los productos? Esta acción no se puede deshacer.")) return;
    const { data: removedProducts, error: selectError } = await client.from("products").select("Sku,Producto").not("Sku", "is", null);
    if (selectError) throw selectError;
    const { error } = await client.from("products").delete().not("Sku", "is", null);
    if (error) throw error;
    (removedProducts || []).forEach(logProductRemoval);
    selectedProductSkus.clear();
    await loadView();
    return;
  }
  if (action === "descriptions") {
    const confirmed = window.confirm("¿Borrar todas las descripciones de todos los productos? Esta acción no se puede deshacer.");
    if (!confirmed) return;
    const { data: products, error: selectError } = await client.from("products").select("*").not("Sku", "is", null);
    if (selectError) throw selectError;
    const { error } = await client.from("products").update({ descripcion: null }).not("Sku", "is", null);
    if (error) throw error;
    (products || []).forEach(product => logProductChange(product, { ...product, descripcion: null }));
    await loadView();
    return;
  }
  if (!skus.length) throw new Error("No hay productos para borrar en esta vista.");
  if (!window.confirm(`¿Borrar ${skus.length} producto(s)? Esta acción no se puede deshacer.`)) return;
  await deleteProducts(skus);
  await loadView();
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
  selectedSearchFields.clear();
  loadView();
});
searchInput.addEventListener("input", render);
refreshButton.addEventListener("click", loadView);
importButton.addEventListener("click", () => importInput.click());
activityLogButton.addEventListener("click", () => activityLogDialog.showModal());
closeActivityLogButton.addEventListener("click", () => activityLogDialog.close());
addProductButton.addEventListener("click", () => openProductDialog());
cancelProductButton.addEventListener("click", () => productDialog.close());
closeProductPreviewButton.addEventListener("click", () => productPreviewDialog.close());
deleteMenuButton.addEventListener("click", () => {
  deleteMenu.hidden = !deleteMenu.hidden;
  deleteMenuButton.setAttribute("aria-expanded", String(!deleteMenu.hidden));
});
deleteCategorySelect.addEventListener("change", () => {
  confirmCategoryDeleteButton.disabled = !deleteCategorySelect.value;
});
cancelCategoryDeleteButton.addEventListener("click", () => categoryDeleteDialog.close());
categoryDeleteForm.addEventListener("submit", async event => {
  event.preventDefault();
  const category = deleteCategorySelect.value;
  if (!category) return;
  confirmCategoryDeleteButton.disabled = true;
  categoryDeleteError.textContent = "";
  try {
    await deleteCategoryProducts(category);
    categoryDeleteDialog.close();
    importStatus.textContent = `Categoría "${category}" borrada correctamente.`;
  } catch (error) {
    categoryDeleteError.textContent = error.message || "No se pudo borrar la categoría.";
    confirmCategoryDeleteButton.disabled = false;
  }
});
document.querySelectorAll("[data-delete-action]").forEach(button => {
  button.addEventListener("click", async () => {
    deleteMenu.hidden = true;
    deleteMenuButton.setAttribute("aria-expanded", "false");
    try {
      await executeDeleteAction(button.dataset.deleteAction);
    } catch (error) {
      importStatus.textContent = `Error: ${error.message || "No se pudo completar el borrado."}`;
    }
  });
});
document.querySelectorAll("[data-context-action]").forEach(button => {
  button.addEventListener("click", async () => {
    const sku = productContextMenu.dataset.sku;
    const record = records.find(item => item.Sku === sku);
    productContextMenu.hidden = true;
    if (!record) return;
    if (button.dataset.contextAction === "edit") {
      openProductDialog(record);
      return;
    }
    try {
      if (!window.confirm(`¿Borrar el producto ${sku}? Esta acción no se puede deshacer.`)) return;
      await deleteProducts([sku]);
      await loadView();
    } catch (error) {
      importStatus.textContent = `Error: ${error.message || "No se pudo borrar el producto."}`;
    }
  });
});
document.addEventListener("click", event => {
  if (!deleteMenu.contains(event.target) && event.target !== deleteMenuButton) {
    deleteMenu.hidden = true;
    deleteMenuButton.setAttribute("aria-expanded", "false");
  }
  if (!productContextMenu.contains(event.target)) productContextMenu.hidden = true;
});
productForm.addEventListener("submit", async event => {
  event.preventDefault();
  productDialogError.textContent = "";
  const formData = new FormData(productForm);
  const stockValue = formData.get("stock");
  const sku = String(formData.get("sku") || "").trim();
  const productName = String(formData.get("producto") || "").trim();
  const payload = {
    Sku: sku,
    Producto: productName,
    Categoria: String(formData.get("categoria") || "").trim() || null,
    Subcategoria: String(formData.get("subcategoria") || "").trim() || null,
    descripcion: String(formData.get("descripcion") || "").trim() || null,
    "Image(url)": String(formData.get("imagen_url") || "").trim() || null,
    stock: stockValue === "" ? null : Number(stockValue),
    is_active: true,
  };
  try {
    if (!payload.Sku || !payload.Producto) throw new Error("SKU y Producto son obligatorios.");
    if (payload.stock !== null && (!Number.isInteger(payload.stock) || payload.stock < 0)) throw new Error("Las existencias deben ser un entero no negativo.");
    const { bySku, productsBySku, takenSlugs } = await loadProductSlugs();
    const previous = productsBySku.get(sku) || null;
    const existingSlug = bySku.get(sku);
    payload.slug = existingSlug || reserveUniqueSlug(createProductSlug(productName, sku), sku, takenSlugs);
    const { error } = await client.from("products").upsert(payload, { onConflict: "Sku" });
    if (error) throw error;
    logProductChange(previous, payload);
    productDialog.close();
    await loadView();
  } catch (error) {
    productDialogError.textContent = error.message || "No se pudo guardar el producto.";
  }
});
menuToggle.addEventListener("click", () => {
  const isOpen = adminNavigation.hidden;
  adminNavigation.hidden = !isOpen;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll("[data-admin-view]").forEach(button => {
  button.addEventListener("click", () => {
    const statisticsView = button.dataset.adminView === "statistics";
    const imagesView = button.dataset.adminView === "images";
    catalogPanel.hidden = statisticsView;
    catalogHeading.hidden = statisticsView;
    statisticsPanel.hidden = !statisticsView;
    imagesPanel.hidden = !imagesView;
    catalogPanel.hidden = statisticsView || imagesView;
    catalogHeading.hidden = statisticsView || imagesView;
    document.querySelectorAll("[data-admin-view]").forEach(item => item.classList.toggle("is-active", item === button));
    adminNavigation.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    if (statisticsView) renderStatistics();
    if (imagesView) {
      loadImageProducts().catch(error => {
        imageStatus.textContent = `Error: ${error.message}`;
      });
    }
  });
});
searchImagesButton.addEventListener("click", searchCurrentProductImages);
imageQuery.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchCurrentProductImages();
  }
});
saveSelectedImagesButton.addEventListener("click", saveCurrentProductImages);
chooseImageFolderButton.addEventListener("click", () => {
  chooseImageFolder().catch(error => {
    imageStatus.textContent = `No se pudo seleccionar la carpeta: ${error.message}`;
  });
});
skipImageButton.addEventListener("click", skipCurrentImageProduct);
stopImageProcessButton.addEventListener("click", () => {
  imageProcessStopped = true;
  imageStatus.textContent = "Proceso detenido.";
});
importInput.addEventListener("change", async event => {
  const [file] = event.currentTarget.files;
  event.currentTarget.value = "";
  if (!file) return;

  importButton.disabled = true;
  generateDescriptionsButton.disabled = true;
  importStatus.textContent = `${t("loading")} ${file.name}`;
  try {
    const result = await importExcelFile(file);
    importStatus.textContent = `${result.count} productos importados${result.failures ? `; ${result.failures} con error, revisa Estadísticas.` : "."}`;
    await loadView();
  } catch (error) {
    importStatus.textContent = `Error de importación: ${error.message || "Error desconocido."}`;
  } finally {
    importButton.disabled = false;
    generateDescriptionsButton.disabled = false;
  }
});
generateDescriptionsButton.addEventListener("click", async () => {
  importButton.disabled = true;
  generateDescriptionsButton.disabled = true;
  importStatus.textContent = "Buscando productos sin descripción...";
  try {
    const result = await generateMissingDescriptions();
    if (!result.canceled) {
      importStatus.textContent = result.failures
        ? `${result.count} descripciones generadas; ${result.failures} con error.`
        : `${result.count} descripciones generadas.`;
    }
    await loadView();
  } catch (error) {
    finishStatistics();
    importStatus.textContent = `Error de generación: ${error.message || "Error desconocido."}`;
  } finally {
    importButton.disabled = false;
    generateDescriptionsButton.disabled = false;
  }
});
cancelGenerationButton.addEventListener("click", () => {
  if (!generationController) return;
  cancelGenerationButton.disabled = true;
  generationController.abort();
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
