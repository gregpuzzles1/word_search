import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type ConfettiBurstProps = {
  active: boolean;
};

const CONFETTI_PIECES = 26;
const CONFETTI_DURATION = 1400;

export default function ConfettiBurst({ active }: ConfettiBurstProps) {
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (!active) return;
    setRender(true);
    const timer = window.setTimeout(() => setRender(false), CONFETTI_DURATION);
    return () => window.clearTimeout(timer);
  }, [active]);

  const pieces = useMemo(() => {
    if (!render) return [] as Array<{ id: string; style: CSSProperties }>;
    return Array.from({ length: CONFETTI_PIECES }).map((_, index) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 70 + Math.random() * 90;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance + 30;
      const rotation = Math.floor(Math.random() * 160 + 40);
      return {
        id: `confetti-${index}`,
        style: {
          "--dx": `${dx.toFixed(1)}px`,
          "--dy": `${dy.toFixed(1)}px`,
          "--rot": `${rotation}deg`,
          "--confetti-color": `var(--highlight-${index % 6})`
        } as CSSProperties
      };
    });
  }, [render]);

  if (!render) return null;

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span key={piece.id} className="confetti-piece" style={piece.style} />
      ))}
    </div>
  );
}
