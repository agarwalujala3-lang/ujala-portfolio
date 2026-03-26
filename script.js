let data = window.UJOS_DATA || {};
const MODE_KEY = "ujala-portfolio-mode";

const state = {
  mode: readStoredMode(),
  filter: "all",
  paletteOpen: false,
  guidePrompt: null,
  brainHistory: [],
  brainPending: false,
};

let paletteHideTimer = null;

const PICO_ACTION_CLASSES = [
  "is-wave",
  "is-pointing",
  "is-happy",
  "is-curious",
  "is-listening",
  "is-sleepy",
  "is-excited",
];

const PICO_IDLE_BEATS = [
  {
    message: "I can guide you through projects, systems, or contact routes whenever you want.",
    action: "curious",
  },
  {
    message: "Still here. Tap a route and I will react to it.",
    action: "wave",
  },
  {
    message: "If you pause for a bit, I go into soft idle mode.",
    action: "sleepy",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  injectViewportFx();
  applyMode();
  syncCurrentNav();
  injectCommandPalette();
  injectProjectModal();
  injectPico();
  bindGlobalEvents();
  renderAll();
  initRevealObserver();
  initMotionPolish();

  window.requestAnimationFrame(() => {
    document.querySelectorAll(".reveal").forEach((element) => {
      if (element.classList.contains("reveal--hero")) {
        element.classList.add("is-visible");
      }
    });
    releasePageWipe();
  });

  queuePicoIdle();
  loadRuntimeData();
});

function readStoredMode() {
  try {
    const storedMode = window.localStorage.getItem(MODE_KEY);
    return data.modes && data.modes[storedMode] ? storedMode : "recruiter";
  } catch {
    return "recruiter";
  }
}

function storeMode(mode) {
  try {
    window.localStorage.setItem(MODE_KEY, mode);
  } catch {
    // Storage failures should not block the portfolio.
  }
}

function applyMode() {
  document.body.dataset.mode = state.mode;
}

