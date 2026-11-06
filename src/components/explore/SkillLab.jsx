import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, FlaskConical, Sparkles, X } from "lucide-react";
import { DOMAIN_META } from "@/lib/landingDomains";
import { VIBES, getVibes } from "@/lib/vibes";
import { cn } from "@/lib/utils";

const INITIAL_SKILLS = 24;

/** Case-insensitive key so "Python" and "python" are one chip. */
const norm = (s) => s.trim().toLowerCase();

function Chip({ active, onClick, children, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border-2 border-ink px-3.5 py-1.5 text-sm font-bold transition-all",
        active
          ? "bg-grape text-white shadow-pop-sm"
          : "bg-surface text-ink hover:-translate-y-0.5 hover:bg-sunny/30",
        className,
      )}
    >
      {children}
    </button>
  );
}

export default function SkillLab({ careers }) {
  const [skills, setSkills] = useState(() => new Set());
  const [vibes, setVibes] = useState(() => new Set());
  const [showAll, setShowAll] = useState(false);

  // Every distinct skill across the catalogue, most common first, so the chips
  // you see are the ones that unlock the most careers.
  const skillList = useMemo(() => {
    const count = new Map();
    const label = new Map();
    careers.forEach((c) =>
      c.skills?.forEach((s) => {
        const k = norm(s);
        count.set(k, (count.get(k) ?? 0) + 1);
        if (!label.has(k)) label.set(k, s.trim());
      }),
    );
    return [...count.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([k]) => ({ key: k, label: label.get(k) }));
  }, [careers]);

  const toggle = (setter) => (key) =>
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const results = useMemo(() => {
    if (skills.size === 0 && vibes.size === 0) return [];
    return careers
      .map((career) => {
        const careerSkills = (career.skills ?? []).map(norm);
        const careerVibes = getVibes(career);
        const matched = (career.skills ?? []).filter((s) => skills.has(norm(s)));
        const missing = (career.skills ?? []).filter((s) => !skills.has(norm(s)));
        const matchedVibes = careerVibes.filter((v) => vibes.has(v));

        // Only the dimensions the student actually engaged with count, so
        // picking skills alone isn't dragged down by a career's vibes.
        const parts = [];
        if (skills.size > 0 && careerSkills.length > 0) parts.push(matched.length / careerSkills.length);
        if (vibes.size > 0) parts.push(matchedVibes.length / careerVibes.length);
        const percent = parts.length ? Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100) : 0;

        return { career, matched, missing, percent };
      })
      .filter((r) => r.percent > 0)
      .sort((a, b) => b.percent - a.percent);
  }, [careers, skills, vibes]);

  const visibleSkills = showAll ? skillList : skillList.slice(0, INITIAL_SKILLS);
  const hasSelection = skills.size > 0 || vibes.size > 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      {/* ── Picker ── */}
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border-2 border-ink bg-surface p-5 shadow-pop sm:p-6">
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <FlaskConical size={20} className="text-grape dark:text-primary" />
            What are you into?
          </div>
          <p className="mt-1 text-sm text-ink-muted">Tap anything that sounds like you. Careers light up on the right.</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {Object.entries(VIBES).map(([key, v]) => (
              <button
                key={key}
                type="button"
                onClick={() => toggle(setVibes)(key)}
                aria-pressed={vibes.has(key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border-2 border-ink px-3.5 py-1.5 text-sm font-bold transition-all",
                  vibes.has(key) ? `${v.bg} shadow-pop-sm` : "bg-surface text-ink hover:-translate-y-0.5 hover:bg-sunny/30",
                )}
              >
                <v.icon size={15} />
                {v.label}
              </button>
            ))}
          </div>

          <div className="mt-5 border-t-2 border-dashed border-rule pt-5">
            <div className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-muted">Skills</div>
            <div className="flex flex-wrap gap-2">
              {visibleSkills.map((s) => (
                <Chip key={s.key} active={skills.has(s.key)} onClick={() => toggle(setSkills)(s.key)}>
                  {s.label}
                </Chip>
              ))}
            </div>
            {skillList.length > INITIAL_SKILLS && (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="mt-4 text-sm font-bold text-grape underline underline-offset-4 dark:text-primary"
              >
                {showAll ? "Show fewer" : `Show all ${skillList.length} skills`}
              </button>
            )}
          </div>

          {hasSelection && (
            <button
              type="button"
              onClick={() => {
                setSkills(new Set());
                setVibes(new Set());
              }}
              className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-bubblegum"
            >
              <X size={14} />
              Clear everything
            </button>
          )}
        </div>
      </div>

      {/* ── Live results ── */}
      <div>
        {!hasSelection ? (
          <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-ink/40 p-8 text-center">
            <Sparkles size={36} className="animate-wiggle text-sunny" />
            <p className="mt-3 font-display text-xl font-semibold text-ink">Your matches will appear here</p>
            <p className="mt-1 max-w-xs text-sm text-ink-muted">
              Pick a vibe or a few skills and watch careers rank themselves.
            </p>
          </div>
        ) : results.length === 0 ? (
          <p className="rounded-3xl border-2 border-ink bg-surface p-6 text-center text-sm font-semibold text-ink-muted shadow-pop-sm">
            No careers match that combination yet. Try removing a filter.
          </p>
        ) : (
          <>
            <p className="mb-3 text-sm font-semibold text-ink-muted">
              {results.length} career{results.length === 1 ? "" : "s"} match
            </p>
            <ul className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {results.slice(0, 12).map(({ career, matched, missing, percent }) => {
                  const meta = DOMAIN_META[career.domain];
                  return (
                    <motion.li
                      key={career.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    >
                      <Link
                        to={`/careers/${career.id}`}
                        className="group block rounded-2xl border-2 border-ink bg-surface p-4 shadow-pop-sm transition-all hover:-translate-y-0.5 hover:shadow-pop"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate font-display text-lg font-semibold text-ink">{career.title}</div>
                            <span className={`mt-1 inline-block rounded-full border-2 border-ink px-2 py-0.5 text-xs font-bold ${meta?.bg ?? ""}`}>
                              {career.domain}
                            </span>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="font-display text-2xl font-bold text-ink">{percent}%</div>
                            <div className="text-xs font-semibold text-ink-muted">match</div>
                          </div>
                        </div>

                        <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-ink bg-paper">
                          <motion.div
                            className="h-full rounded-full bg-mint"
                            initial={false}
                            animate={{ width: `${percent}%` }}
                            transition={{ type: "spring", stiffness: 120, damping: 20 }}
                          />
                        </div>

                        {(matched.length > 0 || missing.length > 0) && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {matched.map((s) => (
                              <span key={s} className="rounded-full bg-mint px-2 py-0.5 text-xs font-bold text-night">
                                ✓ {s}
                              </span>
                            ))}
                            {missing.slice(0, 3).map((s) => (
                              <span key={s} className="rounded-full border border-ink/30 px-2 py-0.5 text-xs font-semibold text-ink-muted">
                                learn: {s}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="mt-3 flex items-center gap-1 text-xs font-bold text-grape dark:text-primary">
                          See the roadmap
                          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
