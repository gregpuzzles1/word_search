import { shuffle } from "./random";

const COMMON = ["E", "A", "R", "S", "T"];
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const WEIGHTED = [
  ...COMMON,
  ...COMMON,
  ...COMMON,
  ...LETTERS
];

export const fillEmptyCells = (grid: (string | null)[][]): string[][] => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const emptyCells: { row: number; col: number }[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (!grid[row][col]) {
        emptyCells.push({ row, col });
      }
    }
  }

  const totalEmpty = emptyCells.length;
  const requiredCommon = Math.ceil(totalEmpty * 0.3);
  const shuffledCells = shuffle(emptyCells);
  const commonCells = shuffledCells.slice(0, requiredCommon);
  const remainingCells = shuffledCells.slice(requiredCommon);

  const filled: string[][] = grid.map((row) =>
    row.map((cell) => cell ?? "")
  );

  commonCells.forEach(({ row, col }) => {
    filled[row][col] = COMMON[Math.floor(Math.random() * COMMON.length)];
  });

  remainingCells.forEach(({ row, col }) => {
    filled[row][col] = WEIGHTED[Math.floor(Math.random() * WEIGHTED.length)];
  });

  return filled;
};
