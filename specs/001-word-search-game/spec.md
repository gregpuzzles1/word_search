# Feature Specification: Modern Word Search Website

**Feature Branch**: `001-word-search-game`  
**Created**: 2026-02-10  
**Status**: Draft  
**Input**: Modern word search game website with category/topic chip clouds, responsive puzzles, light/dark mode toggle, facts, and completion flow.

## Clarifications

### Session 2026-02-10

- Q: Where is `label_topics.json` located? → A: It is per category at `public/wordcache/<categorySlug>/label_topics.json`.
- Q: What key contains the facts list in `<topic>_facts.json`? → A: The facts are in the `facts` array.
- Q: What breakpoints define Mobile/Tablet/Desktop? → A: Mobile <768px; Tablet 768–1023px; Desktop >=1024px.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Start a Puzzle From Categories (Priority: P1)

As a player, I want to open the site, see a sleek category “chip cloud” at the top, select a category, and immediately receive a playable word search puzzle (grid + word list).

**Why this priority**: This is the core value (getting into a puzzle fast).

**Independent Test**: A tester can load the page, shuffle categories, select a category, and see a filled puzzle grid plus a topic word chip cloud.

**Acceptance Scenarios**:

1. **Given** the page loads for the first time, **When** the page finishes loading, **Then** exactly 7 category chips (unique when 7+ are available) are shown in a rounded panel at the top and the default theme is Light.
2. **Given** the category chip cloud is visible, **When** the player selects “Shuffle Categories”, **Then** the chip cloud refreshes to 7 random categories (unique when 7+ are available).
3. **Given** the player selects a category chip, **When** the selection is made, **Then** the game chooses a single topic from that category and shows (a) a topic label heading, (b) a topic word chip cloud, and (c) a populated grid.
4. **Given** the player is on a mobile-sized display, **When** a puzzle is generated, **Then** the grid is 10×10 and the puzzle uses 10 total words (6 Easy + 4 Medium) with no duplicates.
5. **Given** the player is on a tablet-sized display, **When** a puzzle is generated, **Then** the grid is 12×12 and the puzzle uses 10 total words (6 Easy + 4 Medium) with no duplicates.
6. **Given** the player is on a desktop-sized display, **When** a puzzle is generated, **Then** the grid is 15×15 and the puzzle uses 12 total words (6 Easy + 4 Medium + 2 Hard) with no duplicates.

---

### User Story 2 - Play and Validate Word Selection (Priority: P2)

As a player, I want to select letter paths on the grid using touch, mouse, or keyboard, so I can find hidden words, get immediate feedback, and track progress in the word list.

**Why this priority**: Without correct selection + validation, the puzzle is not a functional game.

**Independent Test**: A tester can select a correct word and see it crossed off and persistently highlighted; selecting an incorrect word visibly rejects the selection.

**Acceptance Scenarios**:

1. **Given** a puzzle is visible, **When** the player selects a contiguous straight-line letter path that matches a hidden word, **Then** that word is crossed off in the topic word cloud and the grid highlight remains.
2. **Given** a puzzle is visible, **When** the player selects a letter path that does not match any remaining hidden word, **Then** the temporary highlight shakes briefly and disappears.
3. **Given** multiple words are found, **When** the player views the grid and word list, **Then** each found word remains highlighted and crossed off using one of 5–6 distinct highlight colors.
4. **Given** keyboard play is used, **When** the player navigates and selects letters, **Then** the same validation behavior occurs as with touch/mouse.

---

### User Story 3 - Finish Puzzle, Celebrate, and Continue (Priority: P3)

As a player, when I find all words I want a brief celebration and a clear choice to continue with another topic in the same category or choose a new category.

**Why this priority**: This completes the gameplay loop and encourages replay.

**Independent Test**: A tester can complete a puzzle, see confetti, get the modal prompt, and successfully start another topic or return focus to category selection.

**Acceptance Scenarios**:

1. **Given** the last remaining word is found, **When** completion occurs, **Then** a small confetti burst appears at the top of the page for ~0.5 seconds.
2. **Given** completion occurs, **When** the celebration ends, **Then** a modal asks whether to try another topic in the current category or choose another category.
3. **Given** the player chooses “another topic”, **When** they confirm, **Then** a new topic (from the same category) is selected and the puzzle grid, word list, and facts update.
4. **Given** the player chooses “another category”, **When** they confirm, **Then** focus returns to the category chip cloud so the player can select a new category.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- If fewer than 7 unique categories are available, show all unique categories without errors.
- If a selected category has no valid topics (missing files), show a clear message and allow shuffling categories/topics.
- If a topic does not have enough words for the device’s required mix, use the maximum unique words available while preserving the no-duplicates rule.
- If a facts file is missing or has fewer than 3 facts, show the available facts and avoid empty placeholders.
- If a generated grid cannot place all required words within a reasonable amount of time, retry generation; if still failing, choose a different topic.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
  Include any hosting or deployment constraints required by the constitution.
-->

### Functional Requirements

