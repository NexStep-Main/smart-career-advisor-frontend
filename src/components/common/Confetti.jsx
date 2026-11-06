import { useState } from "react";

const COLORS = ["#7c3aed", "#ff5c8a", "#ffc933", "#2dd4a7", "#38bdf8", "#ff8a3d"];

/**
 * One-shot confetti burst that falls inside its (relative, overflow-hidden)
 * parent. Mount it to fire it; remount with a new `key` to fire again. Pure
 * CSS animation, so it costs nothing while idle and is skipped entirely for
 * users who prefer reduced motion (see .animate-confetti in index.css).
 */
export default function Confetti({ count = 44 }) {
  const [pieces] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 1.6 + Math.random() * 1.2,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 6,
      round: i % 3 === 0,
    })),
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="animate-confetti absolute -top-3 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            background: p.color,
            borderRadius: p.round ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
