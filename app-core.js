(function () {
  const MODE_KEY = "ujala-portfolio-mode";
  const INTRO_KEY = "ujala-portfolio-studio-intro-seen-v4";

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
    const activeProjects = [...(data.projects || [])].filter((project) => project && project.enabled !== false);
    const freshnessBoosts = buildProjectFreshnessBoosts(activeProjects);

    return activeProjects
      .filter((project) => project && project.enabled !== false)
      .sort((left, right) => {
        const leftBoost = freshnessBoosts.get(left?.id) || 0;
        const rightBoost = freshnessBoosts.get(right?.id) || 0;
        const leftLens = Number(left?.lensPriority?.[state.mode] || 0) + leftBoost;
        const rightLens = Number(right?.lensPriority?.[state.mode] || 0) + rightBoost;
        if (rightLens !== leftLens) {
          return rightLens - leftLens;
        }

        const leftPriority = Number(left?.priority || 0) + leftBoost;
        const rightPriority = Number(right?.priority || 0) + rightBoost;
        if (rightPriority !== leftPriority) {
          return rightPriority - leftPriority;
        }

        if (rightBoost !== leftBoost) {
          return rightBoost - leftBoost;
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

  function repoNameFromGithubUrl(value) {
    const candidate = cleanString(value);
    if (!candidate) {
      return "";
    }

    try {
      const url = new URL(candidate);
      if (url.hostname.toLowerCase() !== "github.com") {
        return "";
      }
      const parts = url.pathname.split("/").filter(Boolean);
      return parts.length >= 2 ? parts[1].replace(/\.git$/i, "") : "";
    } catch {
      return "";
    }
  }

  function buildProjectFreshnessBoosts(projects) {
    const activityByRepo = new Map(
      (Array.isArray(data.runtime?.githubActivity) ? data.runtime.githubActivity : [])
        .filter((entry) => cleanString(entry?.name) && cleanString(entry?.pushedAt))
        .map((entry) => [cleanString(entry.name), Date.parse(entry.pushedAt)])
        .filter(([, timestamp]) => Number.isFinite(timestamp))
    );

    const activityEntries = (Array.isArray(projects) ? projects : [])
      .map((project) => {
        const repoName = cleanString(project?.repoSync?.repo) || repoNameFromGithubUrl(project?.links?.repo);
        return {
          id: project?.id,
          timestamp: repoName ? activityByRepo.get(repoName) : undefined,
        };
      })
      .filter((entry) => entry.id && Number.isFinite(entry.timestamp));

    const newestTimestamp = activityEntries.reduce(
      (latest, entry) => Math.max(latest, entry.timestamp),
      0
    );

    return new Map(
      activityEntries.map((entry) => {
        const ageInDays = newestTimestamp > 0 ? Math.floor((newestTimestamp - entry.timestamp) / 86400000) : Number.POSITIVE_INFINITY;
        let boost = 0;
        if (ageInDays <= 14) {
          boost = 8;
        } else if (ageInDays <= 45) {
          boost = 4;
        } else if (ageInDays <= 120) {
          boost = 1;
        }
        return [entry.id, boost];
      })
    );
  }

  function projectVerifiedByGithub(project, verifiedRepoNames) {
    if (!verifiedRepoNames || verifiedRepoNames.size === 0) {
      return true;
    }

    const repoName = cleanString(project?.repoSync?.repo) || repoNameFromGithubUrl(project?.links?.repo);
    return repoName ? verifiedRepoNames.has(repoName) : true;
  }

  function combineProjects(baseProjects, runtimeProjects, syncedCatalog, verifiedRepoNames) {
    const seed = (Array.isArray(baseProjects) ? baseProjects : []).filter((project) => {
      if (!project || project.enabled === false) {
        return false;
      }

      if (syncedCatalog && !projectVerifiedByGithub(project, verifiedRepoNames)) {
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
    const nextGithubActivity = runtimeData.githubActivity || data.runtime?.githubActivity || [];
    const syncedCatalog = runtimeData.sync?.status === "synced" && Array.isArray(runtimeData.projects);
    const verifiedRepoNames = new Set(Array.isArray(runtimeData.sync?.verifiedRepoNames) ? runtimeData.sync.verifiedRepoNames : []);
    const mergedProjects = versionProjectAssets(
      combineProjects(
        runtimeOverrides.projects || data.projects || [],
        runtimeData.projects,
        syncedCatalog,
        verifiedRepoNames
      ),
      nextGithubActivity
    );

    setData({
      ...data,
      ...runtimeOverrides,
      ...(runtimeOverrides.profile ? { profile: { ...(data.profile || {}), ...runtimeOverrides.profile } } : {}),
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

  function cleanString(value) {
    return typeof value === "string" && value.trim() ? value.trim() : "";
  }

  function withAssetVersion(url, version) {
    const assetUrl = cleanString(url);
    const assetVersion = cleanString(version);
    if (!assetUrl || !assetVersion) {
      return assetUrl;
    }

    try {
      const parsedUrl = new URL(assetUrl);
      parsedUrl.searchParams.set("v", assetVersion);
      return parsedUrl.toString();
    } catch {
      const joinChar = assetUrl.includes("?") ? "&" : "?";
      return `${assetUrl}${joinChar}v=${encodeURIComponent(assetVersion)}`;
    }
  }

  function versionProjectAssets(projects, githubActivity) {
    const versionByRepo = new Map(
      (Array.isArray(githubActivity) ? githubActivity : [])
        .filter((entry) => cleanString(entry?.name) && cleanString(entry?.pushedAt))
        .map((entry) => [cleanString(entry.name), cleanString(entry.pushedAt)])
    );

    return (Array.isArray(projects) ? projects : []).map((project) => {
      const repoName = cleanString(project?.repoSync?.repo);
      const version = versionByRepo.get(repoName);
      if (!version) {
        return project;
      }

      return {
        ...project,
        iconImage: withAssetVersion(project.iconImage, version),
        lockupImage: withAssetVersion(project.lockupImage, version),
      };
    });
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
        dock.dataset.footerVisible = visible ? "true" : "false";
        dock.classList.toggle("is-obscured", shouldObscureFloatingDock());
      },
      { threshold: 0, rootMargin: "0px 0px -48px 0px" }
    );

    observer.observe(footer);
    dock.dataset.footerAware = "true";
  }

  function shouldObscureFloatingDock() {
    const dock = document.querySelector(".floating-dock");
    const footer = document.querySelector(".site-footer");
    if (!dock || !footer) {
      return false;
    }

    const footerRect = footer.getBoundingClientRect();
    const dockRect = dock.getBoundingClientRect();
    const footerInViewport = footerRect.top < window.innerHeight - 40 && footerRect.bottom > 0;
    const dockOverlapsFooter =
      dockRect.left < footerRect.right &&
      dockRect.right > footerRect.left &&
      dockRect.top < footerRect.bottom &&
      dockRect.bottom > footerRect.top;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const nearPageBottom = maxScroll > 0 && window.scrollY / maxScroll > 0.78;

    return footerInViewport || dockOverlapsFooter || nearPageBottom;
  }

  async function loadRuntimeData() {
    try {
      if (window.UJOS_RUNTIME_DATA && typeof window.UJOS_RUNTIME_DATA === "object") {
        mergeRuntimeData(sanitizeCopy(window.UJOS_RUNTIME_DATA));
        window.PortfolioApp.renderAll();
        initRevealObserver();
        initHeroDepthScene();
        initSurfaceSpotlights();
        updateViewportUi();
        initFloatingDockObserver();
        return;
      }

      const response = await window.fetch("portfolio-runtime.json", { cache: "no-store" });
      if (!response.ok) {
        return;
      }

      mergeRuntimeData(sanitizeCopy(await response.json()));
      window.PortfolioApp.renderAll();
      initRevealObserver();
      initHeroDepthScene();
      initSurfaceSpotlights();
      updateViewportUi();
      initFloatingDockObserver();
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
      curtain.innerHTML = `
        <div class="page-curtain__grid" aria-hidden="true"></div>
        <div class="page-curtain__core">
          <span class="page-curtain__signal"></span>
          <strong id="page-curtain-label">Loading page</strong>
          <span>The portfolio is loading the next surface.</span>
        </div>
      `;
      document.body.appendChild(curtain);
    }

    if (!document.querySelector(".intro-portal")) {
      const intro = document.createElement("div");
      intro.className = "intro-portal";
      intro.id = "intro-portal";
      intro.setAttribute("aria-hidden", "true");
      intro.innerHTML = `
        <div class="intro-portal__surface" aria-hidden="true"></div>
        <div class="intro-portal__frame" aria-hidden="true">
          <span class="intro-portal__line intro-portal__line--top"></span>
          <span class="intro-portal__line intro-portal__line--right"></span>
          <span class="intro-portal__line intro-portal__line--bottom"></span>
          <span class="intro-portal__line intro-portal__line--left"></span>
          <span class="intro-portal__corner intro-portal__corner--tl"></span>
          <span class="intro-portal__corner intro-portal__corner--tr"></span>
          <span class="intro-portal__corner intro-portal__corner--bl"></span>
          <span class="intro-portal__corner intro-portal__corner--br"></span>
        </div>
        <div class="intro-portal__brand">
          <span class="intro-portal__status">Portfolio Studio</span>
          <h2>Ujala Agarwal</h2>
          <p>Cloud systems, AI products, and full-stack engineering with visible proof.</p>
        </div>
        <div class="intro-portal__proof" aria-hidden="true">
          <span>Cloud Systems</span>
          <span>AI Products</span>
          <span>Full-Stack Build</span>
        </div>
        <div class="intro-portal__handoff">
          <span>Entering Portfolio</span>
          <strong>Built with proof, polish, and production instinct.</strong>
        </div>
        <span class="intro-portal__skip-hint">Press Esc to skip</span>
      `;
      document.body.appendChild(intro);
    }

    if (!document.querySelector(".cursor-mark")) {
      const cursor = document.createElement("div");
      cursor.className = "cursor-mark";
      cursor.setAttribute("aria-hidden", "true");
      cursor.innerHTML = `
        <span class="cursor-mark__axis cursor-mark__axis--x"></span>
        <span class="cursor-mark__axis cursor-mark__axis--y"></span>
        <span class="cursor-mark__corner cursor-mark__corner--tl"></span>
        <span class="cursor-mark__corner cursor-mark__corner--tr"></span>
        <span class="cursor-mark__corner cursor-mark__corner--bl"></span>
        <span class="cursor-mark__corner cursor-mark__corner--br"></span>
        <span class="cursor-mark__point"></span>
      `;
      document.body.appendChild(cursor);
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
          <button class="modal-close" type="button" data-command-close aria-label="Close quick find">x</button>
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
          <button class="modal-close" type="button" data-modal-close aria-label="Close project">x</button>
          <div id="project-modal-body"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    if (!document.querySelector(".floating-dock")) {
      const dock = document.createElement("div");
      dock.className = "floating-dock";
      dock.innerHTML = `
        <button class="dock-chip" type="button" id="dock-mode-chip" data-command-open>Open to Work</button>
        <button class="dock-chip" type="button" data-command-open>Quick Find</button>
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

  function triggerCurtain(label = "Loading page") {
    const labelNode = document.getElementById("page-curtain-label");
    if (labelNode) {
      labelNode.textContent = label;
    }
    document.getElementById("page-curtain")?.classList.add("is-active");
  }

  function releaseCurtain() {
    document.getElementById("page-curtain")?.classList.remove("is-active");
  }

  function initIntroSequence() {
    const intro = document.getElementById("intro-portal");
    if (intro) {
      intro.hidden = true;
      intro.classList.remove("is-active", "is-dismissing", "is-skipped", "is-forced", "intro-stage-brand", "intro-stage-proof", "intro-stage-handoff");
    }
    document.body.classList.remove("intro-lock");
  }

  function initPointerExperience() {
    if (document.body.dataset.pointerExperience === "true") {
      return;
    }

    document.body.dataset.pointerExperience = "true";
    const cursor = document.querySelector(".cursor-mark");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (!finePointer.matches) {
      cursor?.setAttribute("hidden", "");
      return;
    }

    if (cursor) {
      cursor.removeAttribute("hidden");
      let cursorX = window.innerWidth / 2;
      let cursorY = window.innerHeight / 2;
      let targetX = cursorX;
      let targetY = cursorY;
      let cursorActive = false;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const revealCursor = () => {
        if (document.body.classList.contains("intro-lock")) {
          cursor.style.removeProperty("opacity");
          return;
        }
        cursor.style.setProperty("opacity", "1", "important");
      };

      const setCursorTarget = (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        cursorActive = true;
        document.body.dataset.cursorReady = "true";
        revealCursor();
        document.body.style.setProperty("--cursor-x", `${event.clientX}px`);
        document.body.style.setProperty("--cursor-y", `${event.clientY}px`);

        const interactive = event.target.closest("a, button, input, textarea, select, [data-command-action], [data-open-project], [data-copy], [role='button']");
        cursor.classList.toggle("is-interactive", Boolean(interactive));
      };

      const renderCursor = () => {
        const speed = reducedMotion ? 1 : 0.24;
        cursorX += (targetX - cursorX) * speed;
        cursorY += (targetY - cursorY) * speed;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        if (cursorActive) {
          cursor.classList.add("is-live");
          revealCursor();
        }
        window.requestAnimationFrame(renderCursor);
      };

      document.addEventListener("pointermove", (event) => {
        setCursorTarget(event);
      }, { passive: true });

      document.addEventListener("pointerover", (event) => {
        const interactive = event.target.closest("a, button, input, textarea, select, [data-command-action], [data-open-project], [data-copy], [role='button']");
        cursor.classList.toggle("is-interactive", Boolean(interactive));
      }, { passive: true });

      document.addEventListener("pointerdown", (event) => {
        setCursorTarget(event);
        cursor.classList.add("is-pressed");
      }, { passive: true });

      document.addEventListener("pointerup", () => {
        cursor.classList.remove("is-pressed");
      }, { passive: true });

      document.addEventListener("pointerleave", () => {
        cursor.classList.remove("is-live", "is-interactive", "is-pressed");
        cursor.style.removeProperty("opacity");
        document.body.dataset.cursorReady = "false";
      }, { passive: true });

      window.requestAnimationFrame(renderCursor);
    }

    document.addEventListener("click", (event) => {
      const interactive = event.target.closest("a, button, [data-copy], [data-open-project], [data-command-action]");
      if (!interactive) {
        return;
      }

      const pulse = document.createElement("span");
      pulse.className = "click-pulse";
      pulse.style.left = `${event.clientX}px`;
      pulse.style.top = `${event.clientY}px`;
      document.body.appendChild(pulse);
      window.setTimeout(() => pulse.remove(), 620);
    }, { passive: true });
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
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(window.scrollY / maxScroll, 1);
    document.body.style.setProperty("--scroll-progress", progress.toFixed(3));
    document.body.dataset.scrollDepth = progress > 0.66 ? "deep" : progress > 0.28 ? "mid" : "top";
    updateScrollProgress();
    document.querySelector(".masthead")?.classList.toggle("is-compact", window.scrollY > 18);
    document.querySelector(".floating-dock")?.classList.toggle("is-obscured", shouldObscureFloatingDock());
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

  function initHeroDepthScene() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll("[data-depth-scene]").forEach((scene) => {
      if (scene.dataset.depthBound) {
        return;
      }

      const stage = scene.closest(".hero-stage") || scene;
      if (!stage) {
        return;
      }

      if (reducedMotion) {
        stage.style.setProperty("--depth-rotate-x", "0deg");
        stage.style.setProperty("--depth-rotate-y", "0deg");
        stage.style.setProperty("--depth-shift-x", "0px");
        stage.style.setProperty("--depth-shift-y", "0px");
        stage.style.setProperty("--depth-float", "0px");
        stage.style.setProperty("--depth-float-soft", "0px");
        stage.style.setProperty("--depth-float-tiny", "0px");
        stage.style.setProperty("--depth-twist", "0deg");
        stage.style.setProperty("--depth-spin", "0deg");
        stage.style.setProperty("--depth-spin-reverse", "0deg");
        scene.dataset.depthBound = "true";
        return;
      }

      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      const phase = Math.random() * Math.PI * 2;

      const tick = (time = 0) => {
        if (!stage.isConnected) {
          return;
        }

        const driftX = Math.sin(time / 2200 + phase) * 0.16;
        const driftY = Math.cos(time / 2800 + phase) * 0.1;
        const float = Math.sin(time / 1800 + phase) * 18;
        const floatSoft = Math.sin(time / 2000 + phase) * 9;
        const floatTiny = Math.cos(time / 2300 + phase) * 4;
        const twist = Math.sin(time / 2600 + phase) * 2.6;

        currentX += (targetX + driftX - currentX) * 0.08;
        currentY += (targetY + driftY - currentY) * 0.08;

        stage.style.setProperty("--depth-rotate-x", `${(-currentY * 11).toFixed(2)}deg`);
        stage.style.setProperty("--depth-rotate-y", `${(currentX * 13).toFixed(2)}deg`);
        stage.style.setProperty("--depth-shift-x", `${(currentX * 28).toFixed(2)}px`);
        stage.style.setProperty("--depth-shift-y", `${(currentY * 22).toFixed(2)}px`);
        stage.style.setProperty("--depth-glow-x", `${(50 + currentX * 16).toFixed(2)}%`);
        stage.style.setProperty("--depth-glow-y", `${(34 + currentY * 10).toFixed(2)}%`);
        stage.style.setProperty("--depth-float", `${float.toFixed(2)}px`);
        stage.style.setProperty("--depth-float-soft", `${floatSoft.toFixed(2)}px`);
        stage.style.setProperty("--depth-float-tiny", `${floatTiny.toFixed(2)}px`);
        stage.style.setProperty("--depth-twist", `${twist.toFixed(2)}deg`);
        stage.style.setProperty("--depth-spin", `${((time / 90) % 360).toFixed(2)}deg`);
        stage.style.setProperty("--depth-spin-reverse", `${((360 - (time / 110) % 360)).toFixed(2)}deg`);

        window.requestAnimationFrame(tick);
      };

      const updateTarget = (event) => {
        const rect = stage.getBoundingClientRect();
        targetX = (event.clientX - rect.left) / rect.width - 0.5;
        targetY = (event.clientY - rect.top) / rect.height - 0.5;
      };

      stage.addEventListener("pointermove", updateTarget);
      stage.addEventListener("pointerdown", updateTarget);
      stage.addEventListener("pointerleave", () => {
        targetX = 0;
        targetY = 0;
      });

      scene.dataset.depthBound = "true";
      window.requestAnimationFrame(tick);
    });
  }

  function initSurfaceSpotlights() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      ".hero-scene-card__inner",
      ".hero-stage__proof",
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
        if (!reducedMotion) {
          const tiltX = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
          const tiltY = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
          item.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
          item.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
        }
      });

      item.addEventListener("pointerleave", () => {
        item.style.removeProperty("--spot-x");
        item.style.removeProperty("--spot-y");
        item.style.removeProperty("--tilt-x");
        item.style.removeProperty("--tilt-y");
      });

      item.dataset.spotlightBound = "true";
    });
  }

  const ROUTE_PAGES = new Set([
    "index.html",
    "work.html",
    "systems.html",
    "about.html",
    "playground.html",
    "contact.html",
  ]);

  function routeFileFromHref(value) {
    const raw = cleanString(value).split("#")[0].split("?")[0];
    const directFile = raw.split("/").pop();
    if (ROUTE_PAGES.has(directFile)) {
      return directFile;
    }

    try {
      const parsed = new URL(value, window.location.href);
      const query = parsed.search ? parsed.search.slice(1) : "";
      const queryFile = query.split("/").pop();
      if (ROUTE_PAGES.has(queryFile)) {
        return queryFile;
      }

      const pathFile = parsed.pathname.split("/").pop();
      return ROUTE_PAGES.has(pathFile) ? pathFile : "";
    } catch {
      return "";
    }
  }

  function routeHashFromHref(value) {
    try {
      return new URL(value, window.location.href).hash || "";
    } catch {
      const hashIndex = cleanString(value).indexOf("#");
      return hashIndex >= 0 ? cleanString(value).slice(hashIndex) : "";
    }
  }


  function resolveRouteHref(value) {
    const routeFile = routeFileFromHref(value);
    if (!routeFile) {
      return value;
    }


    return `${routeFile}${routeHashFromHref(value)}`;
  }

  function isRouteHref(value) {
    return Boolean(routeFileFromHref(value));
  }

  function goTo(url) {
    triggerCurtain("Opening page");
    window.setTimeout(() => {
      window.location.href = resolveRouteHref(url);
    }, 280);
  }

  const TRUSTED_LINK_HOSTS = new Set([
    "github.com",
    "www.linkedin.com",
    "linkedin.com",
    "lumenstack-ai.onrender.com",
    "ujala-portfolio.onrender.com",
    "cdn.jsdelivr.net",
  ]);

  function safeHref(value, options = {}) {
    const { allowContact = false, allowRelative = true } = options;
    const raw = String(value || "").trim();

    if (!raw) {
      return "#";
    }

    if (allowRelative && !/^[a-z][a-z0-9+.-]*:/i.test(raw) && !raw.startsWith("//")) {
      return raw;
    }

    try {
      const url = new URL(raw);
      const host = url.hostname.toLowerCase();

      if (url.protocol === "https:" && TRUSTED_LINK_HOSTS.has(host)) {
        return url.href;
      }

      if (allowContact && (url.protocol === "mailto:" || url.protocol === "tel:")) {
        return raw;
      }
    } catch (_error) {
      return "#";
    }

    return "#";
  }

  function openExternal(url) {
    const normalizedUrl = safeHref(url, { allowContact: true, allowRelative: false });

    if (normalizedUrl === "#") {
      toast("Blocked unsafe external link.");
      return;
    }

    window.open(normalizedUrl, "_blank", "noopener,noreferrer");
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
    initHeroDepthScene,
    initSurfaceSpotlights,
    initFloatingDockObserver,
    initIntroSequence,
    initPointerExperience,
    goTo,
    resolveRouteHref,
    isRouteHref,
    openExternal,
    safeHref,
    escapeHtml,
    formatMultilineText,
  };
})();


