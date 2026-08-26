"use strict";

const A6_W_MM = 105.0;
const A6_H_MM = 148.0;
const TOP_OFFSET_MM = 43.0;
const BOTTOM_SAFE_MM = 20.0;
const TITLE_SIDE_PADDING_MM = 2.0;
const TITLE_LINE_HEIGHT = 1.12;
const PT_TO_MM = 0.3528;
const TITLE_MARGIN_BOTTOM_MM = 4.0;
const TITLE_CHAR_WIDTH_FACTOR = 0.52;
const TITLE_MIN_CHARS_PER_LINE = 12;

const LOGO_SIDE_OFFSET_MM = 6.54;
const LOGO_TOP_OFFSET_MM = 8.0;
const LOGO_MAX_WIDTH_MM = 38.0;
const LOGO_MAX_HEIGHT_MM = 26.0;

const TITLE_BASE_PT = 22.0;
const VNAME_BASE_PT = pxToPt(18);
const PRICE_MAIN_PT = pxToPt(38);
const PRICE_SEC_PT = pxToPt(38);
const PRICE_HIGH_THRESHOLD = 100.0;
const PRICE_HIGH_VARIANT_LIMIT = 4;
const PRICE_HIGH_FONT_SCALE = 0.95;

const VARIANT_BASE_BLOCK_MM = 15.0;
const VARIANT_BASE_BLOCK_MM_7 = 14.2;
const VARIANT_GAP_MM = 4.0;
const MIN_VARIANT_SCALE = 0.40;

const SIZE_TOKENS = new Set([
  "singolo", "singola", "matrimoniale", "francese", "lettino", "culla", "piazza",
  "queen", "king", "junior", "newborn", "adulto", "adult", "double", "twin",
  "full", "medium", "small", "large", "piccolo", "piccola", "medio", "media",
  "grande", "grandi", "maxi", "mini", "unica", "unique", "size",
  "standard", "xs", "s", "m", "l", "xl", "xxl", "xxxl", "xxxxl", "xxs",
  "s-m", "m-l", "l-xl", "s/m", "m/l", "l/xl", "taglia", "posto", "posti",
]);

const SIZE_PHRASES = [
  "piazza e mezza", "piazza e mezzo", "piazza mezzo", "piazza 1/2", "piazza 1 / 2",
  "mezza piazza", "una piazza", "due piazze", "piazza e un quarto", "piazza e tre quarti",
  "super king", "king size", "queen size",
];

const SIZE_REGEXES = [
  /\d+\s*(?:x|X|×)\s*\d+/,
  /\d+\s*(?:x|X|×)\s*\d+\s*(?:x|X|×)\s*\d+/,
  /\d+\s*(cm|mm|mt|m|ml|cl|l|lt|kg|g|gr|hg|pz|posti|posto|anni|anno|mesi|mese|set)\b/i,
  /\d+\s*[-–]\s*\d+\s*(mesi|mese|anni|anno)\b/i,
  /^\d{1,3}(?:[.,]\d+)?\s*(?:\/|-|–)\s*\d{1,3}(?:[.,]\d+)?$/,
  /^\d{1,3}(?:[.,]\d+)?$/,
];

const PREFERRED_VARIANT_ORDER = [
  ["LETTIN", 0],
  ["SINGOL", 1],
  ["PIAZZA 1/2", 2],
  ["PIAZZA E MEZ", 2],
  ["FRANCESE", 3],
  ["PICCOL", 3],
  ["MEDIO", 4],
  ["MATRIMONIALE EXTRA LUNGO", 5],
  ["MATRIMONIALE XL", 5],
  ["MATRIMONIALE", 4],
  ["GRANDE", 5],
];

const TABLECLOTH_LATE_TOKENS = ["QUADRAT", "ROTOND"];
const BED_VARIANT_TOKENS = ["SINGOL", "PIAZZA", "PIUM", "MATRIMONIALE", "FRANCESE", "KING", "QUEEN", "LETTO"];

const SIZE_NUMBER_RE = /\d+(?:[.,]\d+)?/g;
const DIM_PAIR_RE = /(\d+(?:[.,]\d+)?)\s*(?:x|X|×)\s*(\d+(?:[.,]\d+)?)/;
const NUMERIC_RANGE_RE = /^\s*(\d{1,3}(?:[.,]\d+)?)\s*(?:\/|-|–)\s*(\d{1,3}(?:[.,]\d+)?)\s*$/;
const FRACTION_RE = /\b\d+\s*\/\s*\d+\b/g;
const AGE_RANGE_RE = /(^|[^\d])(\d+(?:[.,]\d+)?)\s*(?:\/|-|–)\s*(\d+(?:[.,]\d+)?)\s*(mesi|mese|anni|anno)\b/i;

const MANUAL_COLUMNS = [
  "Title",
  "Option1 Value",
  "Variant Price",
  "Variant Compare At Price",
];

const BUILT_IN_IMAGES = [
  {
    id: "logo-store",
    kind: "logo",
    label: "Logo Lisolastore",
    src: "assets/images/logo_lisolastore.png",
    width: 752,
    height: 347,
  },
  {
    id: "badge-iconico",
    kind: "badge",
    label: "Bollino Iconico",
    src: "assets/images/iconiciblugiallofluo_conscritta.png",
    width: 2295,
    height: 2295,
  },
  {
    id: "badge-volta",
    kind: "badge",
    label: "Bollino Volta",
    src: "assets/images/Cartellini prezzi negozi volta.png",
    width: 174,
    height: 174,
  },
  {
    id: "badge-piave",
    kind: "badge",
    label: "Bollino Piave",
    src: "assets/images/Cartellini prezzi negozi piave.png",
    width: 174,
    height: 174,
  },
  {
    id: "badge-belfiore",
    kind: "badge",
    label: "Bollino Belfiore",
    src: "assets/images/Cartellini prezzi negozi belfiore.png",
    width: 174,
    height: 174,
  },
  {
    id: "badge-sale-volta",
    kind: "badge",
    label: "Bollino saldi Volta",
    src: "assets/images/saldi/DEF Cartellini prezzi negozi saldi volta.png",
    width: 218,
    height: 218,
  },
  {
    id: "badge-sale-piave",
    kind: "badge",
    label: "Bollino saldi Piave",
    src: "assets/images/saldi/DEF Cartellini prezzi negozi saldi piave.png",
    width: 218,
    height: 218,
  },
  {
    id: "badge-sale-belfiore",
    kind: "badge",
    label: "Bollino saldi Belfiore",
    src: "assets/images/saldi/DEF Cartellini prezzi negozi saldi belfiore.png",
    width: 218,
    height: 218,
  },
];

const STORE_BADGES = {
  none: {
    label: "Nessuno",
    normal: null,
    sale: null,
  },
  volta: {
    label: "Volta",
    normal: "badge-volta",
    sale: "badge-sale-volta",
  },
  piave: {
    label: "Piave",
    normal: "badge-piave",
    sale: "badge-sale-piave",
  },
  belfiore: {
    label: "Belfiore",
    normal: "badge-belfiore",
    sale: "badge-sale-belfiore",
  },
  iconico: {
    label: "Iconico",
    normal: "badge-iconico",
    sale: "badge-sale-volta",
  },
};

const STORE_INVENTORY_FILTERS = {
  belfiore: {
    label: "Belfiore",
    hints: ["belfiore"],
  },
  volta: {
    label: "Volta",
    hints: ["via volta", "brera", "volta"],
  },
  piave: {
    label: "Piave",
    hints: ["viale piave", "porta venezia", "piave"],
  },
};

const state = {
  sourceMode: "excel",
  rows: [],
  columns: [],
  sheetName: "",
  products: [],
  stockFilter: null,
  previewIndex: 0,
  manualHasErrors: false,
  fileName: "",
  leftLogo: null,
  rightLogo: null,
  leftLogoWidthMm: LOGO_MAX_WIDTH_MM,
  rightLogoWidthMm: LOGO_MAX_WIDTH_MM,
  leftCustomLogo: null,
  rightCustomLogo: null,
  leftLogoName: "",
  rightLogoName: "",
  generatedHtml: "",
  manualProductSeq: 0,
  manualVariantSeq: 0,
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  populateImagePresets();
  addManualProductCard();
  bindEvents();
  restorePreferences();
  updateUi();
  updatePreview();
});

function bindElements() {
  for (const id of [
    "sourceExcelBtn", "sourceManualBtn", "excelSection", "manualSection",
    "manualProducts", "addManualProduct", "excelInput", "dropzone",
    "fileMeta", "stockFilterPanel", "stockFilterSummary", "stockFilterColumn",
    "stockExcludedDetails", "stockExcludedList", "downloadExcludedBtn",
    "templateBtn", "storePicker", "storeSelect", "saleMode", "storeBadgeName",
    "orderSelect", "discountPercent",
    "logoOnly", "leftLogoPreset", "rightLogoPreset", "leftLogoInput", "leftLogoBtn",
    "clearLeftLogo", "leftLogoName", "rightLogoInput", "rightLogoBtn",
    "clearRightLogo", "rightLogoName", "resetBtn", "generateBtn",
    "printBtn", "downloadBtn", "productsCount", "variantsCount", "sheetName",
    "previewSearch", "previewSearchBtn", "previewPrev", "previewNext", "previewCounter",
    "previewFrame", "emptyPreview", "statusLine", "headerStatus",
  ]) {
    els[id] = document.getElementById(id);
  }
}

function populateImagePresets() {
  fillPresetSelect(els.leftLogoPreset, "logo");
  fillPresetSelect(els.rightLogoPreset, "badge");
}

