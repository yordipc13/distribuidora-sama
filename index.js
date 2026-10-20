const translations = {
	es: {
		service: "Atención personalizada para tu empresa",
		hours: "Lun - Vie: 8:00 a.m. - 5:00 p.m. &nbsp; | &nbsp; Cotiza por WhatsApp",
		searchAll: "Todas las categorías", searchPlaceholder: "¿Qué estás buscando?", search: "Buscar productos",
		favorites: "Favoritos", quote: "Cotización", viewAll: "Ver todo",
		eyebrow: "Soluciones que mueven tu negocio", heroTitle: "Todo lo que tu empresa necesita.",
		metaDescription: "SAMA: suministros de oficina, limpieza, tecnología y más. Solicita tu cotización.",
		categoryFilter: "Filtrar por categoría",
		heroBody: "Encuentra suministros confiables para oficina, limpieza y tecnología. Nosotros te ayudamos a encontrar la mejor solución.",
		browse: "Explorar catálogo", shopCategory: "Compra por categoría", findQuickly: "Encuentra rápidamente lo que necesitas.", viewCatalog: "Ver catálogo →",
		featured: "Productos destacados", addForQuote: "Agrega productos a tu lista para solicitar una cotización.", results: "resultados",
		attention: "Atención personalizada", helpChoose: "Te ayudamos a elegir la mejor opción.", businessCatalog: "Catálogo empresarial",
		bulkSolutions: "Soluciones para compras por volumen.", noCommitment: "Cotización sin compromiso", quoteWhatsapp: "Solicita precios a través de WhatsApp.",
		links: "Enlaces", catalog: "Catálogo", categories: "Categorías", faq: "Preguntas frecuentes", contact: "Contáctanos",
		footerAbout: "Somos tu aliado para abastecer tu empresa con productos confiables y atención cercana.",
		whatsapp: "WhatsApp", contactPending: "Próximamente", contactWhatsApp: "Contactar por WhatsApp", schedule: "Lun - Vie, 8:00 a.m. - 5:00 p.m.", store: "Tienda", account: "Mi cuenta",
		loading: "Cargando el catálogo...", noConnection: "No se encontró la conexión con Supabase.",
		loadError: "No se pudo cargar el catálogo: {message}", retry: "Reintentar", noFeatured: "Aún no hay productos destacados.",
		noProducts: "Aún no hay productos disponibles en el catálogo.", productsWillAppear: "Los productos aparecerán aquí cuando se agreguen a la base de datos.",
		productDetails: "Consulta la ficha del producto para conocer sus detalles.", noDescription: "No hay una descripción disponible para este producto.",
		quantity: "Cantidad", addQuote: "Agregar a cotización", inFavorites: "♥ En favoritos", addFavorites: "♡ Agregar a favoritos",
		shareProduct: "Compartir producto", shareTitle: "Producto {name} de SAMA", linkCopied: "Enlace del producto copiado.",
		shareUnavailable: "No se pudo compartir el enlace en este navegador.", shareError: "No se pudo compartir el producto.",
		close: "Cerrar", decreaseQuantity: "Disminuir cantidad", increaseQuantity: "Aumentar cantidad",
		addedQuote: "{name} se agregó a tu cotización.", addedFavorite: "Agregado a favoritos.", removedFavorite: "Eliminado de favoritos.",
		selection: "Tu selección", emptyFavorites: "Aún no tienes productos favoritos.", viewProduct: "Ver producto",
		yourRequest: "Tu solicitud", quoteList: "Lista de cotización", emptyQuote: "Tu lista de cotización está vacía.", requestWhatsapp: "Solicitar por WhatsApp",
		quoteMessage: "Hola SAMA, deseo cotizar: ", noAccount: "La cuenta estará disponible próximamente.",
		switchToDark: "Activar modo oscuro", switchToLight: "Activar modo claro", language: "Idioma",
		countProducts: "{count} productos", countOne: "1 producto",
	},
	en: {
		service: "Personalized service for your business",
		hours: "Mon - Fri: 8:00 a.m. - 5:00 p.m. &nbsp; | &nbsp; Request a quote on WhatsApp",
		searchAll: "All categories", searchPlaceholder: "What are you looking for?", search: "Search products",
		favorites: "Favorites", quote: "Quote", viewAll: "View all",
		eyebrow: "Solutions that move your business", heroTitle: "Everything your business needs.",
		metaDescription: "SAMA: office, cleaning, technology, and business supplies. Request a quote.",
		categoryFilter: "Filter by category",
		heroBody: "Find reliable office, cleaning, and technology supplies. We help you find the right solution.",
		browse: "Browse catalog", shopCategory: "Shop by category", findQuickly: "Find what you need quickly.", viewCatalog: "View catalog →",
		featured: "Featured products", addForQuote: "Add products to your list to request a quote.", results: "results",
		attention: "Personalized service", helpChoose: "We help you choose the right option.", businessCatalog: "Business catalog",
		bulkSolutions: "Solutions for volume purchases.", noCommitment: "No-obligation quote", quoteWhatsapp: "Request pricing on WhatsApp.",
		links: "Links", catalog: "Catalog", categories: "Categories", faq: "Frequently asked questions", contact: "Contact us",
		footerAbout: "Your partner for reliable business supplies and attentive service.",
		whatsapp: "WhatsApp", contactPending: "Coming soon", contactWhatsApp: "Contact us on WhatsApp", schedule: "Mon - Fri, 8:00 a.m. - 5:00 p.m.", store: "Store", account: "My account",
		loading: "Loading catalog...", noConnection: "Supabase connection was not found.",
		loadError: "Could not load catalog: {message}", retry: "Retry", noFeatured: "There are no featured products yet.",
		noProducts: "There are no products in the catalog yet.", productsWillAppear: "Products will appear here once they are added to the database.",
		productDetails: "Open the product details to learn more.", noDescription: "No description is available for this product.",
		quantity: "Quantity", addQuote: "Add to quote", inFavorites: "♥ In favorites", addFavorites: "♡ Add to favorites",
		shareProduct: "Share product", shareTitle: "SAMA product: {name}", linkCopied: "Product link copied.",
		shareUnavailable: "This browser cannot share the link.", shareError: "Could not share this product.",
		close: "Close", decreaseQuantity: "Decrease quantity", increaseQuantity: "Increase quantity",
		addedQuote: "{name} was added to your quote.", addedFavorite: "Added to favorites.", removedFavorite: "Removed from favorites.",
		selection: "Your selection", emptyFavorites: "You do not have any favorite products yet.", viewProduct: "View product",
		yourRequest: "Your request", quoteList: "Quote list", emptyQuote: "Your quote list is empty.", requestWhatsapp: "Request on WhatsApp",
		quoteMessage: "Hello SAMA, I would like a quote for: ", noAccount: "Accounts will be available soon.",
		switchToDark: "Switch to dark mode", switchToLight: "Switch to light mode", language: "Language",
		countProducts: "{count} products", countOne: "1 product",
	},
};

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
let manualTheme = false;
const products = [];
const PRODUCTS_TABLE = "products";
const categoryIcons = ["▦", "✦", "⌁", "▤"];
let categories = [];
let categoryRows = [];

