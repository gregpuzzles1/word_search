export type ViewportClass = "mobile" | "tablet" | "desktop";

export const getViewportClass = (width: number): ViewportClass => {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};

export const gridSizeForViewport = (viewport: ViewportClass): number => {
  switch (viewport) {
    case "mobile":
      return 10;
    case "tablet":
      return 12;
    case "desktop":
      return 15;
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
