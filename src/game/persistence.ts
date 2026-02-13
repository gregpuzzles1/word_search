import type { Category } from "../data/types";
import type { GameStatus, Puzzle } from "./state";

const STORAGE_KEY = "wordsearch-game-snapshot";
const SNAPSHOT_VERSION = 1;
const SNAPSHOT_TTL_MS = 1000 * 60 * 60 * 24 * 14;

type PersistableStatus = Extract<GameStatus, "playing" | "completed">;

type PersistedGameSnapshot = {
  version: number;
  savedAt: number;
  status: PersistableStatus;
  puzzle: Puzzle;
  selectedCategory: Category | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
};

const isCategory = (value: unknown): value is Category => {
  if (!isRecord(value)) return false;
  return (
    typeof value.slug === "string" &&
    typeof value.label === "string" &&
    typeof value.path === "string"
  );
};

const isPuzzle = (value: unknown): value is Puzzle => {
  if (!isRecord(value)) return false;
  return (
    typeof value.puzzleId === "string" &&
    isCategory(value.category) &&
    typeof value.topicSlug === "string" &&
    typeof value.topicLabel === "string" &&
    typeof value.gridRows === "number" &&
    typeof value.gridCols === "number" &&
    isStringArray(value.words) &&
    Array.isArray(value.grid) &&
    Array.isArray(value.placements) &&
    Array.isArray(value.foundWords) &&
    isStringArray(value.facts)
  );
};

const isPersistableStatus = (value: unknown): value is PersistableStatus => {
  return value === "playing" || value === "completed";
};

const isPersistedSnapshot = (value: unknown): value is PersistedGameSnapshot => {
  if (!isRecord(value)) return false;
  return (
    value.version === SNAPSHOT_VERSION &&
    typeof value.savedAt === "number" &&
    isPersistableStatus(value.status) &&
    isPuzzle(value.puzzle) &&
    (value.selectedCategory === null || isCategory(value.selectedCategory))
  );
};

export const loadGameSnapshot = (): PersistedGameSnapshot | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isPersistedSnapshot(parsed)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    const isExpired = Date.now() - parsed.savedAt > SNAPSHOT_TTL_MS;
    if (isExpired) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const saveGameSnapshot = (params: {
  status: PersistableStatus;
  puzzle: Puzzle;
  selectedCategory: Category | null;
}) => {
  if (typeof window === "undefined") return;

  const payload: PersistedGameSnapshot = {
    version: SNAPSHOT_VERSION,
    savedAt: Date.now(),
    status: params.status,
    puzzle: params.puzzle,
    selectedCategory: params.selectedCategory
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const clearGameSnapshot = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
};