function fillPresetSelect(select, kind) {
  const options = kind === "badge" ? [
    ["__auto__", "Auto da negozio"],
    ["__none__", "Nessun bollino"],
    ...BUILT_IN_IMAGES
      .filter((asset) => asset.kind === kind)
      .map((asset) => [asset.id, asset.label]),
    ["__custom__", "Personalizzata caricata"],
  ] : [
    ["__none__", "Nessuna immagine"],
    ...BUILT_IN_IMAGES
      .filter((asset) => asset.kind === kind)
      .map((asset) => [asset.id, asset.label]),
    ["__custom__", "Personalizzata caricata"],
  ];
  select.replaceChildren(...options.map(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  }));
}

function bindEvents() {
  els.sourceExcelBtn.addEventListener("click", () => setSourceMode("excel"));
  els.sourceManualBtn.addEventListener("click", () => setSourceMode("manual"));
  els.addManualProduct.addEventListener("click", () => {
    const card = addManualProductCard();
    const input = card.querySelector(".manual-title");
    if (input) input.focus();
    rebuildManualProducts();
  });
  els.manualProducts.addEventListener("input", () => rebuildManualProducts());
  els.manualProducts.addEventListener("click", (event) => {
    const addVariantButton = event.target.closest(".manual-add-variant");
    if (addVariantButton) {
      const card = addVariantButton.closest(".manual-product-card");
      const row = addManualVariantRow(card.querySelector(".manual-variants"));
      const input = row.querySelector(".manual-variant-name");
      if (input) input.focus();
      rebuildManualProducts();
      return;
    }

    const removeVariantButton = event.target.closest(".manual-remove-variant");
    if (removeVariantButton) {
      const row = removeVariantButton.closest(".manual-variant-row");
      const variants = removeVariantButton.closest(".manual-variants");
      if (row && variants && variants.children.length > 1) {
        row.remove();
        updateManualButtons();
        rebuildManualProducts();
      }
      return;
    }

    const duplicateButton = event.target.closest(".manual-duplicate-product");
    if (duplicateButton) {
      const card = duplicateButton.closest(".manual-product-card");
      const clone = addManualProductCard(readManualProductCard(card));
      const input = clone.querySelector(".manual-title");
      if (input) input.focus();
      rebuildManualProducts();
      return;
    }

    const removeProductButton = event.target.closest(".manual-remove-product");
    if (removeProductButton) {
      const card = removeProductButton.closest(".manual-product-card");
      if (card && els.manualProducts.children.length > 1) {
        card.remove();
        updateManualButtons();
        rebuildManualProducts();
      }
      return;
    }
  });

  els.excelInput.addEventListener("change", () => {
    const file = els.excelInput.files && els.excelInput.files[0];
    if (file) loadExcelFile(file);
  });

  els.dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    els.dropzone.classList.add("is-dragover");
  });
  els.dropzone.addEventListener("dragleave", () => {
    els.dropzone.classList.remove("is-dragover");
  });
  els.dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    els.dropzone.classList.remove("is-dragover");
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (file) loadExcelFile(file);
  });

  els.templateBtn.addEventListener("click", downloadTemplate);
  els.storePicker.addEventListener("click", (event) => {
    const button = event.target.closest(".store-button");
    if (!button) return;
    setStoreCode(button.dataset.store);
  });
  els.storeSelect.addEventListener("change", () => {
    setStoreCode(els.storeSelect.value);
  });
  els.saleMode.addEventListener("change", () => {
    if (els.saleMode.checked) {
      els.discountPercent.checked = true;
      rebuildCurrentProducts({ quiet: true });
    }
    updateSaleVisualState();
    els.rightLogoPreset.value = "__auto__";
    applyStoreBadge();
    savePreferences();
    markGeneratedDirty();
    updatePreview();
  });
  els.orderSelect.addEventListener("change", () => {
    savePreferences();
    rebuildCurrentProducts();
  });
  els.discountPercent.addEventListener("change", () => {
    savePreferences();
    rebuildCurrentProducts();
  });
  els.logoOnly.addEventListener("change", () => {
    savePreferences();
    markGeneratedDirty();
    updatePreview();
    if (els.logoOnly.checked && !state.products.length) {
      setStatus("Modalita solo loghi attiva: puoi generare senza caricare dati.");
    }
  });
  els.leftLogoPreset.addEventListener("change", () => applyImagePreset("left", els.leftLogoPreset.value));
  els.rightLogoPreset.addEventListener("change", () => applyImagePreset("right", els.rightLogoPreset.value));

  els.leftLogoBtn.addEventListener("click", () => els.leftLogoInput.click());
  els.rightLogoBtn.addEventListener("click", () => els.rightLogoInput.click());
  els.leftLogoInput.addEventListener("change", () => loadLogo("left", els.leftLogoInput.files[0]));
  els.rightLogoInput.addEventListener("change", () => loadLogo("right", els.rightLogoInput.files[0]));
  els.clearLeftLogo.addEventListener("click", () => clearLogo("left"));
  els.clearRightLogo.addEventListener("click", () => clearLogo("right"));

  els.resetBtn.addEventListener("click", resetWork);
  els.generateBtn.addEventListener("click", generateHtml);
  els.printBtn.addEventListener("click", openPrintWindow);
  els.downloadBtn.addEventListener("click", downloadGeneratedHtml);
  els.downloadExcludedBtn.addEventListener("click", downloadExcludedProducts);
  els.previewSearchBtn.addEventListener("click", searchPreviewProduct);
  els.previewSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchPreviewProduct();
    }
  });
  els.previewPrev.addEventListener("click", () => movePreview(-1));
  els.previewNext.addEventListener("click", () => movePreview(1));
}

function restorePreferences() {
  try {
    const prefs = JSON.parse(localStorage.getItem("cartellini_webapp_prefs") || "{}");
    if (prefs.order === "asc" || prefs.order === "desc") els.orderSelect.value = prefs.order;
    if (isKnownStore(prefs.storeCode)) els.storeSelect.value = prefs.storeCode;
    if (typeof prefs.saleMode === "boolean") els.saleMode.checked = prefs.saleMode;
    updateSaleVisualState();
    if (typeof prefs.discountPercent === "boolean") els.discountPercent.checked = prefs.discountPercent;
    if (typeof prefs.logoOnly === "boolean") els.logoOnly.checked = prefs.logoOnly;
    const leftPreset = normalizeStoredPreset(prefs.leftLogoPreset, "logo", "logo-store");
    const rightPreset = normalizeStoredPreset(prefs.rightLogoPreset, "badge", "__auto__");
    updateStoreButtons();
    applyImagePreset("left", leftPreset, { quiet: true });
    applyImagePreset("right", rightPreset, { quiet: true });
    applyStoreLogo();
    setSourceMode(prefs.sourceMode === "manual" ? "manual" : "excel", { quiet: true });
  } catch {
    updateStoreButtons();
    updateSaleVisualState();
    applyImagePreset("left", "logo-store", { quiet: true });
    applyImagePreset("right", "__auto__", { quiet: true });
    setSourceMode("excel", { quiet: true });
  }
}

function savePreferences() {
  const prefs = {
    sourceMode: state.sourceMode,
    storeCode: els.storeSelect.value,
    saleMode: els.saleMode.checked,
    order: els.orderSelect.value,
    discountPercent: els.discountPercent.checked,
    logoOnly: els.logoOnly.checked,
    leftLogoPreset: els.leftLogoPreset.value,
    rightLogoPreset: els.rightLogoPreset.value,
  };
  try {
    localStorage.setItem("cartellini_webapp_prefs", JSON.stringify(prefs));
  } catch {
    // Preferences are optional.
  }
}

function normalizeStoredPreset(value, kind, fallback) {
  if (kind === "badge" && value === "__auto__") return value;
  if (value === "__none__") return value;
  if (value === "__custom__") return fallback;
  if (BUILT_IN_IMAGES.some((asset) => asset.kind === kind && asset.id === value)) return value;
  return fallback;
}

function isKnownStore(value) {
  return Object.prototype.hasOwnProperty.call(STORE_BADGES, value);
}

function setStoreCode(code) {
  const storeCode = isKnownStore(code) ? code : "volta";
  els.storeSelect.value = storeCode;
  updateStoreButtons();
  applyStoreLogo();
  els.rightLogoPreset.value = "__auto__";
  applyStoreBadge();
  savePreferences();
  if (state.sourceMode === "excel") {
    rebuildProducts();
  } else {
    markGeneratedDirty();
    updatePreview();
  }
}