function syncCurrentNav() {
  const currentPage = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((item) => {
    const isCurrent = item.dataset.nav === currentPage;
    item.classList.toggle("is-current", isCurrent);
    if (isCurrent) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

function renderAll() {
  renderModeSwitch();
  renderHome();
  renderGuideSection();
  renderBrainSection();
  renderProjectsPage();
  renderSystemsPage();
  renderJourneyPage();
  renderLabPage();
  renderContactPage();
  renderNextRoute();
  updatePicoForPage();
  bindPicoHints();
  bindPicoSurfaceReactions();
  bindPicoSelfInteractions();
}

async function loadRuntimeData() {
  try {
    const response = await window.fetch("portfolio-runtime.json", { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const runtimeData = await response.json();
    mergeRuntimeData(runtimeData);
    renderAll();
    initRevealObserver();
    initMotionPolish();
    bindPageTransitions();
    handleViewportChange();
  } catch {
    // Runtime data is optional. The static portfolio remains the fallback.
  }
}

function mergeRuntimeData(runtimeData) {
  if (!runtimeData || typeof runtimeData !== "object") {
    return;
  }

  data = {
    ...data,
    ...(runtimeData.overrides || {}),
    runtime: {
      ...(data.runtime || {}),
      ...(runtimeData.sync ? { sync: runtimeData.sync } : {}),
      ...(runtimeData.githubActivity ? { githubActivity: runtimeData.githubActivity } : {}),
      ...(runtimeData.brain ? { brain: runtimeData.brain } : {}),
    },
    ...(runtimeData.learningLog ? { learningLog: runtimeData.learningLog } : {}),
    ...(runtimeData.ideaInbox ? { ideaInbox: runtimeData.ideaInbox } : {}),
    ...(runtimeData.roadmap ? { roadmap: runtimeData.roadmap } : {}),
    ...(runtimeData.lab ? { lab: { ...(data.lab || {}), ...runtimeData.lab } } : {}),
  };
}

function getModeConfig() {
  return data.modes[state.mode] || data.modes.recruiter;
}

function getProjectsForMode() {
  const mode = getModeConfig();
  const order = mode.projectOrder || [];
  const indexMap = new Map(order.map((id, index) => [id, index]));
  return [...data.projects].sort((left, right) => {
    const leftIndex = indexMap.has(left.id) ? indexMap.get(left.id) : 999;
    const rightIndex = indexMap.has(right.id) ? indexMap.get(right.id) : 999;
    return leftIndex - rightIndex;
  });
}

function renderModeSwitch() {
  const modeSwitch = document.getElementById("mode-switch");
  const modeSummary = document.getElementById("mode-summary");
  const modeFocus = document.getElementById("mode-focus");
  const modeChip = document.getElementById("mode-chip");
  const modeKicker = document.getElementById("mode-kicker");
  const projectsModeKicker = document.getElementById("projects-mode-kicker");
  const projectsModeTitle = document.getElementById("projects-mode-title");
  const projectsModeSummary = document.getElementById("projects-mode-summary");

  const mode = getModeConfig();

  if (modeChip) {
    modeChip.textContent = mode.label;
  }

  if (modeKicker) {
    modeKicker.textContent = mode.kicker;
  }

  if (projectsModeKicker) {
    projectsModeKicker.textContent = mode.kicker;
  }

  if (projectsModeTitle) {
    projectsModeTitle.textContent = `This ${mode.label.toLowerCase()} route is active right now.`;
  }

  if (projectsModeSummary) {
    projectsModeSummary.textContent = mode.summary;
  }

  if (!modeSwitch) {
    return;
  }

  modeSwitch.innerHTML = "";
  Object.entries(data.modes).forEach(([modeKey, modeConfig]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mode-switch__item";
    button.dataset.modeSet = modeKey;
    button.textContent = modeConfig.label;
    if (modeKey === state.mode) {
      button.classList.add("is-active");
    }
    modeSwitch.appendChild(button);
  });

  if (modeSummary) {
    modeSummary.textContent = mode.summary;
  }

  if (modeFocus) {
    modeFocus.innerHTML = "";
    mode.focus.forEach((item) => {
      const pill = document.createElement("span");
      pill.className = "focus-pill";
      pill.textContent = item;
      modeFocus.appendChild(pill);
    });
  }

  modeSwitch.querySelectorAll("[data-mode-set]").forEach((button) => {
    button.addEventListener("click", () => {
      setMode(button.dataset.modeSet, true);
    });
  });
}

function setMode(mode, celebrate = false) {
  if (!data.modes[mode]) {
    return;
  }
  state.mode = mode;
  applyMode();
  storeMode(mode);
  renderAll();
  if (celebrate) {
    setPicoMessage(data.modes[mode].picoGreeting, "happy");
  }
}

function renderHome() {
  const heroTitle = document.getElementById("hero-title");
  const heroLead = document.getElementById("hero-lead");
  const modeSummary = document.getElementById("mode-summary");
  const consoleHighlights = document.getElementById("console-highlights");
  const signalGrid = document.getElementById("signal-grid");
  const featuredProjects = document.getElementById("featured-projects");

  if (!heroTitle) {
    return;
  }

  const mode = getModeConfig();
  heroTitle.textContent = mode.heroTitle;
  heroLead.textContent = mode.heroLead;

  if (modeSummary) {
    modeSummary.textContent = mode.summary;
  }

  if (consoleHighlights) {
    consoleHighlights.innerHTML = "";
    mode.highlights.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "story-card";
      card.innerHTML = `
        <strong>0${index + 1}</strong>
        <p>${escapeHtml(item)}</p>
      `;
      consoleHighlights.appendChild(card);
    });
  }

  if (signalGrid) {
    signalGrid.innerHTML = "";
    data.signals.forEach((signal) => {
      const card = document.createElement("article");
      card.className = "signal-card";
      card.innerHTML = `
        <strong>${escapeHtml(signal.value)}</strong>
        <span>${escapeHtml(signal.label)}</span>
        <p>${escapeHtml(signal.note)}</p>
      `;
      signalGrid.appendChild(card);
    });
  }

  if (featuredProjects) {
    featuredProjects.innerHTML = "";
    getProjectsForMode().slice(0, 2).forEach((project) => {
      featuredProjects.appendChild(createProjectCard(project, true));
    });
    bindProjectCardActions();
  }
}

function renderGuideSection() {
  const guideIntro = document.getElementById("guide-intro");
  const guideChipList = document.getElementById("guide-chip-list");
  const guideTitle = document.getElementById("guide-answer-title");
  const guideText = document.getElementById("guide-answer-text");
  const guideLink = document.getElementById("guide-answer-link");

  if (!guideIntro || !guideChipList || !guideTitle || !guideText || !guideLink || !data.guide) {
    return;
  }

  const prompts = data.guide.prompts || [];
  if (!prompts.length) {
    return;
  }

  if (!state.guidePrompt || !prompts.find((item) => item.id === state.guidePrompt)) {
    state.guidePrompt = prompts[0].id;
  }

  const activePrompt = prompts.find((item) => item.id === state.guidePrompt) || prompts[0];

  guideIntro.textContent = data.guide.intro;
  guideChipList.innerHTML = "";
  prompts.forEach((prompt) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "guide-chip";
    button.textContent = prompt.label;
    button.dataset.guidePrompt = prompt.id;
    button.classList.toggle("is-active", prompt.id === activePrompt.id);
    button.addEventListener("click", () => {
      state.guidePrompt = prompt.id;
      renderGuideSection();
      setPicoMessage(`Guide switched to ${prompt.label.toLowerCase()}.`, "listening", 1800);
    });
    guideChipList.appendChild(button);
  });

  guideTitle.textContent = activePrompt.title;
  guideText.textContent = activePrompt.answer;
  guideLink.textContent = activePrompt.routeLabel;
  guideLink.href = activePrompt.routeHref;
}

function renderBrainSection() {
  const statusText = document.getElementById("brain-status-text");
  const promptList = document.getElementById("brain-prompt-list");
  const thread = document.getElementById("brain-thread");
  const form = document.getElementById("brain-form");
  const clearButton = document.getElementById("brain-clear");
  const submitButton = document.getElementById("brain-submit");

  if (!statusText || !promptList || !thread || !form || !clearButton || !submitButton || !data.brain) {
    return;
  }

  const runtimeBrain = (data.runtime && data.runtime.brain) || {};
  const isConnected = Boolean(runtimeBrain.apiUrl);
  statusText.textContent = isConnected
    ? `${runtimeBrain.label || "Live brain connected."} Tuned for ${getModeConfig().label.toLowerCase()} mode.`
    : data.brain.fallback;

  promptList.innerHTML = "";
  (data.brain.prompts || []).forEach((prompt) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "guide-chip";
    button.textContent = prompt;
    button.addEventListener("click", () => {
      const input = document.getElementById("brain-input");
      if (input) {
        input.value = prompt;
        input.focus();
      }
      setPicoMessage("Question loaded. Send it when you are ready.", "listening", 1500);
    });
    promptList.appendChild(button);
  });

  renderBrainThread();

  if (!form.dataset.bound) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = document.getElementById("brain-input");
      const question = input ? input.value.trim() : "";
      if (!question || state.brainPending) {
        return;
      }
      await askPortfolioBrain(question);
    });
    form.dataset.bound = "true";
  }

  if (!clearButton.dataset.bound) {
    clearButton.addEventListener("click", () => {
      state.brainHistory = [];
      renderBrainThread();
      setPicoMessage("Brain thread cleared.", "wave", 1200);
    });
    clearButton.dataset.bound = "true";
  }

  submitButton.disabled = state.brainPending;
}

