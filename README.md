<p align="center">
  <img src="./content/portfolio-lockup.svg" alt="Ujala Agarwal Portfolio" width="460" />
</p>

<p align="center">
  Adaptive cinematic portfolio system built for live proof, stronger product signal, and a much sharper first read than a standard personal site.
</p>

<p align="center">
  <a href="https://d2ikqjoiirpv7k.cloudfront.net">Live Portfolio</a> |
  <a href="https://github.com/agarwalujala3-lang/ujala-portfolio">Repository</a> |
  <a href="https://lumenstack-ai.onrender.com">LumenStack AI</a> |
  <a href="https://d2ijsg7huf2h2p.cloudfront.net/app.html?v=20260331">ReceiptPulse</a>
</p>

<p align="center">
  <img src="./content/github-preview.svg?v=20260408b" alt="Preview banner for the Ujala Agarwal portfolio showing runtime sync, adaptive visitor lenses, and proof-first project presentation." width="100%" />
</p>

# Ujala Agarwal Portfolio

Adaptive cinematic portfolio for Ujala Agarwal, built as a multi-page personal system instead of a standard portfolio site. It is centered around live proof, especially ReceiptPulse and LumenStack AI, rather than static project cards alone.

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

The runtime sync layer adds:

- GitHub activity feed
- sync status metadata
- learning log
- idea inbox
- roadmap updates

## Refresh Runtime Data

```bash
node sync-portfolio-data.mjs
```

That pulls public GitHub repository activity and rebuilds `portfolio-runtime.json`.

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
   - `links` object (use `links.live` when available)
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

- Portfolio: https://d2ikqjoiirpv7k.cloudfront.net

## Key Proof Links

- ReceiptPulse: https://d2ijsg7huf2h2p.cloudfront.net
  - private per-user receipt workspace with sign-in, OCR extraction, duplicate decision flow, label rename, and dashboard management
- LumenStack AI: https://lumenstack-ai.onrender.com
  - AI-powered codebase analysis with diagrams, compare mode, exports, and guided explanations
- GitHub Profile: https://github.com/agarwalujala3-lang
- LinkedIn: https://www.linkedin.com/in/ujala-agarwal-30aa28283/

## Current Project Positioning

- `ReceiptPulse` is the flagship AWS system proof: private user-scoped uploads, Textract extraction, duplicate handling, rename/delete actions, and live dashboard reporting
- `LumenStack AI` is the strongest AI product proof: repository analysis, Mermaid generation, compare flows, exports, and product-style UI
- `Amazon UI Clone` proves dense frontend layout control and visual composition discipline
- `Valentine Interactive Web Experience` shows creative interaction design, timing, and frontend personality