function updateStoreButtons() {
  const buttons = els.storePicker.querySelectorAll(".store-button");
  buttons.forEach((button) => {
    const active = button.dataset.store === els.storeSelect.value;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function updateSaleVisualState() {
  document.body.classList.toggle("sale-active", Boolean(els.saleMode.checked));
}

function builtInImageById(id) {
  return BUILT_IN_IMAGES.find((item) => item.id === id) || null;
}

function applyStoreLogo() {
  if (els.storeSelect.value === "none") return;
  const asset = builtInImageById("logo-store");
  if (!asset) return;
  els.leftLogoPreset.value = "logo-store";
  setCurrentImage(
    "left",
    assetUrl(asset.src),
    logoWidthFromDimensions(asset.width, asset.height),
    asset.label,
  );
}

function applyStoreBadge() {
  const store = STORE_BADGES[els.storeSelect.value] || STORE_BADGES.volta;
  const badgeId = els.saleMode.checked ? store.sale : store.normal;
  if (!badgeId) {
    setCurrentImage("right", null, LOGO_MAX_WIDTH_MM, "Nessun bollino");
    els.storeBadgeName.textContent = "Bollino: nessuno";
    return;
  }
  const asset = builtInImageById(badgeId);
  if (!asset) {
    setCurrentImage("right", null, LOGO_MAX_WIDTH_MM, "Bollino non trovato");
    els.storeBadgeName.textContent = "Bollino non trovato";
    return;
  }
  const suffix = els.saleMode.checked ? " saldi" : "";
  setCurrentImage(
    "right",
    assetUrl(asset.src),
    logoWidthFromDimensions(asset.width, asset.height),
    asset.label,
  );
  els.storeBadgeName.textContent = `Bollino: ${store.label}${suffix}`;
}

function setSourceMode(mode, options = {}) {
  state.sourceMode = mode === "manual" ? "manual" : "excel";
  updateSourceModeUi();
  if (!options.skipRebuild) {
    rebuildCurrentProducts({ quiet: true });
  }
  savePreferences();
  if (!options.quiet) {
    setStatus(state.sourceMode === "manual"
      ? "Modalita manuale attiva: inserisci titolo e prezzi."
      : "Modalita Excel attiva: carica un file o usa quello gia selezionato.");
  }
}

function updateSourceModeUi() {
  const manual = state.sourceMode === "manual";
  els.sourceExcelBtn.classList.toggle("is-active", !manual);
  els.sourceManualBtn.classList.toggle("is-active", manual);
  els.sourceExcelBtn.setAttribute("aria-pressed", String(!manual));
  els.sourceManualBtn.setAttribute("aria-pressed", String(manual));
  els.excelSection.classList.toggle("is-hidden", manual);
  els.manualSection.classList.toggle("is-hidden", !manual);
  if (manual) {
    els.headerStatus.textContent = "Cartellino manuale";
  } else {
    els.headerStatus.textContent = state.fileName || "Nessun file caricato";
  }
}

function rebuildCurrentProducts(options = {}) {
  if (state.sourceMode === "manual") {
    rebuildManualProducts(options);
  } else {
    rebuildProducts(options);
  }
}

function addManualProductCard(values = {}) {
  state.manualProductSeq += 1;
  const card = document.createElement("div");
  card.className = "manual-product-card";
  card.dataset.productId = String(state.manualProductSeq);
  card.innerHTML = `
    <div class="manual-product-head">
      <div class="manual-product-title">Cartellino</div>
      <div class="manual-product-actions">
        <button class="icon-button manual-duplicate-product" type="button" aria-label="Duplica cartellino">
          <svg class="icon"><use href="#icon-file"></use></svg>
        </button>
        <button class="icon-button manual-remove-product" type="button" aria-label="Elimina cartellino">
          <svg class="icon"><use href="#icon-trash"></use></svg>
        </button>
      </div>
    </div>
    <label class="field">
      <span>Titolo prodotto</span>
      <input class="manual-title" type="text" autocomplete="off" placeholder="Copripiumino Lino" value="${escapeAttribute(values.title || "")}">
    </label>
    <div class="manual-error manual-title-error" aria-live="polite"></div>
    <div class="manual-variants" aria-label="Varianti"></div>
    <button class="button secondary full manual-add-variant" type="button">
      <svg class="icon"><use href="#icon-plus"></use></svg>
      <span>Aggiungi variante</span>
    </button>
  `;
  els.manualProducts.appendChild(card);
  const variants = card.querySelector(".manual-variants");
  const variantValues = values.variants && values.variants.length ? values.variants : [{}];
  variantValues.forEach((variant) => addManualVariantRow(variants, variant));
  updateManualButtons();
  return card;
}

function addManualVariantRow(container, values = {}) {
  state.manualVariantSeq += 1;
  const row = document.createElement("div");
  row.className = "manual-variant-row";
  row.dataset.rowId = String(state.manualVariantSeq);
  row.innerHTML = `
    <label class="manual-field">
      <span>Variante</span>
      <input class="manual-variant-name" type="text" autocomplete="off" placeholder="MATRIMONIALE 260x240" value="${escapeAttribute(values.name || "")}">
    </label>
    <label class="manual-field">
      <span>Prezzo</span>
      <input class="manual-price" type="text" inputmode="decimal" autocomplete="off" placeholder="129,90" value="${escapeAttribute(values.price || "")}">
    </label>
    <label class="manual-field">
      <span>Barrato</span>
      <input class="manual-compare" type="text" inputmode="decimal" autocomplete="off" placeholder="169,90" value="${escapeAttribute(values.compare || "")}">
    </label>
    <button class="icon-button manual-remove-variant" type="button" aria-label="Rimuovi variante">
      <svg class="icon"><use href="#icon-trash"></use></svg>
    </button>
    <div class="manual-variant-error" aria-live="polite"></div>
  `;
  container.appendChild(row);
  updateManualButtons();
  return row;
}

function updateManualButtons() {
  const cards = els.manualProducts.querySelectorAll(".manual-product-card");
  cards.forEach((card, index) => {
    const title = card.querySelector(".manual-product-title");
    if (title) title.textContent = `Cartellino ${index + 1}`;
    const removeProduct = card.querySelector(".manual-remove-product");
    if (removeProduct) removeProduct.disabled = cards.length <= 1;
    const variantRows = card.querySelectorAll(".manual-variant-row");
    variantRows.forEach((row) => {
      const button = row.querySelector(".manual-remove-variant");
      if (button) button.disabled = variantRows.length <= 1;
    });
  });
}

function readManualProductCard(card) {
  return {
    title: card.querySelector(".manual-title")?.value || "",
    variants: Array.from(card.querySelectorAll(".manual-variant-row")).map((row) => ({
      name: row.querySelector(".manual-variant-name")?.value || "",
      price: row.querySelector(".manual-price")?.value || "",
      compare: row.querySelector(".manual-compare")?.value || "",
    })),
  };
}

function collectManualRows() {
  return Array.from(els.manualProducts.querySelectorAll(".manual-product-card")).flatMap((card) => {
    const title = cleanTitle(card.querySelector(".manual-title")?.value || "");
    if (!title) return [];
    return Array.from(card.querySelectorAll(".manual-variant-row"))
      .map((row) => ({
        "Title": title,
        "Option1 Value": row.querySelector(".manual-variant-name")?.value || "",
        "Variant Price": row.querySelector(".manual-price")?.value || "",
        "Variant Compare At Price": row.querySelector(".manual-compare")?.value || "",
      }))
      .filter((row) => !isMissingValue(row["Variant Price"]));
  });
}

function validateManualProducts({ showErrors = true } = {}) {
  const rows = [];
  let errorCount = 0;
  let hasTitle = false;

  els.manualProducts.querySelectorAll(".manual-product-card").forEach((card) => {
    const titleInput = card.querySelector(".manual-title");
    const titleError = card.querySelector(".manual-title-error");
    const title = cleanTitle(titleInput?.value || "");
    const variantRows = Array.from(card.querySelectorAll(".manual-variant-row"));
    const cardHasAnyValue = Boolean(title) || variantRows.some((row) => manualRowHasAnyValue(row));
    let cardHasErrors = false;

    clearManualFieldError(titleInput, titleError);
    variantRows.forEach(clearManualVariantError);

    if (title) hasTitle = true;
    if (!title && cardHasAnyValue) {
      errorCount += 1;
      cardHasErrors = true;
      setManualFieldError(titleInput, titleError, "Titolo obbligatorio.", showErrors);
    }

    if (!cardHasAnyValue) {
      card.classList.toggle("has-errors", false);
      return;
    }

    variantRows.forEach((row) => {
      const nameInput = row.querySelector(".manual-variant-name");
      const priceInput = row.querySelector(".manual-price");
      const compareInput = row.querySelector(".manual-compare");
      const rowError = row.querySelector(".manual-variant-error");
      const name = cleanOption(nameInput?.value || "");
      const priceText = priceInput?.value || "";
      const compareText = compareInput?.value || "";
      const rowHasAnyValue = Boolean(name || cleanOption(priceText) || cleanOption(compareText));

      if (!rowHasAnyValue && !title) return;

      const messages = [];
      const price = toFloat(priceText);
      if (price === null || price <= 0) {
        messages.push("Prezzo obbligatorio.");
        markManualInputInvalid(priceInput, showErrors);
      }

      let compare = null;
      if (!isMissingValue(compareText)) {
        compare = toFloat(compareText);
        if (compare === null || compare <= 0) {
          messages.push("Barrato non valido.");
          markManualInputInvalid(compareInput, showErrors);
        } else if (price !== null && price > 0 && compare <= price) {
          messages.push("Barrato deve essere maggiore del prezzo.");
          markManualInputInvalid(compareInput, showErrors);
        }
      }

      if (messages.length) {
        errorCount += messages.length;
        cardHasErrors = true;
        setManualVariantError(row, rowError, messages.join(" "), showErrors);
        return;
      }

      if (title && price !== null && price > 0) {
        rows.push({
          "Title": title,
          "Option1 Value": name,
          "Variant Price": price,
          "Variant Compare At Price": compare ?? "",
        });
      }
    });

    card.classList.toggle("has-errors", showErrors && cardHasErrors);
  });

  return { rows, errorCount, hasTitle };
}

function manualRowHasAnyValue(row) {
  return [
    row.querySelector(".manual-variant-name")?.value,
    row.querySelector(".manual-price")?.value,
    row.querySelector(".manual-compare")?.value,
  ].some((value) => Boolean(cleanOption(value || "")));
}

function clearManualVariantError(row) {
  row.classList.remove("has-errors");
  row.querySelectorAll("input").forEach((input) => input.classList.remove("is-invalid"));
  const error = row.querySelector(".manual-variant-error");
  if (error) {
    error.textContent = "";
    error.classList.remove("is-visible");
  }
}

function clearManualFieldError(input, error) {
  if (input) input.classList.remove("is-invalid");
  if (error) {
    error.textContent = "";
    error.classList.remove("is-visible");
  }
}

function setManualFieldError(input, error, message, show) {
  if (!show) return;
  markManualInputInvalid(input, true);
  if (error) {
    error.textContent = message;
    error.classList.add("is-visible");
  }
}

function markManualInputInvalid(input, show) {
  if (show && input) input.classList.add("is-invalid");
}

function setManualVariantError(row, error, message, show) {
  if (!show) return;
  row.classList.add("has-errors");
  if (error) {
    error.textContent = message;
    error.classList.add("is-visible");
  }
}

function rebuildManualProducts(options = {}) {
  if (state.sourceMode !== "manual") return;
  const hadGenerated = Boolean(state.generatedHtml);
  const validation = validateManualProducts({ showErrors: !options.quiet });
  const rows = validation.rows;
  state.manualHasErrors = validation.errorCount > 0;
  state.sheetName = "Manuale";
  state.fileName = "cartellino_manuale";
  state.products = rows.length
    ? prepareProducts(rows, {
      descending: els.orderSelect.value === "desc",
      showDiscountPercent: els.discountPercent.checked,
    }, MANUAL_COLUMNS)
    : [];
  state.generatedHtml = "";
  updateUi();
  updatePreview();
  if (hadGenerated) {
    setStatus("Modifiche non generate: premi Genera HTML prima di stampare o scaricare.");
  } else if (!options.quiet) {
    if (validation.errorCount) {
      setStatus("Correggi i campi evidenziati in rosso.", true);
    } else if (!validation.hasTitle) {
      setStatus("Inserisci almeno un titolo per i cartellini manuali.", true);
    } else if (!state.products.length) {
      setStatus("Inserisci almeno un prezzo valido.", true);
    } else {
      const variants = state.products.reduce((sum, product) => sum + product.variants.length, 0);
      setStatus(`Cartellini manuali pronti: ${state.products.length} prodotti, ${variants} varianti.`);
    }
  }
}

function resetWork() {
  state.rows = [];
  state.columns = [];
  state.sheetName = "";
  state.fileName = "";
  state.products = [];
  state.stockFilter = null;
  state.generatedHtml = "";
  els.excelInput.value = "";
  els.fileMeta.textContent = "Colonne richieste: Title, Variant Price";
  els.manualProducts.replaceChildren();
  addManualProductCard();
  updateSourceModeUi();
  updateUi();
  updatePreview();
  setStatus("Nuovo lavoro pronto. Carica un Excel o compila un cartellino manuale.");
}

async function loadExcelFile(file) {
  try {
    requireSheetJs();
    setStatus("Lettura Excel in corso...");
    els.headerStatus.textContent = file.name;
    const workbookData = await readWorkbook(file);
    state.rows = workbookData.rows;
    state.columns = workbookData.columns;
    state.sheetName = workbookData.sheetName;
    state.fileName = file.name;
    state.previewIndex = 0;
    setSourceMode("excel", { quiet: true, skipRebuild: true });
    rebuildProducts({ quiet: true });
    const excelReport = inspectExcelRows(state.rows, state.columns);
    const missing = inspectColumns(state.columns);
    if (missing.length) {
      setStatus(`Colonne mancanti: ${missing.join(", ")}.`, true);
    } else {
      const variants = state.products.reduce((sum, product) => sum + product.variants.length, 0);
      const ignoredText = excelReport.ignored
        ? ` Righe ignorate: ${excelReport.ignored} (${excelReport.ignoredReasons.join(", ")}).`
        : " Nessuna riga ignorata.";
      const stockText = stockFilterStatusText(state.stockFilter);
      setStatus(`Excel caricato: ${state.products.length} prodotti, ${variants} varianti. Righe lette: ${excelReport.total}.${ignoredText}${stockText ? ` ${stockText}` : ""}`);
    }
    markGeneratedDirty();
    updateUi();
    updatePreview();
  } catch (error) {
    state.rows = [];
    state.products = [];
    state.stockFilter = null;
    state.generatedHtml = "";
    state.previewIndex = 0;
    state.manualHasErrors = false;
    updateUi();
    updatePreview();
    setStatus(error.message || String(error), true);
  }
}

async function readWorkbook(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  if (!workbook.SheetNames.length) {
    throw new Error("Il file Excel non contiene fogli.");
  }
  const sheetName = workbook.SheetNames.includes("Products")
    ? "Products"
    : workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
    blankrows: false,
    raw: true,
  });
  const rawHeaders = (matrix[0] || []).map((value) => cleanHeader(value));
  const columns = rawHeaders.filter(Boolean);
  const rows = matrix.slice(1)
    .map((cells) => {
      const row = {};
      rawHeaders.forEach((header, index) => {
        if (header) row[header] = cells[index] ?? null;
      });
      return row;
    })
    .filter((row) => Object.values(row).some((value) => !isMissingValue(value)));
  if (!rows.length) {
    throw new Error("Il foglio selezionato non contiene righe dati.");
  }
  return { rows, columns, sheetName };
}

function inspectColumns(columns) {
  const lowered = columns.map((column) => column.toLowerCase());
  const missing = [];
  if (!lowered.includes("title")) missing.push("Title");
  if (!lowered.includes("variant price") && !lowered.includes("price")) {
    missing.push("Variant Price o price");
  }
  return missing;
}

function inspectExcelRows(rows, columns) {
  const lowerMap = normalizeColumns(rows, columns);
  let missingTitle = 0;
  let invalidPrice = 0;

  rows.forEach((row) => {
    const title = cleanTitle(getValue(row, "Title", lowerMap));
    if (!title) {
      missingTitle += 1;
      return;
    }
    const rawPrice = firstPresent(getValue(row, "Variant Price", lowerMap), getValue(row, "price", lowerMap));
    const price = toFloat(rawPrice);
    if (price === null || price <= 0) {
      invalidPrice += 1;
    }
  });

  const ignoredReasons = [];
  if (missingTitle) ignoredReasons.push(`${missingTitle} senza titolo`);
  if (invalidPrice) ignoredReasons.push(`${invalidPrice} senza prezzo valido`);

  return {
    total: rows.length,
    missingTitle,
    invalidPrice,
    ignored: missingTitle + invalidPrice,
    ignoredReasons,
  };
}

function rebuildProducts(options = {}) {
  const hadGenerated = Boolean(state.generatedHtml);
  state.manualHasErrors = false;
  if (!state.rows.length) {
    state.products = [];
    state.stockFilter = null;
    state.generatedHtml = "";
    updateUi();
    updatePreview();
    return;
  }
  const missing = inspectColumns(state.columns);
  if (missing.length) {
    state.products = [];
    state.stockFilter = null;
    state.generatedHtml = "";
    updateUi();
    updatePreview();
    if (!options.quiet) setStatus(`Colonne mancanti: ${missing.join(", ")}.`, true);
    return;
  }
  const stockFilter = buildStockFilter(state.rows, state.columns, els.storeSelect.value);
  state.stockFilter = stockFilter;
  state.products = prepareProducts(state.rows, {
    descending: els.orderSelect.value === "desc",
    showDiscountPercent: els.discountPercent.checked,
    stockFilter,
  });
  state.generatedHtml = "";
  updateUi();
  updatePreview();
  const stockText = stockFilterStatusText(stockFilter);
  if (hadGenerated) {
    setStatus(`Modifiche non generate: premi Genera HTML prima di stampare o scaricare.${stockText ? ` ${stockText}` : ""}`);
  } else if (!options.quiet) {
    setStatus(`Anteprima aggiornata: ${state.products.length} prodotti.${stockText ? ` ${stockText}` : ""}`);
  }
}

async function loadLogo(side, file) {
  if (!file) return;
  try {
    const dataUri = await fileToDataUri(file);
    const logoWidthMm = await logoWidthFromDataUri(dataUri);
    const custom = {
      src: dataUri,
      widthMm: logoWidthMm,
      name: file.name,
    };
    if (side === "left") {
      state.leftCustomLogo = custom;
      els.leftLogoPreset.value = "__custom__";
    } else {
      state.rightCustomLogo = custom;
      els.rightLogoPreset.value = "__custom__";
    }
    setCurrentImage(side, custom.src, custom.widthMm, custom.name);
    savePreferences();
    markGeneratedDirty();
    updatePreview();
  } catch (error) {
    setStatus(`Impossibile leggere il logo: ${error.message || error}`, true);
  }
}

function clearLogo(side) {
  if (side === "left") {
    els.leftLogoPreset.value = "__none__";
    els.leftLogoInput.value = "";
  } else {
    els.rightLogoPreset.value = "__none__";
    els.rightLogoInput.value = "";
  }
  setCurrentImage(side, null, LOGO_MAX_WIDTH_MM, "Non selezionato");
  savePreferences();
  markGeneratedDirty();
  updatePreview();
}

function applyImagePreset(side, presetId, options = {}) {
  if (side === "right" && presetId === "__auto__") {
    applyStoreBadge();
    savePreferences();
    markGeneratedDirty();
    updatePreview();
    return;
  }

  if (presetId === "__custom__") {
    const custom = side === "left" ? state.leftCustomLogo : state.rightCustomLogo;
    if (custom) {
      setCurrentImage(side, custom.src, custom.widthMm, custom.name);
      savePreferences();
      markGeneratedDirty();
      updatePreview();
      return;
    }
    if (!options.quiet) {
      const input = side === "left" ? els.leftLogoInput : els.rightLogoInput;
      input.click();
    }
    return;
  }

  if (presetId === "__none__") {
    setCurrentImage(side, null, LOGO_MAX_WIDTH_MM, side === "right" ? "Nessun bollino" : "Non selezionato");
    savePreferences();
    markGeneratedDirty();
    updatePreview();
    return;
  }

  const asset = BUILT_IN_IMAGES.find((item) => item.id === presetId);
  if (!asset) return;
  setCurrentImage(
    side,
    assetUrl(asset.src),
    logoWidthFromDimensions(asset.width, asset.height),
    asset.label,
  );
  savePreferences();
  markGeneratedDirty();
  updatePreview();
}

function setCurrentImage(side, src, widthMm, name) {
  if (side === "left") {
    state.leftLogo = src;
    state.leftLogoWidthMm = widthMm;
    state.leftLogoName = src ? name : "";
    els.leftLogoName.textContent = src ? name : "Non selezionato";
  } else {
    state.rightLogo = src;
    state.rightLogoWidthMm = widthMm;
    state.rightLogoName = src ? name : "";
    els.rightLogoName.textContent = src ? name : "Non selezionato";
    if (els.storeBadgeName) {
      if (els.rightLogoPreset.value === "__auto__") {
        // applyStoreBadge owns the exact automatic label.
      } else {
        els.storeBadgeName.textContent = src ? `Bollino manuale: ${name}` : "Bollino disattivato";
      }
    }
  }
}

function fileToDataUri(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("lettura file fallita"));
    reader.readAsDataURL(file);
  });
}

