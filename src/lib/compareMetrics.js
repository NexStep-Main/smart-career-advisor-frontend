import { formatSalary } from "@/lib/formatSalary";

// Series colours as hex: SVG fills and CSS backgrounds for the chart and bars
// (Tailwind classes cannot be used inside SVG attributes).
export const SERIES_COLORS = ["#7c3aed", "#ff5c8a", "#2dd4a7"];

// The five "rounds" careers are compared on. Each axis turns a career into a
// 0-100 score. Pay and skills use a percentile rank within the whole catalogue
// (robust to outliers: one ₹1 crore founder must not flatten every other bar),
// demand and entry paths use fixed scales.
const DEMAND_SCORE = { high: 100, medium: 60, low: 30 };

export const AXES = [
  { key: "top", label: "Top pay", raw: (c) => c.averageSalary?.max ?? 0, show: (c) => formatSalary(c.averageSalary?.max), pct: true },
  { key: "start", label: "Starting pay", raw: (c) => c.averageSalary?.min ?? 0, show: (c) => formatSalary(c.averageSalary?.min), pct: true },
  { key: "demand", label: "Demand", raw: (c) => DEMAND_SCORE[c.demandLevel] ?? 0, show: (c) => c.demandLevel ?? "n/a" },
  { key: "skills", label: "Skills breadth", raw: (c) => c.skills?.length ?? 0, show: (c) => `${c.skills?.length ?? 0} skills`, pct: true },
  { key: "paths", label: "Ways in", raw: (c) => c.educationLevel?.length ?? 0, show: (c) => `${c.educationLevel?.length ?? 0} entry level${c.educationLevel?.length === 1 ? "" : "s"}` },
];

/** score(axis, career) -> 0..100, given the whole catalogue for percentile axes. */
export function makeScorer(catalogue) {
  const sorted = {};
  AXES.filter((a) => a.pct).forEach((a) => {
    sorted[a.key] = catalogue.map(a.raw).sort((x, y) => x - y);
  });

  return (axis, career) => {
    const v = axis.raw(career);
    if (axis.pct) {
      const list = sorted[axis.key];
      if (!list.length) return 50;
      const atOrBelow = list.filter((x) => x <= v).length;
      return Math.max(12, Math.round((atOrBelow / list.length) * 100));
    }
    if (axis.key === "paths") return Math.max(12, Math.round((v / 3) * 100));
    return v;
  };
}

/** Which careers win an axis (ties share the win). Returns ids. */
export function axisWinners(axis, careers) {
  const best = Math.max(...careers.map(axis.raw));
  return careers.filter((c) => axis.raw(c) === best).map((c) => c.id);
}
