import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import type { CellCoord, FoundWord, SelectionPreview } from "../game/state";

type GridMetrics = {
  cellSize: number;
  gap: number;
};

type PillSegment = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  zIndex: number;
};

const buildPillSegments = (
  cells: { row: number; col: number }[],
  metrics: GridMetrics | null,
  color: string,
  zIndex: number,
  idPrefix: string
): PillSegment[] => {
  if (!metrics || cells.length === 0) return [];
  const { cellSize, gap } = metrics;
  const step = cellSize + gap;
  const thickness = Math.max(8, cellSize * 0.86);

  const toCenter = (cell: { row: number; col: number }) => ({
    x: cell.col * step + cellSize / 2,
    y: cell.row * step + cellSize / 2
  });

  if (cells.length === 1) {
    const center = toCenter(cells[0]);
    return [
      {
        id: `${idPrefix}-solo-${cells[0].row}-${cells[0].col}`,
        x: center.x,
        y: center.y,
        width: thickness,
        height: thickness,
        rotation: 0,
        color,
        zIndex
      }
    ];
  }

  const segments: PillSegment[] = [];
  for (let index = 0; index < cells.length - 1; index += 1) {
    const start = toCenter(cells[index]);
    const end = toCenter(cells[index + 1]);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    if (!length) continue;
    segments.push({
      id: `${idPrefix}-seg-${index}-${cells[index].row}-${cells[index].col}`,
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
      width: length + thickness,
      height: thickness,
      rotation: (Math.atan2(dy, dx) * 180) / Math.PI,
      color,
      zIndex
    });
  }

  return segments;
};

type GridProps = {
  grid: string[][];
  selection: SelectionPreview | null;
  foundWords: FoundWord[];
  hintCell: CellCoord | null;
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
  hintCell,
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
  const [gridMetrics, setGridMetrics] = useState<GridMetrics | null>(null);

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

  useLayoutEffect(() => {
    if (!gridRef.current || cols <= 0) return;
    const gridElement = gridRef.current;

    const updateMetrics = () => {
      const rect = gridElement.getBoundingClientRect();
      const computed = window.getComputedStyle(gridElement);
      const gapValue = parseFloat(computed.columnGap || computed.gap || "0");
      const totalGap = gapValue * Math.max(0, cols - 1);
      const cellSize = (rect.width - totalGap) / cols;
      if (!Number.isFinite(cellSize) || cellSize <= 0) return;
      setGridMetrics({ cellSize, gap: gapValue });
    };

    updateMetrics();
    const observer = new ResizeObserver(updateMetrics);
    observer.observe(gridElement);
    return () => observer.disconnect();
  }, [cols]);

  const previewSegments = useMemo(() => {
    return buildPillSegments(
      selection?.pathCells ?? [],
      gridMetrics,
      "var(--brand)",
      3,
      "preview"
    );
  }, [selection, gridMetrics]);

  const foundSegments = useMemo(() => {
    if (!gridMetrics) return [];
    const segments: PillSegment[] = [];
    foundWords.forEach((found, index) => {
      const color = `var(--highlight-${found.colorIndex})`;
      segments.push(
        ...buildPillSegments(
          found.placement.cells,
          gridMetrics,
          color,
          2,
          `found-${index}`
        )
      );
    });
    return segments;
  }, [foundWords, gridMetrics]);

  const hasAnyPill = previewSegments.length > 0 || foundSegments.length > 0;

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
        className={`grid${invalidSelection ? " is-shaking" : ""}${
          hasAnyPill ? " has-pill" : ""
        }`}
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
        {hasAnyPill && (
          <div className="grid-overlay" aria-hidden="true">
            {foundSegments.map((segment) => (
              <span
                key={segment.id}
                className="grid-pill"
                style={
                  {
                    left: `${segment.x}px`,
                    top: `${segment.y}px`,
                    width: `${segment.width}px`,
                    height: `${segment.height}px`,
                    transform: `translate(-50%, -50%) rotate(${segment.rotation}deg)`,
                    "--pill-color": segment.color,
                    zIndex: segment.zIndex
                  } as CSSProperties
                }
              />
            ))}
            {previewSegments.map((segment) => (
              <span
                key={segment.id}
                className="grid-pill"
                style={
                  {
                    left: `${segment.x}px`,
                    top: `${segment.y}px`,
                    width: `${segment.width}px`,
                    height: `${segment.height}px`,
                    transform: `translate(-50%, -50%) rotate(${segment.rotation}deg)`,
                    "--pill-color": segment.color,
                    zIndex: segment.zIndex
                  } as CSSProperties
                }
              />
            ))}
          </div>
        )}
        {grid.map((row, rowIndex) => (
          <div className="grid-row" role="row" key={`row-${rowIndex}`}>
            {row.map((cell, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;
              const foundIndex = foundMap.get(key);
              const isPreview = previewSet.has(key);
              const isHinted =
                hintCell?.row === rowIndex && hintCell?.col === colIndex;
              const cellStyle =
                foundIndex !== undefined
                  ? ({ "--cell-accent": `var(--highlight-${foundIndex})` } as CSSProperties)
                  : undefined;

              return (
                <span
                  key={`cell-${key}`}
                  className={`grid-cell${isPreview ? " is-preview" : ""}${
                    foundIndex !== undefined ? " is-found" : ""
                  }${isHinted ? " is-hint" : ""
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
