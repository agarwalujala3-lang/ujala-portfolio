(function () {
  const App = window.PortfolioApp;
  const FRESHNESS_HINTS = ["update", "latest", "recent", "sync", "github", "future", "next", "plan", "roadmap"];

  function asksForFreshRuntime(question) {
    const prompt = String(question || "").toLowerCase();
    return FRESHNESS_HINTS.some((token) => prompt.includes(token));
  }

  function buildClientBrainFallback(question) {
    const data = App.getData();
    const prompt = String(question || "").toLowerCase();
    const projects = App.getProjectsForMode();
    const primaryProject = projects[0] || null;
    const secondaryProject = projects[1] || null;
    const awsProject = projects.find((project) => (project.tags || []).includes("aws")) || primaryProject;
    const aiProject = projects.find((project) => (project.tags || []).includes("ai")) || secondaryProject || primaryProject;
    const runtime = data.runtime?.sync || {};
    const githubActivity = (data.runtime?.githubActivity || []).slice(0, 4);

    if (prompt.includes("flagship") || prompt.includes("open first") || prompt.includes("best project")) {
      return [
        `Start with ${primaryProject?.title || "the top project in this lens"}.`,
        "",
        primaryProject?.proof || "It is the clearest proof in the current view based on lens and priority.",
        primaryProject?.links?.live ? `Live: ${primaryProject.links.live}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    }

    if (prompt.includes("aws") || prompt.includes("cloud")) {
      return [
        `My strongest AWS-heavy work right now is ${awsProject?.title || "the current AWS project"}.`,
        "",
        awsProject?.proof || "It shows cloud architecture, backend flow, and deployment proof in one build.",
        awsProject?.stack?.length ? `Core stack: ${awsProject.stack.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    }

    if (prompt.includes("ai") || prompt.includes("codebase") || prompt.includes("diagram")) {
      return [
        `My strongest AI-focused build right now is ${aiProject?.title || "the current AI project"}.`,
        "",
        aiProject?.proof || "It combines deterministic project analysis with AI-assisted explanation.",
        aiProject?.stack?.length ? `Core stack: ${aiProject.stack.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    }

    if (prompt.includes("role fit") || prompt.includes("best role") || prompt.includes("fit")) {
      return [
        "The best fit for me right now is cloud, backend, or full-stack product work.",
        "",
        "My strongest signal comes from AWS systems, APIs, deployment, and turning technical workflows into polished experiences.",
      ].join("\n");
    }

    if (
      prompt.includes("learning") ||
      prompt.includes("next") ||
      prompt.includes("build") ||
      prompt.includes("future") ||
      prompt.includes("plan") ||
      prompt.includes("roadmap") ||
      asksForFreshRuntime(question)
    ) {
      const runtimeLabel = runtime.syncedAtLabel || "runtime sync in progress";
      return [
        `Latest runtime sync: ${runtimeLabel}.`,
        "",
        "Recent GitHub updates:",
        ...(githubActivity.length
          ? githubActivity.slice(0, 3).map((entry) => `- ${entry.name}: ${entry.note || "Updated recently"}`)
          : ["- GitHub activity is loading right now."]),
        "",
        "Current strongest focus from live projects:",
        ...projects
          .slice(0, 3)
          .map((project) => `- ${project.title}: ${project.proof || "Strong current portfolio signal."}`),
      ].join("\n");
    }

    if (prompt.includes("contact") || prompt.includes("email")) {
      return [
        `Email: ${data.profile.email}`,
        `Phone: ${data.profile.phone}`,
        `GitHub: ${data.profile.github}`,
        `LinkedIn: ${data.profile.linkedin}`,
      ].join("\n");
    }

    return [
      "I build cloud systems, AI tools, and product-minded full-stack experiences.",
      "",
      `- ${primaryProject?.title || "Primary project"}: ${primaryProject?.proof || "Strong implementation proof."}`,
      `- ${secondaryProject?.title || "Secondary project"}: ${secondaryProject?.proof || "Additional systems and product signal."}`,
    ].join("\n");
  }

  async function askPortfolioBrain(question) {
    const freshnessQuestion = asksForFreshRuntime(question);
    await App.refreshRuntimeFromGithub({ silent: true, force: freshnessQuestion });

    const data = App.getData();
    const runtimeBrain = (data.runtime && data.runtime.brain) || {};
    const statusText = document.getElementById("brain-status-text");
    const input = document.getElementById("brain-input");
    const runtimeContext = {
      sync: data.runtime?.sync || null,
      githubActivity: (data.runtime?.githubActivity || []).slice(0, 6).map((repo) => ({
        name: repo.name,
        language: repo.language,
        note: repo.note,
        pushedAt: repo.pushedAt,
      })),
      projects: App.getProjectsForMode().slice(0, 6).map((project) => ({
        id: project.id,
        title: project.title,
        status: project.status,
        kind: project.kind,
        proof: project.proof,
        tags: project.tags || [],
        links: project.links || {},
      })),
    };

    App.state.brainHistory.push({ role: "user", text: question });
    App.state.brainPending = true;
    App.renderBrainThread();

    if (input) {
      input.value = "";
    }

    if (freshnessQuestion) {
      App.state.brainPending = false;
      App.state.brainHistory.push({ role: "assistant", text: buildClientBrainFallback(question) });
      App.renderBrainThread();
      if (statusText) {
        statusText.textContent = "Answered from the latest runtime sync so this reflects current GitHub/project state.";
      }
      return;
    }

    if (!runtimeBrain.apiUrl) {
      App.state.brainPending = false;
      App.state.brainHistory.push({ role: "assistant", text: buildClientBrainFallback(question) });
      App.renderBrainThread();
      if (statusText) {
        statusText.textContent = "Live brain is offline right now, so I switched to the built-in portfolio guide.";
      }
      return;
    }

    try {
      const response = await window.fetch(runtimeBrain.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          mode: App.state.mode,
          page: document.body.dataset.page,
          history: App.state.brainHistory.slice(-6),
          runtimeContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Brain request failed with status ${response.status}`);
      }

      const payload = await response.json();
      App.state.brainHistory.push({ role: "assistant", text: payload.reply || buildClientBrainFallback(question) });

      if (statusText) {
        statusText.textContent =
          payload.source === "local-fallback"
            ? "Live brain is in fallback mode right now, so answers are coming from the portfolio knowledge layer."
            : `${runtimeBrain.label || "Live brain connected."} Tuned for ${App.getModeConfig().label.toLowerCase()} mode.`;
      }
    } catch {
      App.state.brainHistory.push({ role: "assistant", text: buildClientBrainFallback(question) });
      if (statusText) {
        statusText.textContent = "Live brain hit a connection problem, so I switched to the built-in portfolio guide.";
      }
    } finally {
      App.state.brainPending = false;
      App.renderBrainThread();
    }
  }

  function commandItems() {
    const data = App.getData();
    const projects = App.getProjectsForMode();
    const resumes = data.profile?.resumes || [];
    const repos = (data.runtime && data.runtime.githubActivity) || [];

    return [
      { key: "home", label: "Open Home", hint: "Go to the rebuilt landing page", action: () => App.goTo("index.html") },
      { key: "work", label: "Open Case Studies", hint: "See all project proof", action: () => App.goTo("work.html") },
      { key: "systems", label: "Open Systems", hint: "Read architecture routes", action: () => App.goTo("systems.html") },
      { key: "about", label: "Open Journey", hint: "See the growth path", action: () => App.goTo("about.html") },
      { key: "lab", label: "Open Lab", hint: "See live experiments and roadmap", action: () => App.goTo("playground.html") },
      { key: "contact", label: "Open Contact", hint: "Email, phone, resumes, and links", action: () => App.goTo("contact.html") },
      ...Object.entries(data.modes || {}).map(([key, mode]) => ({
        key: `mode-${key}`,
        label: `Switch to ${mode.label} Lens`,
        hint: mode.summary,
        action: () => {
          App.setMode(key);
          App.closeCommandPalette();
        },
      })),
      ...projects.map((project) => ({
        key: `project-${project.id}`,
        label: `Open ${project.title}`,
        hint: project.proof,
        action: () => {
          App.closeCommandPalette();
          App.openProjectModal(project.id);
        },
      })),
      ...projects
        .filter((project) => project.links?.live)
        .map((project) => ({
          key: `live-${project.id}`,
          label: `Open ${project.title} Live`,
          hint: "Launch the live version",
          action: () => App.openExternal(project.links.live),
        })),
      ...resumes.map((resume) => ({
        key: `resume-${resume.label}`,
        label: `Open ${resume.label}`,
        hint: resume.note,
        action: () => App.openExternal(resume.href),
      })),
      ...repos.slice(0, 4).map((repo) => ({
        key: `repo-${repo.name}`,
        label: `Open ${repo.name}`,
        hint: repo.note || "Recent GitHub activity",
        action: () => App.openExternal(repo.url),
      })),
      { key: "github", label: "Open GitHub Profile", hint: "See public code proof", action: () => App.openExternal(data.profile.github) },
      { key: "linkedin", label: "Open LinkedIn", hint: "See profile context", action: () => App.openExternal(data.profile.linkedin) },
      { key: "email", label: "Email Ujala", hint: "Open the default mail route", action: () => App.openExternal(`mailto:${data.profile.email}`) },
    ];
  }

  function renderCommandList(query) {
    const list = document.getElementById("command-list");
    if (!list) {
      return;
    }

    const normalized = String(query || "").trim().toLowerCase();
    const items = commandItems().filter((item) => {
      if (!normalized) {
        return true;
      }
      return `${item.label} ${item.hint}`.toLowerCase().includes(normalized);
    });

    if (!items.length) {
      list.innerHTML = `<div class="command-empty">No routes match that search yet.</div>`;
      return;
    }

    list.innerHTML = items
      .map(
        (item) => `
          <button class="command-item" type="button" data-command-action="${App.escapeHtml(item.key)}">
            <strong>${App.escapeHtml(item.label)}</strong>
            <span>${App.escapeHtml(item.hint)}</span>
          </button>
        `
      )
      .join("");
  }

  function runCommandAction(key) {
    const item = commandItems().find((entry) => entry.key === key);
    if (item) {
      item.action();
    }
  }

  function bindGlobalEvents() {
    document.addEventListener("click", (event) => {
      const modeButton = event.target.closest("[data-mode-set]");
      if (modeButton) {
        App.setMode(modeButton.dataset.modeSet);
        return;
      }

      const guideButton = event.target.closest("[data-guide-prompt]");
      if (guideButton) {
        App.state.guidePrompt = guideButton.dataset.guidePrompt;
        App.renderAll();
        return;
      }

      const promptButton = event.target.closest("[data-brain-prompt]");
      if (promptButton) {
        const input = document.getElementById("brain-input");
        if (input) {
          input.value = promptButton.dataset.brainPrompt || "";
          input.focus();
        }
        return;
      }

      const openProject = event.target.closest("[data-open-project]");
      if (openProject) {
        App.openProjectModal(openProject.dataset.openProject);
        return;
      }

      const compareButton = event.target.closest("[data-compare-project], [data-compare-select]");
      if (compareButton) {
        App.toggleCompare(compareButton.dataset.compareProject || compareButton.dataset.compareSelect);
        return;
      }

      const filterButton = event.target.closest("[data-filter]");
      if (filterButton) {
        App.state.filter = filterButton.dataset.filter;
        App.renderAll();
        return;
      }

      const copyButton = event.target.closest("[data-copy]");
      if (copyButton) {
        const data = App.getData();
        const type = copyButton.dataset.copy;
        const value = type === "phone" ? data.profile.phone : data.profile.email;
        App.copyText(value, `${type === "phone" ? "Phone number" : "Email"} copied.`);
        return;
      }

      if (event.target.closest("[data-command-open]")) {
        App.openCommandPalette();
        return;
      }

      if (event.target.closest("[data-command-close]")) {
        App.closeCommandPalette();
        return;
      }

      if (event.target.closest("[data-modal-close]")) {
        App.closeProjectModal();
        return;
      }

      const commandAction = event.target.closest("[data-command-action]");
      if (commandAction) {
        runCommandAction(commandAction.dataset.commandAction);
        return;
      }

      if (event.target.closest("[data-scroll-top]")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const anchor = event.target.closest("a[href]");
      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute("href") || "";
      const isInternalPage = !anchor.target && !/^https?:\/\//.test(href) && href.endsWith(".html");
      if (isInternalPage) {
        event.preventDefault();
        App.triggerCurtain();
        window.setTimeout(() => {
          window.location.href = href;
        }, 120);
      }
    });

    document.addEventListener("submit", async (event) => {
      if (event.target.id !== "brain-form") {
        return;
      }

      event.preventDefault();
      const input = document.getElementById("brain-input");
      const question = input ? input.value.trim() : "";
      if (!question || App.state.brainPending) {
        return;
      }
      await askPortfolioBrain(question);
    });

    document.addEventListener("keydown", (event) => {
      const activeTag = document.activeElement?.tagName || "";
      if ((event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey)) || (event.key === "/" && activeTag !== "INPUT" && activeTag !== "TEXTAREA")) {
        event.preventDefault();
        App.openCommandPalette();
      }

      if (event.key === "Escape") {
        App.closeCommandPalette();
        App.closeProjectModal();
      }
    });

    const commandInput = document.getElementById("command-input");
    if (commandInput) {
      commandInput.addEventListener("input", (event) => {
        renderCommandList(event.target.value);
      });
    }

    const clearButton = document.getElementById("brain-clear");
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        App.state.brainHistory = [];
        App.renderBrainThread();
      });
    }

    window.addEventListener("scroll", App.updateViewportUi, { passive: true });
    window.addEventListener("resize", App.updateViewportUi, { passive: true });
    window.addEventListener("focus", () => {
      App.refreshRuntimeFromGithub({ silent: true, force: true });
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        App.refreshRuntimeFromGithub({ silent: true, force: true });
      }
    });
  }

  function init() {
    App.injectChrome();
    App.applyMode();
    App.syncCurrentNav();
    App.renderAll();
    App.initFloatingDockObserver();
    bindGlobalEvents();
    App.initRevealObserver();
    App.initSurfaceSpotlights();
    App.updateViewportUi();
    window.setInterval(() => {
      App.refreshRuntimeFromGithub({ silent: true });
    }, 2 * 60 * 1000);

    window.requestAnimationFrame(() => {
      document.querySelectorAll(".reveal--hero").forEach((item) => item.classList.add("is-visible"));
      App.releaseCurtain();
    });

    App.loadRuntimeData();
  }

  App.askPortfolioBrain = askPortfolioBrain;
  App.commandItems = commandItems;
  App.renderCommandList = renderCommandList;
  App.runCommandAction = runCommandAction;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
