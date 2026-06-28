<p align="center">
  <img src="./content/portfolio-lockup.svg" alt="Ujala Agarwal Portfolio" width="460" />
</p>

<p align="center">
  Adaptive cinematic portfolio system built for live proof, stronger product signal, and a much sharper first read than a standard personal site.
</p>

<p align="center">
  <a href="https://ujala-portfolio-world.netlify.app/">Live Portfolio</a> |
  <a href="https://github.com/agarwalujala3-lang/ujala-portfolio">Repository</a> |
  <a href="https://lumenstack-ai.onrender.com/">LumenStack AI Live</a> |
  <a href="https://github.com/agarwalujala3-lang/LumenStack-AI">LumenStack AI Repo</a> |
  <a href="https://github.com/agarwalujala3-lang/ReceiptPulse">ReceiptPulse Repo</a> |
  <a href="https://github.com/agarwalujala3-lang/Safety-Copilot">Safety Copilot Repo</a>
</p>

<p align="center">
  <img src="./content/github-preview.svg?v=20260408c" alt="Cinematic preview banner for the Ujala Agarwal portfolio showing layered portfolio surfaces, runtime callouts, and premium product storytelling." width="100%" />
</p>

# Ujala Agarwal Portfolio

Adaptive cinematic portfolio for Ujala Agarwal, built as a multi-page personal system instead of a standard portfolio site. It is centered around repo-verified proof, especially ReceiptPulse, Safety Copilot, and LumenStack AI, rather than static project cards alone.

## Core Idea

This portfolio changes how it presents the work depending on the visitor:

- `Recruiter` mode for fast signal and role fit
- `Engineer` mode for systems, architecture, and proof
- `Founder` mode for product taste and execution
- `Friend` mode for the personal story and human side

It also includes `Pico`, a small guided assistant that adds warmth and navigation without taking over the page.

## Pages

- `index.html` - adaptive home runtime
- `work.html` - project dossiers
- `systems.html` - architecture and system routes
- `about.html` - journey and working principles
- `playground.html` - current experiments and active toolkit
- `contact.html` - direct contact console and resume pack

## Data Layer

Most portfolio content is driven from:

- `portfolio-data.js`
- `portfolio-runtime.json`
- `content/learning-log.json`
- `content/idea-inbox.json`
- `content/roadmap.json`

That file controls:

- visitor modes
- profile links
- project data
- systems routes
- journey timeline
- lab content
- resume pack

The static snapshot layer adds:

- GitHub activity feed
- snapshot status metadata
- learning log
- idea inbox
- roadmap updates

## Refresh Snapshot Data

```bash
node sync-portfolio-data.mjs
```

That pulls public GitHub repository activity and rebuilds `portfolio-runtime.json`, `resume-runtime.json`, and `resume-data.js`.

## Build Safe Mirror

```bash
node build-safe-mirror.mjs
```

That generates the self-contained `safe/` mirror from the main source pages, `styles.css`, `portfolio-data.js`, `portfolio-runtime.json`, and the app scripts. Do not edit files in `safe/` directly; edit the main page/data/runtime source, then rebuild.

Safe mirror build:

```bash
npm run build
```

Full data refresh plus safe mirror rebuild:

```bash
npm run refresh
```

Use `npm run build` after navigation, resume links, runtime data, or visual polish changes so the public mirror stays aligned with the main site. Use `npm run refresh` when you also want to pull current GitHub repo/manifest data first.

## Future Project Auto-Onboarding (Important)

Use this every time you add a new project so it appears automatically in the portfolio.

1. In the project repo, add `portfolio-branding.json` at repo root.
2. Add branding assets:
   - `branding/portfolio-brand-mark.svg`
   - `branding/portfolio-brand-lockup.svg`
3. In `portfolio-branding.json`, include all required fields:
   - `enabled`, `id`, `title`, `kind`, `status`
   - `priority`, `featured`
   - `lensPriority.recruiter`, `lensPriority.engineer`, `lensPriority.founder`, `lensPriority.friend`
   - `tags`, `summary`, `proof`, `details`, `architecture`, `tradeoff`
   - `badge`, `icon`, `iconImage`, `lockupImage`
   - `links` object (`links.repo` required; use `links.live` only for a safe, current public deployment)
   - full `theme` object (`surface1`, `surface2`, `ring`, `glow`, `glowSoft`, `accentStrong`, `accentSoft`, `badgeBg`, `badgeBorder`, `proofBg`, `signalBg`, `signalBorder`, `iconBg`)
4. Commit and push that project repo.
5. In this portfolio repo run:
   - `node sync-portfolio-data.mjs`
6. Deploy the portfolio.

### Hide Older Projects Without Deleting Repos

Set `"enabled": false` in that repo's `portfolio-branding.json`. The repo stays on GitHub but disappears from portfolio cards.

### Schema Helper

Use `project-branding.example.json` as your base template.

## Run Locally

```bash
node local-server.js
```

Then open:

```text
http://127.0.0.1:4173
```

## Current Live Portfolio

- Portfolio: https://ujala-portfolio-world.netlify.app/

## Free Hosting

This portfolio is configured for free static hosting with GitHub Pages and a Render Blueprint. It has no AWS deploy requirement.

- GitHub Pages workflow: `.github/workflows/deploy-pages.yml`
- Render Blueprint: `render.yaml`
- Publish directory: `.`
- Build command: `npm run build`

## Key Proof Links

- ReceiptPulse: https://github.com/agarwalujala3-lang/ReceiptPulse
  - private per-user receipt workspace with sign-in, OCR extraction, duplicate decision flow, label rename, and dashboard management
- Safety Copilot: https://github.com/agarwalujala3-lang/Safety-Copilot
  - cloud-first personal safety platform with trusted circles, live trip monitoring, and SOS or silent SOS escalation
- LumenStack AI Live: https://lumenstack-ai.onrender.com/
- LumenStack AI Repo: https://github.com/agarwalujala3-lang/LumenStack-AI
  - AI-powered codebase analysis with diagrams, compare mode, exports, and guided explanations
- GitHub Profile: https://github.com/agarwalujala3-lang
- LinkedIn: https://www.linkedin.com/in/ujala-agarwal-30aa28283/

## Current Project Positioning

- `ReceiptPulse` is the flagship AWS system proof: private user-scoped uploads, Textract extraction, duplicate handling, rename/delete actions, and repo-inspectable dashboard flow
- `Safety Copilot` is the strongest cross-platform product proof: trusted-circle safety workflows, trip orchestration, alert handling, and cloud API workflow design
- `LumenStack AI` is the strongest AI product proof: repository analysis, Mermaid generation, compare flows, exports, and product-style UI