function renderBrainThread() {
  const thread = document.getElementById("brain-thread");
  if (!thread) {
    return;
  }

  if (!state.brainHistory.length && !state.brainPending) {
    thread.innerHTML = `
      <article class="brain-message brain-message--assistant">
        <span class="brain-message__label">Portfolio Brain</span>
        <p>Ask me about projects, AWS work, what I am learning, or which route you should open first.</p>
      </article>
    `;
    return;
  }

  const messages = [...state.brainHistory];
  if (state.brainPending) {
    messages.push({
      role: "assistant",
      text: "Thinking through the portfolio context...",
      pending: true,
    });
  }

  thread.innerHTML = messages
    .map(
      (message) => `
        <article class="brain-message brain-message--${escapeHtml(message.role)}${message.pending ? " is-pending" : ""}">
          <span class="brain-message__label">${message.role === "user" ? "You" : "Portfolio Brain"}</span>
          <p>${formatMultilineText(message.text)}</p>
        </article>
      `
    )
    .join("");
}

async function askPortfolioBrain(question) {
  const runtimeBrain = (data.runtime && data.runtime.brain) || {};
  const input = document.getElementById("brain-input");

  state.brainHistory.push({ role: "user", text: question });
  state.brainPending = true;
  renderBrainThread();
  if (input) {
    input.value = "";
  }

  if (!runtimeBrain.apiUrl) {
    state.brainPending = false;
    state.brainHistory.push({
      role: "assistant",
      text: data.brain.fallback,
    });
    renderBrainThread();
    setPicoMessage("The live brain is not connected yet, so I fell back to the static guide.", "sleepy", 2200);
    return;
  }

  try {
    const response = await window.fetch(runtimeBrain.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        mode: state.mode,
        page: document.body.dataset.page,
        history: state.brainHistory.slice(-6),
      }),
    });

    if (!response.ok) {
      throw new Error(`Brain request failed with status ${response.status}`);
    }

    const payload = await response.json();
    state.brainHistory.push({
      role: "assistant",
      text: payload.reply || "The portfolio brain did not return a usable answer.",
    });
    setPicoMessage("Brain reply ready.", "excited", 1600);
  } catch {
    state.brainHistory.push({
      role: "assistant",
      text: "The live portfolio brain could not answer right now. You can still use the portfolio guide, project dossiers, and systems route while I reconnect.",
    });
    setPicoMessage("The live brain hit a connection problem.", "sleepy", 2200);
  } finally {
    state.brainPending = false;
    renderBrainThread();
  }
}

function renderProjectsPage() {
  const projectGrid = document.getElementById("project-grid");
  const filterBar = document.getElementById("project-filters");

  if (!projectGrid) {
    return;
  }

  if (filterBar && !filterBar.dataset.bound) {
    filterBar.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        state.filter = button.dataset.filter;
        filterBar.querySelectorAll("[data-filter]").forEach((chip) => {
          chip.classList.toggle("is-active", chip.dataset.filter === state.filter);
        });
        drawProjectGrid();
        setPicoMessage(`Filter set to ${button.textContent}.`, "pointing");
      });
    });
    filterBar.dataset.bound = "true";
  }

  drawProjectGrid();
}

function drawProjectGrid() {
  const projectGrid = document.getElementById("project-grid");
  if (!projectGrid) {
    return;
  }

  projectGrid.innerHTML = "";
  getFilteredProjects().forEach((project) => {
    projectGrid.appendChild(createProjectCard(project, false));
  });

  bindProjectCardActions();
}

function getFilteredProjects() {
  const allProjects = getProjectsForMode();
  if (state.filter === "all") {
    return allProjects;
  }
  return allProjects.filter((project) => project.tags.includes(state.filter));
}

function createProjectCard(project, compact = false) {
  const article = document.createElement("article");
  article.className = "project-card";

  const stack = project.stack
    .slice(0, compact ? 4 : 6)
    .map((item) => `<span class="stack-pill">${escapeHtml(item)}</span>`)
    .join("");

  article.innerHTML = `
    <div class="project-card__top">
      <div class="project-icon" data-accent="${escapeHtml(project.accent)}">${escapeHtml(project.icon)}</div>
      <span class="status-chip">${escapeHtml(project.status)}</span>
    </div>
    <div class="project-card__meta">
      <div>
        <p class="project-card__kind">${escapeHtml(project.kind)}</p>
        <h3>${escapeHtml(project.title)}</h3>
      </div>
    </div>
    <p>${escapeHtml(project.summary)}</p>
    <div class="project-card__proof">${escapeHtml(project.proof)}</div>
    <div class="stack-list">${stack}</div>
    <div class="project-actions">
      <button class="mini-link" type="button" data-open-project="${escapeHtml(project.id)}">Open dossier</button>
      <a class="mini-link" href="${escapeHtml(project.links.live)}" target="_blank" rel="noreferrer">Live</a>
      <a class="mini-link" href="${escapeHtml(project.links.repo)}" target="_blank" rel="noreferrer">Repo</a>
    </div>
  `;

  return article;
}

function bindProjectCardActions() {
  document.querySelectorAll("[data-open-project]").forEach((button) => {
    if (button.dataset.bound) {
      return;
    }
    button.addEventListener("click", () => {
      openProjectModal(button.dataset.openProject);
    });
    button.dataset.bound = "true";
  });
}