const state = {
	query: "",
	category: "Todos",
	language: navigator.language?.toLowerCase().startsWith("en") ? "en" : "es",
	theme: systemTheme.matches ? "dark" : "light",
	cart: JSON.parse(localStorage.getItem("sama-cart") || "[]"),
	favorites: JSON.parse(localStorage.getItem("sama-favorites") || "[]"),
	loading: true,
	loadError: "",
};

function t(key, values = {}) {
	let message = translations[state.language][key] ?? translations.es[key] ?? key;
	for (const [name, value] of Object.entries(values)) message = message.replaceAll(`{${name}}`, String(value));
	return message;
}

function applyTheme(theme) {
	state.theme = theme;
	document.documentElement.dataset.theme = theme;
	document.documentElement.style.colorScheme = theme;
	const themeColor = document.querySelector('meta[name="theme-color"]');
	if (themeColor) themeColor.content = theme === "dark" ? "#0b1220" : "#f8fafc";
}

applyTheme(state.theme);
systemTheme.addEventListener("change", event => {
	if (!manualTheme) applyTheme(event.matches ? "dark" : "light");
});

const app = document.querySelector("#app");
const imagePath = "./Logo y Banner/banner.jpg";
const productImage = (product) => product.image || imagePath;
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, character => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
})[character]);

