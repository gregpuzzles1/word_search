type ThemeToggleProps = {
  mode: "light" | "dark";
  onToggle: () => void;
};

export default function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  return (
    <button className="theme-toggle" type="button" onClick={onToggle}>
      {mode === "light" ? "Light" : "Dark"}
    </button>
  );
}