function openProjectModal(projectId) {
  const modal = document.getElementById("project-modal");
  const body = document.getElementById("project-modal-body");
  const project = data.projects.find((item) => item.id === projectId);

  if (!modal || !body || !project) {
    return;
  }

  body.innerHTML = `
    <div class="modal-project-head">
      <p class="eyebrow">${escapeHtml(project.kind)}</p>
      <h2 id="project-modal-title">${escapeHtml(project.title)}</h2>
      <p>${escapeHtml(project.summary)}</p>
    </div>
    <div class="modal-project-grid">
      <section class="modal-box">
        <h3>Why it matters</h3>
        <p>${escapeHtml(project.proof)}</p>
        <h3>Details</h3>
        <ul class="modal-list">
          ${project.details.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>
      <section class="modal-box">
        <h3>Architecture flow</h3>
        <ul class="modal-list">
          ${project.architecture.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
        <h3>Tradeoff</h3>
        <p>${escapeHtml(project.tradeoff)}</p>
      </section>
    </div>
    <div class="project-actions">
      <a class="mini-link" href="${escapeHtml(project.links.live)}" target="_blank" rel="noreferrer">Open live project</a>
      <a class="mini-link" href="${escapeHtml(project.links.repo)}" target="_blank" rel="noreferrer">Open GitHub repo</a>
    </div>
  `;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setPicoMessage(`Dossier open for ${project.title}.`, "happy");
}

