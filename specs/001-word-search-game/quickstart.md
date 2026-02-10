# Quickstart: Modern Word Search Website (React + TypeScript)

**Feature**: specs/001-word-search-game/spec.md

## Prerequisites

- Node.js (LTS recommended)
- npm

## Install

```bash
npm ci
```

## Run (dev)

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Data files

- Categories index: `public/wordcache/categories.json`
- Per-category topic label map: `public/wordcache/<categorySlug>/label_topics.json`
- Per-category topic list: `public/wordcache/<categorySlug>/topics.json`
- Topic words: `public/wordcache/<categorySlug>/<topicSlug>_{easy|medium|hard}.json`
- Topic facts: `public/wordcache/<categorySlug>/<topicSlug>_facts.json`

## GitHub Pages

- Deployment runs via GitHub Actions from `main` only (constitution).
- For project pages, ensure the Vite base path matches the repo name:
  - expected base: `/word_search/`

## Accessibility smoke-check

- Keyboard: Tab into the grid once, arrows move active cell, Space starts selection, Space commits, Escape cancels.
- Screen reader: announcements for “Found WORD” and “Not a word” via a live region.
