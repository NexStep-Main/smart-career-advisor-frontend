import { motion } from "framer-motion";
import { SERIES_COLORS } from "@/lib/compareMetrics";

const SIZE = 340;
const C = SIZE / 2;
const R = 105;
const LEVELS = [0.25, 0.5, 0.75, 1];


const angle = (i, n) => ((-90 + (360 / n) * i) * Math.PI) / 180;
const pt = (i, n, radius) => [C + radius * Math.cos(angle(i, n)), C + radius * Math.sin(angle(i, n))];
const poly = (values, n) => values.map((v, i) => pt(i, n, (R * v) / 100).join(",")).join(" ");

/**
 * Radar chart: one polygon per career over the comparison axes.
 * `series`: [{ id, name, values: [0..100 per axis] }]. Re-mount with a new
 * `key` to replay the grow-in animation.
 */
export default function RadarChart({ axes, series }) {
  const n = axes.length;

  return (
    <svg viewBox={`-45 0 ${SIZE + 90} ${SIZE}`} className="mx-auto block w-full max-w-md" role="img" aria-label={`Radar chart comparing ${series.map((s) => s.name).join(", ")}`}>
      {LEVELS.map((lv) => (
        <polygon
          key={lv}
          points={Array.from({ length: n }, (_, i) => pt(i, n, R * lv).join(",")).join(" ")}
          fill={lv === 1 ? "var(--nx-surface)" : "none"}
          stroke="var(--nx-ink)"
          strokeOpacity={lv === 1 ? 0.5 : 0.15}
          strokeWidth="1.5"
        />
      ))}
      {axes.map((a, i) => {
        const [x, y] = pt(i, n, R);
        const [lx, ly] = pt(i, n, R + 26);
        return (
          <g key={a.key}>
            <line x1={C} y1={C} x2={x} y2={y} stroke="var(--nx-ink)" strokeOpacity="0.15" />
            <text
              x={lx}
              y={ly}
              textAnchor={Math.abs(lx - C) < 8 ? "middle" : lx > C ? "start" : "end"}
              dominantBaseline="middle"
              fontSize="12.5"
              fontWeight="700"
              fill="var(--nx-ink)"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {a.label}
            </text>
          </g>
        );
      })}

      {series.map((s, si) => (
        <motion.g
          key={s.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 14, delay: si * 0.18 }}
          style={{ transformOrigin: `${C}px ${C}px` }}
        >
          <polygon
            points={poly(s.values, n)}
            fill={SERIES_COLORS[si % SERIES_COLORS.length]}
            fillOpacity="0.28"
            stroke={SERIES_COLORS[si % SERIES_COLORS.length]}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {s.values.map((v, i) => {
            const [x, y] = pt(i, n, (R * v) / 100);
            return <circle key={i} cx={x} cy={y} r="4.5" fill={SERIES_COLORS[si % SERIES_COLORS.length]} stroke="#fff6e5" strokeWidth="1.5" />;
          })}
        </motion.g>
      ))}
    </svg>
  );
}
