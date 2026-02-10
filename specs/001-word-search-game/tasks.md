# Tasks: Modern Word Search Website

**Input**: Design documents from `/specs/001-word-search-game/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not included (optional; not explicitly requested in the feature spec).

## Format: `- [ ] T### [P?] [US#?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[US#]**: Which user story this task belongs to (US1/US2/US3). Setup/Foundational/Polish tasks have no story label.
- Every task includes exact file paths.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the React + TypeScript + Vite static app skeleton and Pages deployment wiring.

- [x] T001 Create Vite + React + TypeScript scaffold at repo root in package.json, index.html, vite.config.ts, tsconfig.json, src/main.tsx, src/app/App.tsx
- [x] T002 [P] Add base styling and theme CSS-variable scaffold in src/styles/theme.css and src/styles/app.css
- [x] T003 [P] Configure GitHub Pages project base path in vite.config.ts (set base to /word_search/)
- [x] T004 Setup GitHub Actions Pages deployment (main only) in .github/workflows/pages.yml

**Checkpoint**: `npm run dev` starts; `npm run build` produces static output; Pages workflow exists.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared puzzle/data infrastructure required by all user stories.

**⚠️ CRITICAL**: No user story work should start until this phase is complete.

- [x] T005 Define core data types for wordcache files in src/data/types.ts
- [x] T006 [P] Implement JSON fetch helper with runtime validation errors in src/data/fetchJson.ts
- [x] T007 [P] Implement wordcache loaders (categories/topics/labels/words/facts) in src/data/wordcache.ts
- [x] T008 Implement viewport class → grid size + word-mix derivation in src/game/viewport.ts
- [x] T009 [P] Implement random utilities (seedless sampling, shuffle, unique pick) in src/game/random.ts
- [x] T010 Implement device-specific word selection (6 easy + 4 medium; +2 hard on desktop; de-dupe) in src/game/selectWords.ts
- [x] T011 Implement 8-direction utilities for placement/selection in src/game/directions.ts
- [x] T012 Implement puzzle generator with retry/backtracking budget in src/game/generator.ts
- [x] T013 [P] Implement filler-letter generation meeting FR-015 (>=30% from {E,A,R,S,T} across filler cells) in src/game/filler.ts
- [x] T014 Implement puzzle build orchestration (load JSON → select words → generate grid → choose 3 facts) in src/game/buildPuzzle.ts
- [x] T015 Implement game state + reducer/actions for loading/playing/error in src/game/state.ts
- [x] T016 [P] Create shared loading + error UI components in src/components/LoadingState.tsx and src/components/ErrorState.tsx

**Checkpoint**: A `Puzzle` can be built purely from `public/wordcache/**` without UI.

---

## Phase 3: User Story 1 - Start a Puzzle From Categories (Priority: P1) 🎯 MVP

**Goal**: On page load, show a category chip cloud; selecting a category generates a playable puzzle view (topic label, word chips, grid, facts).

**Independent Test**: Load the page, shuffle categories, select a category, and see a filled puzzle grid plus a topic word chip cloud.

### Implementation for User Story 1

- [x] T017 [US1] Implement theme toggle UI + default Light behavior in src/components/ThemeToggle.tsx
- [x] T018 [P] [US1] Implement CategoryChipCloud (7 unique chips + Shuffle Categories control) in src/components/CategoryChipCloud.tsx
- [x] T019 [P] [US1] Implement TopicHeader (topic label + Shuffle Topic control) in src/components/TopicHeader.tsx
- [x] T020 [P] [US1] Implement WordChipCloud display layout (2–3 rows) in src/components/WordChipCloud.tsx
- [x] T021 [P] [US1] Implement FactsSection showing exactly 3 random non-duplicated facts (or fewer if missing) in src/components/FactsSection.tsx
- [x] T022 [P] [US1] Implement Footer (year range starting 2026, MIT License text/link, repo link, new issue link, >=80px bottom whitespace) in src/components/Footer.tsx
- [x] T023 [US1] Implement read-only Grid renderer using monospaced font in src/components/Grid.tsx and src/styles/game.css
- [x] T024 [US1] Implement game hook to load categories and build puzzles (category select, shuffle categories, shuffle topic) in src/game/useWordSearchGame.ts
- [x] T025 [US1] Compose the page layout and wire actions/state in src/app/App.tsx
- [x] T026 [US1] Ensure topic label display comes from label_topics.json mapping in src/data/wordcache.ts

**Checkpoint**: User Story 1 is functional and demoable as an MVP.

---

## Phase 4: User Story 2 - Play and Validate Word Selection (Priority: P2)

**Goal**: Allow touch/mouse/keyboard selection of straight-line letter paths; validate found words; persist highlights; reject invalid selections.

