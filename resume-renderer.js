(function () {
  const data = window.UJOS_RESUME_DATA || {};

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function safeHref(value) {
    const candidate = String(value || "").trim();
    if (!candidate) {
      return "";
    }

    try {
      const url = new URL(candidate, window.location.href);
      return url.protocol === "https:" || url.protocol === "mailto:" || url.protocol === "tel:" ? url.href : "";
    } catch {
      return "";
    }
  }

  function list(items) {
    return `<ul>${(items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function renderLinks(project) {
    const links = [];
    const live = safeHref(project.links?.live);
    const repo = safeHref(project.links?.repo);

    if (live) {
      links.push(`Live: <a href="${escapeHtml(live)}">${escapeHtml(live)}</a>`);
    }
    if (repo) {
      links.push(`Repo: <a href="${escapeHtml(repo)}">${escapeHtml(repo)}</a>`);
    }

    return links.length ? `<p class="links">${links.join(" | ")}</p>` : "";
  }

  function projectByRepo() {
    return new Map((data.projects || []).map((project) => [project.repo, project]));
  }

  function renderProject(project, variantKey) {
    const bullets = project.bullets?.[variantKey] || project.bullets?.general || [];
    const stack = (project.stack || []).join(", ");

    return `
      <article class="item">
        <div class="item-head">
          <strong>${escapeHtml(project.title)}</strong>
          <span>${escapeHtml(project.status || "GitHub")}</span>
        </div>
        <p class="item-sub">${escapeHtml(stack)}</p>
        ${list(bullets)}
        ${renderLinks(project)}
      </article>`;
  }

  function renderSkills(variant) {
    return `
      <div class="skills-grid">
        ${(variant.skills || [])
          .map((group) => `<p><strong>${escapeHtml(group.label)}:</strong> ${escapeHtml((group.values || []).join(", "))}</p>`)
          .join("")}
      </div>`;
  }

  function renderStrengths(variant) {
    const strengths = Array.isArray(variant.coreStrengths) ? variant.coreStrengths : [];
    if (!strengths.length) {
      return "";
    }

    return `
      <section class="section">
        <h2>Core Strengths</h2>
        ${list(strengths)}
      </section>`;
  }

  function renderExperience() {
    return (data.experience || [])
      .map(
        (item) => `
        <article class="item">
          <div class="item-head">
            <strong>${escapeHtml(item.company)}</strong>
            <span>${escapeHtml(item.dates)}</span>
          </div>
          <p class="item-sub">${escapeHtml(item.role)} | ${escapeHtml(item.location)}</p>
          ${list(item.bullets)}
        </article>`
      )
      .join("");
  }

  function renderEducation() {
    return (data.education || [])
      .map(
        (item) => `
        <article class="item">
          <div class="item-head">
            <strong>${escapeHtml(item.school)}</strong>
            <span>${escapeHtml(item.dates)}</span>
          </div>
          <p class="item-sub">${escapeHtml(item.degree)} | ${escapeHtml(item.location)}</p>
        </article>`
      )
      .join("");
  }

  function renderHeader(variant) {
    const profile = data.profile || {};
    const portfolioUrl = safeHref(profile.portfolioUrl);
    const githubUrl = safeHref(profile.githubUrl);
    const linkedinUrl = safeHref(profile.linkedinUrl);

    return `
      <section class="header">
        <h1 class="name">${escapeHtml(profile.name || "Ujala Agarwal")}</h1>
        <p class="title">${escapeHtml(variant.headline)}</p>
        <p class="contact">${escapeHtml(profile.location)} | ${escapeHtml(profile.phone)} | ${escapeHtml(profile.email)}</p>
        <p class="contact">
          Portfolio: <a href="${escapeHtml(portfolioUrl)}">Ujala OS live mirror</a> |
          GitHub: <a href="${escapeHtml(githubUrl)}">github.com/agarwalujala3-lang</a> |
          LinkedIn: <a href="${escapeHtml(linkedinUrl)}">linkedin.com/in/ujala-agarwal-30aa28283</a>
        </p>
      </section>`;
  }

  function renderResume() {
    const root = document.getElementById("resume-root");
    if (!root) {
      return;
    }

    const variantKey = root.dataset.resumeVariant || document.documentElement.dataset.resumeVariant || "general";
    const variant = data.variants?.[variantKey] || data.variants?.general;
    if (!variant) {
      root.innerHTML = "<p>Resume data is unavailable. Run sync-portfolio-data.mjs.</p>";
      return;
    }

    document.title = variant.documentTitle || document.title;
    const projects = projectByRepo();
    const orderedProjects = (variant.projects || []).map((repo) => projects.get(repo)).filter(Boolean);

    root.innerHTML = `
      ${renderHeader(variant)}
      <section class="section">
        <h2>Professional Summary</h2>
        <p class="summary">${escapeHtml(variant.summary)}</p>
      </section>
      <section class="section">
        <h2>Technical Skills</h2>
        ${renderSkills(variant)}
      </section>
      ${renderStrengths(variant)}
      <section class="section">
        <h2>Experience</h2>
        ${renderExperience()}
      </section>
      <section class="section">
        <h2>Projects</h2>
        ${orderedProjects.map((project) => renderProject(project, variantKey)).join("")}
      </section>
      <section class="section">
        <h2>Education</h2>
        ${renderEducation()}
      </section>
      <section class="section">
        <h2>Certifications and Training</h2>
        ${list(data.certifications || [])}
      </section>`;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderResume, { once: true });
  } else {
    renderResume();
  }
})();
