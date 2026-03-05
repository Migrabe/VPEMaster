(() => {
  const MENU_PANEL_ID = "mainMenuPanel";
  const CONSTRUCTOR_PANEL_ID = "constructorPanel";
  const CONSTRUCTOR_ITEMS_ID = "constructorItems";
  const MASTER_TOGGLE_ID = "constructorToggleAll";
  const MOBILE_TOGGLE_ID = "constructorToggleBtn";
  const HIDDEN_CLASS = "menu-section-hidden";
  const MOBILE_QUERY = "(max-width: 768px)";

  const visibilityState = new Map();
  let autoIdCounter = 1;
  let lastMobileState = null;

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

  function applySectionVisibility(sectionId, isVisible) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    section.classList.toggle(HIDDEN_CLASS, !isVisible);
    section.setAttribute("aria-hidden", isVisible ? "false" : "true");
    visibilityState.set(sectionId, isVisible);
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
    });

    item.append(checkbox, text);
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

      applySectionVisibility(sectionId, isVisible);
      fragment.appendChild(createItem(sectionId, normalizeLabel(section), isVisible));
    });

    itemsRoot.replaceChildren(fragment);
    syncMasterToggle();
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
        applySectionVisibility(cb.dataset.sectionId, shouldShow);
      });

      master.indeterminate = false;
    });

    master.dataset.bound = "true";
  }

  function isMobileViewport() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function syncConstructorCollapse() {
    const panel = document.getElementById(CONSTRUCTOR_PANEL_ID);
    const toggleBtn = document.getElementById(MOBILE_TOGGLE_ID);
    if (!panel || !toggleBtn) return;

    const mobile = isMobileViewport();

    if (mobile) {
      if (lastMobileState !== true) {
        panel.classList.remove("is-expanded");
      }
    } else {
      panel.classList.add("is-expanded");
    }

    const expanded = panel.classList.contains("is-expanded");
    toggleBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
    toggleBtn.textContent = expanded ? "Скрыть" : "Показать";

    lastMobileState = mobile;
  }

  function initConstructorToggleButton() {
    const panel = document.getElementById(CONSTRUCTOR_PANEL_ID);
    const toggleBtn = document.getElementById(MOBILE_TOGGLE_ID);
    if (!panel || !toggleBtn || toggleBtn.dataset.bound === "true") return;

    toggleBtn.addEventListener("click", () => {
      panel.classList.toggle("is-expanded");
      const expanded = panel.classList.contains("is-expanded");
      toggleBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
      toggleBtn.textContent = expanded ? "Скрыть" : "Показать";
    });

    toggleBtn.dataset.bound = "true";
  }

  function syncHeaderOffset() {
    const header = document.querySelector(".app-header");
    if (!header) return;

    const height = Math.ceil(header.getBoundingClientRect().height);
    const offset = Number.isFinite(height) && height > 0 ? height + 16 : 132;
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
    initMasterToggle();
    initConstructorToggleButton();
    renderConstructorItems();
    syncConstructorCollapse();
    syncHeaderOffset();
    initSectionObserver();

    window.addEventListener("resize", () => {
      syncConstructorCollapse();
      syncHeaderOffset();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
