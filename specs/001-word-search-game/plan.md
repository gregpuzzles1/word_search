# Implementation Plan: Modern Word Search Website

**Branch**: `001-word-search-game` | **Date**: 2026-02-10 | **Spec**: specs/001-word-search-game/spec.md
**Input**: Feature specification from `specs/001-word-search-game/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a static, accessible, responsive word search web app using React + TypeScript. The UI features a top category chip cloud (7 random categories), a topic chip cloud (the puzzle words) with shuffle controls, a generated word search grid sized by breakpoint (10/12/15), gameplay validation with persistent highlights, a short confetti burst + completion modal, and a facts section. Data is loaded from `public/wordcache/**` JSON files and the site is deployed to GitHub Pages from `main` via GitHub Actions.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (latest stable)  
**Primary Dependencies**: React, Vite (build), optional Vitest + React Testing Library (tests)  
**Storage**: N/A (no database). Static JSON assets under `public/wordcache/**`  
**Testing**: Vitest (unit) for puzzle generator + selection logic; optional component tests  
**Target Platform**: Modern evergreen browsers; hosted on GitHub Pages
**Project Type**: web (single static frontend)  
**Performance Goals**: Puzzle generation should complete quickly enough to feel instant (target: under ~200ms typical on desktop; allow retry budget)  
**Constraints**: Static-only; no server-side secrets; GitHub Pages deployment from `main` via Actions  
**Scale/Scope**: Single-page game; loads JSON locally; no accounts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Static-only delivery (HTML/CSS/JS/assets); no server-side components.
- GitHub Pages is the sole hosting target.
- Deployment runs via GitHub Actions and only from `main`.
- No runtime secrets or private keys required.

Re-check (post-design): Still satisfied; no backend or secrets introduced.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
public/
└── wordcache/                 # existing data files used by the app

src/
├── app/                       # app shell, routing-less single page
├── components/                # chip clouds, grid, modal, facts
├── game/                      # puzzle generation + selection validation
├── data/                      # JSON loaders and type guards
├── styles/                    # theme tokens (CSS variables)
└── main.tsx

index.html
vite.config.ts
tsconfig.json

tests/
└── unit/                      # generator + validation tests

.github/workflows/
└── pages.yml                  # deploy to GitHub Pages from main
```

**Structure Decision**: Single static frontend at repository root, built with Vite. Existing `public/wordcache/**` remains as static assets consumed by the app.

## Phase 0: Research (done)

- Output: specs/001-word-search-game/research.md

## Phase 1: Design & Contracts (done)

- Data model: specs/001-word-search-game/data-model.md
- Data contracts (JSON schema): specs/001-word-search-game/contracts/
- Quickstart: specs/001-word-search-game/quickstart.md

## Implementation Notes

- GitHub Pages base path: use Vite `base` suitable for project pages (expected `/word_search/`).
- No client-side routing required for MVP; keep a single page to avoid Pages SPA fallback complexity.
- Accessibility: implement grid as `role="grid"` with keyboard navigation and a live-region status announcement.

## Risks

- Puzzle generation can be CPU-heavy on low-end mobile; mitigate with retry budgets, heuristics, and (if needed) a Web Worker.
- Data consistency across categories/topics should be validated defensively when loading JSON.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
