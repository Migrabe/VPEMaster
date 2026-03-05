(function () {
  const CONFIG_URL = window.UI_BUTTONS_URL || "/api/ui/buttons";

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

    const handler = resolveActionHandler(cfg.action.name);
    if (!handler) {
      console.warn("[action-buttons] handler not found:", cfg.action.name);
      return;
    }

    el.addEventListener("click", function (event) {
      event.preventDefault();
      const args = Array.isArray(cfg.action.args) ? cfg.action.args : [];
      handler.apply(null, args);
    });
  }

  async function initActionButtons() {
    let payload;
    try {
      const res = await fetch(CONFIG_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      payload = await res.json();
    } catch (err) {
      console.error("[action-buttons] failed to load config", err);
      return;
    }

    const buttonMap = payload && payload.buttons ? payload.buttons : {};
    document.querySelectorAll(".action-btn[data-action-id]").forEach((el) => {
      const id = el.dataset.actionId;
      const cfg = buttonMap[id];
      if (!cfg) return;
      applyConfig(el, cfg);
      bindAction(el, cfg);
    });
  }

  document.addEventListener("DOMContentLoaded", initActionButtons);
})();
