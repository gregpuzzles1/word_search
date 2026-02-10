import type { Placement } from "./generator";
import type { CellCoord } from "./state";

const isSamePath = (a: CellCoord[], b: CellCoord[]) =>
  a.length === b.length &&
  a.every((cell, index) => cell.row === b[index].row && cell.col === b[index].col);

const isReversePath = (a: CellCoord[], b: CellCoord[]) =>
  a.length === b.length &&
  a.every(
    (cell, index) =>
      cell.row === b[b.length - 1 - index].row &&
      cell.col === b[b.length - 1 - index].col
  );

export const findMatchingPlacement = (
  pathCells: CellCoord[],
  placements: Placement[],
  foundWords: string[]
): Placement | null => {
  for (const placement of placements) {
    if (foundWords.includes(placement.word)) continue;
    if (isSamePath(pathCells, placement.cells) || isReversePath(pathCells, placement.cells)) {
      return placement;
    }
  }
  return null;
};
