# Research: Modern Word Search Website

**Feature**: specs/001-word-search-game/spec.md
**Date**: 2026-02-10

## Decisions

### 1) Build Tooling: Vite + React + TypeScript
- Decision: Use Vite as the build tool with React and TypeScript.
- Rationale: Fast dev server, simple static build output (`dist/`), works well with GitHub Pages.
- Alternatives considered:
  - CRA: legacy / heavier tooling.
  - Next.js: adds complexity and server/SSR concepts that don’t fit the static-only constraint.

### 2) GitHub Pages Deployment: Actions Pages workflow on `main`
- Decision: Deploy with GitHub Actions using `actions/upload-pages-artifact` + `actions/deploy-pages`, triggered only from `main`.
- Rationale: Matches constitution (Actions-only, main-only), reproducible deployments.
- Alternatives considered:
  - Manual uploads: disallowed by constitution.
  - Deploy from another branch (`gh-pages`): disallowed by constitution.

### 3) Vite `base` Strategy for Project Pages
- Decision: Treat the site as a GitHub Pages *project* site and set Vite `base` to `/${repoName}/` (expected `/word_search/`).
- Rationale: GitHub Pages project URLs are served from `/<repo>/`.
- Alternatives considered:
  - `base: '/'`: works only for user/org pages or custom domain.
  - SPA 404 fallback: unnecessary if the app is single-page without client-side routing.

### 4) Puzzle Generation Algorithm: Backtracking with overlap-maximizing scoring
- Decision: Use a placement algorithm that:
  - sorts words (hardest/longest first)
  - enumerates candidate placements in 8 directions
  - scores candidates to maximize overlaps (shared letters)
  - uses controlled randomness among top candidates
  - retries/backtracks with a capped budget
- Rationale: Produces reliable placement in-browser and encourages shared letters.
- Alternatives considered:
  - Pure greedy placement: faster but can dead-end often and reduces overlap.
  - Exact cover / DLX: overkill for the constraints and implementation effort.

### 5) Filler Letter Strategy: Weighted common letters with tempering
- Decision: Fill empty grid cells from a weighted distribution biased toward common letters, using a “tempered” distribution to avoid an unnatural concentration.
- Rationale: Meets the “common letters” requirement while keeping the board readable.
- Alternatives considered:
  - Uniform random letters: violates the “common letters” bias.

### 6) Accessible Grid Interaction: ARIA grid + pointer drag + keyboard start/end
- Decision: Implement the grid as a WAI-ARIA `role="grid"` with:
  - pointer selection via Pointer Events (drag preview path)
  - touch-friendly alternative: tap start cell, tap end cell
  - keyboard: arrows to move active cell, Space to start selection, Space to commit, Escape to cancel
  - live-region announcements for found/invalid selections
- Rationale: Works across mouse/touch/keyboard and is screen-reader compatible.
- Alternatives considered:
  - Drag-only selection: poor accessibility and unreliable with assistive tech.

## Open Items (non-blocking)

- Confetti implementation choice (CSS/canvas/micro-lib) is deferred; spec only requires a brief burst (~0.5s).
- Visual design system choice (CSS variables vs utility framework) is deferred; must remain static and accessible.