function logoWidthFromDataUri(dataUri) {
  return new Promise((resolve) => {
    if (typeof Image === "undefined") {
      resolve(LOGO_MAX_WIDTH_MM);
      return;
    }
    const image = new Image();
    image.onload = () => {
      const width = image.naturalWidth || 0;
      const height = image.naturalHeight || 0;
      if (!width || !height) {
        resolve(LOGO_MAX_WIDTH_MM);
        return;
      }
      resolve(roundNumber(LOGO_MAX_HEIGHT_MM * (width / height), 2));
    };
    image.onerror = () => resolve(LOGO_MAX_WIDTH_MM);
    image.src = dataUri;
  });
}

function logoWidthFromDimensions(width, height) {
  if (!width || !height) return LOGO_MAX_WIDTH_MM;
  return roundNumber(LOGO_MAX_HEIGHT_MM * (width / height), 2);
}

function assetUrl(src) {
  return new URL(src, window.location.href).href;
}

function generateHtml() {
  const logoOnly = els.logoOnly.checked;
  if (state.sourceMode === "manual" && !logoOnly) {
    const validation = validateManualProducts({ showErrors: true });
    state.manualHasErrors = validation.errorCount > 0;
    if (state.manualHasErrors) {
      state.generatedHtml = "";
      updateUi();
      setStatus("Correggi i campi evidenziati in rosso.", true);
      return;
    }
  }
  if (!state.products.length && !logoOnly) {
    setStatus("Nessun prodotto valido da generare.", true);
    return;
  }
  const printableProducts = state.products.length ? state.products : [null];
  state.generatedHtml = renderPrintHtml(printableProducts, {
    leftLogo: state.leftLogo,
    rightLogo: state.rightLogo,
    leftLogoWidthMm: state.leftLogoWidthMm,
    rightLogoWidthMm: state.rightLogoWidthMm,
    logoOnly,
    includePrintButton: true,
  });
  updateUi();
  setStatus(`HTML generato: ${outputFileName()}.`);
}

