import { useEffect, useRef, useState } from "react";
import AriaStatus from "../components/AriaStatus";
import CategoryChipCloud from "../components/CategoryChipCloud";
import CompletionModal from "../components/CompletionModal";
import FactsSection from "../components/FactsSection";
import Footer from "../components/Footer";
import Grid from "../components/Grid";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import ThemeToggle from "../components/ThemeToggle";
import TopicHeader from "../components/TopicHeader";
import WordChipCloud from "../components/WordChipCloud";
import { useWordSearchGame } from "../game/useWordSearchGame";

const THEME_KEY = "wordsearch-theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_KEY);
  return stored === "dark" ? "dark" : "light";
};

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const {
    status,
    errorMessage,
    categories,
    selectedCategory,
    puzzle,
    selection,
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
    hintCell,
    requestHint
  } = useWordSearchGame();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const lastCompletedIdRef = useRef<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("theme-dark", theme === "dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const handleRetry = () => {
    if (selectedCategory) {
      selectCategory(selectedCategory);
    } else {
      shuffleCategories();
    }
  };

  useEffect(() => {
    if (!ariaMessage) return;
    const timer = window.setTimeout(() => setAriaMessage(""), 800);
    return () => window.clearTimeout(timer);
  }, [ariaMessage, setAriaMessage]);

  useEffect(() => {
    if (status !== "completed") {
      setShowConfetti(false);
      setShowModal(false);
      return;
    }
    if (!puzzle || puzzle.puzzleId === lastCompletedIdRef.current) return;

    lastCompletedIdRef.current = puzzle.puzzleId;
    const modalTimer = window.setTimeout(() => {
      setShowModal(true);
      setShowConfetti(true);
    }, 500);
    const confettiTimer = window.setTimeout(() => setShowConfetti(false), 2100);
    return () => {
      window.clearTimeout(confettiTimer);
      window.clearTimeout(modalTimer);
    };
  }, [puzzle, status]);

  const handleAnotherTopic = () => {
    setShowConfetti(false);
    setShowModal(false);
    startAnotherTopic();
    window.setTimeout(() => {
      document.getElementById("topic-panel")?.focus();
    }, 0);
  };

  const handleAnotherCategory = () => {
    setShowConfetti(false);
    setShowModal(false);
    startAnotherCategory();
    window.setTimeout(() => {
      document.getElementById("category-chip-cloud")?.focus();
    }, 0);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="app-kicker">Word Search</p>
          <h1 className="app-title">Find the hidden words.</h1>
        </div>
        <ThemeToggle
          mode={theme}
          onToggle={() =>
            setTheme((prev) => (prev === "light" ? "dark" : "light"))
          }
        />
      </header>

      <main className="app-main">
        <CategoryChipCloud
          categories={categories}
          selectedSlug={selectedCategory?.slug ?? null}
          onShuffle={shuffleCategories}
          onSelect={selectCategory}
        />

        <TopicHeader
          label={puzzle?.topicLabel ?? null}
          onShuffle={shuffleTopic}
          disabled={!puzzle}
        />

        {puzzle ? (
          <WordChipCloud
            words={puzzle.words}
            foundWords={puzzle.foundWords.map((found) => found.word)}
          />
        ) : (
          <p className="empty-muted">Pick a category to generate a puzzle.</p>
        )}

        {status === "loading" ? (
          <LoadingState />
        ) : status === "error" ? (
          <ErrorState
            message={errorMessage ?? "Unable to load puzzle."}
            onRetry={handleRetry}
            onReset={handleAnotherCategory}
          />
        ) : puzzle ? (
          <Grid
            grid={puzzle.grid}
            selection={selection}
            foundWords={puzzle.foundWords}
            hintCell={hintCell}
            invalidSelection={invalidSelection}
            onStartSelection={startSelection}
            onUpdateSelection={updateSelection}
            onCommitSelection={commitSelection}
            onCancelSelection={clearSelection}
          />
        ) : (
          <div className="grid-shell">
            <div className="grid-placeholder">Grid will render here.</div>
          </div>
        )}

        <div className="hint-actions">
          <button
            type="button"
            className="chip-action"
            onClick={requestHint}
            disabled={!puzzle || status === "loading" || status === "error"}
          >
            Hint
          </button>
        </div>

        <FactsSection facts={puzzle?.facts ?? []} />
      </main>

      <Footer />
      <AriaStatus message={ariaMessage} />
      <CompletionModal
        open={showModal}
        confettiActive={showConfetti}
        onAnotherTopic={handleAnotherTopic}
        onAnotherCategory={handleAnotherCategory}
      />
    </div>
  );
}