function normalizeProduct(row) {
	const stock = row.stock == null ? null : Number(row.stock);
	const category = row.category?.name ?? row.categories?.name ?? row.categoria ?? (typeof row.category === "string" ? row.category : "Sin categoría");
	return {
		sku: String(row.sku ?? row.SKU ?? row.codigo ?? "").trim(),
		name: String(row.producto ?? row.product ?? row.nombre ?? row.name ?? "").trim(),
		category: String(category).trim(),
		subcategory: String(row.subcategoria ?? row.subcategory ?? "").trim(),
		description: String(row.descripcion ?? row.description ?? row.detalle ?? "").trim(),
		image: String(row.imagen ?? row.image ?? row.imagen_url ?? row.image_url ?? "").trim(),
		stock,
		isFeatured: row.is_featured === true,
	};
}

function rebuildCategories() {
	const names = [...new Set([
		...categoryRows.map(category => String(category.name ?? "").trim()),
		...products.map(product => product.category),
	].filter(Boolean))];
	categories = names.map((name, index) => ({
		name,
		icon: categoryIcons[index % categoryIcons.length],
		count: products.filter(product => product.category === name).length,
	}));
}

async function loadProducts() {
	const client = window.supabaseClient || window.app?.supabase;
	if (!client) {
		state.loadError = t("noConnection");
		state.loading = false;
		render();
		return;
	}
	const [productResult, categoryResult] = await Promise.all([
		client
			.from(PRODUCTS_TABLE)
			.select("sku,name,category:categories(name),subcategory,description,image_url,stock,is_featured")
			.eq("is_active", true),
		client.from("categories").select("name").eq("is_active", true).order("name"),
	]);
	const { data, error } = productResult;
	if (error) {
		state.loadError = t("loadError", { message: error.message });
	} else {
		categoryRows = categoryResult.error ? [] : categoryResult.data || [];
		products.splice(0, products.length, ...(data || []).map(normalizeProduct).filter(product => product.sku && product.name && product.stock !== 0));
		rebuildCategories();
	}
	state.loading = false;
	render();
	const sharedSku = new URLSearchParams(window.location.search).get("producto");
	const sharedProduct = products.find(product => product.sku === sharedSku);
	if (sharedProduct) openModal(sharedProduct);
}

