(function () {
  const MODE_KEY = "ujala-portfolio-mode";
  const INTRO_KEY = "ujala-portfolio-intro-seen";
  const VOICE_AGENT_AUTO_MS = 7600;

  const PAGE_VOICE_BRIEFS = {
    home: {
      title: "Home security briefing",
      message:
        "I am Ujala Agarwal. This is my portfolio OS: a static-safe command space for my cloud systems, AI tooling, resume routes, and repo-backed proof.",
      commands: "Try: case studies, systems, contact, engineer lens.",
    },
    work: {
      title: "Case study briefing",
      message:
        "This page opens the strongest project proof. I use it to compare ReceiptPulse, LumenStack AI, and Safety Copilot by architecture, product depth, and repo evidence.",
      commands: "Try: compare projects, systems, recruiter lens.",
    },
    systems: {
      title: "Systems briefing",
      message:
        "This page explains how the builds work under the surface: event flow, API choices, cloud paths, AI analysis, and the tradeoffs behind each system.",
      commands: "Try: case studies, lab, engineer lens.",
    },
    about: {
      title: "Journey briefing",
      message:
        "This page explains my path as a builder: how I moved through Java, JavaScript, AWS systems, AI tooling, and product-grade interfaces.",
      commands: "Try: contact, resume, founder lens.",
    },
    playground: {
      title: "Lab briefing",
      message:
        "This page shows what I am improving next: stronger release quality, better interface motion, sharper cloud proof, and more useful AI workflows.",
      commands: "Try: systems, contact, friend lens.",
    },
    contact: {
      title: "Contact briefing",
      message:
        "This page gives the direct routes to reach me, download the right resume, and review my GitHub or LinkedIn proof without extra friction.",
      commands: "Try: home, resume, recruiter lens.",
    },
  };

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

  let voiceAgentTimer = 0;
  let voiceRecognition = null;

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
    const nextGithubActivity = runtimeData.githubActivity || data.runtime?.githubActivity || [];
    const syncedCatalog = runtimeData.sync?.status === "synced" && Array.isArray(runtimeData.projects);
    const mergedProjects = versionProjectAssets(
      combineProjects(
        runtimeOverrides.projects || data.projects || [],
        runtimeData.projects,
        syncedCatalog
      ),
      nextGithubActivity
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
          <strong id="page-curtain-label">Switching route</strong>
          <span>Ujala OS is loading the next surface.</span>
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
        <div class="intro-portal__matrix" aria-hidden="true"></div>
        <div class="intro-portal__scanner" aria-hidden="true"></div>
        <div class="intro-portal__panel intro-portal__panel--security">
          <span class="intro-portal__status">AI security app initializing</span>
          <h2>Ujala OS security core online.</h2>
          <p>Identity, repo proof, static hosting, and project intelligence are being verified before the portfolio opens.</p>
          <div class="intro-portal__console" aria-label="Boot verification">
            <span><strong>Identity</strong> Ujala Agarwal</span>
            <span><strong>Runtime</strong> Static-safe</span>
            <span><strong>Proof</strong> GitHub repos</span>
          </div>
          <div class="intro-portal__scan">
            <span></span>
          </div>
          <div class="intro-portal__boot">
            <span>Running AI security scan</span>
            <span>Verifying resume routes</span>
            <span>Loading lens-aware guide</span>
            <span>Opening Ujala OS</span>
          </div>
        </div>
      `;
      document.body.appendChild(intro);
    }

    if (!document.querySelector(".cursor-orb")) {
      const cursor = document.createElement("div");
      cursor.className = "cursor-orb";
      cursor.setAttribute("aria-hidden", "true");
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
        <button class="dock-chip" type="button" data-voice-open>Voice Agent</button>
        <button class="dock-chip" type="button" data-scroll-top>Back To Top</button>
      `;
      document.body.appendChild(dock);
    }

    if (!document.querySelector(".voice-agent")) {
      const voiceAgent = document.createElement("section");
      voiceAgent.className = "voice-agent";
      voiceAgent.id = "voice-agent";
      voiceAgent.setAttribute("aria-live", "polite");
      voiceAgent.setAttribute("aria-hidden", "true");
      voiceAgent.innerHTML = `
        <div class="voice-agent__beam" aria-hidden="true"></div>
        <div class="voice-agent__robot" aria-hidden="true">
          <div class="voice-agent__halo"></div>
          <div class="voice-agent__head">
            <span class="voice-agent__eye voice-agent__eye--left"></span>
            <span class="voice-agent__eye voice-agent__eye--right"></span>
            <span class="voice-agent__mouth"></span>
          </div>
          <div class="voice-agent__neck"></div>
          <div class="voice-agent__body">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="voice-agent__arm voice-agent__arm--left"></div>
          <div class="voice-agent__arm voice-agent__arm--right"></div>
        </div>
        <div class="voice-agent__panel">
          <span class="voice-agent__kicker">Native voice guide</span>
          <h2 id="voice-agent-title">Page briefing online.</h2>
          <p id="voice-agent-message">Loading the current page briefing.</p>
          <div class="voice-agent__command-line" id="voice-agent-commands">Try: case studies, systems, contact.</div>
          <div class="voice-agent__actions">
            <button class="voice-agent__button" type="button" data-voice-listen>Voice commands</button>
            <button class="voice-agent__button" type="button" data-voice-speak>Speak brief</button>
            <button class="voice-agent__button voice-agent__button--ghost" type="button" data-voice-dismiss>Dismiss</button>
          </div>
          <p class="voice-agent__status" id="voice-agent-status">Mic starts only when you press Voice commands.</p>
        </div>
      `;
      document.body.appendChild(voiceAgent);
    }

    if (!document.querySelector(".toast-stack")) {
      const stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.id = "toast-stack";
      document.body.appendChild(stack);
    }
  }

  function triggerCurtain(label = "Switching route") {
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
    if (!intro || intro.dataset.bound === "true") {
      return;
    }

    intro.dataset.bound = "true";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alreadySeen = false;

    try {
      alreadySeen = window.sessionStorage.getItem(INTRO_KEY) === "true";
    } catch {
      alreadySeen = false;
    }

    if (reducedMotion || alreadySeen) {
      intro.hidden = true;
      return;
    }

    document.body.classList.add("intro-lock");
    intro.classList.add("is-active");

    window.setTimeout(() => {
      intro.classList.add("is-dismissing");
      document.body.classList.remove("intro-lock");
      try {
        window.sessionStorage.setItem(INTRO_KEY, "true");
      } catch {
        // Ignore storage failures.
      }
    }, 2850);

    window.setTimeout(() => {
      intro.hidden = true;
      intro.classList.remove("is-active", "is-dismissing");
    }, 3500);
  }

  function initPointerExperience() {
    if (document.body.dataset.pointerExperience === "true") {
      return;
    }

    document.body.dataset.pointerExperience = "true";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cursor = document.querySelector(".cursor-orb");

    if (!reducedMotion && cursor) {
      let cursorX = window.innerWidth / 2;
      let cursorY = window.innerHeight / 2;
      let targetX = cursorX;
      let targetY = cursorY;

      const renderCursor = () => {
        cursorX += (targetX - cursorX) * 0.2;
        cursorY += (targetY - cursorY) * 0.2;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        window.requestAnimationFrame(renderCursor);
      };

      document.addEventListener("pointermove", (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        document.body.style.setProperty("--cursor-x", `${event.clientX}px`);
        document.body.style.setProperty("--cursor-y", `${event.clientY}px`);
      }, { passive: true });

      document.addEventListener("pointerover", (event) => {
        const interactive = event.target.closest("a, button, input, textarea, [data-command-action], [data-open-project]");
        cursor.classList.toggle("is-interactive", Boolean(interactive));
      }, { passive: true });

      window.requestAnimationFrame(renderCursor);
    }

    document.addEventListener("click", (event) => {
      const interactive = event.target.closest("a, button, [data-copy], [data-open-project], [data-command-action]");
      if (!interactive || reducedMotion) {
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

  function getPageVoiceBrief() {
    const page = document.body.dataset.page || "home";
    const baseBrief = PAGE_VOICE_BRIEFS[page] || PAGE_VOICE_BRIEFS.home;
    const mode = getModeConfig();
    const primaryProject = getProjectsForMode()[0];
    const lensFocus = Array.isArray(mode?.focus) && mode.focus.length
      ? mode.focus.slice(0, 3).join(", ")
      : mode?.summary || "the clearest project proof";
    const projectProof = primaryProject?.proof || primaryProject?.summary || "";
    const shortProof = projectProof.length > 150 ? `${projectProof.slice(0, 147)}...` : projectProof;
    const modeLine = mode
      ? `${mode.label} lens is active, so I am prioritizing ${lensFocus}.`
      : "The portfolio lens is focused on the clearest project proof.";
    const projectLine = primaryProject
      ? `Current lead proof: ${primaryProject.title}. ${shortProof}`
      : "Project proof is loading from the static portfolio snapshot.";

    return {
      title: baseBrief.title,
      message: `${baseBrief.message} ${modeLine} ${projectLine}`.trim(),
      commands: baseBrief.commands,
    };
  }

  function updateVoiceAgentBrief() {
    const agent = document.getElementById("voice-agent");
    if (!agent) {
      return null;
    }

    const brief = getPageVoiceBrief();
    const title = document.getElementById("voice-agent-title");
    const message = document.getElementById("voice-agent-message");
    const commands = document.getElementById("voice-agent-commands");

    if (title) {
      title.textContent = brief.title;
    }
    if (message) {
      message.textContent = brief.message;
    }
    if (commands) {
      commands.textContent = brief.commands;
    }

    return brief;
  }

  function setVoiceAgentStatus(message) {
    const status = document.getElementById("voice-agent-status");
    if (status) {
      status.textContent = message;
    }
  }

  function showVoiceAgent(options = {}) {
    const agent = document.getElementById("voice-agent");
    if (!agent) {
      return;
    }

    window.clearTimeout(voiceAgentTimer);
    updateVoiceAgentBrief();
    agent.hidden = false;
    agent.setAttribute("aria-hidden", "false");
    agent.classList.add("is-active");

    if (options.auto !== false) {
      voiceAgentTimer = window.setTimeout(() => {
        hideVoiceAgent();
      }, options.duration || VOICE_AGENT_AUTO_MS);
    }
  }

  function hideVoiceAgent() {
    const agent = document.getElementById("voice-agent");
    if (!agent) {
      return;
    }

    window.clearTimeout(voiceAgentTimer);
    agent.classList.remove("is-active", "is-speaking", "is-listening");
    agent.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      if (!agent.classList.contains("is-active")) {
        agent.hidden = true;
      }
    }, 260);
  }

  function chooseRobotVoice() {
    if (!("speechSynthesis" in window)) {
      return null;
    }

    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((voice) => /en-IN|India/i.test(voice.lang)) ||
      voices.find((voice) => /Google|Microsoft|Natural|Neural/i.test(voice.name)) ||
      voices.find((voice) => /^en/i.test(voice.lang)) ||
      null
    );
  }

  function speakVoiceAgentBrief() {
    if (!("speechSynthesis" in window)) {
      setVoiceAgentStatus("Speech output is not supported in this browser.");
      return;
    }

    const agent = document.getElementById("voice-agent");
    const brief = updateVoiceAgentBrief() || getPageVoiceBrief();
    const speech = `${brief.title}. ${brief.message}`;
    const utterance = new SpeechSynthesisUtterance(speech);
    const voice = chooseRobotVoice();

    if (voice) {
      utterance.voice = voice;
    }

    utterance.lang = voice?.lang || "en-IN";
    utterance.rate = 0.88;
    utterance.pitch = 0.72;
    utterance.volume = 0.92;
    utterance.onstart = () => {
      agent?.classList.add("is-speaking");
      setVoiceAgentStatus("Robot voice is speaking the current page briefing.");
    };
    utterance.onend = () => {
      agent?.classList.remove("is-speaking");
      setVoiceAgentStatus("Say a command or press Voice commands to navigate.");
    };
    utterance.onerror = () => {
      agent?.classList.remove("is-speaking");
      setVoiceAgentStatus("Speech output was blocked by the browser. Use the text briefing instead.");
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function getSpeechRecognitionConstructor() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }

  function commandIncludes(command, words) {
    return words.some((word) => command.includes(word));
  }

  function handleVoiceCommand(transcript) {
    const command = String(transcript || "").toLowerCase();
    const modeCommands = Object.entries(data.modes || {}).find(([key, mode]) => {
      return command.includes(key) || command.includes(String(mode.label || "").toLowerCase());
    });

    if (modeCommands && window.PortfolioApp.setMode) {
      window.PortfolioApp.setMode(modeCommands[0]);
      showVoiceAgent({ auto: true });
      setVoiceAgentStatus(`${modeCommands[1].label} lens activated from voice command.`);
      return;
    }

    if (commandIncludes(command, ["home", "start", "main page"])) {
      goTo("index.html");
      return;
    }
    if (commandIncludes(command, ["case", "project", "work"])) {
      goTo("work.html");
      return;
    }
    if (commandIncludes(command, ["system", "architecture", "route"])) {
      goTo("systems.html");
      return;
    }
    if (commandIncludes(command, ["journey", "about", "story"])) {
      goTo("about.html");
      return;
    }
    if (commandIncludes(command, ["lab", "playground", "roadmap"])) {
      goTo("playground.html");
      return;
    }
    if (commandIncludes(command, ["contact", "email", "hire"])) {
      goTo("contact.html");
      return;
    }
    if (commandIncludes(command, ["navigator", "command", "search"])) {
      openCommandPalette();
      setVoiceAgentStatus("Navigator opened from voice command.");
      return;
    }
    if (commandIncludes(command, ["resume", "cv"])) {
      const resume = data.profile?.resumes?.[0];
      if (resume?.href) {
        openExternal(resume.href);
        setVoiceAgentStatus("Opening the general resume download.");
      }
      return;
    }
    if (commandIncludes(command, ["speak", "explain", "brief"])) {
      speakVoiceAgentBrief();
      return;
    }
    if (commandIncludes(command, ["stop", "mute", "quiet"])) {
      window.speechSynthesis?.cancel();
      setVoiceAgentStatus("Speech stopped.");
      return;
    }
    if (commandIncludes(command, ["close", "dismiss", "hide"])) {
      hideVoiceAgent();
      return;
    }

    setVoiceAgentStatus(`I heard "${transcript}". Try: case studies, systems, contact, or engineer lens.`);
  }

  function startVoiceCommands() {
    const Recognition = getSpeechRecognitionConstructor();
    const agent = document.getElementById("voice-agent");

    if (!Recognition) {
      setVoiceAgentStatus("Voice commands are not supported in this browser. The text guide still works.");
      return;
    }

    if (voiceRecognition) {
      try {
        voiceRecognition.abort();
      } catch {
        // Ignore abort failures.
      }
    }

    voiceRecognition = new Recognition();
    voiceRecognition.lang = "en-IN";
    voiceRecognition.interimResults = false;
    voiceRecognition.continuous = false;
    voiceRecognition.maxAlternatives = 1;
    voiceRecognition.onstart = () => {
      agent?.classList.add("is-listening");
      setVoiceAgentStatus("Listening. Say: case studies, systems, contact, or engineer lens.");
    };
    voiceRecognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      agent?.classList.remove("is-listening");
      handleVoiceCommand(transcript);
    };
    voiceRecognition.onerror = (event) => {
      agent?.classList.remove("is-listening");
      setVoiceAgentStatus(`Voice command unavailable: ${event.error || "browser blocked microphone"}.`);
    };
    voiceRecognition.onend = () => {
      agent?.classList.remove("is-listening");
    };

    showVoiceAgent({ auto: false });
    try {
      voiceRecognition.start();
    } catch (error) {
      agent?.classList.remove("is-listening");
      setVoiceAgentStatus("Voice command startup was blocked. Press the button again after allowing microphone access.");
    }
  }

  function initVoiceAgent() {
    const agent = document.getElementById("voice-agent");
    if (!agent || agent.dataset.bound === "true") {
      return;
    }

    agent.dataset.bound = "true";
    updateVoiceAgentBrief();

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-voice-open]")) {
        showVoiceAgent({ auto: false });
        return;
      }
      if (event.target.closest("[data-voice-listen]")) {
        startVoiceCommands();
        return;
      }
      if (event.target.closest("[data-voice-speak]")) {
        showVoiceAgent({ auto: false });
        speakVoiceAgentBrief();
        return;
      }
      if (event.target.closest("[data-voice-dismiss]")) {
        window.speechSynthesis?.cancel();
        hideVoiceAgent();
      }
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return;
    }

    const introActive = document.getElementById("intro-portal")?.classList.contains("is-active");
    window.setTimeout(() => {
      showVoiceAgent({ auto: true });
    }, introActive ? 3850 : 900);
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

  function goTo(url) {
    triggerCurtain("Opening route");
    window.setTimeout(() => {
      window.location.href = url;
    }, 280);
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
    initHeroDepthScene,
    initSurfaceSpotlights,
    initFloatingDockObserver,
    initIntroSequence,
    initPointerExperience,
    initVoiceAgent,
    updateVoiceAgentBrief,
    showVoiceAgent,
    hideVoiceAgent,
    startVoiceCommands,
    speakVoiceAgentBrief,
    goTo,
    openExternal,
    escapeHtml,
    formatMultilineText,
  };
})();
