<p align="center">
  <img src="./content/portfolio-lockup.svg" alt="Ujala Agarwal Portfolio lockup" width="520" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Portfolio-Cinematic%20Product%20Surface-1f4d47?style=for-the-badge&labelColor=0f1720" alt="Portfolio badge" />
  <img src="https://img.shields.io/badge/Runtime-GitHub%20Backed-c96f3b?style=for-the-badge&labelColor=0f1720" alt="Runtime badge" />
  <img src="https://img.shields.io/badge/Live-Netlify-117a65?style=for-the-badge&labelColor=0f1720" alt="Live badge" />
</p>

<p align="center">
  A premium multi-page portfolio system designed to present engineering proof, product taste, and recruiter-ready clarity with the energy of a launch microsite.
</p>

<p align="center">
  <a href="https://ujala-portfolio.onrender.com/"><strong>Live Experience</strong></a>
  �
  <a href="https://www.linkedin.com/in/ujala-agarwal-30aa28283/">LinkedIn</a>
  �
  <a href="https://github.com/agarwalujala3-lang">GitHub</a>
</p>

<p align="center">
  <img src="./content/github-preview.svg?v=20260408c" alt="Preview of the Ujala Agarwal portfolio showing cinematic layered UI, telemetry cards, and premium product storytelling." width="100%" />
</p>

---

## The Idea

Most portfolios feel like static archives.

This one is built like a product.

`ujala-portfolio` is a cinematic personal platform for Ujala Agarwal that turns real project proof into a sharper public experience. It blends frontend polish, portfolio telemetry, guided storytelling, resume sync, and GitHub-backed freshness so the work feels alive instead of frozen.

It is designed to answer three questions fast:

- Is the work real?
- Is the thinking strong?
- Does the presentation feel high-level?

---

## Why It Hits Different

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>Product-Level Presentation</h3>
      <p>Animated proof surfaces, signal cards, connector graphics, visual telemetry, and a homepage that feels closer to a modern launch page than a resume website.</p>
    </td>
    <td width="50%" valign="top">
      <h3>Proof Over Claims</h3>
      <p>The experience is centered around repository-backed projects like ReceiptPulse, Safety Copilot, and LumenStack AI instead of vague skill lists.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>Audience-Aware Storytelling</h3>
      <p>The portfolio changes emphasis depending on whether the visitor is a recruiter, engineer, founder, or friend.</p>
    </td>
    <td width="50%" valign="top">
      <h3>Source-Driven Consistency</h3>
      <p>Runtime data, resume files, public links, and generated outputs stay aligned through repeatable local build flows instead of manual patching.</p>
    </td>
  </tr>
</table>

---

## Experience Modes

| Mode | Experience |
| --- | --- |
| `Recruiter` | Fast-read signal, role fit, visible proof, and clarity under pressure |
| `Engineer` | Architecture routes, technical depth, systems thinking, and repo credibility |
| `Founder` | Product judgment, execution quality, and interface taste |
| `Friend` | Story, personality, and human context |

The result is a portfolio that adapts its framing without losing the truth of the work.

---

## Visual System

The frontend is intentionally treated as a premium surface, not an afterthought.

- Layered hero storytelling with cinematic composition
- Motion-backed proof cards and telemetry panels
- SVG connector networks and constellation graphics
- Audience-lens switching
- Guided navigation through `Pico`
- High-contrast product framing without generic template styling

<p align="center">
  <img src="./content/github-preview.svg?v=20260408c" alt="Portfolio visual system preview" width="92%" />
</p>

---

## Core Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Adaptive homepage with flagship proof, visual signal surfaces, and guided framing |
| `work.html` | Case-study route for project proof, tradeoffs, and delivery quality |
| `systems.html` | Architecture-first route for engineering readers |
| `about.html` | Journey, principles, and working style |
| `playground.html` | Current experiments, tools, and learning surfaces |
| `contact.html` | Contact routes, resume access, and direct handoff |

---

## Featured Proof

### ReceiptPulse
Private receipt-processing workflow with authentication, OCR extraction, duplicate handling, rename flows, dashboard management, and strong AWS delivery proof.

### LumenStack AI
AI-powered repository analysis product with diagrams, compare flows, guided explanation, and product-style interface decisions.

### Safety Copilot
Cross-platform safety product exploration with trusted-circle coordination, trip monitoring, and escalation-oriented workflow design.

---

## Stack

```text
Frontend: HTML, CSS, JavaScript
Runtime: Static JSON + GitHub-backed refresh flow
Rendering: app-core.js + app-render.js
Content: portfolio-data.js + content/*.json
Resumes: resume-pipeline.mjs + export-resumes.ps1
Output Targets: dist/ and safe/
Hosting: Netlify live URL, optional Render blueprint
```

---

## Repository Architecture

| Path | Role |
| --- | --- |
| `portfolio-data.js` | Main source of truth for profile content, modes, links, and project metadata |
| `portfolio-runtime.json` | Generated runtime state, freshness, and synced GitHub data |
| `app-core.js` | App behavior, navigation systems, safe links, UI mechanics |
| `app-render.js` | Page rendering and premium homepage composition |
| `styles.css` | Full visual language, motion, layout, and advanced UI styling |
| `content/` | Branding assets, roadmap, learning log, and idea inbox |
| `resume/` | Generated resume HTML/PDF outputs |
| `dist/` | Public deployment bundle |
| `safe/` | Self-contained mirror build |

---

## Local Workflow

### Run Locally

```bash
node local-server.js
```

Open `http://127.0.0.1:4173`

### Refresh Runtime Data

```bash
node sync-portfolio-data.mjs
```

### Build Public Output

```bash
npm run build:render
```

### Build Safe Mirror

```bash
npm run build:safe
```

### Build Everything

```bash
npm run build
```

### Refresh + Rebuild

```bash
npm run refresh
```

### Regenerate Resume PDFs

```bash
npm run export:resumes
```

---

## Deployment Surface

**Canonical public URL**  
`https://ujala-portfolio.onrender.com/`

**Primary deployment output**  
`dist/`

**Default public base variable**  
`PUBLIC_SITE_BASE=https://ujala-portfolio.onrender.com`

The repository still includes `render.yaml` as an optional static deployment path, but the GitHub-facing identity and public portfolio references should remain aligned with the Netlify live URL unless intentionally migrated everywhere.

---

## Resume Sync System

This repository treats resumes like product artifacts, not separate documents.

The following are kept aligned with the live site and source data:

- `resume-data.js`
- `resume-runtime.json`
- `resume/Ujala_Agarwal_Resume.pdf`
- `resume/Ujala_Agarwal_Resume_Software.pdf`

If live URLs, flagship projects, or public proof links change, rebuild the site and re-export resumes so GitHub, portfolio pages, and local assets stay consistent.

---

## Design Standard

This repo aims to feel like it belongs to a professional high-level product team.

That means:

- stronger visual taste
- cleaner proof storytelling
- real system thinking
- less filler, more signal
- better GitHub presentation
- consistency across UI, copy, links, and downloadable assets

---

## Contact

<p align="center">
  <a href="https://ujala-portfolio.onrender.com/">Portfolio</a>
  �
  <a href="https://www.linkedin.com/in/ujala-agarwal-30aa28283/">LinkedIn</a>
  �
  <a href="https://github.com/agarwalujala3-lang">GitHub</a>
</p>
