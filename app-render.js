(function () {
  const App = window.PortfolioApp;

  function renderAll() {
    renderHeaderChip();
    renderFooter();
    renderDock();
    renderModeSwitch();
    renderHome();
    renderGuideSection();
    renderBrainSection();
    renderProjectsPage();
    renderSystemsPage();
    renderJourneyPage();
    renderLabPage();
    renderContactPage();
    App.renderCommandList?.("");
  }

  function renderHeaderChip() {
    const label = `${App.getModeConfig().label} Lens`;
    const headerChip = document.getElementById("header-mode-chip");
    const dockChip = document.getElementById("dock-mode-chip");

    if (headerChip) {
      headerChip.textContent = label;
    }

    if (dockChip) {
      dockChip.textContent = label;
    }
  }

  function renderDock() {
    const dockChip = document.getElementById("dock-mode-chip");
    if (dockChip) {
      dockChip.textContent = `${App.getModeConfig().label} Lens`;
    }
  }

  function renderFooter() {
    const shell = document.getElementById("footer-shell");
    if (!shell) {
      return;
    }

    const data = App.getData();
    const sync = (data.runtime && data.runtime.sync) || {};

    shell.innerHTML = `
      <div class="footer-grid">
        <div class="footer-brand">
          <strong>${App.escapeHtml(data.profile.name)}</strong>
          <p>${App.escapeHtml(data.profile.tagline)}</p>
        </div>
        <div class="footer-links">
          <a class="text-link" href="work.html">Case studies</a>
          <a class="text-link" href="systems.html">Systems</a>
          <a class="text-link" href="${App.escapeHtml(data.profile.github)}" target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <div class="footer-status">
          <span>Mode: ${App.escapeHtml(App.getModeConfig().label)}</span>
          <span>Runtime: ${App.escapeHtml(sync.status || "static")}</span>
          <span>${App.escapeHtml(sync.syncedAtLabel || "Using bundled portfolio data")}</span>
        </div>
      </div>
    `;
  }

  function renderModeSwitch() {
    const data = App.getData();
    const modeSwitch = document.getElementById("mode-switch");
    const summary = document.getElementById("mode-summary");
    const focus = document.getElementById("mode-focus");
    const kicker = document.getElementById("mode-kicker");
    const mode = App.getModeConfig();

    if (kicker) {
      kicker.textContent = mode.kicker;
    }

    if (summary) {
      summary.textContent = mode.summary;
    }

    if (focus) {
      focus.innerHTML = (mode.focus || [])
        .map((item) => `<span class="pill">${App.escapeHtml(item)}</span>`)
        .join("");
    }

    if (!modeSwitch) {
      return;
    }

    modeSwitch.innerHTML = Object.entries(data.modes || {})
      .map(
        ([key, value]) => `
          <button class="guide-chip${key === App.state.mode ? " is-active" : ""}" type="button" data-mode-set="${App.escapeHtml(key)}">
            ${App.escapeHtml(value.label)}
          </button>
        `
      )
      .join("");
  }

  function setMode(mode) {
    const data = App.getData();
    if (!data.modes || !data.modes[mode]) {
      return;
    }

    App.state.mode = mode;
    App.applyMode();
    App.storeMode(mode);
    renderAll();
    App.initRevealObserver();
    App.initSurfaceSpotlights();
    App.syncCurrentNav();
    App.toast(`${data.modes[mode].label} lens is active now.`);
  }

  function renderHome() {
    const heroTitle = document.getElementById("hero-title");
    if (!heroTitle) {
      return;
    }

    const data = App.getData();
    const mode = App.getModeConfig();
    const runtime = (data.runtime && data.runtime.sync) || {};
    const brain = (data.runtime && data.runtime.brain) || {};
    const heroLead = document.getElementById("hero-lead");
    const heroSignals = document.getElementById("hero-signals");
    const runtimeGrid = document.getElementById("home-runtime-grid");
    const highlights = document.getElementById("home-highlights");
    const marquee = document.getElementById("marquee-track");
    const featuredProjects = document.getElementById("featured-projects");
    const githubFeed = document.getElementById("home-github-activity");

    heroTitle.textContent = mode.heroTitle;
    if (heroLead) {
      heroLead.textContent = mode.heroLead;
    }

    if (heroSignals) {
      heroSignals.innerHTML = (data.signals || [])
        .map(
          (signal) => `
            <article class="metric-card">
              <span class="metric-card__value">${App.escapeHtml(signal.value)}</span>
              <span class="metric-card__label">${App.escapeHtml(signal.label)}</span>
              <p>${App.escapeHtml(signal.note)}</p>
            </article>
          `
        )
        .join("");
    }

    if (runtimeGrid) {
      runtimeGrid.innerHTML = [
        { value: runtime.status || "static", label: "Runtime" },
        { value: String(runtime.repoCount || (data.projects || []).length || 0), label: "Repos tracked" },
        { value: brain.status || "fallback", label: "Brain mode" },
        { value: mode.label, label: "Active lens" },
      ]
        .map(
          (item) => `
            <article class="metric-card">
              <span class="metric-card__value">${App.escapeHtml(item.value)}</span>
              <span class="metric-card__label">${App.escapeHtml(item.label)}</span>
            </article>
          `
        )
        .join("");
    }

    if (highlights) {
      highlights.innerHTML = (mode.highlights || [])
        .map(
          (item) => `
            <article class="highlight-card">
              <strong>${App.escapeHtml(item)}</strong>
            </article>
          `
        )
        .join("");
    }

    if (marquee) {
      const items = [...new Set([...(data.lab?.toolkit || []), "Product thinking", "Case studies"])].slice(0, 12);
      const repeated = [...items, ...items];
      marquee.innerHTML = repeated.map((item) => `<span class="marquee-item">${App.escapeHtml(item)}</span>`).join("");
    }

    if (featuredProjects) {
      featuredProjects.innerHTML = App.getProjectsForMode()
        .slice(0, 2)
        .map((project) => createProjectCard(project, true))
        .join("");
    }

    if (githubFeed) {
      githubFeed.innerHTML = buildGithubFeed((data.runtime && data.runtime.githubActivity) || [], 3);
    }
  }

  function renderGuideSection() {
    const data = App.getData();
    const prompts = data.guide?.prompts || [];
    const intro = document.getElementById("guide-intro");
    const list = document.getElementById("guide-chip-list");
    const title = document.getElementById("guide-answer-title");
    const text = document.getElementById("guide-answer-text");
    const link = document.getElementById("guide-answer-link");

    if (!intro || !list || !title || !text || !link || !prompts.length) {
      return;
    }

    if (!App.state.guidePrompt || !prompts.find((item) => item.id === App.state.guidePrompt)) {
      App.state.guidePrompt = prompts[0].id;
    }

    const active = prompts.find((item) => item.id === App.state.guidePrompt) || prompts[0];
    intro.textContent = data.guide.intro;
    list.innerHTML = prompts
      .map(
        (prompt) => `
          <button class="guide-chip${prompt.id === active.id ? " is-active" : ""}" type="button" data-guide-prompt="${App.escapeHtml(prompt.id)}">
            ${App.escapeHtml(prompt.label)}
          </button>
        `
      )
      .join("");

    title.textContent = active.title;
    text.textContent = active.answer;
    link.textContent = active.routeLabel;
    link.href = active.routeHref;
  }

  function renderBrainSection() {
    const data = App.getData();
    const status = document.getElementById("brain-status-text");
    const promptList = document.getElementById("brain-prompt-list");

    if (!status || !promptList || !data.brain) {
      return;
    }

    const runtimeBrain = (data.runtime && data.runtime.brain) || {};
    status.textContent = runtimeBrain.apiUrl
      ? `${runtimeBrain.label || "Live brain connected."} Tuned for ${App.getModeConfig().label.toLowerCase()} mode.`
      : data.brain.fallback;

    promptList.innerHTML = (data.brain.prompts || [])
      .map(
        (prompt) => `
          <button class="guide-chip" type="button" data-brain-prompt="${App.escapeHtml(prompt)}">
            ${App.escapeHtml(prompt)}
          </button>
        `
      )
      .join("");

    renderBrainThread();
  }

  function renderBrainThread() {
    const thread = document.getElementById("brain-thread");
    if (!thread) {
      return;
    }

    const messages = [...App.state.brainHistory];
    if (App.state.brainPending) {
      messages.push({ role: "assistant", text: "Thinking through the portfolio context..." });
    }

    if (!messages.length) {
      thread.innerHTML = `
        <article class="thread-message thread-message--assistant">
          <span class="thread-message__label">Portfolio Brain</span>
          <p>Ask about projects, AWS work, role fit, or what should be explored first.</p>
        </article>
      `;
      return;
    }

    thread.innerHTML = messages
      .map(
        (message) => `
          <article class="thread-message thread-message--${App.escapeHtml(message.role)}">
            <span class="thread-message__label">${message.role === "user" ? "You" : "Portfolio Brain"}</span>
            <p>${App.formatMultilineText(message.text)}</p>
          </article>
        `
      )
      .join("");
  }

  function createProjectCard(project, featured) {
    const activeCompare = App.state.compareIds.includes(project.id);
    return `
      <article class="case-card">
        <div class="case-card__top">
          <div class="case-card__meta">
            <div class="project-icon" data-accent="${App.escapeHtml(project.accent)}">${App.escapeHtml(project.icon)}</div>
            <div>
              <p class="project-kind">${App.escapeHtml(project.kind)}</p>
              <h3>${App.escapeHtml(project.title)}</h3>
            </div>
          </div>
          <span class="status-badge">${App.escapeHtml(project.status)}</span>
        </div>
        <p>${App.escapeHtml(featured ? project.proof : project.summary)}</p>
        <div class="case-card__proof">${App.escapeHtml(project.proof)}</div>
        <div class="case-card__tags">
          ${(project.stack || [])
            .slice(0, featured ? 6 : 5)
            .map((item) => `<span class="stack-pill">${App.escapeHtml(item)}</span>`)
            .join("")}
        </div>
        <div class="case-card__actions">
          <button class="button button--solid" type="button" data-open-project="${App.escapeHtml(project.id)}">Open Case Study</button>
          <button class="button button--ghost" type="button" data-compare-project="${App.escapeHtml(project.id)}">
            ${activeCompare ? "Added To Compare" : "Compare"}
          </button>
          ${project.links?.live ? `<a class="button button--ghost" href="${App.escapeHtml(project.links.live)}" target="_blank" rel="noreferrer">Live</a>` : ""}
          ${project.links?.repo ? `<a class="button button--ghost" href="${App.escapeHtml(project.links.repo)}" target="_blank" rel="noreferrer">Repo</a>` : ""}
        </div>
      </article>
    `;
  }

  function renderProjectsPage() {
    const grid = document.getElementById("project-grid");
    if (!grid) {
      return;
    }

    const mode = App.getModeConfig();
    document.getElementById("projects-mode-kicker").textContent = mode.kicker;
    document.getElementById("projects-mode-title").textContent = `${mode.label} lens is shaping this page right now.`;
    document.getElementById("projects-mode-summary").textContent = mode.summary;

    const projects = App.getProjectsForMode().filter((project) => {
      if (App.state.filter === "all") {
        return true;
      }
      return (project.tags || []).includes(App.state.filter);
    });

    grid.innerHTML = projects.map((project) => createProjectCard(project, false)).join("");

    const compareSelection = document.getElementById("compare-selection");
    if (compareSelection) {
      compareSelection.innerHTML = App.getProjectsForMode()
        .map(
          (project) => `
            <button class="compare-chip${App.state.compareIds.includes(project.id) ? " is-active" : ""}" type="button" data-compare-select="${App.escapeHtml(project.id)}">
              ${App.escapeHtml(project.title)}
            </button>
          `
        )
        .join("");
    }

    const comparePanel = document.getElementById("compare-panel");
    if (comparePanel) {
      comparePanel.innerHTML = buildComparePanel();
      comparePanel.classList.toggle("is-empty", App.state.compareIds.length === 0);
    }

    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === App.state.filter);
    });
  }

  function toggleCompare(id) {
    if (App.state.compareIds.includes(id)) {
      App.state.compareIds = App.state.compareIds.filter((item) => item !== id);
    } else if (App.state.compareIds.length < 2) {
      App.state.compareIds = [...App.state.compareIds, id];
    } else {
      App.state.compareIds = [App.state.compareIds[1], id];
      App.toast("Compare studio keeps the latest two selections.");
    }

    renderProjectsPage();
  }

  function buildComparePanel() {
    const selected = App.getProjectsForMode().filter((project) => App.state.compareIds.includes(project.id));
    if (!selected.length) {
      return `<p>Select one or two projects above to compare architecture, product strength, and tradeoffs.</p>`;
    }

    if (selected.length === 1) {
      return `
        <div class="compare-summary">
          <h3>${App.escapeHtml(selected[0].title)}</h3>
          <p>${App.escapeHtml(selected[0].proof)}</p>
        </div>
      `;
    }

    const [left, right] = selected;
    const sharedStack = (left.stack || []).filter((item) => (right.stack || []).includes(item));
    return `
      <div class="compare-summary">
        <h3>${App.escapeHtml(left.title)} vs ${App.escapeHtml(right.title)}</h3>
        <p>Shared stack signal: ${App.escapeHtml(sharedStack.join(", ") || "Different strengths with limited stack overlap.")}</p>
      </div>
      <div class="compare-columns">
        ${buildCompareColumn(left)}
        ${buildCompareColumn(right)}
      </div>
    `;
  }

  function buildCompareColumn(project) {
    return `
      <article class="compare-column">
        <div class="metric-card">
          <span class="project-kind">${App.escapeHtml(project.kind)}</span>
          <h3>${App.escapeHtml(project.title)}</h3>
          <p>${App.escapeHtml(project.summary)}</p>
        </div>
        <div class="metric-card">
          <span class="metric-card__label">What It Proves</span>
          <p>${App.escapeHtml(project.proof)}</p>
        </div>
        <div class="metric-card">
          <span class="metric-card__label">Tradeoff</span>
          <p>${App.escapeHtml(project.tradeoff)}</p>
        </div>
      </article>
    `;
  }

  function renderProjectModal(projectId) {
    const data = App.getData();
    const project = (data.projects || []).find((item) => item.id === projectId);
    const modal = document.getElementById("project-modal");
    const body = document.getElementById("project-modal-body");

    if (!project || !modal || !body) {
      return;
    }

    body.innerHTML = `
      <div class="modal-layout">
        <section class="modal-section">
          <p class="eyebrow">Case Study</p>
          <h2 id="project-modal-title">${App.escapeHtml(project.title)}</h2>
          <p>${App.escapeHtml(project.summary)}</p>
          <div class="modal-link-row">
            ${project.links?.live ? `<a class="button button--solid" href="${App.escapeHtml(project.links.live)}" target="_blank" rel="noreferrer">Open Live</a>` : ""}
            ${project.links?.repo ? `<a class="button button--ghost" href="${App.escapeHtml(project.links.repo)}" target="_blank" rel="noreferrer">View Repo</a>` : ""}
          </div>
        </section>
        <section class="modal-section">
          <p class="eyebrow eyebrow--small">Proof</p>
          <p>${App.escapeHtml(project.proof)}</p>
        </section>
        <section class="modal-section">
          <p class="eyebrow eyebrow--small">Key Details</p>
          <ul class="bullet-list">${(project.details || []).map((item) => `<li>${App.escapeHtml(item)}</li>`).join("")}</ul>
        </section>
        <section class="modal-section">
          <p class="eyebrow eyebrow--small">Architecture</p>
          <ul class="bullet-list">${(project.architecture || []).map((item) => `<li>${App.escapeHtml(item)}</li>`).join("")}</ul>
        </section>
        <section class="modal-section">
          <p class="eyebrow eyebrow--small">Tradeoff</p>
          <p>${App.escapeHtml(project.tradeoff)}</p>
        </section>
      </div>
    `;

    modal.hidden = false;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function renderSystemsPage() {
    const summaryGrid = document.getElementById("systems-summary-grid");
    const stack = document.getElementById("systems-stack");
    if (!summaryGrid || !stack) {
      return;
    }

    const data = App.getData();
    const systems = data.systems || [];
    const totalSteps = systems.reduce((sum, item) => sum + (item.steps || []).length, 0);
    const liveProjects = (data.projects || []).filter((project) => project.status === "Live").length;

    summaryGrid.innerHTML = [
      { value: String(systems.length), label: "System routes" },
      { value: String(totalSteps), label: "Flow steps" },
      { value: String(liveProjects), label: "Live products" },
      { value: App.getModeConfig().label, label: "Current lens" },
    ]
      .map(
        (item) => `
          <article class="metric-card">
            <span class="metric-card__value">${App.escapeHtml(item.value)}</span>
            <span class="metric-card__label">${App.escapeHtml(item.label)}</span>
          </article>
        `
      )
      .join("");

    stack.innerHTML = systems
      .map(
        (system) => `
          <article class="system-card">
            <p class="eyebrow">${App.escapeHtml(system.subtitle)}</p>
            <h2>${App.escapeHtml(system.title)}</h2>
            <p>${App.escapeHtml(system.summary)}</p>
            <div class="system-card__steps">
              ${(system.steps || [])
                .map(
                  (step) => `
                    <div class="system-step">
                      <span class="system-step__label">${App.escapeHtml(step.label)}</span>
                      <p>${App.escapeHtml(step.text)}</p>
                    </div>
                  `
                )
                .join("")}
            </div>
            <ul class="decision-list">
              ${(system.decisions || []).map((item) => `<li>${App.escapeHtml(item)}</li>`).join("")}
            </ul>
          </article>
        `
      )
      .join("");
  }

  function renderJourneyPage() {
    const metrics = document.getElementById("about-metrics");
    const timeline = document.getElementById("journey-timeline");
    const principles = document.getElementById("principle-list");
    if (!metrics || !timeline || !principles) {
      return;
    }

    const data = App.getData();
    metrics.innerHTML = [
      { value: String((data.journey || []).length), label: "Journey phases" },
      { value: String((data.principles || []).length), label: "Principles" },
      { value: String((data.projects || []).length), label: "Flagship builds" },
      { value: "Cloud + AI", label: "Direction" },
    ]
      .map(
        (item) => `
          <article class="metric-card">
            <span class="metric-card__value">${App.escapeHtml(item.value)}</span>
            <span class="metric-card__label">${App.escapeHtml(item.label)}</span>
          </article>
        `
      )
      .join("");

    timeline.innerHTML = (data.journey || [])
      .map(
        (item) => `
          <article class="timeline-card">
            <span class="timeline-card__phase">${App.escapeHtml(item.phase)}</span>
            <h3>${App.escapeHtml(item.title)}</h3>
            <p>${App.escapeHtml(item.text)}</p>
          </article>
        `
      )
      .join("");

    principles.innerHTML = (data.principles || [])
      .map(
        (item, index) => `
          <article class="principle-item">
            <div class="principle-item__index">${index + 1}</div>
            <div><p>${App.escapeHtml(item)}</p></div>
          </article>
        `
      )
      .join("");
  }

  function renderLabPage() {
    const syncGrid = document.getElementById("sync-status-grid");
    if (!syncGrid) {
      return;
    }

    const data = App.getData();
    const sync = (data.runtime && data.runtime.sync) || {};
    const brain = (data.runtime && data.runtime.brain) || {};

    syncGrid.innerHTML = [
      { value: sync.status || "static", label: "Sync status" },
      { value: String(sync.repoCount || 0), label: "Repos" },
      { value: brain.status || "fallback", label: "Brain" },
      { value: sync.syncedAtLabel || "Bundled data", label: "Last refresh" },
    ]
      .map(
        (item) => `
          <article class="metric-card">
            <span class="metric-card__value">${App.escapeHtml(item.value)}</span>
            <span class="metric-card__label">${App.escapeHtml(item.label)}</span>
          </article>
        `
      )
      .join("");

    const mapCards = (items) => items.map((item) => `<article class="stack-item"><p>${App.escapeHtml(item)}</p></article>`).join("");
    document.getElementById("now-building-list").innerHTML = mapCards(data.lab?.nowBuilding || []);
    document.getElementById("next-experiments-list").innerHTML = mapCards(data.lab?.nextExperiments || []);
    document.getElementById("tool-cloud").innerHTML = (data.lab?.toolkit || []).map((item) => `<span class="pill">${App.escapeHtml(item)}</span>`).join("");

    document.getElementById("learning-log-list").innerHTML = (data.learningLog || [])
      .map(
        (item) => `
          <article class="insight-card">
            <span class="eyebrow eyebrow--small">${App.escapeHtml(item.phase)}</span>
            <h3>${App.escapeHtml(item.title)}</h3>
            <p>${App.escapeHtml(item.note)}</p>
          </article>
        `
      )
      .join("");

    document.getElementById("idea-inbox-list").innerHTML = (data.ideaInbox || [])
      .map(
        (item) => `
          <article class="insight-card">
            <h3>${App.escapeHtml(item.label)}</h3>
            <p>${App.escapeHtml(item.note)}</p>
          </article>
        `
      )
      .join("");

    document.getElementById("roadmap-list").innerHTML = (data.roadmap || [])
      .map(
        (item) => `
          <article class="roadmap-card">
            <span class="eyebrow eyebrow--small">${App.escapeHtml(item.stage)}</span>
            <h3>${App.escapeHtml(item.title)}</h3>
            <p>${App.escapeHtml(item.note)}</p>
          </article>
        `
      )
      .join("");

    document.getElementById("github-activity-feed").innerHTML = buildGithubFeed((data.runtime && data.runtime.githubActivity) || [], 6);
  }

  function buildGithubFeed(repos, limit) {
    const items = repos.slice(0, limit);
    if (!items.length) {
      return `<article class="feed-card"><p>No live GitHub activity is bundled right now.</p></article>`;
    }

    return items
      .map(
        (repo) => `
          <article class="feed-card">
            <div class="feed-card__top">
              <strong>${App.escapeHtml(repo.name)}</strong>
              <span class="feed-card__meta">${App.escapeHtml(repo.language || "Repo")}</span>
            </div>
            <p>${App.escapeHtml(repo.note || "Public repository activity.")}</p>
            <a class="text-link" href="${App.escapeHtml(repo.url)}" target="_blank" rel="noreferrer">Open repository</a>
          </article>
        `
      )
      .join("");
  }

  function renderContactPage() {
    const grid = document.getElementById("contact-grid");
    const resumeGrid = document.getElementById("resume-grid");
    if (!grid || !resumeGrid) {
      return;
    }

    const data = App.getData();
    grid.innerHTML = `
      <article class="contact-card">
        <span class="contact-card__label">Email</span>
        <h2>Primary direct route</h2>
        <a class="contact-card__link" href="mailto:${App.escapeHtml(data.profile.email)}">${App.escapeHtml(data.profile.email)}</a>
        <p>Best for opportunities, follow-up, and direct conversation about the work.</p>
      </article>
      <article class="contact-card">
        <span class="contact-card__label">Phone</span>
        <h2>Direct call route</h2>
        <a class="contact-card__link" href="tel:${App.escapeHtml(data.profile.phone)}">${App.escapeHtml(data.profile.phone)}</a>
        <p>Useful when a direct conversation is easier than back-and-forth email.</p>
      </article>
      <article class="contact-card">
        <span class="contact-card__label">Profiles</span>
        <h2>Public proof layer</h2>
        <div class="contact-card__links">
          <a class="button button--ghost" href="${App.escapeHtml(data.profile.github)}" target="_blank" rel="noreferrer">GitHub</a>
          <a class="button button--ghost" href="${App.escapeHtml(data.profile.linkedin)}" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
        <p>GitHub is strongest for code proof. LinkedIn is strongest for role context.</p>
      </article>
    `;

    resumeGrid.innerHTML = (data.profile.resumes || [])
      .map(
        (resume) => `
          <article class="resume-card">
            <div class="resume-card__top">
              <span class="resume-card__eyebrow">Resume</span>
            </div>
            <h3>${App.escapeHtml(resume.label)}</h3>
            <p class="resume-card__note">${App.escapeHtml(resume.note)}</p>
            <a class="text-link" href="${App.escapeHtml(resume.href)}" target="_blank" rel="noreferrer">Open resume</a>
          </article>
        `
      )
      .join("");
  }

  App.renderAll = renderAll;
  App.setMode = setMode;
  App.renderBrainThread = renderBrainThread;
  App.createProjectCard = createProjectCard;
  App.toggleCompare = toggleCompare;
  App.renderProjectModal = renderProjectModal;
  App.buildGithubFeed = buildGithubFeed;
})();
