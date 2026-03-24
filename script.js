const PAGE_CONTENT = {
  home: {
    kicker: "Dream Scene 01",
    title: "Cloud, AI, and polished product work by Ujala Agarwal.",
    pills: ["Cloud projects", "AI tools", "Web delivery"],
  },
  about: {
    kicker: "Dream Scene 02",
    title: "Hands-on cloud experience, AI curiosity, and frontend polish in one profile.",
    pills: ["AWS exposure", "Project learning", "Frontend polish"],
  },
  work: {
    kicker: "Dream Scene 03",
    title: "Projects, experiments, and stronger builds in progress.",
    pills: ["AWS builds", "UI projects", "AI experiments"],
  },
  playground: {
    kicker: "Dream Scene 04",
    title: "A cinematic signal room for skills, tools, and future direction.",
    pills: ["Skills lab", "Cloud stack", "Cinematic UI"],
  },
  contact: {
    kicker: "Dream Scene 05",
    title: "Email, phone, GitHub, and LinkedIn all in one direct route.",
    pills: ["Email", "GitHub", "LinkedIn"],
  },
};

const MOOD_THEME = {
  candy: "#fff5ec",
  sunset: "#fff1e5",
  violet: "#f6efff",
  mint: "#eefcf6",
};

const STORE_KEY = "ujala-mood";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pointerFine = window.matchMedia("(pointer: fine)").matches;

const elements = {
  body: document.body,
  navItems: Array.from(document.querySelectorAll("[data-nav]")),
  revealItems: Array.from(document.querySelectorAll(".reveal")),
  tiltItems: Array.from(document.querySelectorAll("[data-tilt]")),
  magneticItems: Array.from(document.querySelectorAll("[data-magnetic]")),
  counters: Array.from(document.querySelectorAll("[data-counter]")),
  stage: document.getElementById("scene-stage"),
  stageKicker: document.getElementById("scene-kicker"),
  stageTitle: document.getElementById("scene-title"),
  stagePills: document.getElementById("scene-pills"),
  moodButtons: Array.from(document.querySelectorAll("[data-mood-option]")),
  themeMeta: document.querySelector('meta[name="theme-color"]'),
};

function init() {
  syncMoodFromStorage();
  syncActiveNav();
  hydrateSceneStage();
  initRevealObserver();
  initCounters();
  initTilt();
  initMagnetic();
  initStageParallax();
  initMoodSwitcher();
  initPageTransitions();

  requestAnimationFrame(() => {
    elements.body.classList.add("is-ready");
  });
}

function syncMoodFromStorage() {
  const storedMood = safelyReadMood();
  const currentMood = elements.body.dataset.mood;

  if (storedMood) {
    elements.body.dataset.mood = storedMood;
  } else if (currentMood) {
    persistMood(currentMood);
  }

  updateThemeColor();
  syncMoodButtons();
}

function safelyReadMood() {
  try {
    const mood = window.localStorage.getItem(STORE_KEY);
    return mood && Object.hasOwn(MOOD_THEME, mood) ? mood : "";
  } catch {
    return "";
  }
}

function persistMood(mood) {
  if (!Object.hasOwn(MOOD_THEME, mood)) {
    return;
  }

  try {
    window.localStorage.setItem(STORE_KEY, mood);
  } catch {
    // Ignore storage failures and keep the in-memory mood.
  }
}

function updateThemeColor() {
  const mood = elements.body.dataset.mood;
  const color = MOOD_THEME[mood] || MOOD_THEME.candy;

  if (elements.themeMeta) {
    elements.themeMeta.setAttribute("content", color);
  }
}