function render() {
	document.documentElement.lang = state.language;
	document.title = state.language === "en" ? "SAMA Distribution | Business Supplies" : "Distribuidora SAMA | Suministros para tu empresa";
	const description = document.querySelector('meta[name="description"]');
	if (description) description.content = t("metaDescription");
	app.innerHTML = `
		<div class="topbar"><strong>${t("service")}</strong><span>${t("hours")}</span></div>
		<header class="site-header">
			<div class="nav">
				<a class="brand" href="#" data-home><img src="./Logo y Banner/Logo.jpg" alt="SAMA"><b class="brand-text">SAMA<span>Distribuidora</span></b></a>
				<form class="search" id="search-form"><select id="category-filter" aria-label="${t("categoryFilter")}"><option value="Todos">${t("searchAll")}</option>${categories.map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`).join("")}</select><input id="search-input" value="${escapeHtml(state.query)}" placeholder="${t("searchPlaceholder")}" aria-label="${t("search")}"><button aria-label="${t("search")}">⌕</button></form>
				<div class="header-actions"><div class="appearance-controls"><select id="language-select" aria-label="${t("language")}"><option value="es" ${state.language === "es" ? "selected" : ""}>ES</option><option value="en" ${state.language === "en" ? "selected" : ""}>EN</option></select><button class="theme-toggle" data-theme-toggle type="button" title="${t(state.theme === "dark" ? "switchToLight" : "switchToDark")}" aria-label="${t(state.theme === "dark" ? "switchToLight" : "switchToDark")}">${state.theme === "dark" ? "☀" : "☾"}</button></div><button class="icon-button" data-favorites title="${t("favorites")}">♡ <span>${t("favorites")}</span><i class="count">${state.favorites.length}</i></button><button class="icon-button" data-cart title="${t("quote")}">▱ <span>${t("quote")}</span><i class="count">${state.cart.length}</i></button></div>
			</div>
			<nav class="category-bar"><div class="category-nav"><button class="${state.category === "Todos" ? "active" : ""}" data-category="Todos">${t("viewAll")}</button>${categories.map(c => `<button class="${state.category === c.name ? "active" : ""}" data-category="${escapeHtml(c.name)}">${escapeHtml(c.name)}</button>`).join("")}</div></nav>
		</header>
		<main>
			<section class="hero"><div class="hero-card"><div class="hero-copy"><span class="eyebrow">${t("eyebrow")}</span><h1>${t("heroTitle")}</h1><p>${t("heroBody")}</p><button class="primary-button" data-scroll-products>${t("browse")}</button></div></div></section>
			<section class="section" id="categorias"><div class="section-heading"><div><h2>${t("shopCategory")}</h2><p>${t("findQuickly")}</p></div><button class="text-link" data-scroll-products>${t("viewCatalog")}</button></div><div class="category-grid">${categories.map(c => `<button class="category-card" data-category="${escapeHtml(c.name)}"><span class="category-icon">${c.icon}</span><strong>${escapeHtml(c.name)}</strong><small>${products.filter(product => product.category === c.name).length === 1 ? t("countOne") : t("countProducts", { count: products.filter(product => product.category === c.name).length })}</small></button>`).join("")}</div></section>
			<section class="section" id="catalog"><div class="section-heading"><div><h2>${state.category === "Todos" ? t("featured") : escapeHtml(state.category)}</h2><p>${t("addForQuote")}</p></div><span class="sku">${state.loading ? t("loading") : `${filteredProducts().length} ${t("results")}`}</span></div><div class="product-grid">${productCards()}</div></section>
			<section class="info-band"><div class="info-items"><div class="info-item"><b>${t("attention")}</b><span>${t("helpChoose")}</span></div><div class="info-item"><b>${t("businessCatalog")}</b><span>${t("bulkSolutions")}</span></div><div class="info-item"><b>${t("noCommitment")}</b><span>${t("quoteWhatsapp")}</span></div></div></section>
		</main>
		<footer><div class="footer-grid"><div><h3>SAMA</h3><p>${t("footerAbout")}</p></div><div><h3>${t("links")}</h3><p><a href="#catalog">${t("catalog")}</a><br><a href="#categorias">${t("categories")}</a><br><a href="#faq">${t("faq")}</a></p></div><div><h3>${t("contact")}</h3><p>${t("whatsapp")}: ${t("contactPending")}<br>Email: ${t("contactPending")}<br>${t("schedule")}</p></div></div></footer>
		<nav class="mobile-nav"><button data-scroll-products><strong>⌂</strong>${t("store")}</button><button data-favorites><strong>♡</strong>${t("favorites")}</button><button data-cart><strong>▱</strong>${t("quote")} (${state.cart.length})</button><button data-account><strong>♙</strong>${t("account")}</button></nav><a class="whatsapp" href="https://wa.me/" target="_blank" rel="noreferrer" aria-label="${t("contactWhatsApp")}">◉</a><div class="toast" id="toast"></div><div class="modal-backdrop" id="modal"></div>`;
	bindEvents();
}

function filteredProducts() {
	const matches = products.filter(p => (state.category === "Todos" || p.category === state.category) && `${p.name} ${p.sku} ${p.description}`.toLowerCase().includes(state.query.toLowerCase()));
	return state.category === "Todos" && !state.query ? matches.filter(product => product.isFeatured) : matches;
}
function productCards() {
	if (state.loading) return `<div class="empty-state">${t("loading")}</div>`;
	if (state.loadError) return `<div class="empty-state">${escapeHtml(state.loadError)}<br><button class="text-link" data-retry>${t("retry")}</button></div>`;
	const result = filteredProducts();
	if (!result.length) {
		const message = products.length && state.category === "Todos" && !state.query
			? t("noFeatured")
			: t("noProducts");
		return `<div class="empty-state">${message}<br><span class="sku">${t("productsWillAppear")}</span></div>`;
	}
	return result.map(p => `<article class="product-card"><div class="product-image"><img src="${escapeHtml(productImage(p))}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.src='./Logo y Banner/Logo.jpg'"></div><div class="product-body"><span class="product-category">${escapeHtml(p.category)}</span><h3>${escapeHtml(p.name)}</h3><span class="sku">SKU: ${escapeHtml(p.sku)}</span><p class="product-description">${escapeHtml(p.description || t("productDetails"))}</p><button class="primary-button" data-product="${escapeHtml(p.sku)}">${t("addQuote")}</button></div></article>`).join("");
}
function save() {
	localStorage.setItem("sama-cart", JSON.stringify(state.cart));
	localStorage.setItem("sama-favorites", JSON.stringify(state.favorites));
}
function toast(message) {
	const el = document.querySelector("#toast"); el.textContent = message; el.classList.add("show");
	setTimeout(() => el.classList.remove("show"), 2600);
}
function openModal(product) {
	const modal = document.querySelector("#modal");
	modal.innerHTML = `<div class="modal"><button class="modal-close" data-close aria-label="${t("close")}">×</button><div class="modal-content"><div class="modal-image"><img src="${escapeHtml(productImage(product))}" alt="${escapeHtml(product.name)}" onerror="this.src='./Logo y Banner/Logo.jpg'"></div><div><span class="product-category">${escapeHtml(product.category)}${product.subcategory ? ` · ${escapeHtml(product.subcategory)}` : ""}</span><h2>${escapeHtml(product.name)}</h2><span class="sku">SKU: ${escapeHtml(product.sku)}</span><p class="product-description">${escapeHtml(product.description || t("noDescription"))}</p><div class="quantity"><span>${t("quantity")}</span><button data-quantity="-1" aria-label="${t("decreaseQuantity")}">−</button><strong id="quantity">1</strong><button data-quantity="1" aria-label="${t("increaseQuantity")}">+</button></div><button class="primary-button" data-modal-cart="${escapeHtml(product.sku)}">${t("addQuote")}</button><button class="secondary-button" data-modal-favorite="${escapeHtml(product.sku)}">${state.favorites.includes(product.sku) ? t("inFavorites") : t("addFavorites")}</button><button class="secondary-button" data-share>${t("shareProduct")}</button></div></div></div>`;
	modal.classList.add("open");
	let quantity = 1;
	modal.querySelectorAll("[data-quantity]").forEach(btn => btn.addEventListener("click", () => { quantity = Math.max(1, quantity + Number(btn.dataset.quantity)); modal.querySelector("#quantity").textContent = quantity; }));
	modal.querySelector("[data-modal-cart]").addEventListener("click", () => addToCart(product, quantity));
	modal.querySelector("[data-modal-favorite]").addEventListener("click", () => toggleFavorite(product.sku));
	modal.querySelector("[data-share]").addEventListener("click", () => shareProduct(product));
	modal.querySelector("[data-close]").addEventListener("click", () => modal.classList.remove("open"));
	modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("open"); }, { once: true });
}
async function shareProduct(product) {
	const url = new URL(window.location.href);
	url.searchParams.set("producto", product.sku);
	const shareData = { title: product.name, text: t("shareTitle", { name: product.name }), url: url.toString() };
	try {
		if (navigator.share) {
			await navigator.share(shareData);
		} else if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(shareData.url);
			toast(t("linkCopied"));
		} else {
			toast(t("shareUnavailable"));
		}
	} catch (error) {
		if (error.name !== "AbortError") toast(t("shareError"));
	}
}
function addToCart(product, quantity = 1) {
	const item = state.cart.find(i => i.sku === product.sku);
	if (item) item.quantity += quantity; else state.cart.push({ sku: product.sku, name: product.name, quantity });
	save(); render(); toast(t("addedQuote", { name: product.name }));
}
function toggleFavorite(sku) {
	state.favorites = state.favorites.includes(sku) ? state.favorites.filter(id => id !== sku) : [...state.favorites, sku];
	save(); render(); toast(state.favorites.includes(sku) ? t("addedFavorite") : t("removedFavorite"));
}
function showFavorites() {
	const favoriteProducts = products.filter(product => state.favorites.includes(product.sku));
	const details = favoriteProducts.length
		? favoriteProducts.map(product => `<p><b>${escapeHtml(product.name)}</b><br><span class="sku">SKU: ${escapeHtml(product.sku)}</span><br><button class="text-link" data-favorite-open="${escapeHtml(product.sku)}">${t("viewProduct")}</button></p>`).join("")
		: `<p>${t("emptyFavorites")}</p>`;
	const modal = document.querySelector("#modal");
	modal.innerHTML = `<div class="modal"><button class="modal-close" data-close aria-label="${t("close")}">×</button><div class="modal-content"><div><span class="eyebrow">${t("selection")}</span><h2>${t("favorites")}</h2>${details}</div><div class="modal-image"><img src="${escapeHtml(imagePath)}" alt="SAMA"></div></div></div>`;
	modal.classList.add("open");
	modal.querySelector("[data-close]").addEventListener("click", () => modal.classList.remove("open"));
	modal.querySelectorAll("[data-favorite-open]").forEach(button => button.addEventListener("click", () => openModal(products.find(product => product.sku === button.dataset.favoriteOpen))));
}
function showCart() {
	const details = state.cart.length ? state.cart.map(i => `<p><b>${escapeHtml(i.quantity)} ×</b> ${escapeHtml(i.name)}<br><span class="sku">SKU: ${escapeHtml(i.sku)}</span></p>`).join("") : `<p>${t("emptyQuote")}</p>`;
	const modal = document.querySelector("#modal"); modal.innerHTML = `<div class="modal"><button class="modal-close" data-close aria-label="${t("close")}">×</button><div class="modal-content"><div><span class="eyebrow">${t("yourRequest")}</span><h2>${t("quoteList")}</h2>${details}<button class="primary-button" data-whatsapp ${state.cart.length ? "" : "disabled"}>${t("requestWhatsapp")}</button></div><div class="modal-image"><img src="${escapeHtml(imagePath)}" alt="SAMA"></div></div></div>`; modal.classList.add("open");
	modal.querySelector("[data-close]").addEventListener("click", () => modal.classList.remove("open"));
	const whatsapp = modal.querySelector("[data-whatsapp]"); if (whatsapp) whatsapp.addEventListener("click", () => { window.open(`https://wa.me/?text=${encodeURIComponent(t("quoteMessage") + state.cart.map(i => `${i.quantity}x ${i.name}`).join(", "))}`, "_blank"); });
}
function bindEvents() {
	document.querySelector("#language-select").addEventListener("change", event => { state.language = event.target.value; render(); });
	document.querySelector("[data-theme-toggle]").addEventListener("click", () => { manualTheme = true; applyTheme(state.theme === "dark" ? "light" : "dark"); render(); });
	document.querySelector("#search-form").addEventListener("submit", e => { e.preventDefault(); state.query = document.querySelector("#search-input").value.trim(); render(); document.querySelector("#catalog").scrollIntoView({ behavior: "smooth" }); });
	document.querySelector("#category-filter").value = state.category;
	document.querySelector("#category-filter").addEventListener("change", e => { state.category = e.target.value; render(); });
	document.querySelectorAll("[data-category]").forEach(el => el.addEventListener("click", () => { state.category = el.dataset.category; render(); document.querySelector("#catalog").scrollIntoView({ behavior: "smooth" }); }));
	document.querySelectorAll("[data-scroll-products]").forEach(el => el.addEventListener("click", () => document.querySelector("#catalog").scrollIntoView({ behavior: "smooth" })));
	document.querySelectorAll("[data-product]").forEach(el => el.addEventListener("click", () => openModal(products.find(p => p.sku === el.dataset.product))));
	document.querySelectorAll("[data-cart]").forEach(el => el.addEventListener("click", showCart));
	document.querySelectorAll("[data-favorites]").forEach(el => el.addEventListener("click", showFavorites));
	document.querySelectorAll("[data-reset]").forEach(el => el.addEventListener("click", () => { state.query = ""; state.category = "Todos"; render(); }));
	document.querySelectorAll("[data-retry]").forEach(el => el.addEventListener("click", loadProducts));
	document.querySelector("[data-home]").addEventListener("click", e => { e.preventDefault(); state.query = ""; state.category = "Todos"; render(); window.scrollTo({ top: 0, behavior: "smooth" }); });
	document.querySelector("[data-account]").addEventListener("click", () => toast(t("noAccount")));
}

render();
loadProducts();