**Independent Test**: Select a correct word and see it crossed off and persistently highlighted; select an incorrect word and see it rejected with shake then cleared.

### Implementation for User Story 2

- [x] T027 [P] [US2] Implement straight-line selection path derivation (anchor + current → cells) in src/game/path.ts
- [x] T028 [P] [US2] Implement selection validation vs remaining words (including reverse direction) in src/game/validateSelection.ts
- [x] T029 [US2] Extend game state to include selection preview + found word placements/colors in src/game/state.ts
- [x] T030 [US2] Add pointer interactions (drag preview + tap start/end) to the grid in src/components/Grid.tsx
- [x] T031 [US2] Add keyboard interactions (arrows, Space start/commit, Esc cancel) to the grid in src/components/Grid.tsx
- [x] T032 [US2] Render selection preview + persistent 5–6 highlight colors for found words in src/components/Grid.tsx and src/styles/game.css
- [x] T033 [US2] Implement invalid selection feedback (shake briefly then clear) in src/components/Grid.tsx and src/styles/game.css
- [x] T034 [US2] Cross off found words in the word chip cloud in src/components/WordChipCloud.tsx
- [x] T035 [P] [US2] Add live-region announcements (“Found WORD”, “Not a word”) in src/components/AriaStatus.tsx and wire it in src/app/App.tsx

**Checkpoint**: User Story 2 works across mouse/touch/keyboard.

---

## Phase 5: User Story 3 - Finish Puzzle, Celebrate, and Continue (Priority: P3)

**Goal**: On completion, show a brief confetti burst and a modal offering another topic (same category) or another category.

**Independent Test**: Complete a puzzle, see confetti + modal, choose another topic and get a new puzzle; choose another category and focus returns to category chip cloud.

### Implementation for User Story 3

- [x] T036 [P] [US3] Implement completion detection helper (all words found) in src/game/isComplete.ts
- [x] T037 [P] [US3] Implement top-of-page confetti burst (~0.5s) with reduced-motion fallback in src/components/ConfettiBurst.tsx
- [x] T038 [P] [US3] Implement completion modal (two choices + focus management) in src/components/CompletionModal.tsx
- [x] T039 [US3] Wire completion state, confetti trigger, and modal open/close flow in src/game/useWordSearchGame.ts
- [x] T040 [US3] Implement “another topic” regeneration behavior (choose topic, rebuild puzzle, refresh facts) in src/game/buildPuzzle.ts
- [x] T041 [US3] Implement “another category” behavior and return focus to category chip cloud in src/app/App.tsx

**Checkpoint**: User Story 3 completes the replay loop.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improve resilience, performance, and spec/quickstart alignment across stories.

- [x] T042 [P] Add reduced-motion handling utilities and wire to animations in src/game/motion.ts and src/styles/game.css
- [x] T043 [P] Improve missing/invalid data messaging and recovery controls in src/components/ErrorState.tsx and src/game/useWordSearchGame.ts
- [x] T044 [P] Tune generator performance (constants, retry budget, early exits) in src/game/generator.ts
- [x] T045 Update quickstart to match the implemented scripts and Pages config in specs/001-word-search-game/quickstart.md
- [x] T046 Validate spec clarity and record any requirement gaps found during implementation in specs/001-word-search-game/checklists/ux.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)** → blocks Phase 2
- **Phase 2 (Foundational)** → blocks all user stories
- **US1 (P1)** → can start after Phase 2; delivers MVP
- **US2 (P2)** → depends on US1 UI being present; extends gameplay
- **US3 (P3)** → depends on US2 found-word tracking to detect completion
- **Polish** → after any subset of user stories (ideally after US3)

### User Story Dependency Graph (recommended order)

Setup → Foundational → US1 → US2 → US3 → Polish

---

## Parallel Execution Examples

### Setup (Phase 1)

- Example parallel set:
  - T002 (CSS scaffolding) + T003 (Vite base) + T004 (Pages workflow)

### Foundational (Phase 2)

- Example parallel set:
  - T006 (fetch helper) + T007 (loaders) + T009 (random utils) + T013 (filler)

### User Story 1

- Example parallel set:
  - T018 (CategoryChipCloud) + T019 (TopicHeader) + T020 (WordChipCloud) + T021 (FactsSection) + T022 (Footer)

### User Story 2

- Example parallel set:
  - T027 (path derivation) + T028 (validation) + T035 (AriaStatus)

### User Story 3

- Example parallel set:
  - T036 (completion detection) + T037 (confetti) + T038 (modal)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational)
3. Complete Phase 3 (US1)
4. Validate US1 independently (category chips → puzzle appears with grid/words/facts)

### Incremental Delivery

- Add US2 for real gameplay (selection + validation)
- Add US3 to complete replay loop
- Finish with Polish tasks