- **FR-001**: The site MUST provide a Light/Dark mode toggle and default to Light mode on first load.
- **FR-002**: On initial load, the site MUST display a rounded “chip cloud” panel containing exactly 7 randomly selected category chips, using unique category labels when 7+ are available.
- **FR-003**: Category chips MUST be populated from the labels in `public/wordcache/categories.json` using the key name `label`.
- **FR-004**: The site MUST provide a “Shuffle Categories” control that re-populates the category chip cloud with 7 random category labels (unique when 7+ are available).
- **FR-005**: Selecting a category MUST generate a puzzle using words from exactly one topic within that category.
- **FR-006**: The topic displayed label above the playing word chip cloud MUST come from the selected category’s `public/wordcache/<categorySlug>/label_topics.json` using the topic `slug` to locate the matching entry and the entry’s `label` for display.
- **FR-007**: The site MUST provide a “Shuffle Topic” control that selects another topic within the current category and re-generates the word chip cloud, grid, and facts.
- **FR-008**: The playing word chip cloud MUST show the selected topic words in small chips arranged to fit within 2–3 rows above the grid (and below the category chip panel).
- **FR-009**: Puzzle word selection MUST use difficulty files for the chosen topic:
  - Mobile/tablet: use Easy + Medium only
  - Desktop: use Easy + Medium + Hard
- **FR-010**: For mobile/tablet puzzles, the system MUST randomly select 6 unique Easy words and 4 unique Medium words.
- **FR-011**: For desktop puzzles, the system MUST randomly select 6 unique Easy words, 4 unique Medium words, and 2 unique Hard words.
- **FR-012**: The system MUST ensure there are no duplicate words within a single puzzle word list, even if source files contain duplicates.
- **FR-013**: The grid MUST be sized by display class: 10×10 (mobile), 12×12 (tablet), 15×15 (desktop).
- **FR-013a**: Display classes MUST be determined by viewport width: Mobile <768px; Tablet 768–1023px; Desktop >=1024px.
- **FR-014**: The grid MUST place words using all 8 directions.
- **FR-015**: In the non-word (filler) grid cells, letters from the set {E, A, R, S, T} MUST make up at least 30% of filler letters.
- **FR-016**: The grid MUST use a monospaced font.
- **FR-017**: The player MUST be able to select letter paths using touch, mouse, and keyboard.
- **FR-018**: While selecting letters, the UI MUST display a colored “pill” highlight; the system MUST support 5–6 distinct highlight colors for found words.
- **FR-019**: If a selected letter path matches a remaining hidden word, the system MUST mark the word as found by (a) crossing it off in the topic chip cloud and (b) leaving the highlight on the grid.
- **FR-020**: If a selected letter path does not match any remaining hidden word, the system MUST reject it by briefly shaking the highlight and then removing it.
- **FR-021**: When all words are found, the system MUST show a small confetti burst at the top of the page lasting approximately 0.5 seconds.
- **FR-022**: After completion, the system MUST display a modal offering: (a) try another topic in the current category, or (b) choose another category.
- **FR-023**: If the player chooses another topic, the system MUST start a new puzzle from a randomly selected topic within the current category.
- **FR-024**: If the player chooses another category, the system MUST return focus to the category chip cloud.
- **FR-025**: The page MUST show a “3 amazing facts” section below the grid with exactly 3 randomly selected, non-duplicated facts for the current topic.
- **FR-026**: Facts MUST be sourced from the topic facts file located in the category directory (pattern: `<topic>_facts.json`) and selected from the `facts` array within that file.
- **FR-027**: The footer MUST include: a dynamic copyright year range starting at 2026, “MIT License”, a link to the GitHub repo, and a link to open a new issue.
- **FR-028**: The page MUST include at least 80px of whitespace/padding below the footer.

### Deployment Constraints *(mandatory)*

- Deployment MUST target GitHub Pages.
- Deployments MUST run via GitHub Actions and only from `main`.
- Output MUST be static assets (HTML/CSS/JS/images).

### Assumptions & Dependencies

- The repository contains `public/wordcache/categories.json` and per-category `public/wordcache/<categorySlug>/label_topics.json` and they are consistent with the category/topic folders and files under `public/wordcache/`.
- Each topic has difficulty word lists available as Easy/Medium/Hard JSON files with a `words` list; on mobile/tablet the game will ignore Hard even if present.
- “Mobile/Tablet/Desktop” are determined by viewport width as defined in FR-013a.
- Each topic may have an optional facts file with 7 facts; the site will display up to 3 when available.

### Key Entities *(include if feature involves data)*

- **Category**: A labeled grouping of topics; displayed as a chip; maps to a folder under `public/wordcache/`.
- **Topic**: A themed set of word lists (Easy/Medium/Hard) within a category; identified by a `slug` and displayed via a human-readable `label`.
- **Word List Entry**: A word used in a puzzle; sourced from a topic difficulty file’s `words` list.
- **Puzzle**: A single generated game instance consisting of one topic, a selected set of words, a letter grid, found-word state, and completion state.
- **Fact**: A short “amazing fact” string displayed below the grid; selected from the topic’s facts file.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: A new visitor can start a playable puzzle in under 10 seconds (page load → category selection → populated grid visible) under typical network conditions.
- **SC-002**: For a given category selection, the system generates a puzzle word list with 0 duplicates (100% of generated puzzles).
- **SC-003**: On all supported display classes (mobile/tablet/desktop), the grid renders at the correct size (10×10 / 12×12 / 15×15) and remains playable without horizontal scrolling.
- **SC-004**: In manual QA, correct word selections are accepted and incorrect selections are rejected with visible feedback in 100% of tested attempts.
- **SC-005**: After completing a puzzle, 100% of completions show the confetti burst and modal, and the user can successfully start another topic or return to category selection.
- **SC-006**: The facts section displays exactly 3 facts (or fewer if data is missing), with no duplicates among the displayed facts.