function openPrintWindow() {
  if (!state.generatedHtml) {
    setStatus("Premi Genera HTML prima di stampare.", true);
    return;
  }
  const html = state.generatedHtml;
  const popup = window.open("", "_blank");
  if (!popup) {
    setStatus("Il browser ha bloccato la finestra di stampa.", true);
    return;
  }
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
  popup.focus();
}

function downloadGeneratedHtml() {
  if (!state.generatedHtml) {
    setStatus("Premi Genera HTML prima di scaricare.", true);
    return;
  }
  downloadBlob(outputFileName(), state.generatedHtml, "text/html;charset=utf-8");
}

function downloadExcludedProducts() {
  const filter = state.stockFilter;
  if (!filter?.active || !filter.excludedTitles?.length) {
    setStatus("Nessun prodotto escluso da scaricare.", true);
    return;
  }

  const lines = [
    "Prodotti esclusi per giacenza",
    `Negozio: ${filter.storeLabel}`,
    `Colonna: ${filter.column}`,
    "",
    ...filter.excludedTitles,
    "",
  ];
  const fileBase = excelBaseFileName();
  const storeSlug = slugFilePart(filter.storeLabel) || "negozio";
  downloadBlob(
    `${fileBase}_prodotti_esclusi_${storeSlug}.txt`,
    lines.join("\r\n"),
    "text/plain;charset=utf-8",
  );
}

