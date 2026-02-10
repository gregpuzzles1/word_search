import { useMemo, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import type { FoundWord, SelectionPreview } from "../game/state";

type GridProps = {
  grid: string[][];
  selection: SelectionPreview | null;
  foundWords: FoundWord[];
  invalidSelection: boolean;
  onStartSelection: (cell: { row: number; col: number }) => void;
  onUpdateSelection: (cell: { row: number; col: number }) => void;
  onCommitSelection: () => void;
  onCancelSelection: () => void;
};

export default function Grid({
  grid,
  selection,
  foundWords,
  invalidSelection,
  onStartSelection,
  onUpdateSelection,
  onCommitSelection,
  onCancelSelection
}: GridProps) {
  const size = grid.length;
  const style = { "--grid-size": size } as CSSProperties;
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });

  const foundMap = useMemo(() => {
    const map = new Map<string, number>();
    foundWords.forEach((found) => {
      found.placement.cells.forEach((cell) => {
        map.set(`${cell.row}-${cell.col}`, found.colorIndex);
      });
    });
    return map;
  }, [foundWords]);

  const previewSet = useMemo(() => {
    const set = new Set<string>();
    selection?.pathCells.forEach((cell) => {
      set.add(`${cell.row}-${cell.col}`);
    });
    return set;
  }, [selection]);

  const handlePointerDown = (row: number, col: number) => {
    setIsPointerDown(true);
    onStartSelection({ row, col });
  };

  const handlePointerEnter = (row: number, col: number) => {
    if (!isPointerDown) return;
    onUpdateSelection({ row, col });
  };

  const handlePointerUp = () => {
    if (!isPointerDown) return;
    setIsPointerDown(false);
    onCommitSelection();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
      event.preventDefault();
      setActiveCell((prev) => {
        const next = { ...prev };
        if (key === "ArrowUp") next.row = Math.max(0, prev.row - 1);
        if (key === "ArrowDown") next.row = Math.min(size - 1, prev.row + 1);
        if (key === "ArrowLeft") next.col = Math.max(0, prev.col - 1);
        if (key === "ArrowRight") next.col = Math.min(size - 1, prev.col + 1);
        if (selection?.anchor) {
          onUpdateSelection(next);
        }
        return next;
      });
    }

    if (key === " ") {
      event.preventDefault();
      if (selection?.anchor) {
        onCommitSelection();
      } else {
        onStartSelection(activeCell);
      }
    }

    if (key === "Escape") {
      event.preventDefault();
      onCancelSelection();
    }
  };

  return (
    <div className="grid-shell">
      <div
        className={`grid${invalidSelection ? " is-shaking" : ""}`}
        style={style}
        role="grid"
        aria-label="Word search grid"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => setIsPointerDown(false)}
      >
        {grid.map((row, rowIndex) => (
          <div className="grid-row" role="row" key={`row-${rowIndex}`}>
            {row.map((cell, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;
              const foundIndex = foundMap.get(key);
              const isPreview = previewSet.has(key);
              const cellStyle =
                foundIndex !== undefined
                  ? ({ "--cell-accent": `var(--highlight-${foundIndex})` } as CSSProperties)
                  : undefined;

              return (
                <span
                  key={`cell-${key}`}
                  className={`grid-cell${isPreview ? " is-preview" : ""}${
                    foundIndex !== undefined ? " is-found" : ""
                  }`}
                  style={cellStyle}
                  role="gridcell"
                  onPointerDown={() => handlePointerDown(rowIndex, colIndex)}
                  onPointerEnter={() => handlePointerEnter(rowIndex, colIndex)}
                  onClick={() => {
                    if (!selection?.anchor) {
                      onStartSelection({ row: rowIndex, col: colIndex });
                    } else {
                      onUpdateSelection({ row: rowIndex, col: colIndex });
                      onCommitSelection();
                    }
                  }}
                >
                  {cell}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
