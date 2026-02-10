import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../game/motion";

type ConfettiBurstProps = {
  active: boolean;
};

const CONFETTI_PIECES = 14;

export default function ConfettiBurst({ active }: ConfettiBurstProps) {
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (!active) return;
    setRender(true);
    const timer = window.setTimeout(() => setRender(false), 520);
    return () => window.clearTimeout(timer);
  }, [active]);

  if (!render || prefersReducedMotion()) return null;

  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: CONFETTI_PIECES }).map((_, index) => (
        <span key={`confetti-${index}`} className="confetti-piece" />
      ))}
    </div>
  );
}
