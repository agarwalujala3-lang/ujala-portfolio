(function () {
  const MODE_KEY = "ujala-portfolio-mode";
  const GITHUB_USER = "agarwalujala3-lang";
  const MANIFEST_PATH = "portfolio-branding.json";
  const RUNTIME_REFRESH_INTERVAL_MS = 10 * 60 * 1000;
  const THEME_KEYS = [
    "surface1",
    "surface2",
    "ring",
    "glow",
    "glowSoft",
    "accentStrong",
    "accentSoft",
    "badgeBg",
    "badgeBorder",
    "proofBg",
    "signalBg",
    "signalBorder",
    "iconBg",
  ];
  const LENS_KEYS = ["recruiter", "engineer", "founder", "friend"];

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
    githubRefreshPending: false,
    githubLastRefreshAt: 0,
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
    return [...(data.projects || [])]
      .filter((project) => project && project.enabled !== false)
      .sort((left, right) => {
        const leftLens = Number(left?.lensPriority?.[state.mode] || 0);
        const rightLens = Number(right?.lensPriority?.[state.mode] || 0);
        if (rightLens !== leftLens) {
          return rightLens - leftLens;
        }

        const leftPriority = Number(left?.priority || 0);
        const rightPriority = Number(right?.priority || 0);
        if (rightPriority !== leftPriority) {
          return rightPriority - leftPriority;
        }

        return String(left?.title || "").localeCompare(String(right?.title || ""));
    });
  }

  function setData(nextData) {
    data = sanitizeCopy(nextData);
  }

  function getData() {
    return data;
  }

  function mergeProjectRecord(baseProject, overrideProject) {
    return {
      ...baseProject,
      ...overrideProject,
      theme: {
        ...(baseProject?.theme || {}),
        ...(overrideProject?.theme || {}),
      },
      links: {
        ...(baseProject?.links || {}),
        ...(overrideProject?.links || {}),
      },
      lensPriority: {
        ...(baseProject?.lensPriority || {}),
        ...(overrideProject?.lensPriority || {}),
      },
      repoSync: {
        ...(baseProject?.repoSync || {}),
        ...(overrideProject?.repoSync || {}),
      },
    };
  }

  function combineProjects(baseProjects, runtimeProjects, syncedCatalog) {
    const seed = (Array.isArray(baseProjects) ? baseProjects : []).filter((project) => {
      if (!project || project.enabled === false) {
        return false;
      }

      if (syncedCatalog && project.repoSync?.manifestRequired) {
        return false;
      }

      return true;
    });
    const merged = seed.map((project) => ({ ...project }));
    const indexMap = new Map(merged.map((project, index) => [project.id, index]));

    for (const project of Array.isArray(runtimeProjects) ? runtimeProjects : []) {
      if (!project || !project.id || project.enabled === false) {
        continue;
      }

      if (indexMap.has(project.id)) {
        const index = indexMap.get(project.id);
        merged[index] = mergeProjectRecord(merged[index], project);
        continue;
      }

      indexMap.set(project.id, merged.length);
      merged.push(project);
    }

    return merged;
  }

  function mergeRuntimeData(runtimeData) {
    if (!runtimeData || typeof runtimeData !== "object") {
      return;
    }

    const runtimeOverrides = runtimeData.overrides || {};
    const syncedCatalog = runtimeData.sync?.status === "synced" && Array.isArray(runtimeData.projects);
    const mergedProjects = combineProjects(
      runtimeOverrides.projects || data.projects || [],
      runtimeData.projects,
      syncedCatalog
    );

    setData({
      ...data,
      ...runtimeOverrides,
      ...(Array.isArray(mergedProjects) ? { projects: mergedProjects } : {}),
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

  function formatRuntimeDate(iso) {
    try {
      return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  function cleanString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : "";
  }

  function cleanStringArray(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.map((item) => cleanString(item)).filter(Boolean);
  }

  function resolveManifestAsset(repo, candidate) {
    const value = cleanString(candidate);
    if (!value) {
      return "";
    }
    if (/^https?:\/\//i.test(value)) {
      return value;
    }
    const branch = cleanString(repo.default_branch) || "main";
    const path = value.replace(/^\/+/, "");
    return `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/${branch}/${path}`;
  }

  function normalizeManifestProject(repo, manifest) {
    if (!manifest || typeof manifest !== "object" || manifest.enabled === false) {
      return null;
    }

    const project = {
      enabled: true,
      id: cleanString(manifest.id),
      title: cleanString(manifest.title),
      kind: cleanString(manifest.kind),
      status: cleanString(manifest.status),
      priority: Number.isFinite(manifest.priority) ? manifest.priority : 0,
      featured: Boolean(manifest.featured),
      badge: cleanString(manifest.badge),
      icon: cleanString(manifest.icon),
      iconImage: resolveManifestAsset(repo, manifest.iconImage),
      lockupImage: resolveManifestAsset(repo, manifest.lockupImage),
      summary: cleanString(manifest.summary),
      proof: cleanString(manifest.proof),
      details: cleanStringArray(manifest.details),
      architecture: cleanStringArray(manifest.architecture),
      tradeoff: cleanString(manifest.tradeoff),
      tags: cleanStringArray(manifest.tags),
      stack: cleanStringArray(manifest.stack),
      links: {
        live: cleanString(manifest.links?.live) || cleanString(repo.homepage),
        repo: repo.html_url,
      },
      theme: {},
      lensPriority: {},
      repoSync: {
        repo: repo.name,
        manifestPath: MANIFEST_PATH,
        manifestRequired: true,
      },
    };

    for (const key of THEME_KEYS) {
      const value = cleanString(manifest.theme?.[key]);
      if (value) {
        project.theme[key] = value;
      }
    }

    for (const key of LENS_KEYS) {
      const value = manifest.lensPriority?.[key];
      if (Number.isFinite(value)) {
        project.lensPriority[key] = value;
      }
    }

    const requiredStrings = [
      project.id,
      project.title,
      project.kind,
      project.status,
      project.summary,
      project.proof,
      project.tradeoff,
      project.badge,
      project.icon,
    ];
    const hasRequiredArrays = project.tags.length && project.details.length && project.architecture.length;
    const hasRequiredLens = LENS_KEYS.every((key) => Number.isFinite(project.lensPriority[key]));
    const hasRequiredTheme = THEME_KEYS.every((key) => cleanString(project.theme[key]));

    if (requiredStrings.some((value) => !value) || !hasRequiredArrays || !hasRequiredLens || !hasRequiredTheme) {
      return null;
    }

    return project;
  }

  async function fetchGithubRuntimeSnapshot() {
    const response = await window.fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub runtime sync failed with status ${response.status}`);
    }

    const repos = (await response.json())
      .filter((repo) => !repo.fork)
      .sort((left, right) => new Date(right.pushed_at) - new Date(left.pushed_at));

    const githubActivity = repos.slice(0, 6).map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      language: repo.language || "Repo update",
      note: repo.description || `Updated ${formatRuntimeDate(repo.pushed_at)}`,
      pushedAt: repo.pushed_at,
      homepage: repo.homepage || "",
    }));

    const projects = (
      await Promise.all(
        repos.map(async (repo) => {
          const branch = cleanString(repo.default_branch) || "main";
          const manifestUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/${branch}/${MANIFEST_PATH}`;

          try {
            const manifestResponse = await window.fetch(manifestUrl, { cache: "no-store" });
            if (!manifestResponse.ok) {
              return null;
            }

            return normalizeManifestProject(repo, await manifestResponse.json());
          } catch {
            return null;
          }
        })
      )
    )
      .filter(Boolean)
      .sort((left, right) => {
        if (right.priority !== left.priority) {
          return right.priority - left.priority;
        }
        return left.title.localeCompare(right.title);
      });

    const nowIso = new Date().toISOString();
    return {
      sync: {
        status: "synced",
        syncedAt: nowIso,
        syncedAtLabel: formatRuntimeDate(nowIso),
        repoCount: repos.length,
        githubUser: GITHUB_USER,
      },
      githubActivity,
      projects,
    };
  }

  async function refreshRuntimeFromGithub(options = {}) {
    const { force = false, silent = false } = options;
    if (state.githubRefreshPending) {
      return false;
    }

    const now = Date.now();
    if (!force && state.githubLastRefreshAt && now - state.githubLastRefreshAt < RUNTIME_REFRESH_INTERVAL_MS) {
      return false;
    }

    state.githubRefreshPending = true;
    try {
      const snapshot = await fetchGithubRuntimeSnapshot();
      mergeRuntimeData(snapshot);
      state.githubLastRefreshAt = Date.now();
      window.PortfolioApp.renderAll();
      initRevealObserver();
      initSurfaceSpotlights();
      updateViewportUi();
      if (!silent) {
        toast("Runtime refreshed from GitHub.");
      }
      return true;
    } catch (error) {
      if (!silent) {
        console.warn(error.message);
      }
      return false;
    } finally {
      state.githubRefreshPending = false;
    }
  }

  function initFloatingDockObserver() {
    const dock = document.querySelector(".floating-dock");
    const footer = document.querySelector(".site-footer");
    if (!dock || !footer || dock.dataset.footerAware === "true") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        dock.classList.toggle("is-obscured", visible);
      },
      { threshold: 0.02, rootMargin: "0px 0px 140px 0px" }
    );

    observer.observe(footer);
    dock.dataset.footerAware = "true";
  }

  async function loadRuntimeData() {
    try {
      const response = await window.fetch("portfolio-runtime.json", { cache: "no-store" });
      if (!response.ok) {
        refreshRuntimeFromGithub({ silent: true });
        return;
      }

      mergeRuntimeData(sanitizeCopy(await response.json()));
      window.PortfolioApp.renderAll();
      initRevealObserver();
      initSurfaceSpotlights();
      updateViewportUi();
      initFloatingDockObserver();
      refreshRuntimeFromGithub({ silent: true });
    } catch {
      // Runtime data is optional.
      refreshRuntimeFromGithub({ silent: true });
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
    initRevealObserver,
    initSurfaceSpotlights,
    initFloatingDockObserver,
    refreshRuntimeFromGithub,
    goTo,
    openExternal,
    escapeHtml,
    formatMultilineText,
  };
})();
