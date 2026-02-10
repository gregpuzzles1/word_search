export type ViewportClass = "mobile" | "tablet" | "desktop";

export type GridSize = {
  rows: number;
  cols: number;
};

export const getViewportClass = (width: number): ViewportClass => {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};

export const gridSizeForViewport = (viewport: ViewportClass): GridSize => {
  switch (viewport) {
    case "mobile":
      return { rows: 9, cols: 8 };
    case "tablet":
      return { rows: 12, cols: 12 };
    case "desktop":
      return { rows: 15, cols: 15 };
  }
};

export const wordMixForViewport = (viewport: ViewportClass) => {
  switch (viewport) {
    case "mobile":
    case "tablet":
      return { easy: 6, medium: 4, hard: 0 };
    case "desktop":
      return { easy: 6, medium: 4, hard: 2 };
  }
};
