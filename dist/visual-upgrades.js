(function () {
  const App = window.PortfolioApp;
  if (!App || window.__UJALA_VISUAL_UPGRADES__) {
    return;
  }
  window.__UJALA_VISUAL_UPGRADES__ = true;

  const TECH_SYMBOLS = [
    { glyph: "AWS", label: "AWS Cloud", note: "Lambda, S3, DynamoDB, Cognito, API Gateway", tokens: ["aws", "lambda", "s3", "dynamodb", "cognito", "api gateway", "serverless"] },
    { glyph: "API", label: "Backend APIs", note: "Routes, auth, user flows, review logic", tokens: ["api", "backend", "node", "express", "auth", "server"] },
    { glyph: "JS", label: "JavaScript", note: "Frontend behavior, product logic, data shaping", tokens: ["javascript", "js", "frontend", "dashboard", "interactive"] },
    { glyph: "DB", label: "Data Layer", note: "Storage models and user-scoped records", tokens: ["dynamodb", "database", "data", "storage", "records"] },
    { glyph: "AI", label: "AI Workflows", note: "Analysis, guided explanation, prompt systems", tokens: ["ai", "openai", "analysis", "prompt", "mermaid", "diagram"] },
    { glyph: "UI", label: "Product UI", note: "Dashboards, glass panels, responsive proof routes", tokens: ["ui", "css", "html", "responsive", "frontend", "product"] },
    { glyph: "GH", label: "GitHub Proof", note: "Public repos, live links, deployment history", tokens: ["github", "repo", "repository", "deploy", "live"] },
    { glyph: "SEC", label: "Trust Layer", note: "Static-safe portfolio, CSP, scoped links", tokens: ["security", "safe", "csp", "static", "trust"] },
  ];

  const CONTACT_ROUTES = [
    { key: "email", icon: "@", label: "Email", title: "Primary direct route", description: "Best for opportunities, referrals, interview follow-up, and direct conversation about the work." },
    { key: "phone", icon: "PH", label: "Phone", title: "Fast call route", description: "Useful when a quick conversation is better than a long email thread." },
    { key: "github", icon: "GH", label: "GitHub", title: "Public code proof", description: "The strongest proof layer for repositories, project history, and implementation depth." },
    { key: "linkedin", icon: "in", label: "LinkedIn", title: "Professional context", description: "Role context, updates, and the public narrative around the shipped portfolio." },
  ];

  function assetPath(relativePath) {
    const cleanPath = String(relativePath || "").replace(/^\/+/, "");
    return window.location.pathname.includes("/safe/") ? `../${cleanPath}` : cleanPath;
  }

  function projectEvidence(projects) {
    return (projects || [])
      .map((project) => [project.title, project.kind, project.summary, project.proof, ...(project.tags || []), ...(project.stack || []), ...(project.details || []), ...(project.architecture || [])].join(" "))
      .join(" ")
      .toLowerCase();
  }

  function scoreTokens(projects, tokens) {
    const evidence = projectEvidence(projects);
    const hits = tokens.reduce((count, token) => count + (evidence.includes(token) ? 1 : 0), 0);
    return Math.max(36, Math.min(98, 38 + hits * 12));
  }

  function buildSymbolGrid(projects) {
    return TECH_SYMBOLS.map((symbol) => {
      const strength = scoreTokens(projects, symbol.tokens);
      return `
        <article class="tech-symbol-card electric-card">
          <span class="tech-symbol-card__glyph" aria-hidden="true">${App.escapeHtml(symbol.glyph)}</span>
          <span class="tech-symbol-card__label">${App.escapeHtml(symbol.label)}</span>
          <p>${App.escapeHtml(symbol.note)}</p>
          <span class="tech-symbol-card__meter" aria-hidden="true"><span style="width: ${strength}%"></span></span>
        </article>
      `;
    }).join("");
  }

  function capabilityScores(projects) {
    return [
      { label: "Cloud", value: scoreTokens(projects, ["aws", "lambda", "dynamodb", "s3", "cognito", "serverless"]) },
      { label: "Backend", value: scoreTokens(projects, ["api", "backend", "auth", "node", "storage", "workflow"]) },
      { label: "AI", value: scoreTokens(projects, ["ai", "analysis", "mermaid", "prompt", "diagram", "openai"]) },
      { label: "UI", value: scoreTokens(projects, ["ui", "frontend", "dashboard", "css", "responsive", "product"]) },
      { label: "Delivery", value: scoreTokens(projects, ["github", "repo", "live", "deploy", "render", "static"]) },
    ];
  }

  function buildGraph(scores) {
    const width = 520;
    const height = 190;
    const padding = 32;
    const step = scores.length > 1 ? (width - padding * 2) / (scores.length - 1) : 0;
    const points = scores.map((score, index) => {
      const x = padding + step * index;
      const y = height - padding - ((height - padding * 2) * score.value) / 100;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    const dots = scores.map((score, index) => {
      const x = padding + step * index;
      const y = height - padding - ((height - padding * 2) * score.value) / 100;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.4" />`;
    }).join("");
    const bars = scores.map((score) => `
      <div class="proof-bar">
        <span>${App.escapeHtml(score.label)}</span>
        <strong>${score.value}</strong>
        <i style="width: ${score.value}%"></i>
      </div>
    `).join("");

    return `
      <svg class="proof-graph" viewBox="0 0 ${width} ${height}" role="img" aria-label="Capability strength graph">
        <defs>
          <linearGradient id="proofGraphLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#8df4ff" />
            <stop offset="0.58" stop-color="#74e6b6" />
            <stop offset="1" stop-color="#8aa8ff" />
          </linearGradient>
          <filter id="proofGraphGlow" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path class="proof-graph__grid" d="M32 40 H488 M32 82 H488 M32 124 H488 M32 166 H488" />
        <polyline class="proof-graph__line" points="${points}" />
        <g class="proof-graph__dots">${dots}</g>
      </svg>
      <div class="proof-bars">${bars}</div>
    `;
  }

  function renderTechShowcase() {
    if (document.body.dataset.page !== "home") {
      return;
    }
    const section = document.querySelector(".section--skills-board");
    if (!section) {
      return;
    }
    let showcase = document.getElementById("home-tech-showcase");
    if (!showcase) {
      showcase = document.createElement("div");
      showcase.id = "home-tech-showcase";
      showcase.className = "tech-showcase";
      section.appendChild(showcase);
    }

    const data = App.getData();
    const projects = App.getProjectsForMode();
    const scores = capabilityScores(projects);
    const repoCount = (data.projects || []).filter((project) => project.links?.repo).length;
    const liveCount = (data.projects || []).filter((project) => project.links?.live).length;
    const leadProject = projects[0]?.title || "portfolio";

    showcase.innerHTML = `
      <article class="tech-panel panel electric-card">
        <span class="electric-card__line electric-card__line--top" aria-hidden="true"></span>
        <div class="tech-panel__top">
          <div>
            <p class="eyebrow eyebrow--small">Tech Stack Console</p>
            <h3>Symbols mapped to real project proof.</h3>
          </div>
          <span class="tech-panel__badge">${App.escapeHtml(App.getModeConfig().label)} lens</span>
        </div>
        <div class="tech-symbol-grid">${buildSymbolGrid(projects)}</div>
      </article>
      <article class="tech-panel proof-graph-card panel electric-card">
        <span class="electric-card__line electric-card__line--right" aria-hidden="true"></span>
        <div class="tech-panel__top">
          <div>
            <p class="eyebrow eyebrow--small">Proof Graph</p>
            <h3>Capability signal from shipped work.</h3>
          </div>
          <span class="tech-panel__badge">${repoCount} repos / ${liveCount} live</span>
        </div>
        ${buildGraph(scores)}
        <p class="proof-graph-card__note">Lead proof right now: ${App.escapeHtml(leadProject)}. The graph is generated from stack, project detail, live links, and repo-backed evidence.</p>
      </article>
    `;
  }

  function renderArchitecturePanel() {
    if (document.body.dataset.page !== "systems") {
      return;
    }
    const stack = document.getElementById("systems-stack");
    if (!stack) {
      return;
    }
    let panel = document.getElementById("systems-architecture-map");
    if (!panel) {
      panel = document.createElement("article");
      panel.id = "systems-architecture-map";
      stack.prepend(panel);
    }
    const systems = (App.getData().systems || []).slice(0, 3);
    const projects = App.getProjectsForMode().slice(0, 3);
    panel.className = "architecture-proof-panel panel electric-card";
    panel.innerHTML = `
      <span class="electric-card__line electric-card__line--top" aria-hidden="true"></span>
      <div class="architecture-proof-panel__copy">
        <p class="eyebrow">Architecture Image Layer</p>
        <h2>A clear system map for the work behind the portfolio.</h2>
        <p>This panel turns the portfolio into an engineering read: inputs, identity, APIs, storage, AI analysis, deployment, and public proof routes.</p>
        <div class="architecture-chip-row">
          ${projects.map((project) => `<span class="pill">${App.escapeHtml(project.title)}</span>`).join("")}
        </div>
      </div>
      <figure class="architecture-map-frame">
        <img src="${App.escapeHtml(assetPath("content/architecture-proof-map.svg"))}" alt="Architecture map showing portfolio inputs, APIs, storage, AI analysis, GitHub proof, and Render deployment" loading="lazy" decoding="async">
      </figure>
      <div class="architecture-route-grid">
        ${systems.map((system, index) => `
          <article class="architecture-route-card electric-card">
            <span class="architecture-route-card__index">0${index + 1}</span>
            <div><h3>${App.escapeHtml(system.title)}</h3><p>${App.escapeHtml(system.summary)}</p></div>
          </article>
        `).join("")}
      </div>
    `;
    stack.querySelectorAll(".system-card").forEach((card) => card.classList.add("electric-card"));
  }

  function routeHref(route, data) {
    if (route.key === "email") return App.safeHref(`mailto:${data.profile.email}`, { allowContact: true, allowRelative: false });
    if (route.key === "phone") return App.safeHref(`tel:${String(data.profile.phone || "").replace(/\s+/g, "")}`, { allowContact: true, allowRelative: false });
    if (route.key === "github") return App.safeHref(data.profile.github, { allowRelative: false });
    if (route.key === "linkedin") return App.safeHref(data.profile.linkedin, { allowRelative: false });
    return "#";
  }

  function routeValue(route, data) {
    if (route.key === "email") return data.profile.email;
    if (route.key === "phone") return data.profile.phone;
    if (route.key === "github") return "github.com/agarwalujala3-lang";
    if (route.key === "linkedin") return "linkedin.com/in/ujala-agarwal";
    return route.label;
  }

  function renderContactPanel() {
    if (document.body.dataset.page !== "contact") {
      return;
    }
    const grid = document.getElementById("contact-grid");
    if (!grid) {
      return;
    }
    const data = App.getData();
    grid.innerHTML = CONTACT_ROUTES.map((route) => {
      const isExternal = route.key === "github" || route.key === "linkedin";
      return `
        <article class="contact-card contact-route-card electric-card">
          <span class="electric-card__line electric-card__line--top" aria-hidden="true"></span>
          <div class="contact-route-card__header">
            <span class="contact-route-card__icon" aria-hidden="true">${App.escapeHtml(route.icon)}</span>
            <span class="contact-card__label">${App.escapeHtml(route.label)}</span>
          </div>
          <h2>${App.escapeHtml(route.title)}</h2>
          <a class="contact-route-card__link" href="${App.escapeHtml(routeHref(route, data))}"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ""}>
            <span>${App.escapeHtml(routeValue(route, data))}</span><b aria-hidden="true">OPEN</b>
          </a>
          <p>${App.escapeHtml(route.description)}</p>
        </article>
      `;
    }).join("");

    document.querySelectorAll(".resume-card__top").forEach((top) => {
      if (!top.querySelector(".resume-card__icon")) {
        const icon = document.createElement("span");
        icon.className = "resume-card__icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "CV";
        top.appendChild(icon);
      }
    });
  }

  function renderVisualUpgrades() {
    renderTechShowcase();
    renderArchitecturePanel();
    renderContactPanel();
  }

  const originalRenderAll = App.renderAll;
  App.renderAll = function patchedRenderAll(...args) {
    originalRenderAll.apply(this, args);
    renderVisualUpgrades();
  };

  window.addEventListener("DOMContentLoaded", () => {
    window.requestAnimationFrame(renderVisualUpgrades);
  });
})();
