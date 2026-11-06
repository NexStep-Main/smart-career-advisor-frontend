import { Check, Lock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const ROW = 132; // vertical distance between nodes (px)
const TOP = 64; // first node's centre (px)
const X_PATTERN = [50, 80, 50, 20]; // horizontal wave, in % of the width

const nodeX = (i) => X_PATTERN[i % X_PATTERN.length];
const nodeY = (i) => TOP + i * ROW;

/**
 * Roadmap as a winding path: one node per phase, joined by a dashed trail
 * that turns solid green behind completed phases, ending in a trophy. Pure
 * presentation: selection and completion live in the page. Nodes are real
 * buttons, so the path is fully keyboard accessible.
 */
export default function PathMap({ phases, completed, selectedNumber, onSelect, allDone }) {
  const currentNumber = phases.find((p) => !completed.has(p.phaseNumber))?.phaseNumber;
  const count = phases.length;
  const height = nodeY(count) + 70; // trophy sits one row after the last phase

  // Smooth S-curve between consecutive points, in viewBox units (x in %, y in px).
  const segment = (i) => {
    const x1 = nodeX(i);
    const y1 = nodeY(i);
    const x2 = nodeX(i + 1);
    const y2 = nodeY(i + 1);
    const mid = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`;
  };

  return (
    <div className="relative mx-auto w-full max-w-sm" style={{ height }}>
      <svg
        aria-hidden
        className="absolute inset-0 size-full overflow-visible"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
      >
        {Array.from({ length: count }, (_, i) => {
          const done = completed.has(phases[i].phaseNumber);
          return (
            <path
              key={i}
              d={segment(i)}
              fill="none"
              stroke={done ? "#2dd4a7" : "currentColor"}
              strokeWidth={done ? 6 : 4}
              strokeDasharray={done ? undefined : "1 11"}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className={done ? "" : "text-ink/35"}
            />
          );
        })}
      </svg>

      {phases.map((phase, i) => {
        const done = completed.has(phase.phaseNumber);
        const current = phase.phaseNumber === currentNumber;
        const selected = phase.phaseNumber === selectedNumber;
        return (
          <div
            key={phase.phaseNumber}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${nodeX(i)}%`, top: nodeY(i) }}
          >
            {current && (
              <span aria-hidden className="absolute inset-0 -z-10 animate-ping rounded-full bg-grape/40 motion-reduce:animate-none" />
            )}
            <button
              type="button"
              onClick={() => onSelect(phase.phaseNumber)}
              aria-label={`Phase ${phase.phaseNumber}: ${phase.title}${done ? " (completed)" : current ? " (up next)" : ""}`}
              aria-pressed={selected}
              className={cn(
                "relative flex size-[72px] items-center justify-center rounded-full border-[3px] border-ink font-display text-2xl font-bold transition-all",
                "hover:-translate-y-1 hover:shadow-pop focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-grape",
                done && "bg-mint text-night shadow-pop-sm",
                !done && current && "bg-grape text-white shadow-pop",
                !done && !current && "bg-surface text-ink shadow-pop-sm",
                selected && "scale-110 ring-4 ring-sunny",
              )}
            >
              {done ? <Check size={30} strokeWidth={3.5} /> : phase.phaseNumber}
            </button>
            <span
              className={cn(
                "pointer-events-none absolute left-1/2 top-full mt-2 w-32 -translate-x-1/2 text-center text-xs font-bold leading-tight",
                selected ? "text-ink" : "text-ink-muted",
              )}
            >
              {phase.title}
            </span>
          </div>
        );
      })}

      {/* Finish line */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${nodeX(count)}%`, top: nodeY(count) }}>
        <div
          className={cn(
            "flex size-[72px] items-center justify-center rounded-full border-[3px] transition-all",
            allDone
              ? "animate-wiggle border-ink bg-sunny text-night shadow-pop"
              : "border-dashed border-ink/40 text-ink-faint",
          )}
          title={allDone ? "Roadmap complete!" : "Finish every phase to unlock"}
        >
          {allDone ? <Trophy size={32} /> : <Lock size={24} />}
        </div>
        <span className="pointer-events-none absolute left-1/2 top-full mt-2 w-32 -translate-x-1/2 text-center text-xs font-bold text-ink-muted">
          {allDone ? "Career ready!" : "Finish line"}
        </span>
      </div>
    </div>
  );
}
