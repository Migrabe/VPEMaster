(function () {
  const CONFIG_URLS = [
    window.UI_BUTTONS_URL,
    "/api/ui/buttons",
    "./config/ui-buttons.json"
  ].filter(Boolean);

  const FALLBACK_BUTTONS = {
    "header-reset": { action: { type: "call", name: "resetAll" } },
    "collapse-all": { action: { type: "call", name: "toggleAllSections" } }
  };

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

    const parts = [];
    if (cfg.icon) parts.push(cfg.icon);
    if (cfg.label) parts.push(cfg.label);
    el.textContent = parts.join(" ").trim();
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
