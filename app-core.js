(function () {
  const MODE_KEY = "ujala-portfolio-mode";

  function sanitizeCopy(value) {
    const replacements = [
      ["â€™", "'"],
      ["â€œ", '"'],
      ["â€", '"'],
      ["â€“", "-"],
      ["â€”", "-"],
      ["â€¦", "..."],
      ["â€¢", "-"],
      ["â†’", "->"],
      ["Â", ""],
    ];

    if (Array.isArray(value)) {
      return value.map((item) => sanitizeCopy(item));
    }

    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeCopy(item)]));
    }

    if (typeof value === "string") {
      return replacements.reduce((result, [from, to]) => result.split(from).join(to), value);
    }

    return value;
  }

  let data = sanitizeCopy(window.UJOS_DATA || {});

  function readStoredMode() {
    try {
      const mode = window.localStorage.getItem(MODE_KEY);
      return data.modes && data.modes[mode] ? mode : "recruiter";
    } catch {
      return "recruiter";
    }
  }

  const state = {
    mode: readStoredMode(),
    filter: "all",
    paletteOpen: false,
    guidePrompt: null,
    brainHistory: [],
    brainPending: false,
    compareIds: [],
  };

  const CURSOR_INTERACTIVE_SELECTOR = [
    "a",
    "button",
    "input",
    "textarea",
    "select",
    "label",
    "summary",
    "[role='button']",
    "[contenteditable='true']",
  ].join(", ");

  const cursorState = {
    x: 0,
    y: 0,
    renderX: 0,
    renderY: 0,
    visible: false,
    rafId: 0,
  };

  function storeMode(mode) {
    try {
      window.localStorage.setItem(MODE_KEY, mode);
    } catch {
      // Ignore storage failures.
    }
  }

  function applyMode() {
    document.body.dataset.mode = state.mode;
  }

  function syncCurrentNav() {
    const currentPage = document.body.dataset.page;
    document.querySelectorAll("[data-nav]").forEach((link) => {
      const isCurrent = link.dataset.nav === currentPage;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function getModeConfig() {
    return data.modes[state.mode] || data.modes.recruiter;
  }

  function getProjectsForMode() {
    const mode = getModeConfig();
    const order = new Map((mode.projectOrder || []).map((id, index) => [id, index]));
    return [...(data.projects || [])].sort((left, right) => {
      const leftIndex = order.has(left.id) ? order.get(left.id) : 999;
      const rightIndex = order.has(right.id) ? order.get(right.id) : 999;
      return leftIndex - rightIndex;
    });
  }

  function setData(nextData) {
    data = sanitizeCopy(nextData);
  }

  function getData() {
    return data;
  }

  function mergeRuntimeData(runtimeData) {
    if (!runtimeData || typeof runtimeData !== "object") {
      return;
    }

    setData({
      ...data,
      ...(runtimeData.overrides || {}),
      runtime: {
        ...(data.runtime || {}),
        ...(runtimeData.sync ? { sync: runtimeData.sync } : {}),
        ...(runtimeData.brain ? { brain: runtimeData.brain } : {}),
        ...(runtimeData.githubActivity ? { githubActivity: runtimeData.githubActivity } : {}),
      },
      ...(runtimeData.learningLog ? { learningLog: runtimeData.learningLog } : {}),
      ...(runtimeData.ideaInbox ? { ideaInbox: runtimeData.ideaInbox } : {}),
      ...(runtimeData.roadmap ? { roadmap: runtimeData.roadmap } : {}),
      ...(runtimeData.lab ? { lab: { ...(data.lab || {}), ...runtimeData.lab } } : {}),
    });
  }

  async function loadRuntimeData() {
    try {
      const response = await window.fetch("portfolio-runtime.json", { cache: "no-store" });
      if (!response.ok) {
        return;
      }

      mergeRuntimeData(sanitizeCopy(await response.json()));
      window.PortfolioApp.renderAll();
      initRevealObserver();
      initSurfaceSpotlights();
      updateViewportUi();
    } catch {
      // Runtime data is optional.
    }
  }

  function injectChrome() {
    if (!document.querySelector(".progress-bar")) {
      const bar = document.createElement("div");
      bar.className = "progress-bar";
      bar.innerHTML = `<div class="progress-bar__inner" id="progress-bar-inner"></div>`;
      document.body.appendChild(bar);
    }

    if (!document.querySelector(".page-curtain")) {
      const curtain = document.createElement("div");
      curtain.className = "page-curtain is-active";
      curtain.id = "page-curtain";
      document.body.appendChild(curtain);
    }

    if (!document.querySelector(".command-palette")) {
      const palette = document.createElement("div");
      palette.className = "command-palette";
      palette.id = "command-palette";
      palette.hidden = true;
      palette.setAttribute("aria-hidden", "true");
      palette.innerHTML = `
        <div class="command-palette__backdrop" data-command-close></div>
        <div class="command-palette__panel">
          <button class="modal-close" type="button" data-command-close aria-label="Close navigator">x</button>
          <p class="eyebrow">Navigator</p>
          <h2>Jump anywhere fast.</h2>
          <input id="command-input" class="command-input" type="text" placeholder="Search pages, projects, links, and modes.">
          <div class="command-list" id="command-list"></div>
        </div>
      `;
      document.body.appendChild(palette);
    }

    if (!document.querySelector(".project-modal")) {
      const modal = document.createElement("div");
      modal.className = "project-modal";
      modal.id = "project-modal";
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML = `
        <div class="project-modal__backdrop" data-modal-close></div>
        <div class="project-modal__card" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
          <button class="modal-close" type="button" data-modal-close aria-label="Close case study">x</button>
          <div id="project-modal-body"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    if (!document.querySelector(".floating-dock")) {
      const dock = document.createElement("div");
      dock.className = "floating-dock";
      dock.innerHTML = `
        <button class="dock-chip" type="button" id="dock-mode-chip" data-command-open>Recruiter Lens</button>
        <button class="dock-chip" type="button" data-command-open>Quick Routes</button>
        <button class="dock-chip" type="button" data-scroll-top>Back To Top</button>
      `;
      document.body.appendChild(dock);
    }

    if (!document.querySelector(".toast-stack")) {
      const stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.id = "toast-stack";
      document.body.appendChild(stack);
    }

    if (!document.querySelector(".theme-cursor")) {
      const cursor = document.createElement("div");
      cursor.className = "theme-cursor";
      cursor.id = "theme-cursor";
      cursor.hidden = true;
      cursor.setAttribute("aria-hidden", "true");
      cursor.innerHTML = `
        <div class="theme-cursor__aura"></div>
        <div class="theme-cursor__ring"></div>
        <div class="theme-cursor__arrow"></div>
        <div class="theme-cursor__spark"></div>
      `;
      document.body.appendChild(cursor);
    }
  }

  function initThemeCursor() {
    const cursor = document.getElementById("theme-cursor");
    if (!cursor) {
      return;
    }

    const isFinePointer =
      window.matchMedia("(hover: hover)").matches && window.matchMedia("(pointer: fine)").matches;

    document.body.classList.toggle("has-theme-cursor", isFinePointer);
    cursor.hidden = !isFinePointer;

    if (!isFinePointer) {
      cursor.classList.remove("is-visible", "is-interactive", "is-pressed");
      return;
    }

    const renderCursor = () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const smoothing = prefersReducedMotion ? 1 : 0.2;
      cursorState.renderX += (cursorState.x - cursorState.renderX) * smoothing;
      cursorState.renderY += (cursorState.y - cursorState.renderY) * smoothing;
      cursor.style.transform = `translate3d(${cursorState.renderX}px, ${cursorState.renderY}px, 0)`;

      if (
        Math.abs(cursorState.renderX - cursorState.x) > 0.1 ||
        Math.abs(cursorState.renderY - cursorState.y) > 0.1
      ) {
        cursorState.rafId = window.requestAnimationFrame(renderCursor);
      } else {
        cursorState.rafId = 0;
      }
    };

    const queueRender = () => {
      if (!cursorState.rafId) {
        cursorState.rafId = window.requestAnimationFrame(renderCursor);
      }
    };

    const setInteractiveState = (target) => {
      const interactiveTarget = target?.closest?.(CURSOR_INTERACTIVE_SELECTOR);
      cursor.classList.toggle("is-interactive", Boolean(interactiveTarget));
    };

    if (!cursor.dataset.bound) {
      document.addEventListener(
        "pointermove",
        (event) => {
          cursorState.x = event.clientX;
          cursorState.y = event.clientY;

          if (!cursorState.visible) {
            cursorState.visible = true;
            cursorState.renderX = event.clientX;
            cursorState.renderY = event.clientY;
            cursor.classList.add("is-visible");
          }

          setInteractiveState(event.target);
          queueRender();
        },
        { passive: true }
      );

      document.addEventListener("pointerdown", () => {
        cursor.classList.add("is-pressed");
      });

      document.addEventListener("pointerup", () => {
        cursor.classList.remove("is-pressed");
      });

      window.addEventListener("blur", () => {
        cursor.classList.remove("is-visible", "is-interactive", "is-pressed");
        cursorState.visible = false;
      });

      window.addEventListener("mouseout", (event) => {
        if (event.relatedTarget) {
          return;
        }
        cursor.classList.remove("is-visible", "is-interactive", "is-pressed");
        cursorState.visible = false;
      });

      cursor.dataset.bound = "true";
    }
  }

  function triggerCurtain() {
    document.getElementById("page-curtain")?.classList.add("is-active");
  }

  function releaseCurtain() {
    document.getElementById("page-curtain")?.classList.remove("is-active");
  }

  function openCommandPalette() {
    const palette = document.getElementById("command-palette");
    const input = document.getElementById("command-input");
    if (!palette || state.paletteOpen) {
      return;
    }

    palette.hidden = false;
    palette.classList.add("is-open");
    palette.setAttribute("aria-hidden", "false");
    document.body.classList.add("command-open");
    state.paletteOpen = true;
    window.PortfolioApp.renderCommandList("");

    if (input) {
      input.value = "";
      window.setTimeout(() => input.focus(), 10);
    }
  }

  function closeCommandPalette() {
    const palette = document.getElementById("command-palette");
    if (!palette) {
      return;
    }

    palette.classList.remove("is-open");
    palette.setAttribute("aria-hidden", "true");
    document.body.classList.remove("command-open");
    state.paletteOpen = false;

    window.setTimeout(() => {
      if (!state.paletteOpen) {
        palette.hidden = true;
      }
    }, 180);
  }

  function openProjectModal(projectId) {
    window.PortfolioApp.renderProjectModal(projectId);
  }

  function closeProjectModal() {
    const modal = document.getElementById("project-modal");
    if (!modal) {
      return;
    }

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    window.setTimeout(() => {
      if (!modal.classList.contains("is-open")) {
        modal.hidden = true;
      }
    }, 180);
  }

  function toast(message) {
    const stack = document.getElementById("toast-stack");
    if (!stack || !message) {
      return;
    }

    const item = document.createElement("div");
    item.className = "toast";
    item.textContent = message;
    stack.appendChild(item);
    window.setTimeout(() => item.remove(), 2200);
  }

  function copyText(value, label) {
    if (!navigator.clipboard?.writeText) {
      toast(value);
      return;
    }

    navigator.clipboard.writeText(value).then(
      () => toast(label),
      () => toast(value)
    );
  }

  function updateScrollProgress() {
    const inner = document.getElementById("progress-bar-inner");
    if (!inner) {
      return;
    }

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min((window.scrollY / maxScroll) * 100, 100) : 0;
    inner.style.width = `${progress}%`;
  }

  function updateViewportUi() {
    updateScrollProgress();
    document.querySelector(".masthead")?.classList.toggle("is-compact", window.scrollY > 18);
  }

  function initRevealObserver() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(document.querySelectorAll(".reveal"));

    if (reducedMotion) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((item) => {
      if (item.classList.contains("reveal--hero")) {
        item.classList.add("is-visible");
        return;
      }
      if (!item.classList.contains("is-visible")) {
        observer.observe(item);
      }
    });
  }

  function initSurfaceSpotlights() {
    const selector = [
      ".panel",
      ".case-card",
      ".route-card",
      ".resume-card",
      ".contact-card",
      ".system-card",
      ".principle-card",
      ".feed-card",
      ".roadmap-card",
      ".insight-card",
      ".timeline-card",
      ".stack-item",
      ".metric-card",
      ".highlight-card",
    ].join(", ");

    document.querySelectorAll(selector).forEach((item) => {
      if (item.dataset.spotlightBound) {
        return;
      }

      item.addEventListener("pointermove", (event) => {
        const rect = item.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        item.style.setProperty("--spot-x", `${x}%`);
        item.style.setProperty("--spot-y", `${y}%`);
      });

      item.addEventListener("pointerleave", () => {
        item.style.removeProperty("--spot-x");
        item.style.removeProperty("--spot-y");
      });

      item.dataset.spotlightBound = "true";
    });
  }

  function goTo(url) {
    triggerCurtain();
    window.setTimeout(() => {
      window.location.href = url;
    }, 120);
  }

  function openExternal(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function formatMultilineText(value) {
    return escapeHtml(value).replace(/\n/g, "<br>");
  }

  window.PortfolioApp = {
    MODE_KEY,
    state,
    sanitizeCopy,
    getData,
    setData,
    storeMode,
    applyMode,
    syncCurrentNav,
    getModeConfig,
    getProjectsForMode,
    mergeRuntimeData,
    loadRuntimeData,
    injectChrome,
    triggerCurtain,
    releaseCurtain,
    openCommandPalette,
    closeCommandPalette,
    openProjectModal,
    closeProjectModal,
    toast,
    copyText,
    updateViewportUi,
    initThemeCursor,
    initRevealObserver,
    initSurfaceSpotlights,
    goTo,
    openExternal,
    escapeHtml,
    formatMultilineText,
  };
})();
