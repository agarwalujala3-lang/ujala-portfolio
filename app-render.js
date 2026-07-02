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
    const routes = [
      { id: "home", label: "Home", href: "index.html", kicker: "Start route" },
      { id: "work", label: "Case Studies", href: "work.html", kicker: "Project route" },
      { id: "systems", label: "Systems", href: "systems.html", kicker: "Architecture route" },
      { id: "about", label: "Journey", href: "about.html", kicker: "Story route" },
      { id: "playground", label: "Lab", href: "playground.html", kicker: "Build workshop" },
      { id: "contact", label: "Contact", href: "contact.html", kicker: "Direct route" },
    ];
    const currentIndex = routes.findIndex((route) => route.id === document.body.dataset.page);
    const previousRoute = currentIndex >= 0 ? routes[(currentIndex - 1 + routes.length) % routes.length] : routes[0];
    const nextRoute = currentIndex >= 0 ? routes[(currentIndex + 1) % routes.length] : routes[1];

    shell.innerHTML = `
      <div class="footer-grid">
        <div class="footer-brand">
          <strong>${App.escapeHtml(data.profile.name)}</strong>
          <p>${App.escapeHtml(data.profile.tagline)}</p>
        </div>
        <div class="footer-links">
          <a class="text-link" href="${App.escapeHtml(App.resolveRouteHref("work.html"))}">Case studies</a>
          <a class="text-link" href="${App.escapeHtml(App.resolveRouteHref("systems.html"))}">Systems</a>
          <a class="text-link" href="${App.escapeHtml(App.safeHref(data.profile.github, { allowRelative: false }))}" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <div class="footer-status">
          <span>Mode: ${App.escapeHtml(App.getModeConfig().label)}</span>
          <span>Runtime: ${App.escapeHtml(sync.status || "static")}</span>
          <span>${App.escapeHtml(sync.syncedAtLabel || "Using bundled portfolio data")}</span>
        </div>
      </div>
      <div class="footer-route-nav">
        <a class="footer-route-card" href="${App.escapeHtml(App.resolveRouteHref(previousRoute.href))}">
          <span class="footer-route-card__eyebrow">Previous page</span>
          <strong>${App.escapeHtml(previousRoute.label)}</strong>
          <p>${App.escapeHtml(previousRoute.kicker)}</p>
        </a>
        <a class="footer-route-card footer-route-card--next" href="${App.escapeHtml(App.resolveRouteHref(nextRoute.href))}">
          <span class="footer-route-card__eyebrow">Next page</span>
          <strong>${App.escapeHtml(nextRoute.label)}</strong>
          <p>${App.escapeHtml(nextRoute.kicker)}</p>
        </a>
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
    App.initHeroDepthScene();
    App.initSurfaceSpotlights();
    App.syncCurrentNav();
    App.toast(`${data.modes[mode].label} lens is active now.`);
  }

  function clampCopy(value, maxLength = 140) {
    const text = String(value || "").trim();
    if (!text) {
      return "";
    }
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}...`;
  }

  function buildHeroSceneProject(project, variant) {
    if (!project) {
      return "";
    }

    const delivery = projectDeliveryLabel(project);
    const summary = clampCopy(project.summary || project.proof || "Portfolio proof layer.", 150);
    const stack = (project.stack || []).slice(0, 1);

    return `
      <article class="hero-scene-card__inner" style="${App.escapeHtml(projectThemeStyle(project))}">
        <div class="hero-scene-card__header">
          ${renderProjectIcon(project)}
          <div>
            <p class="hero-scene-card__kicker">${App.escapeHtml(project.kind)}</p>
            <h3>${App.escapeHtml(project.title)}</h3>
          </div>
        </div>
        <div class="hero-scene-card__chips">
          <span class="hero-scene-card__chip">${App.escapeHtml(project.badge || delivery)}</span>
          ${stack.map((item) => `<span class="hero-scene-card__chip hero-scene-card__chip--soft">${App.escapeHtml(item)}</span>`).join("")}
        </div>
        <p class="hero-scene-card__summary">${App.escapeHtml(summary)}</p>
        <div class="hero-scene-card__footer">
          <span>${App.escapeHtml(variant === "primary" ? "Lead proof" : "Secondary proof")}</span>
          <span>${App.escapeHtml(project.status || "Portfolio")}</span>
        </div>
      </article>
    `;
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
    const capabilityRadar = document.getElementById("capability-radar");
    const signalInsightList = document.getElementById("signal-insight-list");
    const capabilityMatrix = document.getElementById("capability-matrix");
    const commandNetwork = document.getElementById("command-network");
    const launchStrip = document.getElementById("launch-strip");
    const projectPulseGrid = document.getElementById("project-pulse-grid");
    const orbitConstellation = document.getElementById("orbit-constellation");
    const toolOrbit = document.getElementById("tool-orbit");
    const proofMiniGrid = document.getElementById("proof-mini-grid");
    const featuredProjects = document.getElementById("featured-projects");
    const githubFeed = document.getElementById("home-github-activity");
    const heroStage = document.getElementById("hero-stage");
    const heroPrimary = document.getElementById("hero-project-primary");
    const heroSecondary = document.getElementById("hero-project-secondary");
    const heroProof = document.getElementById("hero-stage-proof");
    const heroSync = document.getElementById("hero-scene-sync");
    const heroSceneProof = document.getElementById("hero-scene-proof");
    const heroSceneLens = document.getElementById("hero-scene-lens");
    const heroRuntimeLabel = document.getElementById("hero-stage-runtime-label");
    const orderedProjects = App.getProjectsForMode();
    const capabilityScores = buildCapabilityScores(orderedProjects);
    const isMobileViewport = window.matchMedia("(max-width: 760px)").matches;
    const primaryProject = orderedProjects[0] || null;
    const secondaryProject = orderedProjects.find((project) => project.id !== primaryProject?.id) || primaryProject;
    const primaryActivitySummary = projectActivitySummary(primaryProject);
    const secondaryActivitySummary = secondaryProject ? projectActivitySummary(secondaryProject) : "";

    heroTitle.textContent = mode.heroTitle;
    if (heroLead) {
      heroLead.textContent = mode.heroLead;
    }

    if (heroSignals) {
      heroSignals.innerHTML = (data.signals || [])
        .slice(0, isMobileViewport ? 2 : 3)
        .map(
          (signal) => `
            <article class="metric-card">
              <span class="metric-card__value">${App.escapeHtml(signal.value)}</span>
              <span class="metric-card__label">${App.escapeHtml(signal.label)}</span>
              ${isMobileViewport ? "" : `<p>${App.escapeHtml(signal.note)}</p>`}
            </article>
          `
        )
        .join("");
    }

    if (heroStage && primaryProject) {
      const secondaryTheme = secondaryProject?.theme || {};
      heroStage.style.setProperty("--hero-accent", primaryProject.theme?.accentStrong || "#8af4ff");
      heroStage.style.setProperty("--hero-accent-soft", primaryProject.theme?.accentSoft || "rgba(122, 151, 255, 0.16)");
      heroStage.style.setProperty("--hero-glow-primary", primaryProject.theme?.glow || "rgba(122, 151, 255, 0.22)");
      heroStage.style.setProperty("--hero-glow-secondary", secondaryTheme.glowSoft || secondaryTheme.glow || "rgba(214, 183, 255, 0.18)");
    }

    if (heroPrimary) {
      heroPrimary.innerHTML = buildHeroSceneProject(primaryProject, "primary");
    }

    if (heroSecondary) {
      heroSecondary.innerHTML = secondaryProject ? buildHeroSceneProject(secondaryProject, "secondary") : "";
    }

    if (heroProof) {
      const proofLine = secondaryProject
        ? `${primaryProject?.title || "The lead project"} leads right now, ${primaryActivitySummary}, with ${secondaryProject.title} next at ${secondaryActivitySummary}.`
        : `${primaryProject?.title || "The lead project"} leads right now, ${primaryActivitySummary}.`;
      heroProof.innerHTML = `
        <span class="hero-stage__proof-label">Current GitHub lead</span>
        <p>${App.escapeHtml(clampCopy(proofLine, isMobileViewport ? 120 : 180))}</p>
      `;
    }

    if (heroSync) {
      heroSync.textContent = runtime.syncedAtLabel
        ? `Static snapshot refreshed ${runtime.syncedAtLabel}`
        : "Using bundled static portfolio data";
    }

    if (heroSceneProof) {
      heroSceneProof.textContent = primaryProject?.proof || primaryProject?.summary || "Primary project proof is loading.";
    }

    if (heroSceneLens) {
      heroSceneLens.textContent = `${mode.label} lens is shaping the homepage narrative right now.`;
    }

    if (heroRuntimeLabel) {
      heroRuntimeLabel.textContent = "Static snapshot";
    }

    if (runtimeGrid) {
      const repoProofCount = (data.projects || []).filter((project) => project.links?.repo).length || (data.projects || []).length || 0;
      const brainMode = brain.status === "connected" ? "connected" : "local";
      const runtimeItems = isMobileViewport
        ? [
            { value: String(repoProofCount), label: "Repo proofs" },
            { value: mode.label, label: "Active lens" },
          ]
        : [
            { value: "static", label: "Hosting mode" },
            { value: String(repoProofCount), label: "Repo proofs" },
            { value: brainMode, label: "Guide mode" },
            { value: mode.label, label: "Active lens" },
          ];
      runtimeGrid.innerHTML = runtimeItems
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
        .slice(0, isMobileViewport ? 2 : 3)
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

    if (capabilityRadar) {
      capabilityRadar.innerHTML = buildCapabilityRadar(capabilityScores);
    }

    if (signalInsightList) {
      signalInsightList.innerHTML = buildSignalInsights(capabilityScores);
    }

    if (capabilityMatrix) {
      capabilityMatrix.innerHTML = buildCapabilityMatrix(capabilityScores);
    }

    if (commandNetwork) {
      commandNetwork.innerHTML = buildCommandNetwork(capabilityScores, orderedProjects);
    }

    if (launchStrip) {
      launchStrip.innerHTML = buildLaunchStrip(data, orderedProjects);
    }

    if (projectPulseGrid) {
      projectPulseGrid.innerHTML = buildProjectPulseGrid(orderedProjects.slice(0, 3));
    }

    if (orbitConstellation) {
      orbitConstellation.innerHTML = buildOrbitConstellation(orderedProjects);
    }

    if (toolOrbit) {
      toolOrbit.innerHTML = buildToolOrbit(data, orderedProjects);
    }

    if (proofMiniGrid) {
      proofMiniGrid.innerHTML = buildProofMiniGrid(data, orderedProjects);
    }

    if (featuredProjects) {
      const homeProjects = [
        ...orderedProjects.filter((project) => project.featured),
        ...orderedProjects.filter((project) => !project.featured),
      ]
        .filter((project, index, items) => items.findIndex((item) => item.id === project.id) === index)
        .slice(0, 2);

      featuredProjects.innerHTML = homeProjects
        .map((project) => createProjectCard(project, true))
        .join("");
    }

    if (githubFeed) {
      githubFeed.innerHTML = buildGithubFeed((data.runtime && data.runtime.githubActivity) || [], 3);
    }
  }
  function normalizeSignalToken(value) {
    return String(value || "").toLowerCase();
  }

  function projectSearchText(project) {
    return [project.title, project.kind, project.summary, project.proof, ...(project.tags || []), ...(project.stack || []), ...(project.details || [])].join(" ").toLowerCase();
  }

  function scoreCapability(projects, tokens) {
    let score = 18;
    projects.forEach((project, index) => {
      const haystack = projectSearchText(project);
      const hit = tokens.some((token) => haystack.includes(normalizeSignalToken(token)));
      if (!hit) {
        return;
      }

      const weight = Math.max(8, 22 - index * 4);
      score += weight;
      if (project.links?.repo) {
        score += 6;
      }
      if (project.links?.live) {
        score += 5;
      }
      if (project.featured) {
        score += 4;
      }
    });

    return Math.max(24, Math.min(98, score));
  }

  function buildCapabilityScores(projects) {
    return [
      { label: "Cloud Systems", shortLabel: "Cloud", note: "AWS flow, serverless routes, and backend delivery proof.", value: scoreCapability(projects, ["aws", "lambda", "dynamodb", "textract", "cognito", "s3", "api gateway", "cloudfront", "serverless"]) },
      { label: "AI Workflow", shortLabel: "AI", note: "Analysis, explanation, and guided AI-assisted product work.", value: scoreCapability(projects, ["ai", "openai", "mermaid", "diagram", "analysis", "analyzer", "chat"]) },
      { label: "Frontend Craft", shortLabel: "UI", note: "Visual polish, interaction quality, and readable app surfaces.", value: scoreCapability(projects, ["frontend", "ui", "css", "html", "dashboard", "interactive", "product"]) },
      { label: "Product Thinking", shortLabel: "Product", note: "User flow clarity, review tooling, and portfolio storytelling.", value: scoreCapability(projects, ["workflow", "review", "product", "experience", "compare", "dashboard", "usability"]) },
      { label: "Delivery Trust", shortLabel: "Trust", note: "Repo-backed proof, live routes, and stable public presentation.", value: scoreCapability(projects, ["repo", "github", "deploy", "deployment", "static", "safe", "hosting", "live"]) },
    ];
  }

  function radarPoint(value, index, total, radius, center) {
    const angle = (-Math.PI / 2) + ((Math.PI * 2) / total) * index;
    const length = (radius * value) / 100;
    const x = center + Math.cos(angle) * length;
    const y = center + Math.sin(angle) * length;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }

  function buildCapabilityRadar(scores) {
    const size = 320;
    const center = size / 2;
    const radius = 112;
    const levels = [20, 40, 60, 80, 100];
    const polygon = scores.map((item, index) => radarPoint(item.value, index, scores.length, radius, center)).join(" ");
    const axes = scores.map((item, index) => {
      const angle = (-Math.PI / 2) + ((Math.PI * 2) / scores.length) * index;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      const labelX = center + Math.cos(angle) * (radius + 34);
      const labelY = center + Math.sin(angle) * (radius + 34);
      return `
          <line x1="${center}" y1="${center}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"></line>
          <text x="${labelX.toFixed(1)}" y="${labelY.toFixed(1)}">${App.escapeHtml(item.shortLabel)}</text>
        `;
    }).join("");

    const rings = levels.map((level) => {
      const points = scores.map((_, index) => radarPoint(level, index, scores.length, radius, center)).join(" ");
      return `<polygon points="${points}"></polygon>`;
    }).join("");

    const points = scores.map((item, index) => {
      const angle = (-Math.PI / 2) + ((Math.PI * 2) / scores.length) * index;
      const length = (radius * item.value) / 100;
      const x = center + Math.cos(angle) * length;
      const y = center + Math.sin(angle) * length;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"></circle>`;
    }).join("");

    return `
      <div class="radar-chart-card">
        <svg class="radar-chart" viewBox="0 0 ${size} ${size}" aria-label="Capability radar chart">
          <g class="radar-chart__rings">${rings}</g>
          <g class="radar-chart__axes">${axes}</g>
          <polygon class="radar-chart__shape" points="${polygon}"></polygon>
          <g class="radar-chart__points">${points}</g>
        </svg>
        <div class="radar-chart__center-glow"></div>
      </div>
    `;
  }

  function buildSignalInsights(scores) {
    const ordered = [...scores].sort((a, b) => b.value - a.value);
    const average = Math.round(scores.reduce((sum, item) => sum + item.value, 0) / Math.max(scores.length, 1));
    return [
      { title: `${ordered[0].label} leads the story`, body: `${ordered[0].value}% signal strength from the current project mix and proof links.` },
      { title: `${ordered[1].label} is close behind`, body: `${ordered[1].note}` },
      { title: "Overall portfolio readiness", body: `${average}% average across cloud, AI, frontend, product, and delivery trust.` },
    ].map((item) => `
          <article class="signal-insight-card">
            <strong>${App.escapeHtml(item.title)}</strong>
            <p>${App.escapeHtml(item.body)}</p>
          </article>
        `).join("");
  }

  function buildCapabilityMatrix(scores) {
    return scores.map((item) => `
          <article class="capability-row">
            <div class="capability-row__head">
              <div>
                <strong>${App.escapeHtml(item.label)}</strong>
                <p>${App.escapeHtml(item.note)}</p>
              </div>
              <span>${App.escapeHtml(String(item.value))}%</span>
            </div>
            <div class="capability-row__track">
              <span class="capability-row__fill" style="width: ${App.escapeHtml(String(item.value))}%"></span>
            </div>
          </article>
        `).join("");
  }

  function buildCommandNetwork(scores, projects) {
    const featured = projects.slice(0, 3);
    const lanes = scores.slice(0, 4).map((item, index) => {
      const phase = (index * 0.9).toFixed(2);
      return `
        <div class="network-lane" style="--lane-width: ${Math.max(30, item.value)}%; --lane-delay: ${phase}s">
          <span class="network-lane__label">${App.escapeHtml(item.shortLabel)}</span>
          <span class="network-lane__beam"></span>
        </div>`;
    }).join("");

    const nodes = featured.map((project, index) => `
      <article class="network-node network-node--${index + 1}" style="${App.escapeHtml(projectThemeStyle(project))}">
        <span class="network-node__halo"></span>
        <strong>${App.escapeHtml(project.title)}</strong>
        <p>${App.escapeHtml(project.kind)}</p>
      </article>
    `).join("");

    return `
      <div class="network-shell">
        <div class="network-grid" aria-hidden="true"></div>
        <svg class="network-svg" viewBox="0 0 560 240" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="network-flow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="rgba(32, 74, 68, 0.18)"></stop>
              <stop offset="50%" stop-color="rgba(198, 111, 55, 0.88)"></stop>
              <stop offset="100%" stop-color="rgba(63, 96, 121, 0.18)"></stop>
            </linearGradient>
          </defs>
          <path class="network-svg__line network-svg__line--a" d="M24 122 C116 42, 194 46, 282 118 S440 198, 536 112"></path>
          <path class="network-svg__line network-svg__line--b" d="M26 160 C120 214, 196 194, 282 132 S426 42, 536 154"></path>
          <circle class="network-svg__node" cx="106" cy="64" r="6"></circle>
          <circle class="network-svg__node" cx="278" cy="118" r="7"></circle>
          <circle class="network-svg__node" cx="450" cy="176" r="6"></circle>
        </svg>
        <div class="network-lanes">${lanes}</div>
        <div class="network-node-stack">${nodes}</div>
      </div>
    `;
  }

  function buildOrbitConstellation(projects) {
    const accents = projects.slice(0, 3).map((project) => project.theme?.accentStrong || "#204a44");
    return `
      <div class="constellation-panel">
        <svg class="constellation-svg" viewBox="0 0 520 210" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="constellation-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${accents[0] || "#204a44"}"></stop>
              <stop offset="50%" stop-color="${accents[1] || "#c66f37"}"></stop>
              <stop offset="100%" stop-color="${accents[2] || "#3f6079"}"></stop>
            </linearGradient>
          </defs>
          <path class="constellation-svg__line" d="M38 160 C120 80, 186 70, 266 112 S396 184, 480 66"></path>
          <path class="constellation-svg__line constellation-svg__line--soft" d="M74 38 C148 118, 236 152, 320 120 S414 70, 488 156"></path>
          <circle class="constellation-svg__point" cx="74" cy="38" r="5"></circle>
          <circle class="constellation-svg__point" cx="186" cy="78" r="7"></circle>
          <circle class="constellation-svg__point" cx="322" cy="118" r="6"></circle>
          <circle class="constellation-svg__point" cx="480" cy="66" r="7"></circle>
        </svg>
        <div class="constellation-copy">
          <strong>Stack Constellation</strong>
          <p>Tools orbit around cloud systems, AI workflow, and product-facing craft instead of sitting in a flat list.</p>
        </div>
      </div>
    `;
  }

  function buildLaunchStrip(data, projects) {
    const liveCount = projects.filter((project) => project.links?.live).length;
    const repoCount = projects.filter((project) => project.links?.repo).length;
    const featuredCount = projects.filter((project) => project.featured).length;
    const resumeCount = (data.profile?.resumes || []).length;
    return [
      { value: String(liveCount), label: "Live routes" },
      { value: String(repoCount), label: "Repo proofs" },
      { value: String(featuredCount), label: "Flagship stories" },
      { value: String(resumeCount), label: "Resume paths" },
    ].map((item) => `
          <article class="launch-stat">
            <strong>${App.escapeHtml(item.value)}</strong>
            <span>${App.escapeHtml(item.label)}</span>
          </article>
        `).join("");
  }

  function buildProjectPulseGrid(projects) {
    return projects.map((project, index) => `
          <article class="pulse-card" style="${App.escapeHtml(projectThemeStyle(project))}">
            <div class="pulse-card__top">
              ${renderProjectIcon(project)}
              <div>
                <p>${App.escapeHtml(index === 0 ? "Lead surface" : index === 1 ? "Next signal" : "Supporting proof")}</p>
                <h3>${App.escapeHtml(project.title)}</h3>
              </div>
            </div>
            <div class="pulse-card__meter">
              <span style="width: ${App.escapeHtml(String(Math.max(54, 92 - index * 11)))}%"></span>
            </div>
            <p class="pulse-card__summary">${App.escapeHtml(project.proof || project.summary)}</p>
            <div class="pulse-card__meta">
              <span>${App.escapeHtml(projectDeliveryLabel(project))}</span>
              <span>${App.escapeHtml(projectActivityLabel(project))}</span>
            </div>
          </article>
        `).join("");
  }

  function buildToolOrbit(data, projects) {
    const items = [...new Set([...(data.lab?.toolkit || []), ...projects.flatMap((project) => project.stack || [])])].slice(0, 11);
    return items.map((item, index) => {
      const initials = item.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
      const size = index % 3 === 0 ? "is-large" : index % 3 === 1 ? "is-medium" : "is-small";
      return `
          <article class="orbit-chip ${size}">
            <span class="orbit-chip__mark">${App.escapeHtml(initials)}</span>
            <strong>${App.escapeHtml(item)}</strong>
          </article>
        `;
    }).join("");
  }

  function buildProofMiniGrid(data, projects) {
    const modeFocus = App.getModeConfig().focus || [];
    return [
      { label: "Lens focus", value: modeFocus[0] || "Proof-first" },
      { label: "Current lead", value: projects[0]?.title || "Portfolio route" },
      { label: "Proof style", value: data.signals?.[2]?.value || "Product + System" },
      { label: "Primary track", value: data.signals?.[1]?.value || "AWS" },
    ].map((item) => `
          <article class="proof-mini-card">
            <span>${App.escapeHtml(item.label)}</span>
            <strong>${App.escapeHtml(item.value)}</strong>
          </article>
        `).join("");
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
    link.href = App.resolveRouteHref(active.routeHref);
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

  function renderProjectIcon(project) {
    const classes = ["project-icon"];
    if (project.iconImage) {
      classes.push("project-icon--image");
    }

    const content = project.iconImage
      ? `<img class="project-icon__image" src="${App.escapeHtml(project.iconImage)}" alt="${App.escapeHtml(project.title)} logo" loading="lazy" decoding="async">`
      : App.escapeHtml(project.icon);

    return `<div class="${classes.join(" ")}" data-accent="${App.escapeHtml(project.accent)}">${content}</div>`;
  }

  function projectThemeStyle(project) {
    const theme = project.theme || {};
    const vars = {
      "--project-surface-1": theme.surface1 || "rgba(255, 255, 255, 0.82)",
      "--project-surface-2": theme.surface2 || "rgba(246, 240, 232, 0.96)",
      "--project-ring": theme.ring || "rgba(32, 74, 68, 0.12)",
      "--project-glow": theme.glow || "rgba(198, 111, 55, 0.16)",
      "--project-glow-soft": theme.glowSoft || "rgba(32, 74, 68, 0.14)",
      "--project-accent-strong": theme.accentStrong || "var(--brand)",
      "--project-accent-soft": theme.accentSoft || "rgba(32, 74, 68, 0.12)",
      "--project-badge-bg": theme.badgeBg || "rgba(32, 74, 68, 0.08)",
      "--project-badge-border": theme.badgeBorder || "rgba(32, 74, 68, 0.14)",
      "--project-proof-bg": theme.proofBg || "linear-gradient(135deg, rgba(32, 74, 68, 0.08), rgba(198, 111, 55, 0.08))",
      "--project-signal-bg": theme.signalBg || "rgba(255, 255, 255, 0.72)",
      "--project-signal-border": theme.signalBorder || "rgba(32, 74, 68, 0.1)",
      "--project-icon-bg": theme.iconBg || "rgba(32, 74, 68, 0.12)",
    };

    return Object.entries(vars)
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ");
  }

  function projectDeliveryLabel(project) {
    const parts = [project.links?.live ? "Live" : null, project.links?.repo ? "Repo" : null].filter(Boolean);
    return parts.length ? parts.join(" + ") : "Portfolio";
  }

  function repoNameFromGithubUrl(value) {
    if (typeof value !== "string" || !value.trim()) {
      return "";
    }

    try {
      const url = new URL(value);
      if (url.hostname.toLowerCase() !== "github.com") {
        return "";
      }
      const parts = url.pathname.split("/").filter(Boolean);
      return parts.length >= 2 ? parts[1].replace(/\.git$/i, "") : "";
    } catch {
      return "";
    }
  }

  function getGithubActivityByRepo() {
    return new Map(
      ((App.getData().runtime && App.getData().runtime.githubActivity) || [])
        .filter((entry) => entry?.name)
        .map((entry) => [entry.name, entry])
    );
  }

  function getProjectActivity(project) {
    const repoName = project?.repoSync?.repo || repoNameFromGithubUrl(project?.links?.repo);
    return repoName ? getGithubActivityByRepo().get(repoName) || null : null;
  }

  function formatProjectActivityDate(value) {
    const timestamp = Date.parse(value || "");
    if (!Number.isFinite(timestamp)) {
      return "recently";
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(timestamp));
  }

  function projectActivityLabel(project) {
    const activity = getProjectActivity(project);
    if (!activity?.pushedAt) {
      return "Portfolio snapshot";
    }

    return `Updated ${formatProjectActivityDate(activity.pushedAt)}`;
  }

  function projectActivitySummary(project) {
    const activity = getProjectActivity(project);
    if (!activity?.pushedAt) {
      return "running on the current portfolio snapshot";
    }

    return `updated on ${formatProjectActivityDate(activity.pushedAt)}`;
  }

  function projectActivityNote(project) {
    const activity = getProjectActivity(project);
    if (activity?.note) {
      return activity.note;
    }

    return "Recent public repo activity is shaping current portfolio emphasis.";
  }

  function projectSignalLabel(project) {
    const tags = project.tags || [];
    if (tags.includes("aws")) {
      return "AWS system depth";
    }
    if (tags.includes("ai")) {
      return "AI product depth";
    }
    if (tags.includes("interactive")) {
      return "Interaction design";
    }
    if (tags.includes("ui")) {
      return "Layout fidelity";
    }
    if (tags.includes("frontend")) {
      return "Frontend polish";
    }
    return "Shipped web product";
  }

  function projectFocusLabel(project) {
    const tags = project.tags || [];
    const stack = project.stack || [];

    if (tags.includes("aws")) {
      return "Serverless workflow + private user flow";
    }
    if (tags.includes("ai")) {
      return "Repository analysis + AI explanation";
    }
    if (tags.includes("interactive")) {
      return "Motion-led storytelling";
    }
    if (tags.includes("ui")) {
      return "Dense interface reconstruction";
    }
    if (stack.length) {
      return stack.slice(0, 2).join(" + ");
    }
    return project.kind;
  }

  function projectSignalItems(project) {
    const stack = project.stack || [];

    return [
      {
        label: "Strongest Signal",
        value: projectSignalLabel(project),
        note: projectFocusLabel(project),
      },
      {
        label: "Repo Activity",
        value: projectActivityLabel(project),
        note: projectActivityNote(project),
      },
      {
        label: "Delivery",
        value: projectDeliveryLabel(project),
        note: project.links?.repo ? "Repository proof is ready to inspect." : "Portfolio case study is the main proof.",
      },
      {
        label: "Core Stack",
        value: stack.slice(0, 3).join(" / ") || "Web stack",
        note: stack.length > 3 ? `+${stack.length - 3} more tools in the build.` : "Focused implementation surface.",
      },
    ];
  }

  function buildProjectSignalCards(project, limit) {
    return `
      <div class="project-signal-grid">
        ${projectSignalItems(project)
          .slice(0, limit || 3)
          .map(
            (item) => `
              <article class="project-signal-card">
                <span class="project-signal-card__label">${App.escapeHtml(item.label)}</span>
                <strong class="project-signal-card__value">${App.escapeHtml(item.value)}</strong>
                <p>${App.escapeHtml(item.note)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  function buildProjectDetailList(project, limit) {
    const items = (project.details || []).slice(0, limit || 3);
    if (!items.length) {
      return "";
    }

    return `
      <div class="case-card__detail-list">
        ${items
          .map(
            (item) => `
              <article class="case-card__detail-item">
                <p>${App.escapeHtml(item)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  function createProjectCard(project, featured) {
    const activeCompare = App.state.compareIds.includes(project.id);
    const compareLabel = featured
      ? activeCompare
        ? "Added To Studio"
        : "Compare In Studio"
      : activeCompare
        ? "Added To Compare"
        : "Compare";
    const badge = project.badge ? `<span class="project-badge">${App.escapeHtml(project.badge)}</span>` : "";
    return `
      <article class="case-card${featured ? " case-card--featured" : ""}" style="${App.escapeHtml(projectThemeStyle(project))}">
        <div class="case-card__top">
          <div class="case-card__meta">
            ${renderProjectIcon(project)}
            <div>
              <p class="project-kind">${App.escapeHtml(project.kind)}</p>
              <h3>${App.escapeHtml(project.title)}</h3>
              ${badge}
            </div>
          </div>
          <div class="case-card__status">
            <span class="status-badge">${App.escapeHtml(project.status)}</span>
            <span class="case-card__status-note">${App.escapeHtml(projectDeliveryLabel(project))}</span>
          </div>
        </div>
        <p class="case-card__summary">${App.escapeHtml(project.summary)}</p>
        ${buildProjectSignalCards(project, featured ? 2 : 3)}
        <div class="case-card__proof">
          <span class="case-card__proof-label">What it proves</span>
          <p>${App.escapeHtml(project.proof)}</p>
        </div>
        ${buildProjectDetailList(project, featured ? 2 : 3)}
        <div class="case-card__tags">
          ${(project.stack || [])
            .slice(0, featured ? 5 : 6)
            .map((item) => `<span class="stack-pill">${App.escapeHtml(item)}</span>`)
            .join("")}
        </div>
        <div class="case-card__actions">
          <button class="button button--solid" type="button" data-open-project="${App.escapeHtml(project.id)}">Open Case Study</button>
          <button class="button button--ghost" type="button" data-compare-project="${App.escapeHtml(project.id)}">
            ${compareLabel}
          </button>
          ${project.links?.live ? `<a class="button button--ghost" href="${App.escapeHtml(App.safeHref(project.links.live, { allowRelative: false }))}" target="_blank" rel="noopener noreferrer">Live</a>` : ""}
          ${project.links?.repo ? `<a class="button button--ghost" href="${App.escapeHtml(App.safeHref(project.links.repo, { allowRelative: false }))}" target="_blank" rel="noopener noreferrer">Repo</a>` : ""}
        </div>
      </article>
    `;
  }

  function renderProjectsPage() {
    const grid = document.getElementById("project-grid");
    if (!grid) {
      return;
    }

    const data = App.getData();
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

    const studioMetrics = document.getElementById("project-studio-metrics");
    if (studioMetrics) {
      const allProjects = data.projects || [];
      studioMetrics.innerHTML = [
        {
          value: String(allProjects.filter((project) => project.links?.repo).length),
          label: "Repo Proof",
          note: "Projects with public source and clear implementation proof.",
        },
        {
          value: String(allProjects.filter((project) => (project.tags || []).includes("aws")).length),
          label: "Cloud Signals",
          note: "Projects where AWS and backend depth are the strongest proof.",
        },
        {
          value: String(allProjects.filter((project) => (project.tags || []).includes("ai")).length),
          label: "AI Products",
          note: "Builds where analysis, explanation, or AI-assisted flow matters most.",
        },
        {
          value: String(
            allProjects.filter((project) => {
              const tags = project.tags || [];
              return tags.includes("frontend") || tags.includes("interactive") || tags.includes("ui");
            }).length
          ),
          label: "Interface Builds",
          note: "Projects where visual control and product feel are the main signal.",
        },
      ]
        .map(
          (item) => `
            <article class="metric-card">
              <span class="metric-card__value">${App.escapeHtml(item.value)}</span>
              <span class="metric-card__label">${App.escapeHtml(item.label)}</span>
              <p>${App.escapeHtml(item.note)}</p>
            </article>
          `
        )
        .join("");
    }

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
          <span class="case-card__proof-label">Single project read</span>
          <h3>${App.escapeHtml(selected[0].title)}</h3>
          <p>${App.escapeHtml(selected[0].proof)}</p>
        </div>
        ${buildCompareColumn(selected[0])}
      `;
    }

    const [left, right] = selected;
    const sharedStack = (left.stack || []).filter((item) => (right.stack || []).includes(item));
    return `
      <div class="compare-summary">
        <span class="case-card__proof-label">Comparison summary</span>
        <h3>${App.escapeHtml(left.title)} vs ${App.escapeHtml(right.title)}</h3>
        <p>${App.escapeHtml(sharedStack.length ? `Shared stack signal: ${sharedStack.join(", ")}.` : "These projects win in different areas with limited stack overlap.")}</p>
      </div>
      <div class="compare-columns">
        ${buildCompareColumn(left)}
        ${buildCompareColumn(right)}
      </div>
    `;
  }

  function buildCompareColumn(project) {
    const architectureNotes = (project.architecture || []).slice(0, 3);

    return `
      <article class="compare-column" style="${App.escapeHtml(projectThemeStyle(project))}">
        <div class="compare-column__header">
          <div class="case-card__meta">
            ${renderProjectIcon(project)}
            <div>
              <p class="project-kind">${App.escapeHtml(project.kind)}</p>
              <h3>${App.escapeHtml(project.title)}</h3>
            </div>
          </div>
          <span class="status-badge">${App.escapeHtml(project.status)}</span>
        </div>
        <p class="compare-column__summary">${App.escapeHtml(project.summary)}</p>
        ${buildProjectSignalCards(project, 2)}
        <div class="compare-summary compare-summary--column">
          <span class="case-card__proof-label">What it proves</span>
          <p>${App.escapeHtml(project.proof)}</p>
        </div>
        <div class="compare-list">
          ${architectureNotes
            .map(
              (item) => `
                <article class="compare-list__item">
                  <p>${App.escapeHtml(item)}</p>
                </article>
              `
            )
            .join("")}
        </div>
        <div class="compare-summary compare-summary--column">
          <span class="case-card__proof-label">Tradeoff</span>
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
      <div class="modal-layout" style="${App.escapeHtml(projectThemeStyle(project))}">
        <section class="modal-section">
          <div class="modal-project-brand">
            ${
              project.lockupImage
                ? `<img class="modal-project-lockup" src="${App.escapeHtml(project.lockupImage)}" alt="${App.escapeHtml(project.title)} logo" loading="lazy" decoding="async">`
                : renderProjectIcon(project)
            }
            <span class="status-badge">${App.escapeHtml(project.status)}</span>
          </div>
          <p class="eyebrow">Case Study</p>
          <h2 id="project-modal-title">${App.escapeHtml(project.title)}</h2>
          ${project.badge ? `<p class="project-badge project-badge--modal">${App.escapeHtml(project.badge)}</p>` : ""}
          <p>${App.escapeHtml(project.summary)}</p>
          <div class="modal-link-row">
            ${project.links?.live ? `<a class="button button--solid" href="${App.escapeHtml(App.safeHref(project.links.live, { allowRelative: false }))}" target="_blank" rel="noopener noreferrer">Open Live App</a>` : ""}
            ${project.links?.repo ? `<a class="button button--ghost" href="${App.escapeHtml(App.safeHref(project.links.repo, { allowRelative: false }))}" target="_blank" rel="noopener noreferrer">View Repo</a>` : ""}
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
    const proofProjects = (data.projects || []).filter((project) => project.links?.repo).length;

    summaryGrid.innerHTML = [
      { value: String(systems.length), label: "System routes" },
      { value: String(totalSteps), label: "Flow steps" },
      { value: String(proofProjects), label: "Repo-backed" },
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
            <a class="text-link" href="${App.escapeHtml(App.safeHref(repo.url, { allowRelative: false }))}" target="_blank" rel="noopener noreferrer">Open repository</a>
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
          <a class="button button--ghost" href="${App.escapeHtml(App.safeHref(data.profile.github, { allowRelative: false }))}" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a class="button button--ghost" href="${App.escapeHtml(App.safeHref(data.profile.linkedin, { allowRelative: false }))}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
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
            <a class="text-link" href="${App.escapeHtml(App.safeHref(resume.href))}" target="_blank" rel="noopener noreferrer">Open PDF</a>
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



