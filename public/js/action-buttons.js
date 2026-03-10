(function () {
  function isGitHubPagesHost() {
    return window.location.hostname.includes("github.io");
  }

  function getConfigBaseUrl() {
    const explicit = String(window.VPE_CONFIG_BASE_URL || "").trim();
    if (explicit) return explicit.replace(/\/+$/, "");
    if (isGitHubPagesHost()) {
      return window.location.pathname.includes("/mobile/") ? "../config" : "config";
    }
    return "/config";
  }

  const configBaseUrl = getConfigBaseUrl();
  const CONFIG_URLS = [
    window.UI_BUTTONS_URL,
    `${configBaseUrl}/ui-buttons.json`,
    isGitHubPagesHost() ? null : "/api/ui/buttons"
  ].filter(Boolean);

  const FALLBACK_BUTTONS = {
    "undo-step": { action: { type: "call", name: "undoLastStep" } },
    "header-reset": { action: { type: "call", name: "resetAll" } },
    "collapse-all": { action: { type: "call", name: "toggleAllSections" } }
  };

  const LOCAL_ICONS = {
    "undo-2": `<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 1 1 0 10h-1"/>`,
    "rotate-ccw": `<path d="M3 2v6h6"/><path d="M3 8a9 9 0 1 0 2.6-6.4L3 4"/>`,
    "chevrons-up-down": `<path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>`,
    "languages": `<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>`,
    "sparkles": `<path d="M12 3l1.8 3.7L18 8.5l-3 2.9.7 4.1L12 13.8l-3.7 1.7.7-4.1-3-2.9 4.2-1.8L12 3z"/><path d="m19 3 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/>`,
    "dice-5": `<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1"/><circle cx="16" cy="8" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/>`,
    "x": `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
    "copy": `<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`,
    "zap": `<path d="M13 2 3 14h7l-1 8 10-12h-7z"/>`,
    "save": `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>`,
    "trash-2": `<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>`
  };

  function renderLocalIcon(name, className) {
    const key = String(name || "").trim();
    const paths = LOCAL_ICONS[key];
    if (!paths) return "";
    const cls = className ? ` ${className}` : "";
    return `<svg class="vpe-svg-icon${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  }

  function resolveActionHandler(actionName) {
    const explicit = window.uiActionHandlers && window.uiActionHandlers[actionName];
    if (typeof explicit === "function") return explicit;

    const globalFn = window[actionName];
    if (typeof globalFn === "function") return globalFn;

    return null;
  }

  function applyConfig(el, cfg) {
    if (cfg.attrs && typeof cfg.attrs === "object") {
      Object.entries(cfg.attrs).forEach(([k, v]) => {
        el.setAttribute(k, String(v));
      });
    }

    if (cfg.styles && typeof cfg.styles === "object") {
      Object.assign(el.style, cfg.styles);
    }

    if (typeof cfg.title === "string") {
      el.title = cfg.title;
    }

    // Keep icon-only controls accessible for screen readers.
    if (!cfg.label && typeof cfg.title === "string" && cfg.title.trim()) {
      el.setAttribute("aria-label", cfg.title.trim());
    }

    el.replaceChildren();

    if (cfg.icon) {
      const iconMarkup = (window.VPEIcons && typeof window.VPEIcons.render === "function")
        ? window.VPEIcons.render(cfg.icon, "button-icon-svg")
        : renderLocalIcon(cfg.icon, "button-icon-svg");

      if (iconMarkup) {
        const iconNode = document.createElement("span");
        iconNode.className = "vpe-btn-icon";
        const parser = new DOMParser();
        const doc = parser.parseFromString(iconMarkup, 'image/svg+xml');
        const svgElement = doc.documentElement;
        iconNode.appendChild(svgElement);
        iconNode.setAttribute("aria-hidden", "true");
        el.appendChild(iconNode);
      }
    }

    if (cfg.label) {
      const labelNode = document.createElement("span");
      labelNode.className = "vpe-btn-label";
      labelNode.textContent = String(cfg.label);
      el.appendChild(labelNode);
    }
  }

  function bindAction(el, cfg) {
    if (!cfg.action || cfg.action.type !== "call" || !cfg.action.name) return;

    el.addEventListener("click", function (event) {
      event.preventDefault();
      const handler = resolveActionHandler(cfg.action.name);
      if (!handler) {
        console.warn("[action-buttons] handler not found:", cfg.action.name);
        return;
      }
      const args = Array.isArray(cfg.action.args) ? cfg.action.args : [];
      handler.apply(null, args);
    });
  }

  async function loadButtonMap() {
    for (const url of CONFIG_URLS) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const payload = await res.json();
        if (payload && payload.buttons) return payload.buttons;
      } catch (err) {
        console.warn("[action-buttons] config load failed from", url, err);
      }
    }

    // Keep critical header controls operational even when config endpoint is unavailable.
    return FALLBACK_BUTTONS;
  }

  async function initActionButtons() {
    const buttonMap = await loadButtonMap();
    document.querySelectorAll(".action-btn[data-action-id]").forEach((el) => {
      const id = el.dataset.actionId;
      const cfg = buttonMap[id] || FALLBACK_BUTTONS[id];
      if (!cfg) return;
      applyConfig(el, cfg);
      bindAction(el, cfg);
    });
  }

  document.addEventListener("DOMContentLoaded", initActionButtons);
})();
