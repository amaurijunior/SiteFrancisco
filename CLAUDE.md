# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static academic website for Francisco Braun, Professor at UFSCar Mathematics Department. Pure HTML/CSS site deployed to GitHub Pages — no build system, package manager, or backend.

## Development

**Local dev:** Open HTML files directly or use VSCode Live Server (configured on port 5501).

**Deployment:** Pushing to `master` triggers `.github/workflows/static.yml`, which deploys the entire repo to GitHub Pages via `actions/deploy-pages@v4`.

## Architecture

Five standalone HTML pages sharing a common layout (header with Bootstrap navbar, main content, footer with contact info):

- `index.html` — Homepage with introduction and photo
- `students.html` — Ph.D. and Masters students listing
- `research.html` — Publications and preprints
- `teaching.html` — Course schedule
- `miscellaneous.html` — Links to CV, ORCID, ResearchGate, Google Scholar

Each page duplicates the full header/footer markup — there is no shared template system.

## Tech Stack

- **Bootstrap 5.2.1** loaded via CDN (CSS + JS + Popper.js)
- **Single custom stylesheet:** `css/style.css`
- **Images:** `Assets/` directory
- No JavaScript framework, no bundler, no preprocessor

## Conventions

- Content is in **Portuguese**; HTML/CSS identifiers are in English
- Color scheme: blue gradients (`#576CBC`/`#718AF0` background, `#0B2447`/`#144283` header/footer)
- Font: Open Sans
- Layout uses Bootstrap grid (`col-lg-6`, `col-lg-12`) for responsiveness
- Inline styles are mixed with CSS classes throughout; `css/style.css` uses `!important` in several places
- Semantic HTML elements (`<header>`, `<main>`, `<footer>`) with Bootstrap accessibility attributes on navbar

## When Editing

- Changes to the navbar or footer must be replicated across all 5 HTML files
- External dependencies are CDN-only — no `npm install` or similar step needed
- No tests exist; verify changes visually in a browser