function downloadTemplate() {
  try {
    requireSheetJs();
    const columns = [
      "Title",
      "Option1 Value",
      "Option2 Value",
      "Option3 Value",
      "Variant Name",
      "Variant Price",
      "Variant Compare At Price",
    ];
    const rows = [
      {
        "Title": "Copripiumino Lino",
        "Option1 Value": "MATRIMONIALE 260x240",
        "Option2 Value": "",
        "Option3 Value": "",
        "Variant Name": "",
        "Variant Price": 129.90,
        "Variant Compare At Price": 169.90,
      },
      {
        "Title": "Copripiumino Lino",
        "Option1 Value": "SINGOLO 155x200",
        "Option2 Value": "",
        "Option3 Value": "",
        "Variant Name": "",
        "Variant Price": 89.90,
        "Variant Compare At Price": 0,
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: columns });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    const output = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([output], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    downloadBlob("modello_cartellini.xlsx", blob);
  } catch (error) {
    setStatus(error.message || String(error), true);
  }
}

function downloadBlob(fileName, content, type = "") {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

function outputFileName() {
  if (state.sourceMode === "manual") {
    const firstTitle = Array.from(els.manualProducts.querySelectorAll(".manual-title"))
      .map((input) => cleanTitle(input.value))
      .find(Boolean);
    const titleSlug = slugFilePart(firstTitle);
    const base = state.products.length > 1
      ? `${titleSlug || "cartellini"}_manuali`
      : (titleSlug || "cartellino_manuale");
    return `${base}${els.logoOnly.checked ? "_A6_solo_loghi" : "_A6"}.html`;
  }
  const base = excelBaseFileName();
  return `${base}${els.logoOnly.checked ? "_A6_solo_loghi" : "_A6"}.html`;
}

function excelBaseFileName() {
  return (state.fileName || "cartellini")
    .replace(/\.(xlsx|xls)$/i, "")
    .replace(/[\\/:*?"<>|]+/g, "_")
    .trim() || "cartellini";
}

function updateUi() {
  const variants = state.products.reduce((sum, product) => sum + product.variants.length, 0);
  const logoOnly = els.logoOnly.checked;
  clampPreviewIndex();
  els.productsCount.textContent = String(state.products.length);
  els.variantsCount.textContent = String(variants);
  els.sheetName.textContent = state.sourceMode === "manual" ? "Manuale" : (state.sheetName || "-");
  els.generateBtn.disabled = (!state.products.length && !logoOnly)
    || (state.manualHasErrors && !logoOnly);
  const hasGeneratedHtml = Boolean(state.generatedHtml);
  els.printBtn.disabled = !hasGeneratedHtml;
  els.downloadBtn.disabled = !hasGeneratedHtml;
  els.previewSearch.disabled = !state.products.length;
  els.previewSearchBtn.disabled = !state.products.length;
  els.previewPrev.disabled = state.previewIndex <= 0;
  els.previewNext.disabled = state.previewIndex >= state.products.length - 1;
  els.previewCounter.textContent = state.products.length
    ? `${state.previewIndex + 1} di ${state.products.length}`
    : (logoOnly ? "1 di 1" : "0 di 0");
  if (state.columns.length) {
    const previewColumns = state.columns.slice(0, 8).join(", ");
    els.fileMeta.textContent = state.columns.length > 8 ? `${previewColumns}...` : previewColumns;
  } else {
    els.fileMeta.textContent = "Colonne richieste: Title, Variant Price";
  }
  updateStockFilterPanel();
}

function updateStockFilterPanel() {
  if (!els.stockFilterPanel) return;
  const filter = state.stockFilter;
  const visible = state.sourceMode === "excel" && Boolean(filter?.requested);
  els.stockFilterPanel.classList.toggle("is-hidden", !visible);
  if (!visible) {
    els.stockFilterSummary.textContent = "";
    els.stockFilterColumn.textContent = "";
    els.stockExcludedList.replaceChildren();
    els.downloadExcludedBtn.disabled = true;
    return;
  }

  if (!filter.active) {
    els.stockFilterSummary.textContent = `Giacenza ${filter.storeLabel}: filtro non applicato`;
    els.stockFilterColumn.textContent = filter.hasInventoryColumns
      ? "Colonna giacenza non trovata per questo negozio."
      : "Questo Excel non contiene colonne Inventory Available.";
    els.stockExcludedList.replaceChildren();
    els.downloadExcludedBtn.disabled = true;
    return;
  }

  els.stockFilterSummary.textContent = `${filter.storeLabel}: ${filter.availableProducts} stampabili, ${filter.excludedProducts} esclusi`;
  els.stockFilterColumn.textContent = `Colonna giacenza: ${filter.column}`;
  const excludedTitles = filter.excludedTitles || [];
  if (excludedTitles.length) {
    els.stockExcludedList.replaceChildren(...excludedTitles.map((title) => {
      const item = document.createElement("li");
      item.textContent = title;
      return item;
    }));
  } else {
    const item = document.createElement("li");
    item.textContent = "Nessun prodotto escluso.";
    els.stockExcludedList.replaceChildren(item);
  }
  els.downloadExcludedBtn.disabled = !excludedTitles.length;
}

function updatePreview() {
  const logoOnly = els.logoOnly.checked;
  if (!state.products.length && !logoOnly) {
    els.previewFrame.removeAttribute("srcdoc");
    els.emptyPreview.classList.remove("is-hidden");
    els.previewCounter.textContent = "0 di 0";
    return;
  }
  clampPreviewIndex();
  const previewProduct = state.products.length ? state.products[state.previewIndex] : null;
  const html = renderPrintHtml([previewProduct], {
    leftLogo: state.leftLogo,
    rightLogo: state.rightLogo,
    leftLogoWidthMm: state.leftLogoWidthMm,
    rightLogoWidthMm: state.rightLogoWidthMm,
    logoOnly,
    includePrintButton: false,
    previewMode: true,
  });
  els.previewFrame.srcdoc = html;
  els.emptyPreview.classList.add("is-hidden");
  updateUi();
}

function clampPreviewIndex() {
  if (!state.products.length) {
    state.previewIndex = 0;
    return;
  }
  state.previewIndex = Math.max(0, Math.min(state.previewIndex, state.products.length - 1));
}

function movePreview(delta) {
  if (!state.products.length) return;
  state.previewIndex += delta;
  clampPreviewIndex();
  updatePreview();
}

function searchPreviewProduct() {
  const query = normalizeSearchText(els.previewSearch.value);
  if (!query) {
    setStatus("Inserisci un testo da cercare.", true);
    return;
  }
  if (!state.products.length) {
    setStatus("Nessun cartellino in anteprima.", true);
    return;
  }

  const start = Math.min(state.previewIndex + 1, state.products.length);
  const orderedIndexes = [
    ...range(start, state.products.length),
    ...range(0, start),
  ];
  const found = orderedIndexes.find((index) => normalizeSearchText(state.products[index].title).includes(query));
  if (found === undefined) {
    setStatus(`Nessun prodotto trovato per "${els.previewSearch.value}".`, true);
    return;
  }
  state.previewIndex = found;
  updatePreview();
  setStatus(`Anteprima: ${state.products[found].title}`);
}

function range(start, end) {
  return Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);
}

function normalizeSearchText(value) {
  const folded = String(value || "")
    .replace(/[àáâãäå]/gi, "a")
    .replace(/[èéêë]/gi, "e")
    .replace(/[ìíîï]/gi, "i")
    .replace(/[òóôõö]/gi, "o")
    .replace(/[ùúûü]/gi, "u");
  return folded
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function markGeneratedDirty(options = {}) {
  const hadGenerated = Boolean(state.generatedHtml);
  state.generatedHtml = "";
  updateUi();
  if (hadGenerated && !options.quiet) {
    setStatus("Modifiche non generate: premi Genera HTML prima di stampare o scaricare.");
  }
}

function setStatus(message, isError = false) {
  els.statusLine.textContent = message;
  els.statusLine.classList.toggle("is-error", isError);
  if (isError) {
    els.headerStatus.textContent = "Errore";
  }
}

function prepareProducts(rows, options, columns = state.columns) {
  const lowerMap = normalizeColumns(rows, columns);
  const ignoredOptionsByTitle = detectMonogramOptionColumns(rows, lowerMap);
  const allowedTitles = options.stockFilter?.active ? options.stockFilter.availableTitles : null;
  const products = new Map();
  const dedupe = new Map();

  rows.forEach((row) => {
    const title = cleanTitle(getValue(row, "Title", lowerMap));
    if (!title) return;
    if (allowedTitles && !allowedTitles.has(title)) return;

    const opt1 = getValue(row, "Option1 Value", lowerMap);
    const opt2 = getValue(row, "Option2 Value", lowerMap);
    const opt3 = getValue(row, "Option3 Value", lowerMap);
    const variantNameRaw = getValue(row, "Variant Name", lowerMap);
    const ignoredOptionIndexes = ignoredOptionsByTitle.get(title) || new Set();
    const variantLabel = selectVariantLabel(opt1, opt2, variantNameRaw, opt3, ignoredOptionIndexes);

    const rawPrice = firstPresent(getValue(row, "Variant Price", lowerMap), getValue(row, "price", lowerMap));
    const rawCompare = firstPresent(
      getValue(row, "Variant Compare At Price", lowerMap),
      getValue(row, "compare_at_price", lowerMap),
    );
    let price = toFloat(rawPrice);
    let comparePrice = toFloat(rawCompare);
    if (price === null) price = 0.0;
    if (comparePrice === null) comparePrice = 0.0;

    if (!products.has(title)) {
      products.set(title, { title, variants: [] });
      dedupe.set(title, new Set());
    }

    const label = cleanOption(variantLabel);
    const hasLabel = Boolean(label);
    const nameUpper = hasLabel ? label.toUpperCase() : "";
    const [width, length] = hasLabel ? extractDimensions(label) : [null, null];
    const [ageStart, ageEnd, ageUnit] = hasLabel ? extractAgeRange(label) : [null, null, null];
    const [numericStart, numericEnd] = hasLabel ? extractNumericRange(label) : [null, null];

    if (price > 0) {
      const hasDiscount = Boolean(comparePrice && comparePrice > price);
      const showDiscountPercent = Boolean(hasDiscount && options.showDiscountPercent);
      const discountInt = showDiscountPercent
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;
      const keyLabel = hasLabel ? labelDedupeKey(label) : "__NO_LABEL__";
      const compareKey = hasDiscount ? roundNumber(comparePrice, 2) : 0.0;
      const key = JSON.stringify([keyLabel, roundNumber(price, 2), compareKey]);
      const seen = dedupe.get(title);
      if (seen.has(key)) return;
      seen.add(key);

      const product = products.get(title);
      const orderIndex = product.variants.length;
      product.variants.push({
        name: label,
        nameUpper,
        hasLabel,
        price,
        priceFmt: eur(price),
        comparePrice: comparePrice > 0 ? comparePrice : null,
        compareFmt: comparePrice > 0 ? eur(comparePrice) : null,
        ageStartSort: ageSortValue(ageStart, ageUnit),
        ageEndSort: ageSortValue(ageEnd, ageUnit),
        numericStartSort: numericStart,
        numericEndSort: numericEnd,
        discInt: discountInt,
        hasDiscount,
        showDiscountPercent,
        orderIndex,
        isBedVariant: BED_VARIANT_TOKENS.some((token) => nameUpper.includes(token)),
        dimWidth: width,
        dimLength: length,
        priceFontScale: 1.0,
      });
    }
  });

  products.forEach((product) => {
    const regular = product.variants.filter((variant) => !isTableclothSpecial(variant.nameUpper));
    const special = product.variants.filter((variant) => isTableclothSpecial(variant.nameUpper));
    regular.sort((a, b) => compareKeys(variantSortKey(a, options.descending), variantSortKey(b, options.descending)));
    special.sort((a, b) => compareKeys(variantSortKey(a, options.descending), variantSortKey(b, options.descending)));
    product.variants = regular.concat(special);

    const count = product.variants.length || 1;
    product.titleScale = titleScale(product.title);
    const titleHeight = estimateTitleHeightMm(product.title, product.titleScale);
    const baseGap = variantGapMm(count);
    product.scale = computeScale(count, baseGap, titleHeight);
    product.gapMm = roundNumber(baseGap * product.scale, 2);
    product.variants.forEach((variant) => {
      variant.priceFontScale = priceFontScaleForVariant(variant.comparePrice, count);
    });
  });

  return Array.from(products.values()).filter((product) => product.variants.length);
}

function buildStockFilter(rows, columns, storeCode) {
  const store = STORE_INVENTORY_FILTERS[storeCode];
  if (!store) {
    return { active: false, requested: false, availableTitles: null };
  }

  const lowerMap = normalizeColumns(rows, columns);
  const inventoryColumns = inventoryColumnNames(columns, lowerMap);
  const column = findInventoryColumn(inventoryColumns, store.hints);
  if (!column) {
    return {
      active: false,
      requested: true,
      storeLabel: store.label,
      hasInventoryColumns: inventoryColumns.length > 0,
      availableTitles: null,
    };
  }

  const allTitles = new Set();
  const availableTitles = new Set();
  rows.forEach((row) => {
    const title = cleanTitle(getValue(row, "Title", lowerMap));
    if (!title) return;
    allTitles.add(title);
    const quantity = toFloat(getValue(row, column, lowerMap));
    if (quantity !== null && quantity >= 1) {
      availableTitles.add(title);
    }
  });
  const excludedTitles = Array.from(allTitles).filter((title) => !availableTitles.has(title));

  return {
    active: true,
    requested: true,
    storeLabel: store.label,
    column,
    availableTitles,
    excludedTitles,
    totalProducts: allTitles.size,
    availableProducts: availableTitles.size,
    excludedProducts: excludedTitles.length,
  };
}

function inventoryColumnNames(columns, lowerMap) {
  const names = columns.length ? columns : Array.from(lowerMap.values());
  return names.filter((column) => normalizeSearchText(column).includes("inventory available"));
}

function findInventoryColumn(columns, hints) {
  const normalizedHints = hints.map((hint) => normalizeSearchText(hint));
  return columns.find((column) => {
    const normalizedColumn = normalizeSearchText(column);
    return normalizedHints.some((hint) => normalizedColumn.includes(hint));
  }) || null;
}

function stockFilterStatusText(filter) {
  if (!filter?.requested) return "";
  if (filter.active) {
    return `Giacenza ${filter.storeLabel}: esclusi ${filter.excludedProducts} prodotti senza disponibilita.`;
  }
  if (filter.hasInventoryColumns) {
    return `Giacenza ${filter.storeLabel}: colonna non trovata, filtro non applicato.`;
  }
  return "";
}

function normalizeColumns(rows, explicitColumns) {
  const columns = explicitColumns.length
    ? explicitColumns
    : Array.from(rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(cleanHeader(key)));
      return set;
    }, new Set()));
  const lowerMap = new Map();
  columns.forEach((column) => {
    lowerMap.set(column.toLowerCase(), column);
  });
  return lowerMap;
}

function getValue(row, key, lowerMap) {
  if (Object.prototype.hasOwnProperty.call(row, key)) return row[key];
  const realKey = lowerMap.get(key.toLowerCase());
  if (realKey && Object.prototype.hasOwnProperty.call(row, realKey)) return row[realKey];
  return null;
}

function detectMonogramOptionColumns(rows, lowerMap) {
  const grouped = new Map();
  rows.forEach((row) => {
    const title = cleanTitle(getValue(row, "Title", lowerMap));
    if (!title) return;
    if (!grouped.has(title)) grouped.set(title, { 1: [], 2: [], 3: [] });
    const bucket = grouped.get(title);
    [
      [1, "Option1 Value"],
      [2, "Option2 Value"],
      [3, "Option3 Value"],
    ].forEach(([index, column]) => {
      const value = cleanOption(getValue(row, column, lowerMap));
      if (value) bucket[index].push(value);
    });
  });

  const result = new Map();
  grouped.forEach((columns, title) => {
    const ignored = new Set();
    Object.entries(columns).forEach(([index, values]) => {
      if (values.length < 8) return;
      const letters = values.map((value) => value.toUpperCase()).filter(isSingleLetterCode);
      const uniqueLetters = new Set(letters);
      if (uniqueLetters.size >= 8 && letters.length / values.length >= 0.75) {
        ignored.add(Number(index));
      }
    });
    if (ignored.size) result.set(title, ignored);
  });
  return result;
}

function selectVariantLabel(opt1, opt2, variantName, opt3, ignoredOptionIndexes) {
  const optionCandidates = [
    [1, opt1],
    [2, opt2],
    [3, opt3],
  ];

  for (const [index, candidate] of optionCandidates) {
    if (ignoredOptionIndexes.has(index)) continue;
    if (isSizeValue(candidate)) return cleanOption(candidate);
  }

  for (const [index, candidate] of optionCandidates) {
    if (ignoredOptionIndexes.has(index)) continue;
    if (candidate && String(candidate).toLowerCase().includes("trouss")) return cleanOption(candidate);
  }

  if (variantName) {
    const raw = cleanOption(variantName);
    if (!raw) return null;
    const parts = raw.split("/").map((part) => part.trim()).filter(Boolean);
    for (const part of parts) {
      if (isSizeValue(part)) return part;
    }
    if (isSizeValue(raw)) return raw;
  }

  return null;
}

function isSizeValue(value) {
  const text = cleanOption(value);
  if (!text) return false;
  const lowered = text.toLowerCase();
  if (lowered === "default title" || lowered === "default") return false;

  if (SIZE_PHRASES.some((phrase) => lowered.includes(phrase))) return true;

  const tokens = lowered.split(/[\s/|,+\-–]+/).filter(Boolean);
  if (tokens.some((token) => SIZE_TOKENS.has(token))) return true;
  if (lowered.includes("ø") || lowered.includes("diam")) return true;
  return SIZE_REGEXES.some((regex) => regex.test(lowered));
}

function variantSortKey(variant, descending) {
  const label = (variant.nameUpper || "").trim();
  const orderIndex = variant.orderIndex || 0;
  const ageStart = variant.ageStartSort;
  const ageEnd = variant.ageEndSort;
  const numericStart = variant.numericStartSort;
  const numericEnd = variant.numericEndSort;
  const width = variant.dimWidth;
  const length = variant.dimLength;

  if (ageStart !== null && ageEnd !== null) {
    return descending
      ? [0, -ageEnd, -ageStart, label, orderIndex]
      : [0, ageStart, ageEnd, label, orderIndex];
  }

  if (numericStart !== null && numericEnd !== null) {
    return descending
      ? [0, -numericEnd, -numericStart, label, orderIndex]
      : [0, numericStart, numericEnd, label, orderIndex];
  }

  const lengthPriority = length !== null ? length : Infinity;
  const widthPriority = width !== null ? width : Infinity;
  const missingDims = width !== null && length !== null ? 0 : 1;
  let sizePriority = label ? sizeSortMetric(label) : 0.0;
  if (sizePriority <= 0) sizePriority = length !== null ? lengthPriority : Infinity;

  let rank = label ? 10 : 99;
  for (const [token, rankValue] of PREFERRED_VARIANT_ORDER) {
    if (label.includes(token)) {
      rank = rankValue;
      break;
    }
  }

  if (descending) {
    const lengthKey = length !== null ? -length : 0.0;
    const widthKey = width !== null ? -width : 0.0;
    const sizeKey = sizePriority !== Infinity ? -sizePriority : 0.0;
    const rankKey = rank !== 99 ? -rank : 99;
    return [missingDims, lengthKey, widthKey, sizeKey, rankKey, label, orderIndex];
  }

  return [missingDims, lengthPriority, widthPriority, sizePriority, rank, label, orderIndex];
}

function compareKeys(left, right) {
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const a = left[index];
    const b = right[index];
    if (a === b) continue;
    if (typeof a === "number" && typeof b === "number") return a < b ? -1 : 1;
    return String(a).localeCompare(String(b), "it");
  }
  return 0;
}