function syncActiveNav() {
  const currentPage = elements.body.dataset.page;

  elements.navItems.forEach((item) => {
    const isCurrent = item.dataset.nav === currentPage;
    item.classList.toggle("is-current", isCurrent);

    if (isCurrent) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

function hydrateSceneStage() {
  const currentPage = elements.body.dataset.page;
  const content = PAGE_CONTENT[currentPage];

  if (!content) {
    return;
  }

  if (elements.stageKicker) {
    elements.stageKicker.textContent = content.kicker;
  }

  if (elements.stageTitle) {
    elements.stageTitle.textContent = content.title;
  }

  if (!elements.stagePills) {
    return;
  }

  elements.stagePills.innerHTML = "";

  content.pills.forEach((pill) => {
    const chip = document.createElement("span");
    chip.className = "scene-pill";
    chip.textContent = pill;
    elements.stagePills.appendChild(chip);
  });
}

function initRevealObserver() {
  if (reducedMotion) {
    elements.revealItems.forEach((item) => item.classList.add("is-visible"));
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
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  elements.revealItems.forEach((item) => observer.observe(item));
}

function initCounters() {
  if (!elements.counters.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  elements.counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(element) {
  const target = Number(element.dataset.counter || 0);

  if (!Number.isFinite(target) || target <= 0) {
    element.textContent = "0";
    return;
  }

  if (reducedMotion) {
    element.textContent = String(target);
    return;
  }

  const startedAt = performance.now();
  const duration = 1300;

  const frame = (now) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    element.textContent = String(Math.round(target * eased));

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  };

  requestAnimationFrame(frame);
}

function initTilt() {
  if (!pointerFine || reducedMotion) {
    return;
  }

  elements.tiltItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      item.style.setProperty("--tilt-x", `${(-y * 10).toFixed(2)}deg`);
      item.style.setProperty("--tilt-y", `${(x * 12).toFixed(2)}deg`);
      item.style.setProperty("--lift", "-8px");
    });

    item.addEventListener("pointerleave", () => {
      resetMotionVars(item);
    });
  });
}

function initMagnetic() {
  if (!pointerFine || reducedMotion) {
    return;
  }

  elements.magneticItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      item.style.setProperty("--magnetic-x", `${(x * 18).toFixed(2)}px`);
      item.style.setProperty("--magnetic-y", `${(y * 12).toFixed(2)}px`);
    });

    item.addEventListener("pointerleave", () => {
      item.style.setProperty("--magnetic-x", "0px");
      item.style.setProperty("--magnetic-y", "0px");
    });
  });
}

function initStageParallax() {
  if (!elements.stage || !pointerFine || reducedMotion) {
    return;
  }

  const stage = elements.stage;

  stage.addEventListener("pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 7;
    const rotateY = (x - 0.5) * 9;
    const artX = (x - 0.5) * 18;
    const artY = (y - 0.5) * 14;

    stage.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
    stage.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
    stage.style.setProperty("--lift", "-4px");
    stage.style.setProperty("--spot-x", `${(x * 100).toFixed(2)}%`);
    stage.style.setProperty("--spot-y", `${(y * 100).toFixed(2)}%`);
    stage.style.setProperty("--art-x", `${artX.toFixed(2)}px`);
    stage.style.setProperty("--art-y", `${artY.toFixed(2)}px`);
  });

  stage.addEventListener("pointerleave", () => {
    resetMotionVars(stage);
    stage.style.setProperty("--spot-x", "50%");
    stage.style.setProperty("--spot-y", "24%");
    stage.style.setProperty("--art-x", "0px");
    stage.style.setProperty("--art-y", "0px");
  });
}

function resetMotionVars(node) {
  node.style.setProperty("--tilt-x", "0deg");
  node.style.setProperty("--tilt-y", "0deg");
  node.style.setProperty("--lift", "0px");
}

function initMoodSwitcher() {
  if (!elements.moodButtons.length) {
    return;
  }

  syncMoodButtons();

  elements.moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mood = button.dataset.moodOption;

      if (!mood || !Object.hasOwn(MOOD_THEME, mood)) {
        return;
      }

      elements.body.dataset.mood = mood;
      persistMood(mood);
      syncMoodButtons();
      updateThemeColor();
    });
  });
}

function syncMoodButtons() {
  const activeMood = elements.body.dataset.mood;

  elements.moodButtons.forEach((button) => {
    const isActive = button.dataset.moodOption === activeMood;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function initPageTransitions() {
  if (reducedMotion) {
    return;
  }

  const overlay = createTransitionOverlay();
  const internalLinks = Array.from(document.querySelectorAll('a[href$=".html"], a[href="index.html"]'));
  const currentPath = normalizePath(window.location.pathname);

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank"
      ) {
        return;
      }

      const destination = new URL(link.href, window.location.href);

      if (destination.origin !== window.location.origin || normalizePath(destination.pathname) === currentPath) {
        return;
      }

      event.preventDefault();
      overlay.querySelector(".page-transition__label").textContent = link.textContent.trim() || "Opening";
      overlay.classList.add("is-active");

      window.setTimeout(() => {
        window.location.href = destination.href;
      }, 420);
    });
  });
}

function createTransitionOverlay() {
  const existing = document.querySelector(".page-transition");

  if (existing) {
    return existing;
  }

  const overlay = document.createElement("div");
  overlay.className = "page-transition";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = [
    '<div class="page-transition__veil"></div>',
    '<div class="page-transition__blob"></div>',
    '<div class="page-transition__label"></div>',
  ].join("");

  document.body.appendChild(overlay);
  return overlay;
}

function normalizePath(pathname) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.replace(/\/index\.html$/, "/");
}

init();