function closeProjectModal() {
  const modal = document.getElementById("project-modal");
  if (!modal) {
    return;
  }
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function injectProjectModal() {
  if (document.getElementById("project-modal")) {
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "modal-shell";
  wrapper.id = "project-modal";
  wrapper.setAttribute("aria-hidden", "true");
  wrapper.innerHTML = `
    <div class="modal-backdrop" data-modal-close></div>
    <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
      <button class="modal-close" type="button" data-modal-close aria-label="Close project details">×</button>
      <div id="project-modal-body"></div>
    </div>
  `;

  document.body.appendChild(wrapper);
}

function renderSystemsPage() {
  const systemsStack = document.getElementById("systems-stack");
  if (!systemsStack) {
    return;
  }

  systemsStack.innerHTML = "";
  data.systems.forEach((system) => {
    const article = document.createElement("article");
    article.className = "system-card reveal";
    article.innerHTML = `
      <div class="system-card__header">
        <div>
          <p class="eyebrow eyebrow--small">${escapeHtml(system.subtitle)}</p>
          <h2>${escapeHtml(system.title)}</h2>
        </div>
      </div>
      <p>${escapeHtml(system.summary)}</p>
      <div class="system-route">
        ${system.steps
          .map(
            (step) => `
          <article class="system-step">
            <span class="system-step__label">${escapeHtml(step.label)}</span>
            <p>${escapeHtml(step.text)}</p>
          </article>
        `
          )
          .join("")}
      </div>
      <h3>Key decisions</h3>
      <ul class="decision-list">
        ${system.decisions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    `;
    systemsStack.appendChild(article);
  });
}

function renderJourneyPage() {
  const timeline = document.getElementById("journey-timeline");
  const principleList = document.getElementById("principle-list");

  if (timeline) {
    timeline.innerHTML = "";
    data.journey.forEach((entry) => {
      const card = document.createElement("article");
      card.className = "timeline-card";
      card.innerHTML = `
        <div class="timeline-card__phase">${escapeHtml(entry.phase)}</div>
        <h3>${escapeHtml(entry.title)}</h3>
        <p>${escapeHtml(entry.text)}</p>
      `;
      timeline.appendChild(card);
    });
  }

  if (principleList) {
    principleList.innerHTML = "";
    data.principles.forEach((principle, index) => {
      const card = document.createElement("article");
      card.className = "principle-item";
      card.innerHTML = `
        <strong>0${index + 1}</strong>
        <p>${escapeHtml(principle)}</p>
      `;
      principleList.appendChild(card);
    });
  }
}

function renderLabPage() {
  const nowBuildingList = document.getElementById("now-building-list");
  const nextExperimentsList = document.getElementById("next-experiments-list");
  const toolCloud = document.getElementById("tool-cloud");
  const learningLogList = document.getElementById("learning-log-list");
  const ideaInboxList = document.getElementById("idea-inbox-list");
  const roadmapList = document.getElementById("roadmap-list");
  const syncStatusGrid = document.getElementById("sync-status-grid");
  const githubActivityFeed = document.getElementById("github-activity-feed");

  if (nowBuildingList) {
    nowBuildingList.innerHTML = data.lab.nowBuilding
      .map((item) => `<span class="stack-pill">${escapeHtml(item)}</span>`)
      .join("");
  }

  if (nextExperimentsList) {
    nextExperimentsList.innerHTML = data.lab.nextExperiments
      .map((item) => `<span class="stack-pill">${escapeHtml(item)}</span>`)
      .join("");
  }

  if (toolCloud) {
    toolCloud.innerHTML = data.lab.toolkit
      .map((item) => `<span class="tool-chip">${escapeHtml(item)}</span>`)
      .join("");
  }

  if (learningLogList) {
    learningLogList.innerHTML = "";
    (data.learningLog || []).forEach((entry) => {
      const card = document.createElement("article");
      card.className = "insight-card";
      card.innerHTML = `
        <span class="insight-card__label">${escapeHtml(entry.phase)}</span>
        <h3>${escapeHtml(entry.title)}</h3>
        <p>${escapeHtml(entry.note)}</p>
      `;
      learningLogList.appendChild(card);
    });
  }

  if (ideaInboxList) {
    ideaInboxList.innerHTML = "";
    (data.ideaInbox || []).forEach((entry) => {
      const card = document.createElement("article");
      card.className = "insight-card";
      card.innerHTML = `
        <span class="insight-card__label">${escapeHtml(entry.label)}</span>
        <p>${escapeHtml(entry.note)}</p>
      `;
      ideaInboxList.appendChild(card);
    });
  }

  if (roadmapList) {
    roadmapList.innerHTML = "";
    (data.roadmap || []).forEach((entry) => {
      const card = document.createElement("article");
      card.className = "roadmap-card";
      card.innerHTML = `
        <span class="roadmap-card__stage">${escapeHtml(entry.stage)}</span>
        <h3>${escapeHtml(entry.title)}</h3>
        <p>${escapeHtml(entry.note)}</p>
      `;
      roadmapList.appendChild(card);
    });
  }

  if (syncStatusGrid) {
    const sync = (data.runtime && data.runtime.sync) || null;
    const syncItems = sync
      ? [
          { label: "Status", value: sync.status || "ready" },
          { label: "Last sync", value: sync.syncedAtLabel || sync.syncedAt || "manual" },
          { label: "Repos tracked", value: String(sync.repoCount || 0) },
        ]
      : [
          { label: "Status", value: "static" },
          { label: "Last sync", value: "manual" },
          { label: "Repos tracked", value: "0" },
        ];

    syncStatusGrid.innerHTML = syncItems
      .map(
        (item) => `
          <article class="sync-card">
            <span class="sync-card__label">${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(item.value)}</strong>
          </article>
        `
      )
      .join("");
  }

  if (githubActivityFeed) {
    const activity = ((data.runtime && data.runtime.githubActivity) || []).slice(0, 4);
    githubActivityFeed.innerHTML = "";

    if (!activity.length) {
      githubActivityFeed.innerHTML = `
        <article class="activity-card">
          <span class="activity-card__label">GitHub Feed</span>
          <p>Runtime sync has not pulled repository activity yet, so the static portfolio data is still being used.</p>
        </article>
      `;
    } else {
      activity.forEach((repo) => {
        const card = document.createElement("article");
        card.className = "activity-card";
        card.innerHTML = `
          <span class="activity-card__label">${escapeHtml(repo.language || "Repo update")}</span>
          <h3>${escapeHtml(repo.name)}</h3>
          <p>${escapeHtml(repo.note)}</p>
          <a class="mini-link" href="${escapeHtml(repo.url)}" target="_blank" rel="noreferrer">Open repo</a>
        `;
        githubActivityFeed.appendChild(card);
      });
    }
  }
}

function renderContactPage() {
  const resumeGrid = document.getElementById("resume-grid");
  if (!resumeGrid) {
    return;
  }

  resumeGrid.innerHTML = "";
  data.profile.resumes.forEach((resume) => {
    const card = document.createElement("article");
    card.className = "resume-card";
    card.innerHTML = `
      <div class="resume-card__top">
        <span class="resume-card__eyebrow">Resume Route</span>
        <span class="status-chip">PDF</span>
      </div>
      <h3>${escapeHtml(resume.label)}</h3>
      <p class="resume-card__note">${escapeHtml(resume.note)}</p>
      <a class="mini-link" href="${escapeHtml(resume.href)}" target="_blank" rel="noreferrer">Open</a>
    `;
    resumeGrid.appendChild(card);
  });
}

function renderNextRoute() {
  const shell = document.querySelector("main.shell");
  const page = document.body.dataset.page;
  if (!shell || !page) {
    return;
  }

  const existingInjected = document.getElementById("global-next-route");
  if (existingInjected) {
    existingInjected.remove();
  }

  if (shell.querySelector(".next-panel")) {
    return;
  }

  const routeMap = {
    home: {
      eyebrow: "Next Route",
      title: "Move from the overview into the full project dossiers.",
      href: "work.html",
      label: "Open Projects",
      message: "Projects page is next if you want the strongest proof first.",
    },
    about: {
      eyebrow: "Next Route",
      title: "Move from the journey into the experimental lab.",
      href: "playground.html",
      label: "Open Lab",
      message: "Lab route shows what I am exploring next.",
    },
    playground: {
      eyebrow: "Next Route",
      title: "Move from the lab into direct contact and resume routes.",
      href: "contact.html",
      label: "Open Contact",
      message: "Contact route is the cleanest exit if you want to reach me directly.",
    },
    contact: {
      eyebrow: "Loop Back",
      title: "Return to the homepage and switch to a different visitor route.",
      href: "index.html",
      label: "Back to Home",
      message: "Home route lets you restart the tour from a different angle.",
    },
  };

  const route = routeMap[page];
  if (!route) {
    return;
  }

  const section = document.createElement("section");
  section.className = "section-block reveal";
  section.id = "global-next-route";
  section.innerHTML = `
    <a class="panel panel--cta next-panel" href="${escapeHtml(route.href)}" data-pico-message="${escapeHtml(route.message)}">
      <p class="eyebrow">${escapeHtml(route.eyebrow)}</p>
      <h2>${escapeHtml(route.title)}</h2>
      <span>${escapeHtml(route.label)}</span>
    </a>
  `;

  shell.appendChild(section);
}

function injectCommandPalette() {
  if (document.querySelector(".command-palette")) {
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "command-palette";
  wrapper.innerHTML = `
    <div class="command-palette__backdrop" data-command-close></div>
    <div class="command-palette__panel" role="dialog" aria-modal="true" aria-label="Command palette">
      <input class="command-palette__input" id="command-input" type="text" placeholder="Search routes, resumes, and live proof..." />
      <div class="command-list" id="command-list"></div>
    </div>
  `;
  document.body.appendChild(wrapper);
  wrapper.hidden = true;
  wrapper.setAttribute("aria-hidden", "true");
  renderCommandList("");
}

function injectViewportFx() {
  if (!document.querySelector(".page-progress")) {
    const progress = document.createElement("div");
    progress.className = "page-progress";
    progress.innerHTML = `<div class="page-progress__bar" id="page-progress-bar"></div>`;
    document.body.appendChild(progress);
  }

  if (!document.querySelector(".page-wipe")) {
    const wipe = document.createElement("div");
    wipe.className = "page-wipe is-active";
    wipe.id = "page-wipe";
    document.body.appendChild(wipe);
  }
}

function releasePageWipe() {
  const wipe = document.getElementById("page-wipe");
  if (!wipe) {
    return;
  }
  window.setTimeout(() => {
    wipe.classList.remove("is-active");
  }, 50);
}

function triggerPageWipe() {
  const wipe = document.getElementById("page-wipe");
  if (!wipe) {
    return;
  }
  wipe.classList.add("is-active");
}

function commandItems() {
  const commands = [
    {
      label: "Go to Home",
      hint: "Open the adaptive homepage",
      action: () => goTo("index.html"),
    },
    {
      label: "Go to Projects",
      hint: "Open the project dossiers",
      action: () => goTo("work.html"),
    },
    {
      label: "Go to Systems",
      hint: "Open the architecture route",
      action: () => goTo("systems.html"),
    },
    {
      label: "Go to Journey",
      hint: "Open my journey page",
      action: () => goTo("about.html"),
    },
    {
      label: "Go to Lab",
      hint: "Open experiments and toolkit page",
      action: () => goTo("playground.html"),
    },
    {
      label: "Go to Contact",
      hint: "Open my direct contact console",
      action: () => goTo("contact.html"),
    },
    {
      label: "Open ReceiptPulse Live",
      hint: "Launch flagship AWS product",
      action: () => openExternal(data.projects.find((item) => item.id === "receiptpulse").links.live),
    },
    {
      label: "Open LumenStack AI Live",
      hint: "Launch AI codebase product",
      action: () => openExternal(data.projects.find((item) => item.id === "lumenstack").links.live),
    },
    {
      label: "Open GitHub Profile",
      hint: "Jump to public code trail",
      action: () => openExternal(data.profile.github),
    },
    {
      label: "Email Me",
      hint: "Open my primary contact route",
      action: () => openExternal(`mailto:${data.profile.email}`),
    },
    ...Object.keys(data.modes).map((modeKey) => ({
      label: `Switch to ${data.modes[modeKey].label} Mode`,
      hint: data.modes[modeKey].summary,
      action: () => {
        setMode(modeKey, true);
        closeCommandPalette();
      },
    })),
    ...data.profile.resumes.map((resume) => ({
      label: `Open ${resume.label}`,
      hint: resume.note,
      action: () => openExternal(resume.href),
    })),
    ...((data.runtime && data.runtime.githubActivity) || []).slice(0, 3).map((repo) => ({
      label: `Open ${repo.name}`,
      hint: `Latest GitHub activity: ${repo.note}`,
      action: () => openExternal(repo.url),
    })),
  ];

  return commands;
}

function renderCommandList(query) {
  const list = document.getElementById("command-list");
  if (!list) {
    return;
  }

  const normalized = query.trim().toLowerCase();
  const filtered = commandItems().filter((item) => {
    if (!normalized) {
      return true;
    }
    return `${item.label} ${item.hint}`.toLowerCase().includes(normalized);
  });

  list.innerHTML = "";
  filtered.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "command-item";
    button.innerHTML = `<strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.hint)}</span>`;
    button.addEventListener("click", item.action);
    list.appendChild(button);
  });
}

function initMotionPolish() {
  const touchUi = isTouchUi();
  const spotlightTargets = document.querySelectorAll(
    ".panel, .project-card, .route-card, .contact-card, .system-card, .resume-card, .trait-card, .direction-card, .signal-card, .story-card"
  );

  spotlightTargets.forEach((item) => {
    if (item.dataset.motionBound) {
      return;
    }

    if (!touchUi) {
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
    } else {
      item.style.setProperty("--spot-x", "50%");
      item.style.setProperty("--spot-y", "24%");
    }

    item.dataset.motionBound = "true";
  });
}

function isTouchUi() {
  return window.matchMedia("(max-width: 760px), (hover: none), (pointer: coarse)").matches;
}

function bindPageTransitions() {
  document.querySelectorAll("a[href]").forEach((link) => {
    if (link.dataset.transitionBound) {
      return;
    }

    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        link.target === "_blank" ||
        /^https?:\/\//.test(href)
      ) {
        return;
      }

      event.preventDefault();
      triggerPageWipe();
      window.setTimeout(() => {
        window.location.href = href;
      }, 170);
    });

    link.dataset.transitionBound = "true";
  });
}

