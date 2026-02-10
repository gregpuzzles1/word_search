import type { Puzzle } from "./state";

export const isComplete = (puzzle: Puzzle) =>
  puzzle.words.length > 0 && puzzle.foundWords.length >= puzzle.words.length;
