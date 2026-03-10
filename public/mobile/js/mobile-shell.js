(function () {
  const DESKTOP_COOKIE = "prefer-desktop=1; path=/; max-age=31536000; SameSite=Lax";
  const CLEAR_DESKTOP_COOKIE = "prefer-desktop=; path=/; max-age=0; SameSite=Lax";
  const DEFAULT_OPEN_SECTIONS = [
    "promptSection",
    "quickStyleSection",
    "aiModelSection",
    "descriptionSection",
    "jsonSection"
  ];

  function getDesktopTarget() {
    const url = new URL(window.location.href);
    url.searchParams.delete("view");
    const search = url.searchParams.toString();
    const searchString = search ? `?${search}` : "";
    return `../${searchString}${window.location.hash}`;
  }

  function preferDesktop() {
    localStorage.setItem("prefer-desktop", "1");
    document.cookie = DESKTOP_COOKIE;
    window.location.href = getDesktopTarget();
  }

  function ensureMobileMode() {
    localStorage.removeItem("prefer-desktop");
    document.cookie = CLEAR_DESKTOP_COOKIE;
  }

  function openPrioritySections() {
    DEFAULT_OPEN_SECTIONS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) section.classList.remove("collapsed");
    });
    if (typeof window.syncCollapseAllButtonLabel === "function") {
      window.syncCollapseAllButtonLabel();
    }
  }

  function bindBottomBar() {
    document.querySelectorAll("[data-mobile-nav-target]").forEach((button) => {
      button.addEventListener("click", () => {
        document.body.classList.remove("constructor-overlay-open");
        document.body.style.overflow = "";
        document.getElementById("bottomConstructorPanelBtn")?.setAttribute("aria-expanded", "false");
        const target = document.getElementById(button.dataset.mobileNavTarget);
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    document.querySelectorAll("[data-mobile-action='desktop']").forEach((button) => {
      button.addEventListener("click", preferDesktop);
    });
  }

  function bindConstructorCloseButton() {
    const closeButton = document.getElementById("constructorToggleBtn");
    if (!closeButton || closeButton.dataset.mobileBound === "true") return;

    const syncLabel = () => {
      closeButton.textContent = "Закрыть";
      closeButton.setAttribute("aria-label", "Закрыть конструктор");
      closeButton.setAttribute("title", "Закрыть конструктор");
    };

    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      document.body.classList.remove("constructor-overlay-open");
      document.body.style.overflow = "";
      document.getElementById("constructorPanel")?.setAttribute("aria-hidden", "true");
      document.getElementById("bottomConstructorPanelBtn")?.classList.remove("is-open");
      document.getElementById("bottomConstructorPanelBtn")?.setAttribute("aria-expanded", "false");
      syncLabel();
    });

    syncLabel();
    closeButton.dataset.mobileBound = "true";
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureMobileMode();
    openPrioritySections();
    bindBottomBar();
    bindConstructorCloseButton();
    registerServiceWorker();
    window.preferDesktop = preferDesktop;
    document.body.classList.add("mobile-vpe-shell-ready");
  });
})();
