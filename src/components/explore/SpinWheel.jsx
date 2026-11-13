import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Confetti from "@/components/common/Confetti";
import { DOMAIN_META } from "@/lib/landingDomains";

const SIZE = 320;
const C = SIZE / 2;
const R = 150;
const SEGMENTS = 8;
const FILLS = ["#7c3aed", "#ff5c8a", "#ffc933", "#2dd4a7", "#38bdf8", "#ff8a3d"];

const point = (angleDeg, radius) => {
  const a = (angleDeg * Math.PI) / 180; // 0° is straight up, clockwise
  return [C + radius * Math.sin(a), C - radius * Math.cos(a)];
};

function wedge(i) {
  const seg = 360 / SEGMENTS;
  const [x1, y1] = point(i * seg, R);
  const [x2, y2] = point((i + 1) * seg, R);
  return `M${C} ${C} L${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2} Z`;
}

/** Picks `n` random careers, spreading across domains where it can. */
function pickCareers(careers, n) {
  const pool = [...careers].sort(() => Math.random() - 0.5);
  const picked = [];
  const seenDomains = new Set();
  for (const c of pool) {
    if (picked.length >= n) break;
    if (!seenDomains.has(c.domain)) {
      picked.push(c);
      seenDomains.add(c.domain);
    }
  }
  for (const c of pool) {
    if (picked.length >= n) break;
    if (!picked.includes(c)) picked.push(c);
  }
  return picked.sort(() => Math.random() - 0.5);
}

/**
 * "Surprise me" — a prize wheel of 8 random careers. Spins with a long CSS
 * ease-out, lands on a pre-chosen winner (the rotation is computed so that
 * segment ends up under the pointer), then pops confetti and the result card.
 */
export default function SpinWheel({ careers, onClose }) {
  const [wheel, setWheel] = useState(() => pickCareers(careers, SEGMENTS));
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const pendingWinner = useRef(null);

  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Freeze the page behind the modal. Scrolling it while a full-screen overlay
  // and a spinning wheel are on top forces the browser to re-composite the
  // whole page every frame (that was the lag). Padding replaces the vanished
  // scrollbar so the layout doesn't jump sideways.
  useEffect(() => {
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    html.style.overflow = "hidden";
    if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`;
    return () => {
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.paddingRight;
    };
  }, []);

  const spin = () => {
    if (spinning) return;
    const seg = 360 / SEGMENTS;
    const winnerIndex = Math.floor(Math.random() * wheel.length);
    // Centre of the winning segment, measured clockwise from the top. A
    // random nudge inside the segment keeps it from always landing dead-centre.
    const center = winnerIndex * seg + seg / 2 + (Math.random() - 0.5) * seg * 0.6;
    const target = Math.ceil(rotation / 360) * 360 + 360 * 5 - center;

    setWinner(null);
    setSpinning(true);
    setRotation(target);
    // Remember which career won until the transition finishes.
    pendingWinner.current = wheel[winnerIndex];
  };

  const onSpinEnd = () => {
    if (!spinning) return;
    setSpinning(false);
    setWinner(pendingWinner.current);
  };

  const newWheel = () => {
    setWinner(null);
    setWheel(pickCareers(careers, SEGMENTS));
  };

  const meta = winner ? DOMAIN_META[winner.domain] : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Spin the career wheel"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-night/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-[2rem] border-2 border-ink bg-surface p-6 text-center shadow-pop-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border-2 border-ink bg-surface text-ink hover:bg-sunny/40"
        >
          <X size={16} />
        </button>

        <h2 className="font-display text-3xl font-bold text-ink">Spin for a career!</h2>
        <p className="mt-1 text-sm text-ink-muted">Not sure where to start? Let the wheel pick.</p>

        <div className="relative mx-auto mt-6" style={{ width: SIZE, maxWidth: "100%" }}>
          {/* Pointer */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[-10px] z-10 -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: "14px solid transparent",
              borderRight: "14px solid transparent",
              borderTop: "26px solid var(--nx-ink)",
            }}
          />
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="block w-full overflow-visible rounded-full border-4 border-ink"
            style={{
              // Own GPU layer: the spin is then pure compositor work, no repaint.
              willChange: "transform",
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? `transform ${reduceMotion ? 0.5 : 5}s cubic-bezier(0.12, 0.7, 0.12, 1)`
                : "none",
            }}
            onTransitionEnd={onSpinEnd}
            role="img"
            aria-label={`Wheel with ${wheel.map((c) => c.title).join(", ")}`}
          >
            {wheel.map((c, i) => {
              const seg = 360 / SEGMENTS;
              const mid = i * seg + seg / 2;
              const title = c.title.length > 17 ? `${c.title.slice(0, 16)}…` : c.title;
              return (
                <g key={c.id}>
                  <path d={wedge(i)} fill={FILLS[i % FILLS.length]} stroke="#1b1640" strokeWidth="2" />
                  <text
                    transform={`rotate(${mid - 90} ${C} ${C})`}
                    x={C + R - 12}
                    y={C}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize="12.5"
                    fontWeight="700"
                    fill="#1b1640"
                    style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                  >
                    {title}
                  </text>
                </g>
              );
            })}
            <circle cx={C} cy={C} r="22" fill="#fff6e5" stroke="#1b1640" strokeWidth="3" />
          </svg>
        </div>

        {winner ? (
          <div className="relative mt-6 overflow-hidden rounded-2xl border-2 border-ink bg-paper p-5">
            <Confetti />
            <span className={`inline-block rounded-full border-2 border-ink px-3 py-0.5 text-xs font-bold ${meta?.bg ?? ""}`}>
              {winner.domain}
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold text-ink">{winner.title}</h3>
            <p className="text-sm font-bold text-grape dark:text-primary">{winner.salaryRange}</p>
            {winner.funFact && <p className="mt-2 text-sm text-ink-muted">{winner.funFact}</p>}
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button asChild variant="ink" size="sm">
                <Link to={`/careers/${winner.id}`} onClick={onClose}>
                  Explore it
                  <ArrowRight size={15} />
                </Link>
              </Button>
              <Button variant="inkOutline" size="sm" onClick={spin}>
                <RotateCcw size={14} />
                Spin again
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="sunny" size="lg" onClick={spin} disabled={spinning}>
              {spinning ? "Spinning…" : "SPIN!"}
            </Button>
            <Button variant="inkOutline" size="lg" onClick={newWheel} disabled={spinning}>
              New wheel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
