export type Direction = {
  name: string;
  dr: number;
  dc: number;
};

export const DIRECTIONS: Direction[] = [
  { name: "right", dr: 0, dc: 1 },
  { name: "left", dr: 0, dc: -1 },
  { name: "down", dr: 1, dc: 0 },
  { name: "up", dr: -1, dc: 0 },
  { name: "down-right", dr: 1, dc: 1 },
  { name: "down-left", dr: 1, dc: -1 },
  { name: "up-right", dr: -1, dc: 1 },
  { name: "up-left", dr: -1, dc: -1 }
];

export const isStraightLine = (
  start: { row: number; col: number },
  end: { row: number; col: number }
): Direction | null => {
  const dRow = end.row - start.row;
  const dCol = end.col - start.col;

  const stepRow = Math.sign(dRow);
  const stepCol = Math.sign(dCol);

  if (dRow !== 0 && dCol !== 0 && Math.abs(dRow) !== Math.abs(dCol)) {
    return null;
  }

  return DIRECTIONS.find((dir) => dir.dr === stepRow && dir.dc === stepCol) ?? null;
};

export const buildPathCells = (
  start: { row: number; col: number },
  end: { row: number; col: number }
): { row: number; col: number }[] => {
  const direction = isStraightLine(start, end);
  if (!direction) return [];

  const length =
    Math.max(Math.abs(end.row - start.row), Math.abs(end.col - start.col)) + 1;
  const cells: { row: number; col: number }[] = [];
  for (let i = 0; i < length; i += 1) {
    cells.push({
      row: start.row + direction.dr * i,
      col: start.col + direction.dc * i
    });
  }
  return cells;
};
