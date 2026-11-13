import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flag, Trophy } from "lucide-react";
import Button from "@/components/ui/Button";
import { DOMAIN_META } from "@/lib/landingDomains";
import { formatSalary } from "@/lib/formatSalary";
import { cn } from "@/lib/utils";

const METRICS = {
  max: { label: "Top of the range", hint: "What experienced people can earn", pick: (c) => c.averageSalary.max },
  min: { label: "Starting range", hint: "What to expect early on", pick: (c) => c.averageSalary.min },
};

const TOP_N = 10;
const DOMAIN_NAMES = Object.keys(DOMAIN_META).filter((d) => d !== "Engineering");

/**
 * Salary Race — careers as racing bars, ranked by pay. Flip between the top
 * and bottom of each salary range and the bars re-sort with a spring; hit
 * "Race!" to replay the run from the start line. Estimates, not promises.
 */
export default function SalaryRace({ careers }) {
  const [metric, setMetric] = useState("max");
  const [domains, setDomains] = useState(() => new Set());
  const [showAll, setShowAll] = useState(false);
  const [run, setRun] = useState(0); // bumping this remounts the bars → replays the race

  const pick = METRICS[metric].pick;

  const ranked = useMemo(
    () =>
      careers
        .filter((c) => c.averageSalary && (domains.size === 0 || domains.has(c.domain)))
        .map((c) => ({ career: c, value: pick(c) }))
        .sort((a, b) => b.value - a.value),
    [careers, domains, pick],
  );

  const visible = showAll ? ranked : ranked.slice(0, TOP_N);
  const maxValue = visible[0]?.value || 1;
  const leader = ranked[0];

  const toggleDomain = (d) =>
    setDomains((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-surface p-5 shadow-pop sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label="Which salary to compare" className="flex gap-2">
            {Object.entries(METRICS).map(([key, m]) => (
              <button
                key={key}
                type="button"
                aria-pressed={metric === key}
                onClick={() => setMetric(key)}
                className={cn(
                  "rounded-full border-2 border-ink px-4 py-2 text-sm font-bold transition-all",
                  metric === key ? "bg-ink text-paper shadow-pop-sm" : "bg-surface text-ink hover:bg-sunny/30",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <Button variant="sunny" size="md" onClick={() => setRun((r) => r + 1)}>
            <Flag size={16} />
            Race!
          </Button>
        </div>
        <p className="-mt-1 text-xs font-semibold text-ink-muted">{METRICS[metric].hint}</p>

        <div className="flex flex-wrap gap-2">
          {DOMAIN_NAMES.map((d) => {
            const active = domains.has(d);
            return (
              <button
                key={d}
                type="button"
                aria-pressed={active}
                onClick={() => toggleDomain(d)}
                className={cn(
                  "rounded-full border-2 border-ink px-3 py-1 text-xs font-bold transition-all",
                  active ? `${DOMAIN_META[d].bg} shadow-pop-sm` : "bg-surface text-ink hover:bg-sunny/30",
                )}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {leader && (
        <p className="flex items-center gap-2 text-sm font-bold text-ink">
          <Trophy size={18} className="text-sunny" fill="currentColor" />
          Leading the race: {leader.career.title} at {formatSalary(leader.value)} / yr
        </p>
      )}

      {/* The track */}
      {visible.length === 0 ? (
        <p className="rounded-3xl border-2 border-dashed border-ink/40 p-8 text-center text-sm font-semibold text-ink-muted">
          No careers in those fields yet.
        </p>
      ) : (
        <ol key={run} className="flex flex-col gap-2.5">
          {visible.map(({ career, value }, i) => {
            const meta = DOMAIN_META[career.domain];
            const Icon = meta?.icon;
            return (
              <motion.li key={career.id} layout transition={{ type: "spring", stiffness: 260, damping: 28 }}>
                <Link
                  to={`/careers/${career.id}`}
                  className="group flex items-center gap-3 rounded-2xl p-1 transition-colors hover:bg-sunny/20"
                >
                  <span className="w-6 shrink-0 text-right font-display text-lg font-bold text-ink-muted">
                    {i + 1}
                  </span>
                  <span className="relative h-11 min-w-0 flex-1 overflow-hidden rounded-full border-2 border-ink bg-paper">
                    <motion.span
                      className={`absolute inset-y-0 left-0 flex items-center gap-2 rounded-full pl-3 pr-3 ${meta?.bg ?? "bg-grape text-white"}`}
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.max((value / maxValue) * 100, 12)}%` }}
                      transition={{ type: "spring", stiffness: 70, damping: 16, delay: run === 0 && i === 0 ? 0 : i * 0.06 }}
                    >
                      {Icon && <Icon size={18} strokeWidth={2.4} className="shrink-0" />}
                      <span className="truncate text-sm font-bold">{career.title}</span>
                    </motion.span>
                  </span>
                  <span className="w-20 shrink-0 text-right font-display text-lg font-bold text-ink">
                    {formatSalary(value)}
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ol>
      )}

      {ranked.length > TOP_N && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="self-start text-sm font-bold text-grape underline underline-offset-4 dark:text-primary"
        >
          {showAll ? `Show top ${TOP_N} only` : `Show all ${ranked.length} careers`}
        </button>
      )}

      <p className="text-xs text-ink-faint">
        Annual figures in rupees (L = lakh, Cr = crore). These are rough estimates to compare careers, not
        guarantees. Real pay depends on city, company and experience.
      </p>
    </div>
  );
}
