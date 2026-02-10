# Data Model: Modern Word Search Website

**Feature**: specs/001-word-search-game/spec.md
**Date**: 2026-02-10

> This is a static client-side app. “Data model” describes in-memory state and the JSON file shapes consumed from `public/wordcache/**`.

## Entities

### Category
- **slug**: string (e.g., `history_civics`)
- **label**: string (e.g., `History & Civics`)
- **path**: string (e.g., `public/wordcache/history_civics`)

**Source**: `public/wordcache/categories.json` → `categories[]`

### Topic
- **slug**: string (e.g., `civics`)
- **label**: string (e.g., `Civics`)
- **categorySlug**: string

**Sources**:
- `public/wordcache/<categorySlug>/topics.json` → list of topic slugs
- `public/wordcache/<categorySlug>/label_topics.json` → slug → label mapping

### TopicWordList (by difficulty)
- **topicSlug**: string
- **difficulty**: `easy | medium | hard`
- **words**: string[] (uppercase words)

**Source**: `public/wordcache/<categorySlug>/<topicSlug>_<difficulty>.json` → `words`

### TopicFacts
- **categorySlug**: string
- **topicLabel**: string (human label in the file)
- **facts**: string[]

**Source**: `public/wordcache/<categorySlug>/<topicSlug>_facts.json` → `facts`

### Puzzle
- **category**: Category
- **topic**: Topic
- **gridSize**: number (10/12/15)
- **selectedWords**: string[] (device mix, unique)
- **grid**: Grid
- **foundWords**: FoundWord[]
- **factsShown**: string[] (3 unique facts)

### Grid
- **size**: number
- **cells**: string[][] (size×size, single A–Z letters)

### WordPlacement
- **word**: string
- **startRow/startCol**: number
- **dir**: one of 8 directions
- **cells**: { row: number; col: number }[]

### FoundWord
- **word**: string
- **placement**: WordPlacement
- **colorIndex**: number (0..5)

### SelectionPreview
- **anchor**: { row: number; col: number } | null
- **current**: { row: number; col: number } | null
- **pathCells**: { row: number; col: number }[] (derived)
- **previewText**: string (derived)

## Validation Rules

- Category chip cloud uses **unique** category labels when >=7 exist.
- Puzzle word list must contain **no duplicates**.
- Device mixes:
  - Mobile/Tablet: 6 easy + 4 medium
  - Desktop: 6 easy + 4 medium + 2 hard
- Grid sizes by viewport width:
  - <768px: 10×10
  - 768–1023px: 12×12
  - >=1024px: 15×15
- Words must be placeable in 8 directions and remain within bounds.
- Overlap allowed only when letters match; overlaps are encouraged.
- Filler letters: at least 30% from {E, A, R, S, T} across filler cells.

## State Machine

### UI State
- **Idle**: App loads, categories available.
- **LoadingPuzzle**: Fetching JSON and/or generating grid.
- **Playing**: Grid interactive; found words tracked.
- **Completed**: All words found; confetti + modal prompt.
- **Error**: Missing/invalid data; user can shuffle categories/topics.

Transitions:
- Idle → LoadingPuzzle (category selected)
- LoadingPuzzle → Playing (puzzle ready)
- Playing → Completed (all words found)
- Completed → LoadingPuzzle (choose another topic)
- Completed → Idle (choose another category)
- Any → Error (data missing / generation failure beyond retry budget)
- Error → LoadingPuzzle (shuffle topic/category)