function handleViewportChange() {
  const topbar = document.querySelector(".topbar");
  if (topbar) {
    topbar.classList.toggle("is-compact", window.scrollY > 20);
  }
  document.body.classList.toggle("is-touch-ui", isTouchUi());
  updateScrollProgress();
}

function updateScrollProgress() {
  const bar = document.getElementById("page-progress-bar");
  if (!bar) {
    return;
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min((window.scrollY / maxScroll) * 100, 100) : 0;
  bar.style.width = `${progress}%`;
}

function bindGlobalEvents() {
  document.querySelectorAll("[data-command-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => openCommandPalette());
  });

  bindPageTransitions();

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-modal-close]")) {
      closeProjectModal();
    }
    if (event.target.closest("[data-command-close]")) {
      closeCommandPalette();
    }
  });

  document.addEventListener("keydown", (event) => {
    if ((event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey)) || event.key === "/") {
      const activeTag = document.activeElement ? document.activeElement.tagName : "";
      if (activeTag !== "INPUT" && activeTag !== "TEXTAREA") {
        event.preventDefault();
        openCommandPalette();
      }
    }

    if (event.key === "Escape") {
      closeProjectModal();
      closeCommandPalette();
    }
  });

  const commandInput = document.getElementById("command-input");
  if (commandInput) {
    commandInput.addEventListener("input", (event) => {
      renderCommandList(event.target.value);
    });
  }

  window.addEventListener("scroll", handleViewportChange, { passive: true });
  window.addEventListener("resize", updateScrollProgress, { passive: true });
  handleViewportChange();
  bindPicoHints();
  bindPicoSurfaceReactions();
  bindPicoSelfInteractions();
}

