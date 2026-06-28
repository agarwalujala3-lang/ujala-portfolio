# Contributing

This repository is maintained as a portfolio product surface, so changes should improve clarity, proof quality, visual polish, or data consistency.

## Working Principles

- Keep the portfolio professional, intentional, and production-minded.
- Prefer source-of-truth updates over manual edits to generated files.
- Preserve the visual language unless a change is clearly an upgrade.
- Treat resume files, runtime data, and public URLs as user-facing product assets.

## Before You Change Anything

1. Identify whether the source of truth lives in page HTML, runtime JSON, resume pipeline files, or content assets.
2. Avoid editing generated outputs directly unless the workflow specifically requires it.
3. If you update links, resume metadata, or project proof, rebuild affected artifacts.

## Common Commands

```bash
node local-server.js
npm run build:render
npm run build:safe
npm run build
npm run refresh
npm run export:resumes
```

## Pull Request Expectations

- Explain the user-facing improvement clearly.
- Mention whether `dist/`, `safe/`, or resume files were regenerated.
- Include screenshots for visual changes when possible.
- Call out any URL, SEO, or metadata updates explicitly.

## Visual Standard

Do not settle for generic UI changes. Updates should feel clean, deliberate, and high-end.
