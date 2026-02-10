import { DIRECTIONS } from "./directions";
import { shuffle } from "./random";
import { fillEmptyCells } from "./filler";
import type { Direction } from "./directions";

export type Placement = {
  word: string;
  row: number;
  col: number;
  dir: Direction;
  cells: { row: number; col: number }[];
};

export type GeneratedPuzzle = {
  grid: string[][];
  placements: Placement[];
};

const createEmptyGrid = (size: number) =>
  Array.from({ length: size }, () => Array.from({ length: size }, () => null as
    | string
    | null));

const computeCells = (
  word: string,
  row: number,
  col: number,
  dir: Direction
) => {
  const cells: { row: number; col: number }[] = [];
  for (let i = 0; i < word.length; i += 1) {
    cells.push({ row: row + dir.dr * i, col: col + dir.dc * i });
  }
  return cells;
};

const canPlaceWord = (
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  dir: Direction
) => {
  const size = grid.length;
  const endRow = row + dir.dr * (word.length - 1);
  const endCol = col + dir.dc * (word.length - 1);
  if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
    return null;
  }

  const cells = computeCells(word, row, col, dir);
  let overlap = 0;
  for (let i = 0; i < cells.length; i += 1) {
    const { row: r, col: c } = cells[i];
    const current = grid[r][c];
    if (current && current !== word[i]) {
      return null;
    }
    if (current === word[i]) {
      overlap += 1;
    }
  }

  return { cells, overlap };
};

const placeWordOnGrid = (
  grid: (string | null)[][],
  word: string,
  cells: { row: number; col: number }[]
) => {
  const changed: { row: number; col: number; prev: string | null }[] = [];
  cells.forEach(({ row, col }, index) => {
    if (!grid[row][col]) {
      changed.push({ row, col, prev: null });
      grid[row][col] = word[index];
    }
  });
  return changed;
};

const undoPlacement = (
  grid: (string | null)[][],
  changed: { row: number; col: number; prev: string | null }[]
) => {
  changed.forEach(({ row, col, prev }) => {
    grid[row][col] = prev;
  });
};

export const generateGrid = (
  words: string[],
  size: number,
  options?: { maxAttempts?: number; maxCandidates?: number }
): GeneratedPuzzle => {
  const maxAttempts =
    options?.maxAttempts ?? Math.max(80, Math.min(300, words.length * 25));
  const maxCandidates = options?.maxCandidates ?? 12;
  const sortedWords = [...words].sort((a, b) => b.length - a.length);

  if (sortedWords.some((word) => word.length > size)) {
    throw new Error("One or more words are longer than the grid size.");
  }

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const grid = createEmptyGrid(size);
    const placements: Placement[] = [];

    const tryPlace = (index: number): boolean => {
      if (index >= sortedWords.length) return true;
      const word = sortedWords[index];
      const candidates: {
        row: number;
        col: number;
        dir: Direction;
        overlap: number;
        cells: { row: number; col: number }[];
      }[] = [];

      for (let row = 0; row < size; row += 1) {
        for (let col = 0; col < size; col += 1) {
          for (const dir of DIRECTIONS) {
            const result = canPlaceWord(grid, word, row, col, dir);
            if (result) {
              candidates.push({ row, col, dir, overlap: result.overlap, cells: result.cells });
            }
          }
        }
      }

      if (!candidates.length) return false;
      candidates.sort((a, b) => b.overlap - a.overlap);
      const shortlist = shuffle(candidates.slice(0, maxCandidates));

      for (const candidate of shortlist) {
        const changed = placeWordOnGrid(grid, word, candidate.cells);
        placements.push({
          word,
          row: candidate.row,
          col: candidate.col,
          dir: candidate.dir,
          cells: candidate.cells
        });

        if (tryPlace(index + 1)) return true;

        placements.pop();
        undoPlacement(grid, changed);
      }

      return false;
    };

    if (tryPlace(0)) {
      return { grid: fillEmptyCells(grid), placements };
    }
  }

  throw new Error("Unable to generate a valid grid with the given words.");
};
