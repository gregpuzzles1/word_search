import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { loadCategories } from "../data/wordcache";
import { buildPuzzle } from "./buildPuzzle";
import { getViewportClass } from "./viewport";
import { sampleUnique } from "./random";
import type { Category } from "../data/types";
import type { ViewportClass } from "./viewport";
import { gameReducer, initialGameState } from "./state";
import { getSelectionPreview } from "./path";
import { findMatchingPlacement } from "./validateSelection";
import { isComplete } from "./isComplete";

const pickVisibleCategories = (categories: Category[]) => {
  return sampleUnique(categories, Math.min(7, categories.length));
};

export const useWordSearchGame = () => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [invalidSelection, setInvalidSelection] = useState(false);
  const [ariaMessage, setAriaMessage] = useState("");
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const viewport = useMemo<ViewportClass>(
    () => getViewportClass(viewportWidth),
    [viewportWidth]
  );

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!state.puzzle) return;
    if (isComplete(state.puzzle) && state.status !== "completed") {
      dispatch({ type: "SET_STATUS", payload: "completed" });
    }
  }, [state.puzzle, state.status]);

  useEffect(() => {
    let active = true;
    loadCategories()
      .then((categories) => {
        if (!active) return;
        dispatch({ type: "SET_CATEGORIES", payload: categories });
        setVisibleCategories(pickVisibleCategories(categories));
      })
      .catch((error) => {
        if (!active) return;
        const message =
          error instanceof Error
            ? `Unable to load categories: ${error.message}`
            : "Unable to load categories.";
        dispatch({ type: "SET_ERROR", payload: message });
      });

    return () => {
      active = false;
    };
  }, []);

  const shuffleCategories = useCallback(() => {
    if (!state.categories.length) return;
    setVisibleCategories(pickVisibleCategories(state.categories));
  }, [state.categories]);

  const loadPuzzle = useCallback(
    async (category: Category, topicSlug?: string) => {
      dispatch({ type: "START_LOADING" });
      try {
        const puzzle = await buildPuzzle({
          category,
          viewport,
          topicSlug
        });
        dispatch({ type: "SET_PUZZLE", payload: puzzle });
      } catch (error) {
        const message =
          error instanceof Error
            ? `Unable to generate puzzle: ${error.message}`
            : "Unable to generate puzzle.";
        dispatch({ type: "SET_ERROR", payload: message });
      }
    },
    [viewport]
  );

  const selectCategory = useCallback(
    (category: Category) => {
      setSelectedCategory(category);
      loadPuzzle(category);
    },
    [loadPuzzle]
  );

  const shuffleTopic = useCallback(() => {
    if (!selectedCategory) return;
    loadPuzzle(selectedCategory);
  }, [loadPuzzle, selectedCategory]);

  const startAnotherTopic = useCallback(() => {
    if (!selectedCategory) return;
    loadPuzzle(selectedCategory);
  }, [loadPuzzle, selectedCategory]);

  const startAnotherCategory = useCallback(() => {
    setSelectedCategory(null);
    dispatch({ type: "RESET" });
  }, []);

  const startSelection = useCallback(
    (cell: { row: number; col: number }) => {
      if (!state.puzzle) return;
      dispatch({
        type: "SET_SELECTION",
        payload: getSelectionPreview(state.puzzle.grid, cell, cell)
      });
    },
    [state.puzzle]
  );

  const updateSelection = useCallback(
    (cell: { row: number; col: number }) => {
      if (!state.puzzle || !state.selection?.anchor) return;
      dispatch({
        type: "SET_SELECTION",
        payload: getSelectionPreview(state.puzzle.grid, state.selection.anchor, cell)
      });
    },
    [state.puzzle, state.selection]
  );

  const clearSelection = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTION" });
  }, []);

  const commitSelection = useCallback(() => {
    if (!state.puzzle || !state.selection) return;
    const { pathCells } = state.selection;
    if (pathCells.length <= 1) {
      clearSelection();
      return;
    }

    const match = findMatchingPlacement(
      pathCells,
      state.puzzle.placements,
      state.puzzle.foundWords.map((found) => found.word)
    );

    if (match) {
      const colorIndex = state.puzzle.foundWords.length % 6;
      dispatch({
        type: "ADD_FOUND_WORD",
        payload: { word: match.word, placement: match, colorIndex }
      });
      setAriaMessage(`Found ${match.word}`);
    } else {
      setInvalidSelection(true);
      setTimeout(() => setInvalidSelection(false), 320);
      setAriaMessage("Not a word");
      clearSelection();
    }
  }, [clearSelection, state.puzzle, state.selection]);

  return {
    status: state.status,
    errorMessage: state.errorMessage,
    categories: visibleCategories,
    selectedCategory,
    puzzle: state.puzzle,
    selection: state.selection,
    invalidSelection,
    ariaMessage,
    setAriaMessage,
    shuffleCategories,
    selectCategory,
    shuffleTopic,
    startAnotherTopic,
    startAnotherCategory,
    startSelection,
    updateSelection,
    commitSelection,
    clearSelection,
    viewport
  };
};
