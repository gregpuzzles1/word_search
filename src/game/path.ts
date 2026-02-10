import { buildPathCells } from "./directions";
import type { CellCoord, SelectionPreview } from "./state";

export const getSelectionPreview = (
  grid: string[][],
  anchor: CellCoord,
  current: CellCoord
): SelectionPreview => {
  const pathCells = buildPathCells(anchor, current);
  const previewText = pathCells
    .map((cell) => grid[cell.row]?.[cell.col] ?? "")
    .join("");

  return {
    anchor,
    current,
    pathCells,
    previewText
  };
};