function openCommandPalette() {
  const palette = document.querySelector(".command-palette");
  const input = document.getElementById("command-input");
  if (!palette || state.paletteOpen) {
    return;
  }
  if (paletteHideTimer) {
    window.clearTimeout(paletteHideTimer);
    paletteHideTimer = null;
  }
  palette.hidden = false;
  palette.setAttribute("aria-hidden", "false");
  state.paletteOpen = true;
  document.body.classList.add("command-palette-open");
  window.requestAnimationFrame(() => {
    palette.classList.add("is-open");
  });
  renderCommandList("");
  if (input) {
    input.value = "";
    window.setTimeout(() => input.focus(), 20);
  }
  setPicoMessage("Command mode open. Ask me for routes, resumes, or live proof.", "listening", 2800);
}

function closeCommandPalette() {
  const palette = document.querySelector(".command-palette");
  if (!palette) {
    return;
  }
  palette.classList.remove("is-open");
  state.paletteOpen = false;
  palette.setAttribute("aria-hidden", "true");
  document.body.classList.remove("command-palette-open");
  if (paletteHideTimer) {
    window.clearTimeout(paletteHideTimer);
  }
  paletteHideTimer = window.setTimeout(() => {
    if (!state.paletteOpen) {
      palette.hidden = true;
    }
  }, 190);
  updatePicoForPage();
}

function injectPico() {
  if (document.querySelector(".pico")) {
    return;
  }

  const pico = document.createElement("div");
  pico.className = "pico";
  pico.id = "pico";
  pico.innerHTML = `
    <div class="pico__bubble" id="pico-bubble"></div>
    <div class="pico__shell" aria-hidden="true">
      <div class="pico__halo"></div>
      <div class="pico__bot">
        <span class="pico__antenna pico__antenna--left"></span>
        <span class="pico__antenna pico__antenna--right"></span>
        <span class="pico__ear pico__ear--left"></span>
        <span class="pico__ear pico__ear--right"></span>
        <span class="pico__chat pico__chat--one"></span>
        <span class="pico__chat pico__chat--two"></span>
        <span class="pico__chat pico__chat--three"></span>
        <div class="pico__head">
          <div class="pico__face">
            <div class="pico__eyes"><span></span><span></span></div>
            <div class="pico__cheeks"><span></span><span></span></div>
            <div class="pico__mouth"></div>
          </div>
        </div>
        <div class="pico__body"></div>
        <span class="pico__arm pico__arm--left"></span>
        <span class="pico__arm pico__arm--right"></span>
        <span class="pico__leg pico__leg--left"></span>
        <span class="pico__leg pico__leg--right"></span>
        <span class="pico__foot pico__foot--left"></span>
        <span class="pico__foot pico__foot--right"></span>
      </div>
    </div>
  `;

  document.body.appendChild(pico);
}

function updatePicoForPage() {
  const page = document.body.dataset.page;
  const mode = getModeConfig();
  const messages = {
    home: mode.picoGreeting,
    work: "Tap any dossier and I'll open the deeper proof.",
    systems: "These are the routes where architecture becomes visible.",
    about: "This route shows how my work evolved over time.",
    playground: "This lab is where my next ideas are still taking shape.",
    contact: "If you want to reach me directly, this page is the fastest route.",
  };
  const actions = {
    home: "wave",
    work: "curious",
    systems: "listening",
    about: "happy",
    playground: "curious",
    contact: "pointing",
  };

  setPicoMessage(messages[page] || mode.picoGreeting, actions[page] || "wave", 2200);
}

function bindPicoHints() {
  document.querySelectorAll("[data-pico-message]").forEach((item) => {
    if (item.dataset.picoBound) {
      return;
    }
    item.addEventListener("mouseenter", () => {
      const action = item.dataset.picoAction || "pointing";
      setPicoMessage(item.dataset.picoMessage, action);
    });
    item.addEventListener("mouseleave", () => {
      updatePicoForPage();
    });
    item.dataset.picoBound = "true";
  });
}

function bindPicoSurfaceReactions() {
  const selector = [
    "a",
    "button",
    "input",
    ".project-card",
    ".route-card",
    ".contact-card",
    ".resume-card",
    ".system-card",
    ".timeline-card",
    ".principle-item",
    ".command-item",
  ].join(", ");

  document.querySelectorAll(selector).forEach((item) => {
    if (item.dataset.picoReactive) {
      return;
    }

    const reaction = getPicoSurfaceReaction(item);
    const clickReaction = getPicoClickReaction(item);

    if (reaction) {
      item.addEventListener("mouseenter", () => {
        if (!item.hasAttribute("data-pico-message")) {
          setPicoMessage(reaction.message, reaction.action, reaction.duration || 1800);
        }
      });

      item.addEventListener("focus", () => {
        if (!item.hasAttribute("data-pico-message")) {
          setPicoMessage(reaction.message, reaction.action, reaction.duration || 1800);
        }
      }, true);

      item.addEventListener("mouseleave", () => {
        if (!item.hasAttribute("data-pico-message")) {
          updatePicoForPage();
        }
      });

      item.addEventListener("blur", () => {
        if (!item.hasAttribute("data-pico-message")) {
          updatePicoForPage();
        }
      }, true);
    }

    if (clickReaction) {
      item.addEventListener("click", () => {
        setPicoMessage(clickReaction.message, clickReaction.action, clickReaction.duration || 1600);
      });
    }

    item.dataset.picoReactive = "true";
  });
}

