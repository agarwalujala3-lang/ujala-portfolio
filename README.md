# Ujala Agarwal Portfolio

<p align="center">
  Adaptive cinematic portfolio built as a multi-page personal system instead of a standard portfolio site.
</p>

<p align="center">
  <a href="https://d2ikqjoiirpv7k.cloudfront.net">Live Portfolio</a> |
  <a href="https://github.com/agarwalujala3-lang/ujala-portfolio">Repository</a> |
  <a href="https://lumenstack-ai.onrender.com">LumenStack AI</a> |
  <a href="https://d2ijsg7huf2h2p.cloudfront.net">ReceiptPulse</a>
</p>

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