function renderPrintHtml(products, options) {
  const leftLogoClass = options.leftLogo ? " has-left-logo" : "";
  const rightLogoClass = options.rightLogo ? " has-right-logo" : "";
  const leftLogoWidthMm = roundNumber(options.leftLogoWidthMm || LOGO_MAX_WIDTH_MM, 2);
  const rightLogoWidthMm = roundNumber(options.rightLogoWidthMm || LOGO_MAX_WIDTH_MM, 2);
  const bodyVars = [
    options.leftLogo ? `--left-logo:${cssUrl(options.leftLogo)};` : "",
    options.rightLogo ? `--right-logo:${cssUrl(options.rightLogo)};` : "",
    options.leftLogo ? `--left-logo-width:${leftLogoWidthMm}mm;` : "",
    options.rightLogo ? `--right-logo-width:${rightLogoWidthMm}mm;` : "",
  ].join("");

  const pages = products.map((product) => {
    const content = options.logoOnly ? "" : renderProductContent(product);
    return `<div class="page${leftLogoClass}${rightLogoClass}">${content}</div>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Cartellini A6</title>
  <style>
  @page{ size:${A6_W_MM}mm ${A6_H_MM}mm; margin:0; }
  *{ margin:0; padding:0; box-sizing:border-box; }
  html{ background:#e0e0e0; padding:${options.previewMode ? 0 : 20}px 0; }
  body{
    margin:0 auto; padding:0;
    font-family:'Quicksand',system-ui,-apple-system,'Segoe UI',sans-serif;
    max-width:${A6_W_MM}mm;
    ${bodyVars}
  }
  .page{
    width:${A6_W_MM}mm; height:${A6_H_MM}mm;
    background:#fff; position:relative; page-break-after:always;
    padding-top:${TOP_OFFSET_MM}mm; margin:0 auto ${options.previewMode ? 0 : 20}px;
    box-shadow:${options.previewMode ? "none" : "0 2px 8px rgba(0,0,0,.15)"};
    overflow:hidden;
  }
  .page.has-left-logo::before,
  .page.has-right-logo::after{
    content:"";
    position:absolute;
    top:${LOGO_TOP_OFFSET_MM}mm;
    width:${LOGO_MAX_WIDTH_MM}mm;
    height:${LOGO_MAX_HEIGHT_MM}mm;
    background-repeat:no-repeat;
    background-size:contain;
  }
  .page.has-left-logo::before{
    left:${LOGO_SIDE_OFFSET_MM}mm;
    width:var(--left-logo-width);
    background-image:var(--left-logo);
    background-position:left top;
  }
  .page.has-right-logo::after{
    right:${LOGO_SIDE_OFFSET_MM}mm;
    width:var(--right-logo-width);
    background-image:var(--right-logo);
    background-position:right top;
  }
  .title-wrap{ text-align:center; padding:0 ${TITLE_SIDE_PADDING_MM}mm; margin-bottom:4mm; }
  .title{ line-height:${TITLE_LINE_HEIGHT}; color:#000; font-size:${TITLE_BASE_PT}pt; font-weight:400; word-break:break-word; }
  .variants{ padding:0; width:100%; }
  .variant{ margin-bottom:${VARIANT_GAP_MM}mm; width:100%; }
  .vname{
    font-size:${VNAME_BASE_PT}pt; font-weight:400; letter-spacing:.3px; color:#000;
    text-transform:uppercase; text-align:left; padding:0 8mm;
  }
  .price-container{ width:100%; display:flex; justify-content:center; text-align:center; }
  .price-row{ display:inline-flex; align-items:baseline; gap:4mm; column-gap:4mm; }
  .price-item{ display:inline-block; white-space:nowrap; }
  .old-price{ font-size:${PRICE_SEC_PT}pt; color:#797979; text-decoration:line-through; font-weight:400; }
  .discount{ font-size:${PRICE_SEC_PT}pt; color:#e02367; font-weight:700; }
  .final-price{ font-size:${PRICE_MAIN_PT}pt; color:#000; font-weight:700; }
  .print-btn{
    position:fixed; top:10px; right:10px;
    padding:8px 12px; border:none; border-radius:8px;
    font:600 12px/1.1 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
    cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,.12);
    background:#111; color:#fff; z-index:10;
  }
  .print-btn:active{ transform:translateY(1px); }
  @media print{
    html, body{ background:#fff !important; padding:0 !important; margin:0 !important; }
    body{ max-width:none !important; }
    .print-btn{ display:none !important; }
    .page{
      box-shadow:none !important; margin:0 !important;
      width:${A6_W_MM}mm !important; height:${A6_H_MM}mm !important;
      position:relative !important; left:0 !important; transform:none !important;
      overflow:hidden !important;
    }
    .price-container{ display:flex !important; justify-content:center !important; }
    .price-row{ display:inline-flex !important; }
    *{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
  </style>
</head>
<body>
  ${options.includePrintButton ? '<button class="print-btn" onclick="window.print()">Stampa</button>' : ""}
  ${pages}
</body>
</html>`;
}

function renderProductContent(product) {
  const titleSize = roundNumber(TITLE_BASE_PT * product.titleScale, 2);
  const variants = product.variants.map((variant, index) => {
    const margin = index === product.variants.length - 1 ? 0 : product.gapMm;
    const label = variant.hasLabel
      ? `<div class="vname" style="font-size:${roundNumber(VNAME_BASE_PT * product.scale, 2)}pt;">${escapeHtml(variant.nameUpper)}</div>`
      : "";
    const priceScale = product.scale * variant.priceFontScale;
    const oldPrice = variant.hasDiscount
      ? `<span class="price-item old-price" style="font-size:${roundNumber(PRICE_SEC_PT * priceScale, 2)}pt;">${escapeHtml(variant.compareFmt)}</span>`
      : "";
    const discount = variant.hasDiscount && variant.showDiscountPercent
      ? `<span class="price-item discount" style="font-size:${roundNumber(PRICE_SEC_PT * priceScale, 2)}pt;">-${variant.discInt}%</span>`
      : "";
    return `<div class="variant${variant.hasLabel ? "" : " no-label"}" style="margin-bottom:${margin}mm;">
      ${label}
      <div class="price-container">
        <div class="price-row">
          ${oldPrice}
          ${discount}
          <span class="price-item final-price" style="font-size:${roundNumber(PRICE_MAIN_PT * priceScale, 2)}pt;">${escapeHtml(variant.priceFmt)}</span>
        </div>
      </div>
    </div>`;
  }).join("");

  return `<div class="title-wrap">
    <h1 class="title" style="font-size:${titleSize}pt;">${escapeHtml(product.title)}</h1>
  </div>
  <div class="variants">${variants}</div>`;
}

function pxToPt(px) {
  return roundNumber(px * 0.75, 2);
}

function isMissingValue(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "number") return Number.isNaN(value);
  if (typeof value === "string") {
    const text = value.trim().toLowerCase();
    return !text || ["nan", "none", "null", "<na>"].includes(text);
  }
  return false;
}

function firstPresent(...values) {
  return values.find((value) => !isMissingValue(value)) ?? null;
}

function cleanHeader(value) {
  return isMissingValue(value) ? "" : String(value).trim();
}

function cleanTitle(value) {
  return isMissingValue(value) ? "" : String(value).trim();
}

function cleanOption(value) {
  return isMissingValue(value) ? "" : String(value).trim();
}

function labelDedupeKey(label) {
  return label ? label.replace(/\s+/g, " ").trim().toUpperCase() : "";
}

function toFloat(value) {
  if (isMissingValue(value)) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  let text = String(value).trim();
  if (!text) return null;
  text = text.replace(/[€�\s]/g, "").replace(/'/g, "");
  if ((text.match(/,/g) || []).length > 1 && !text.includes(".")) {
    const parts = text.split(",");
    text = `${parts.slice(0, -1).join("")}.${parts[parts.length - 1]}`;
  } else if (text.includes(",") && text.includes(".")) {
    if (text.lastIndexOf(",") > text.lastIndexOf(".")) {
      text = text.replace(/\./g, "").replace(",", ".");
    } else {
      text = text.replace(/,/g, "");
    }
  } else if (text.includes(",")) {
    text = text.replace(",", ".");
  }
  const parsed = Number.parseFloat(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function eur(value) {
  return `${Number(value).toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}€`;
}

function titleScale(text) {
  const clean = (text || "").trim();
  const length = clean.length;
  const words = clean.split(/\s+/).filter(Boolean).length;
  let scale = 1.0;
  if (length > 26) scale *= 0.96;
  if (length > 34) scale *= 0.93;
  if (length > 42) scale *= 0.90;
  if (length > 52) scale *= 0.86;
  if (words >= 6) scale *= 0.95;
  if (words >= 8) scale *= 0.92;
  return Math.max(0.75, roundNumber(scale, 3));
}

function estimateTitleLines(text, fontPt) {
  const clean = (text || "").trim();
  if (!clean || fontPt <= 0) return 0;
  const usableMm = A6_W_MM - (2 * TITLE_SIDE_PADDING_MM);
  const fontMm = fontPt * PT_TO_MM;
  const avgCharMm = fontMm * TITLE_CHAR_WIDTH_FACTOR;
  if (avgCharMm <= 0) return 1;
  const maxChars = Math.max(TITLE_MIN_CHARS_PER_LINE, Math.floor(usableMm / avgCharMm));
  return Math.max(1, Math.ceil(clean.length / maxChars));
}

function estimateTitleHeightMm(title, scale) {
  const clean = (title || "").trim();
  if (!clean) return 0.0;
  const fontPt = TITLE_BASE_PT * scale;
  const lines = estimateTitleLines(clean, fontPt);
  const lineHeightMm = fontPt * PT_TO_MM * TITLE_LINE_HEIGHT;
  return roundNumber((lines * lineHeightMm) + TITLE_MARGIN_BOTTOM_MM, 2);
}

function computeScale(variantCount, gapMm, titleHeightMm) {
  const count = Math.max(1, variantCount);
  const availableMm = Math.max(0.0, A6_H_MM - TOP_OFFSET_MM - BOTTOM_SAFE_MM - titleHeightMm);
  const totalGapMm = gapMm * Math.max(0, count - 1);
  const baseBlockMm = variantBaseBlockMm(count);
  const neededMm = (count * baseBlockMm) + totalGapMm;
  if (neededMm <= 0) return 1.0;
  const scale = availableMm > 0 ? availableMm / neededMm : MIN_VARIANT_SCALE;
  return roundNumber(Math.max(MIN_VARIANT_SCALE, Math.min(1.0, scale)), 3);
}

function variantGapMm(variantCount) {
  if (variantCount <= 3) return VARIANT_GAP_MM;
  const table = new Map([[4, 3.5], [5, 3.0], [6, 2.5], [7, 2.2]]);
  return roundNumber(table.get(variantCount) ?? 1.8, 2);
}

function variantBaseBlockMm(variantCount) {
  return variantCount >= 7 ? VARIANT_BASE_BLOCK_MM_7 : VARIANT_BASE_BLOCK_MM;
}

function priceFontScaleForVariant(comparePrice, variantCount) {
  if (
    variantCount <= PRICE_HIGH_VARIANT_LIMIT
    && comparePrice !== null
    && comparePrice >= PRICE_HIGH_THRESHOLD
  ) {
    return PRICE_HIGH_FONT_SCALE;
  }
  return 1.0;
}

function isSingleLetterCode(value) {
  return /^[A-Z]$/.test(String(value || "").trim().toUpperCase());
}

function extractDimensions(label) {
  if (!label) return [null, null];
  const pair = label.match(DIM_PAIR_RE);
  if (pair) {
    return [
      Number.parseFloat(pair[1].replace(",", ".")),
      Number.parseFloat(pair[2].replace(",", ".")),
    ];
  }
  const cleaned = label.replace(FRACTION_RE, " ");
  const nums = [...cleaned.matchAll(SIZE_NUMBER_RE)].map((match) => Number.parseFloat(match[0].replace(",", ".")));
  if (nums.length >= 2) return [nums[0], nums[1]];
  if (nums.length === 1) return [nums[0], null];
  return [null, null];
}

function extractAgeRange(label) {
  if (!label) return [null, null, null];
  const match = label.match(AGE_RANGE_RE);
  if (!match) return [null, null, null];
  return [
    Number.parseFloat(match[2].replace(",", ".")),
    Number.parseFloat(match[3].replace(",", ".")),
    match[4].toLowerCase(),
  ];
}

function extractNumericRange(label) {
  if (!label) return [null, null];
  const match = label.match(NUMERIC_RANGE_RE);
  if (!match) return [null, null];
  return [
    Number.parseFloat(match[1].replace(",", ".")),
    Number.parseFloat(match[2].replace(",", ".")),
  ];
}

function ageSortValue(value, unit) {
  if (value === null || !unit) return null;
  return unit.startsWith("ann") ? value * 12.0 : value;
}

function sizeSortMetric(label) {
  const [width, length] = extractDimensions(label);
  if (width !== null && length !== null) return width * length;
  if (width !== null) return width;
  return 0.0;
}

function isTableclothSpecial(labelUpper) {
  return Boolean(labelUpper) && TABLECLOTH_LATE_TOKENS.some((token) => labelUpper.includes(token));
}

function roundNumber(value, digits) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function cssUrl(dataUri) {
  return `url("${String(dataUri).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}")`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function slugFilePart(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80)
    .toLowerCase();
}

function requireSheetJs() {
  if (!window.XLSX) {
    throw new Error("SheetJS non e' disponibile. Controlla che webapp/vendor/xlsx.full.min.js sia presente.");
  }
}
