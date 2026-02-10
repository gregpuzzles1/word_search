import type { Category } from "../data/types";
import type { Placement } from "./generator";

export type CellCoord = { row: number; col: number };

export type FoundWord = {
  word: string;
  placement: Placement;
  colorIndex: number;
};

export type SelectionPreview = {
  anchor: CellCoord | null;
  current: CellCoord | null;
  pathCells: CellCoord[];
  previewText: string;
};

export type Puzzle = {
  category: Category;
  topicSlug: string;
  topicLabel: string;
  gridSize: number;
  words: string[];
  grid: string[][];
  placements: Placement[];
  foundWords: FoundWord[];
  facts: string[];
};

export type GameStatus = "idle" | "loading" | "playing" | "completed" | "error";

export type GameState = {
  status: GameStatus;
  categories: Category[];
  puzzle: Puzzle | null;
  errorMessage: string | null;
  selection: SelectionPreview | null;
};

export type GameAction =
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "START_LOADING" }
  | { type: "SET_PUZZLE"; payload: Puzzle }
  | { type: "SET_ERROR"; payload: string }
  | { type: "RESET" }
  | { type: "SET_SELECTION"; payload: SelectionPreview }
  | { type: "CLEAR_SELECTION" }
  | { type: "ADD_FOUND_WORD"; payload: FoundWord }
  | { type: "SET_STATUS"; payload: GameStatus };

export const initialGameState: GameState = {
  status: "idle",
  categories: [],
  puzzle: null,
  errorMessage: null,
  selection: null
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "START_LOADING":
      return { ...state, status: "loading", errorMessage: null };
    case "SET_PUZZLE":
      return {
        ...state,
        status: "playing",
        puzzle: action.payload,
        selection: null
      };
    case "SET_ERROR":
      return { ...state, status: "error", errorMessage: action.payload };
    case "RESET":
      return {
        ...state,
        status: "idle",
        puzzle: null,
        errorMessage: null,
        selection: null
      };
    case "SET_SELECTION":
      return { ...state, selection: action.payload };
    case "CLEAR_SELECTION":
      return { ...state, selection: null };
    case "ADD_FOUND_WORD":
      if (!state.puzzle) return state;
      return {
        ...state,
        puzzle: {
          ...state.puzzle,
          foundWords: [...state.puzzle.foundWords, action.payload]
        },
        selection: null
      };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    default:
      return state;
  }
};
