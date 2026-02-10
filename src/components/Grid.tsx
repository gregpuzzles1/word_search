import { useMemo, useRef, useState } from "react";
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
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const style = { "--grid-columns": cols } as CSSProperties;
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });
  const gridRef = useRef<HTMLDivElement | null>(null);

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

  const handlePointerDown = (
    event: React.PointerEvent,
    row: number,
    col: number
  ) => {
    event.preventDefault();
    setIsPointerDown(true);
    onStartSelection({ row, col });
    gridRef.current?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!isPointerDown) return;
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const cell = target instanceof HTMLElement ? target.closest(".grid-cell") : null;
    if (!cell) return;
    const row = Number(cell.getAttribute("data-row"));
    const col = Number(cell.getAttribute("data-col"));
    if (Number.isNaN(row) || Number.isNaN(col)) return;
    onUpdateSelection({ row, col });
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (!isPointerDown) return;
    setIsPointerDown(false);
    onCommitSelection();
    gridRef.current?.releasePointerCapture(event.pointerId);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
      event.preventDefault();
      setActiveCell((prev) => {
        const next = { ...prev };
        if (key === "ArrowUp") next.row = Math.max(0, prev.row - 1);
        if (key === "ArrowDown") next.row = Math.min(rows - 1, prev.row + 1);
        if (key === "ArrowLeft") next.col = Math.max(0, prev.col - 1);
        if (key === "ArrowRight") next.col = Math.min(cols - 1, prev.col + 1);
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
        onPointerMove={handlePointerMove}
        onPointerCancel={() => setIsPointerDown(false)}
        ref={gridRef}
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
                  data-row={rowIndex}
                  data-col={colIndex}
                  onPointerDown={(event) =>
                    handlePointerDown(event, rowIndex, colIndex)
                  }
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