function bindPicoSelfInteractions() {
  const shell = document.querySelector(".pico__shell");
  const bubble = document.querySelector(".pico__bubble");
  const interactiveParts = [shell, bubble].filter(Boolean);
  const selfMessages = [
    { message: "Hi. I can guide you through the whole portfolio.", action: "wave" },
    { message: "Hover over cards or buttons and I'll react with them.", action: "curious" },
    { message: "Open the command panel if you want the fastest route.", action: "listening" },
    { message: "Nice. You found my attention button.", action: "excited" },
  ];

  interactiveParts.forEach((item) => {
    if (item.dataset.picoSelfBound) {
      return;
    }

    item.addEventListener("mouseenter", () => {
      setPicoMessage("You can tap me too. I react to the page around me.", "curious", 1800);
    });

    item.addEventListener("mouseleave", () => {
      updatePicoForPage();
    });

    item.addEventListener("click", () => {
      const pick = selfMessages[Math.floor(Math.random() * selfMessages.length)];
      setPicoMessage(pick.message, pick.action, 2200);
    });

    item.dataset.picoSelfBound = "true";
  });
}

function getPicoSurfaceReaction(item) {
  if (item.matches("input")) {
    return {
      message: "I'm listening. Type a route, project, or resume name here.",
      action: "listening",
      duration: 2000,
    };
  }

  if (item.classList.contains("project-card")) {
    return {
      message: "This card opens the deeper proof, architecture, and live links.",
      action: "curious",
      duration: 1800,
    };
  }

  if (item.classList.contains("route-card") || item.classList.contains("next-panel")) {
    return {
      message: "This route moves the story forward.",
      action: "pointing",
      duration: 1800,
    };
  }

  if (item.classList.contains("system-card")) {
    return {
      message: "System cards show how the backend flow actually works.",
      action: "listening",
      duration: 1900,
    };
  }

  if (item.classList.contains("contact-card") || item.classList.contains("resume-card")) {
    return {
      message: "This is a direct action route if you want to move from browsing to contact.",
      action: "happy",
      duration: 1800,
    };
  }

  if (item.classList.contains("timeline-card") || item.classList.contains("principle-item")) {
    return {
      message: "This part explains how I think and how my work evolved.",
      action: "curious",
      duration: 1700,
    };
  }

  if (item.classList.contains("command-item")) {
    return {
      message: "Pick a command and I'll route you there fast.",
      action: "listening",
      duration: 1800,
    };
  }

  if (item.matches("a, button")) {
    return {
      message: "Tap and I'll take the next step with you.",
      action: "wave",
      duration: 1500,
    };
  }

  return null;
}

function getPicoClickReaction(item) {
  if (item.matches("input")) {
    return {
      message: "Ready. Start typing and I'll stay focused.",
      action: "listening",
      duration: 1500,
    };
  }

  if (item.classList.contains("project-card")) {
    return {
      message: "Nice pick. Opening a deeper layer of proof.",
      action: "excited",
      duration: 1600,
    };
  }

  if (item.classList.contains("route-card") || item.classList.contains("next-panel")) {
    return {
      message: "Route selected. Moving ahead.",
      action: "pointing excited",
      duration: 1500,
    };
  }

  if (item.matches("a, button")) {
    return {
      message: "Nice choice.",
      action: "happy",
      duration: 1300,
    };
  }

  return null;
}

let picoTimer = null;
let picoIdleTimer = null;
let picoIdleIndex = 0;

function queuePicoIdle() {
  if (picoIdleTimer) {
    window.clearTimeout(picoIdleTimer);
  }

  picoIdleTimer = window.setTimeout(() => {
    if (state.paletteOpen) {
      queuePicoIdle();
      return;
    }

    const beat = PICO_IDLE_BEATS[picoIdleIndex % PICO_IDLE_BEATS.length];
    picoIdleIndex += 1;
    setPicoMessage(beat.message, beat.action, 2400);
  }, 7600);
}

function setPicoMessage(message, action = "", duration = 2200) {
  const pico = document.getElementById("pico");
  const bubble = document.getElementById("pico-bubble");
  if (!pico || !bubble || !message) {
    return;
  }

  bubble.textContent = message;
  pico.classList.remove(...PICO_ACTION_CLASSES);

  action
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((item) => {
      const className = `is-${item}`;
      if (PICO_ACTION_CLASSES.includes(className)) {
        pico.classList.add(className);
      }
    });

  if (picoTimer) {
    window.clearTimeout(picoTimer);
  }

  if (duration > 0) {
    picoTimer = window.setTimeout(() => {
      pico.classList.remove(...PICO_ACTION_CLASSES);
    }, duration);
  }

  queuePicoIdle();
}

function initRevealObserver() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  if (reducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
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
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => {
    if (item.classList.contains("reveal--hero")) {
      item.classList.add("is-visible");
      return;
    }
    observer.observe(item);
  });
}

function goTo(url) {
  window.location.href = url;
}

function openExternal(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatMultilineText(value) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

