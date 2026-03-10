(() => {
  const MENU_PANEL_ID = "mainMenuPanel";
  const CONSTRUCTOR_PANEL_ID = "constructorPanel";
  const CONSTRUCTOR_ITEMS_ID = "constructorItems";
  const MASTER_TOGGLE_ID = "constructorToggleAll";
  const TOGGLE_BUTTON_ID = "constructorToggleBtn";
  const HEADER_PANEL_TOGGLE_ID = "headerConstructorPanelBtn";
  const BOTTOM_PANEL_TOGGLE_ID = "bottomConstructorPanelBtn";
  const HIDDEN_CLASS = "menu-section-hidden";
  const SIDEBAR_COLLAPSED_CLASS = "sidebar-collapsed";
  const OVERLAY_OPEN_CLASS = "constructor-overlay-open";
  const VISIBILITY_STORAGE_KEY = "vpe_constructor_visibility_v1";
  const COMPOSITE_ACTIONS_ID = "constructorCompositeActions";
  const COMPOSITE_STYLE_ID = "constructorCompositeStyles";
  const COMPOSITE_FLOATING_TIP_ID = "constructorCompositeFloatingTip";
  const DESKTOP_MEDIA_QUERY = "(min-width: 1101px)";

  const FAN_MODE_SECTIONS = [
    "generationModeSection",
    "quickStyleSection",
    "aiModelSection",
    "descriptionSection",
    "aspectRatioSection",
    "resolutionSection",
    "qualitySection",
    "negativeSection"
  ];

  const PRO_MODE_SECTIONS = [
    "generationModeSection",
    "fashionFoodSection",
    "foodCommercialSection",
    "photoStyleSection",
    "cinemaStyleSection",
    "directorStyleSection",
    "presetsSection",
    "aiModelSection",
    "descriptionSection",
    "emotionSection",
    "aspectRatioSection",
    "resolutionSection",
    "cameraSectionV2",
    "photoCameraSectionV2",
    "lensSectionV2",
    "apertureSection",
    "artStyleSectionV2",
    "filmStockSection",
    "lightingSchemesSectionV2",
    "paletteSectionV2",
    "moodSectionV2",
    "motionBlurSectionV2",
    "materialSection",
    "textSection",
    "specialModesSection",
    "genParamsSection",
    "referencesSection",
    "qualitySection",
    "negativeSection"
  ];

  const COMPOSITE_MODES = [
    {
      key: "fan",
      label: "Фан",
      title: "Быстрый режим: любимые фильм-пресеты и минимум ручных настроек",
      description: "Фан: быстрый выбор пресетов любимых фильмов. Когда использовать: нужен результат за 1–2 клика, без глубокой ручной настройки.",
      sections: FAN_MODE_SECTIONS
    },
    {
      key: "pro",
      label: "Pro",
      title: "Профессиональный режим: полная ручная настройка структуры",
      description: "Pro: полностью настраиваемая структура. Когда использовать: нужен полный контроль параметров и точная детальная настройка.",
      sections: PRO_MODE_SECTIONS
    }
  ];

  const COMPOSITE_SECTION_STATE_DEFAULTS = {
    generationModeSection: { maxConsistency: false },
    presetsSection: { isStandardPresetActive: false },
    referencesSection: { referenceImages: [] },
    specialModesSection: { generateFourMode: false, grid3x3Mode: false, beforeAfter: false, seamlessPattern: false },
    motionBlurSectionV2: {
      motionBlurMode: false,
      motionBlurBackgroundEnabled: false,
      motionBlurForegroundEnabled: false,
      motionBlurCharacter: "",
      motionBlurLocation: "",
      motionBlurBackground: "",
      motionBlurForeground: ""
    },
    genParamsSection: {
      seed: "",
      mjVersion: "7",
      mjStyle: "",
      mjStylize: 250,
      mjChaos: 0,
      mjWeird: 0,
      mjSref: "",
      sdCfg: 7,
      sdSteps: 25,
      fluxModel: "dev",
      fluxGuidance: 3.5,
      fluxSteps: 28,
      dalleStyle: "vivid",
      dalleQuality: "hd"
    }
  };

  const CONTROL_STATE_KEY_MAP = {
    seedInput: "seed",
    referenceImages: "referenceImages",
    mjStylizeSlider: "mjStylize",
    mjChaosSlider: "mjChaos",
    mjWeirdSlider: "mjWeird",
    mjSrefInput: "mjSref",
    sdCfgSlider: "sdCfg",
    sdStepsSlider: "sdSteps",
    fluxGuidanceSlider: "fluxGuidance",
    fluxStepsSlider: "fluxSteps"
  };

  const visibilityState = new Map();
  let autoIdCounter = 1;
  let overlayModeInitialized = false;
  let activeCompositeMode = "";
  let floatingTipLifecycleBound = false;

  function loadPersistedVisibility() {
    try {
      const raw = localStorage.getItem(VISIBILITY_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return;

      Object.entries(parsed).forEach(([sectionId, isVisible]) => {
        if (typeof isVisible === "boolean") {
          visibilityState.set(sectionId, isVisible);
        }
      });
    } catch (_) {
      // Ignore storage errors (private mode / disabled storage / malformed data).
    }
  }

  function persistVisibilityState() {
    try {
      const payload = {};
      visibilityState.forEach((isVisible, sectionId) => {
        if (typeof isVisible === "boolean") {
          payload[sectionId] = isVisible;
        }
      });
      localStorage.setItem(VISIBILITY_STORAGE_KEY, JSON.stringify(payload));
    } catch (_) {
      // Ignore storage errors to avoid breaking UI logic.
    }
  }

  function getMenuPanel() {
    return document.getElementById(MENU_PANEL_ID);
  }

  function getSections() {
    const menuPanel = getMenuPanel();
    if (!menuPanel) return [];
    return Array.from(menuPanel.querySelectorAll(":scope > .section"));
  }

  function ensureSectionId(section) {
    if (section.id) return section.id;
    const id = `menu-section-auto-${autoIdCounter++}`;
    section.id = id;
    return id;
  }

  function normalizeLabel(section) {
    const title = section.querySelector(".section-header h2");
    if (!title) return section.id || "Section";

    const clone = title.cloneNode(true);
    clone.querySelectorAll(".help-tip, .icon").forEach((node) => node.remove());

    const text = (clone.textContent || "").replace(/\s+/g, " ").trim();
    return text || section.id || "Section";
  }

  function applySectionVisibility(sectionId, isVisible, persist = true) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.classList.toggle(HIDDEN_CLASS, !isVisible);
    section.setAttribute("aria-hidden", isVisible ? "false" : "true");
    visibilityState.set(sectionId, isVisible);
    if (persist) {
      persistVisibilityState();
    }
  }

  function cloneCompositeValue(value) {
    if (Array.isArray(value)) return value.slice();
    if (value && typeof value === "object") return { ...value };
    return value;
  }

  function getLiveState() {
    return window.state && typeof window.state === "object" ? window.state : null;
  }

  function setStateValue(key, value) {
    const liveState = getLiveState();
    if (!liveState) return;
    liveState[key] = cloneCompositeValue(value);
  }

  function clearStateKey(key) {
    const liveState = getLiveState();
    if (!liveState || !(key in liveState)) return;

    const current = liveState[key];
    if (Array.isArray(current)) liveState[key] = [];
    else if (typeof current === "boolean") liveState[key] = false;
    else if (typeof current === "number") liveState[key] = 0;
    else if (current && typeof current === "object") liveState[key] = {};
    else liveState[key] = "";
  }

  function getControlStateKey(control) {
    if (!control || !control.id) return "";
    return CONTROL_STATE_KEY_MAP[control.id] || control.id;
  }

  function resetControlElement(control) {
    if (!control) return;

    if (control.type === "checkbox" || control.type === "radio") {
      control.checked = false;
      return;
    }

    if (control.type === "range") {
      const defaultValue = control.getAttribute("value") || control.getAttribute("data-default") || control.min || "0";
      control.value = defaultValue;
      if (control.id) {
        const display = document.getElementById(control.id.replace("Slider", "Val"));
        if (display) display.textContent = defaultValue;
      }
      return;
    }

    if (control.type === "file") {
      control.value = "";
      return;
    }

    if (control.tagName === "SELECT") {
      control.selectedIndex = 0;
      return;
    }

    if ("value" in control) {
      control.value = "";
    }
  }

  function resetControlState(control) {
    const liveState = getLiveState();
    if (!liveState) return;

    const stateKey = getControlStateKey(control);
    if (!stateKey || !(stateKey in liveState)) return;

    if (control.type === "checkbox" || control.type === "radio") {
      liveState[stateKey] = false;
      return;
    }

    if (control.type === "file") {
      liveState[stateKey] = [];
      return;
    }

    if (control.type === "range") {
      const defaultValue = control.getAttribute("value") || control.getAttribute("data-default") || control.min || "0";
      if (typeof liveState[stateKey] === "number") {
        const parsed = Number(defaultValue);
        liveState[stateKey] = Number.isFinite(parsed) ? parsed : 0;
      } else {
        liveState[stateKey] = defaultValue;
      }
      return;
    }

    clearStateKey(stateKey);
  }

  function pruneHiddenSectionsState(keep) {
    const liveState = getLiveState();
    if (!liveState) return;

    getSections().forEach((section) => {
      const sectionId = ensureSectionId(section);
      if (keep.has(sectionId)) return;

      const groups = new Set();
      section.querySelectorAll("[data-group]").forEach((node) => {
        const group = node.getAttribute("data-group");
        if (group) groups.add(group);
      });
      groups.forEach(clearStateKey);

      section.querySelectorAll("input, textarea, select").forEach((control) => {
        resetControlElement(control);
        resetControlState(control);
      });

      const defaults = COMPOSITE_SECTION_STATE_DEFAULTS[sectionId];
      if (defaults) {
        Object.entries(defaults).forEach(([key, value]) => setStateValue(key, value));
      }
    });

    if (typeof window.updateAll === "function") {
      window.updateAll();
    }
  }

  function syncMasterToggle() {
    const master = document.getElementById(MASTER_TOGGLE_ID);
    const itemsRoot = document.getElementById(CONSTRUCTOR_ITEMS_ID);
    if (!master || !itemsRoot) return;

    const sectionChecks = Array.from(itemsRoot.querySelectorAll('input[type="checkbox"][data-section-id]'));
    if (!sectionChecks.length) {
      master.checked = false;
      master.indeterminate = false;
      return;
    }

    const checkedCount = sectionChecks.filter((cb) => cb.checked).length;
    master.checked = checkedCount === sectionChecks.length;
    master.indeterminate = checkedCount > 0 && checkedCount < sectionChecks.length;
  }

  function ensureCompositeStyles() {
    if (document.getElementById(COMPOSITE_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = COMPOSITE_STYLE_ID;
    style.textContent = `
      #${CONSTRUCTOR_PANEL_ID} .constructor-composite-actions {
        display: grid;
        gap: 8px;
        margin: 8px 0 8px;
      }
      #${CONSTRUCTOR_PANEL_ID} .constructor-item.composite-mode {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        border: 1px solid rgba(130, 183, 255, 0.55);
        background: linear-gradient(145deg, rgba(104, 165, 255, 0.22), rgba(78, 133, 220, 0.18));
        color: #d9ecff;
        cursor: pointer;
        font-weight: 800;
      }
      #${CONSTRUCTOR_PANEL_ID} .constructor-composite-label {
        flex: 1;
        text-align: left;
      }
      #${CONSTRUCTOR_PANEL_ID} .constructor-composite-help {
        position: relative;
        flex: 0 0 auto;
        width: 22px;
        height: 22px;
        border-radius: 999px;
        border: 1px solid rgba(112, 168, 235, 0.8);
        background: linear-gradient(145deg, rgba(55, 90, 140, 0.62), rgba(34, 63, 104, 0.66));
        color: #d9ecff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 900;
        line-height: 1;
        cursor: help;
      }
      #${CONSTRUCTOR_PANEL_ID} .constructor-composite-help:focus-visible {
        outline: 2px solid rgba(145, 208, 255, 0.95);
        outline-offset: 2px;
      }
      #${CONSTRUCTOR_PANEL_ID} .constructor-item.composite-mode:hover {
        border-color: rgba(160, 210, 255, 0.75);
        background: linear-gradient(145deg, rgba(122, 186, 255, 0.28), rgba(92, 151, 238, 0.24));
      }
      #${CONSTRUCTOR_PANEL_ID} .constructor-item.composite-mode.is-active {
        border-color: rgba(185, 228, 255, 0.9);
        box-shadow: 0 0 0 1px rgba(157, 214, 255, 0.45), 0 0 20px rgba(105, 176, 255, 0.38);
      }
      #${COMPOSITE_FLOATING_TIP_ID} {
        position: fixed;
        left: 0;
        top: 0;
        transform: translateY(-50%);
        max-width: min(260px, 72vw);
        border: 1px solid rgba(120, 180, 255, 0.65);
        border-radius: 10px;
        background: linear-gradient(145deg, rgba(12, 24, 49, 0.98), rgba(10, 19, 40, 0.98));
        color: #cde6ff;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
        font-size: 0.76rem;
        font-weight: 600;
        line-height: 1.35;
        padding: 8px 10px;
        overflow-wrap: anywhere;
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        z-index: 2500;
        transition: opacity .12s ease, visibility .12s ease;
      }
      #${COMPOSITE_FLOATING_TIP_ID}.is-visible {
        opacity: 1;
        visibility: visible;
      }
    `;
    document.head.appendChild(style);
  }

  function getFloatingCompositeTip() {
    let tip = document.getElementById(COMPOSITE_FLOATING_TIP_ID);
    if (tip) return tip;
    tip = document.createElement("div");
    tip.id = COMPOSITE_FLOATING_TIP_ID;
    tip.setAttribute("role", "tooltip");
    document.body.appendChild(tip);
    return tip;
  }

  function hideFloatingCompositeTip() {
    const tip = document.getElementById(COMPOSITE_FLOATING_TIP_ID);
    if (tip) tip.classList.remove("is-visible");
  }

  function showFloatingCompositeTip(anchorEl, text) {
    if (!anchorEl || !text) return;
    const tip = getFloatingCompositeTip();
    tip.textContent = text;
    tip.classList.add("is-visible");

    const margin = 10;
    const anchorRect = anchorEl.getBoundingClientRect();
    const tipWidth = tip.offsetWidth || 220;
    const tipHeight = tip.offsetHeight || 64;

    // Open to the opposite side (right of the "?"), fallback to left if needed.
    let left = anchorRect.right + margin;
    if (left + tipWidth > window.innerWidth - margin) {
      left = anchorRect.left - tipWidth - margin;
    }
    left = Math.max(margin, Math.min(left, window.innerWidth - tipWidth - margin));

    let centerY = anchorRect.top + (anchorRect.height / 2);
    const minY = margin + (tipHeight / 2);
    const maxY = window.innerHeight - margin - (tipHeight / 2);
    centerY = Math.max(minY, Math.min(centerY, maxY));

    tip.style.left = `${Math.round(left)}px`;
    tip.style.top = `${Math.round(centerY)}px`;
  }

  function bindFloatingTipLifecycle() {
    if (floatingTipLifecycleBound) return;
    floatingTipLifecycleBound = true;

    window.addEventListener("resize", hideFloatingCompositeTip);
    document.addEventListener("scroll", hideFloatingCompositeTip, true);
    document.addEventListener("pointerdown", (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest(".constructor-composite-help")) return;
      hideFloatingCompositeTip();
    });
  }

  function setActiveCompositeMode(modeKey) {
    activeCompositeMode = modeKey || "";
    document.querySelectorAll(`#${CONSTRUCTOR_PANEL_ID} .constructor-item.composite-mode`).forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.modeKey === activeCompositeMode);
    });
  }

  function applyCompositeModeVisibility(sectionIds, modeKey) {
    const itemsRoot = document.getElementById(CONSTRUCTOR_ITEMS_ID);
    if (!itemsRoot) return;

    const keep = new Set((sectionIds || []).map((id) => String(id)));
    itemsRoot.querySelectorAll('input[type="checkbox"][data-section-id]').forEach((cb) => {
      const isVisible = keep.has(cb.dataset.sectionId);
      cb.checked = isVisible;
      applySectionVisibility(cb.dataset.sectionId, isVisible, false);
    });

    pruneHiddenSectionsState(keep);
    syncMasterToggle();
    persistVisibilityState();
    setActiveCompositeMode(modeKey);
  }

  function createCompositeModeButton(mode) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "constructor-item composite-mode";
    button.dataset.modeKey = mode.key;
    button.removeAttribute("title");

    const label = document.createElement("span");
    label.className = "constructor-composite-label";
    label.textContent = mode.label;

    const help = document.createElement("span");
    help.className = "constructor-composite-help";
    help.textContent = "?";
    help.tabIndex = 0;
    help.removeAttribute("title");
    help.setAttribute("role", "button");
    help.setAttribute("aria-label", mode.description || mode.title || mode.label);

    help.addEventListener("mouseenter", () => showFloatingCompositeTip(help, mode.description || mode.title || mode.label));
    help.addEventListener("mouseleave", hideFloatingCompositeTip);
    help.addEventListener("focus", () => showFloatingCompositeTip(help, mode.description || mode.title || mode.label));
    help.addEventListener("blur", hideFloatingCompositeTip);

    ["pointerdown", "click"].forEach((evt) => {
      help.addEventListener(evt, (event) => {
        event.stopPropagation();
        if (evt === "click") event.preventDefault();
      });
    });

    help.addEventListener("keydown", (event) => {
      event.stopPropagation();
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showFloatingCompositeTip(help, mode.description || mode.title || mode.label);
      } else if (event.key === "Escape" || event.key === "Esc") {
        hideFloatingCompositeTip();
      }
    });

    button.append(label, help);

    button.addEventListener("click", () => {
      applyCompositeModeVisibility(mode.sections, mode.key);
    });

    return button;
  }

  function initCompositeModeButtons() {
    const controls = document.getElementById("constructorControls");
    const itemsRoot = document.getElementById(CONSTRUCTOR_ITEMS_ID);
    if (!controls || !itemsRoot) return;

    ensureCompositeStyles();

    let actions = document.getElementById(COMPOSITE_ACTIONS_ID);
    if (!actions) {
      actions = document.createElement("div");
      actions.id = COMPOSITE_ACTIONS_ID;
      actions.className = "constructor-composite-actions";
      controls.insertBefore(actions, itemsRoot);
    }

    if (actions.dataset.bound === "true") return;
    COMPOSITE_MODES.forEach((mode) => {
      actions.appendChild(createCompositeModeButton(mode));
    });
    actions.dataset.bound = "true";
  }

  function createItem(sectionId, label, checked) {
    const item = document.createElement("label");
    item.className = "constructor-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.sectionId = sectionId;
    checkbox.checked = checked;

    const text = document.createElement("span");
    text.textContent = label;

    checkbox.addEventListener("change", () => {
      applySectionVisibility(sectionId, checkbox.checked);
      syncMasterToggle();
      setActiveCompositeMode("");
    });

    item.append(text, checkbox);
    return item;
  }

  function renderConstructorItems() {
    const itemsRoot = document.getElementById(CONSTRUCTOR_ITEMS_ID);
    if (!itemsRoot) return;

    const sections = getSections();
    const fragment = document.createDocumentFragment();

    sections.forEach((section) => {
      const sectionId = ensureSectionId(section);
      const stored = visibilityState.get(sectionId);
      const isVisible = stored !== undefined ? stored : !section.classList.contains(HIDDEN_CLASS);

      applySectionVisibility(sectionId, isVisible, false);
      fragment.appendChild(createItem(sectionId, normalizeLabel(section), isVisible));
    });

    itemsRoot.replaceChildren(fragment);
    syncMasterToggle();
    persistVisibilityState();
    setActiveCompositeMode(activeCompositeMode);
  }

  function initMasterToggle() {
    const master = document.getElementById(MASTER_TOGGLE_ID);
    if (!master || master.dataset.bound === "true") return;

    master.addEventListener("change", () => {
      const itemsRoot = document.getElementById(CONSTRUCTOR_ITEMS_ID);
      if (!itemsRoot) return;

      const shouldShow = master.checked;
      itemsRoot.querySelectorAll('input[type="checkbox"][data-section-id]').forEach((cb) => {
        cb.checked = shouldShow;
        applySectionVisibility(cb.dataset.sectionId, shouldShow, false);
      });

      master.indeterminate = false;
      persistVisibilityState();
      setActiveCompositeMode("");
    });

    master.dataset.bound = "true";
  }

  function setSidebarCollapsed(isCollapsed) {
    const panel = document.getElementById(CONSTRUCTOR_PANEL_ID);
    const toggleBtn = document.getElementById(TOGGLE_BUTTON_ID);

    document.body.classList.toggle(SIDEBAR_COLLAPSED_CLASS, isCollapsed);

    if (panel) {
      panel.classList.toggle("collapsed", isCollapsed);
    }

    if (toggleBtn) {
      const mobileMode = !isDesktopLayout();
      if (mobileMode) {
        toggleBtn.setAttribute("aria-expanded", document.body.classList.contains(OVERLAY_OPEN_CLASS) ? "true" : "false");
        toggleBtn.textContent = "Закрыть";
        toggleBtn.setAttribute("aria-label", "Закрыть конструктор");
        toggleBtn.title = "Закрыть конструктор";
      } else {
        const label = isCollapsed ? "Развернуть список конструктора" : "Свернуть список конструктора";
        toggleBtn.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
        toggleBtn.textContent = isCollapsed ? "▶" : "◀";
        toggleBtn.setAttribute("aria-label", label);
        toggleBtn.title = label;
      }
    }

    syncHeaderOffset();
  }

  function isDesktopLayout() {
    return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
  }

  function setConstructorOverlayOpen(isOpen) {
    const panel = document.getElementById(CONSTRUCTOR_PANEL_ID);
    const headerToggleBtn = document.getElementById(HEADER_PANEL_TOGGLE_ID);
    const bottomToggleBtn = document.getElementById(BOTTOM_PANEL_TOGGLE_ID);
    const closeToggleBtn = document.getElementById(TOGGLE_BUTTON_ID);
    const shouldOpen = Boolean(isOpen);

    document.body.classList.toggle(OVERLAY_OPEN_CLASS, shouldOpen);
    document.body.style.overflow = shouldOpen ? "hidden" : "";

    if (panel) {
      panel.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
    }

    if (headerToggleBtn) {
      const label = shouldOpen ? "Скрыть навигатор" : "Показать навигатор";
      headerToggleBtn.classList.toggle("is-open", shouldOpen);
      headerToggleBtn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      headerToggleBtn.setAttribute("aria-label", label);
      headerToggleBtn.title = label;

      const arrow = headerToggleBtn.querySelector(".header-constructor-arrow");
      if (arrow) {
        arrow.textContent = shouldOpen ? "◀" : "▶";
      }
    }

    if (bottomToggleBtn) {
      bottomToggleBtn.classList.toggle("is-open", shouldOpen);
      bottomToggleBtn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      bottomToggleBtn.setAttribute("aria-label", shouldOpen ? "Скрыть конструктор" : "Открыть конструктор");
    }

    if (closeToggleBtn && !isDesktopLayout()) {
      closeToggleBtn.textContent = "Закрыть";
      closeToggleBtn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      closeToggleBtn.setAttribute("aria-label", "Закрыть конструктор");
      closeToggleBtn.title = "Закрыть конструктор";
    }

    syncHeaderOffset();
  }

  function syncConstructorOverlayMode() {
    const currentlyOpen = document.body.classList.contains(OVERLAY_OPEN_CLASS);
    setConstructorOverlayOpen(overlayModeInitialized ? currentlyOpen : false);
    overlayModeInitialized = true;
  }

  function initHeaderPanelToggleButton() {
    const panel = document.getElementById(CONSTRUCTOR_PANEL_ID);
    const headerToggleBtn = document.getElementById(HEADER_PANEL_TOGGLE_ID);
    if (!panel || !headerToggleBtn || headerToggleBtn.dataset.bound === "true") return;

    headerToggleBtn.addEventListener("click", () => {
      const isOpen = document.body.classList.contains(OVERLAY_OPEN_CLASS);
      setConstructorOverlayOpen(!isOpen);
    });

    document.addEventListener("click", (event) => {
      if (!document.body.classList.contains(OVERLAY_OPEN_CLASS)) return;
      if (panel.contains(event.target)) return;
      if (headerToggleBtn.contains(event.target)) return;
      const bottomToggleBtn = document.getElementById(BOTTOM_PANEL_TOGGLE_ID);
      if (bottomToggleBtn && bottomToggleBtn.contains(event.target)) return;
      setConstructorOverlayOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (!document.body.classList.contains(OVERLAY_OPEN_CLASS)) return;
      setConstructorOverlayOpen(false);
    });

    headerToggleBtn.dataset.bound = "true";
  }

  function initConstructorToggleButton() {
    const panel = document.getElementById(CONSTRUCTOR_PANEL_ID);
    const toggleBtn = document.getElementById(TOGGLE_BUTTON_ID);
    // By default constructor list must start expanded.
    setSidebarCollapsed(false);

    if (!panel || !toggleBtn || toggleBtn.dataset.bound === "true") return;

    toggleBtn.addEventListener("click", () => {
      if (!isDesktopLayout()) {
        setConstructorOverlayOpen(false);
        return;
      }
      const isCollapsed = document.body.classList.contains(SIDEBAR_COLLAPSED_CLASS);
      setSidebarCollapsed(!isCollapsed);
    });

    toggleBtn.dataset.bound = "true";
  }

  function initBottomPanelToggleButton() {
    const panel = document.getElementById(CONSTRUCTOR_PANEL_ID);
    const bottomToggleBtn = document.getElementById(BOTTOM_PANEL_TOGGLE_ID);
    if (!panel || !bottomToggleBtn || bottomToggleBtn.dataset.bound === "true") return;

    bottomToggleBtn.addEventListener("click", () => {
      const isOpen = document.body.classList.contains(OVERLAY_OPEN_CLASS);
      setConstructorOverlayOpen(!isOpen);
    });

    document.addEventListener("click", (event) => {
      if (!document.body.classList.contains(OVERLAY_OPEN_CLASS)) return;
      if (panel.contains(event.target)) return;
      if (bottomToggleBtn.contains(event.target)) return;
      const headerToggleBtn = document.getElementById(HEADER_PANEL_TOGGLE_ID);
      if (headerToggleBtn && headerToggleBtn.contains(event.target)) return;
      setConstructorOverlayOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (!document.body.classList.contains(OVERLAY_OPEN_CLASS)) return;
      setConstructorOverlayOpen(false);
    });

    bottomToggleBtn.dataset.bound = "true";
  }

  function syncHeaderOffset() {
    const header = document.querySelector(".app-header");
    if (!header) return;

    const height = Math.ceil(header.getBoundingClientRect().height);
    const safeHeight = Number.isFinite(height) && height > 0 ? height : 86;
    const offset = safeHeight + 16;
    document.documentElement.style.setProperty("--topbar-height", `${safeHeight}px`);
    document.documentElement.style.setProperty("--app-header-offset", `${offset}px`);
  }

  function initSectionObserver() {
    const menuPanel = getMenuPanel();
    if (!menuPanel || menuPanel.dataset.constructorObserved === "true") return;

    let pending = false;
    const observer = new MutationObserver(() => {
      if (pending) return;
      pending = true;
      window.setTimeout(() => {
        pending = false;
        renderConstructorItems();
      }, 50);
    });

    observer.observe(menuPanel, { childList: true });
    menuPanel.dataset.constructorObserved = "true";
  }

  function init() {
    loadPersistedVisibility();
    initMasterToggle();
    initCompositeModeButtons();
    bindFloatingTipLifecycle();
    initConstructorToggleButton();
    initHeaderPanelToggleButton();
    initBottomPanelToggleButton();
    renderConstructorItems();
    syncConstructorOverlayMode();
    syncHeaderOffset();
    initSectionObserver();

    window.addEventListener("resize", () => {
      syncConstructorOverlayMode();
      syncHeaderOffset();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
