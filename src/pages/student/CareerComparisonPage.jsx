import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Plus, Scale, Search, Swords, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Confetti from "@/components/common/Confetti";
import DomainBadge from "@/components/career/DomainBadge";
import EmptyState from "@/components/common/EmptyState";
import SEOHead from "@/components/common/SEOHead";
import PageHeader from "@/components/common/PageHeader";
import RadarChart from "@/components/compare/RadarChart";
import useAllCareers from "@/hooks/useAllCareers";
import useCareerStore from "@/store/useCareerStore";
import { AXES, SERIES_COLORS, axisWinners, makeScorer } from "@/lib/compareMetrics";
import { cn } from "@/lib/utils";

const MAX = 3;
const EDUCATION_LABELS = { class10: "Class 10", class12: "Class 12", graduation: "Graduation" };

const MATCHUPS = [
  { label: "Data Analyst vs AI / ML Engineer", titles: ["Data Analyst", "AI / ML Engineer"] },
  { label: "Doctor vs Pharmacist vs Physio", titles: ["Doctor (MBBS)", "Pharmacist", "Physiotherapist"] },
  { label: "UX vs Graphic Designer", titles: ["UX Designer", "Graphic Designer"] },
];

/** Searchable "add a career" panel. */
function CareerPicker({ all, chosenIds, onAdd }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const options = useMemo(() => {
    const term = q.trim().toLowerCase();
    return all
      .filter((c) => !chosenIds.includes(c.id))
      .filter((c) => !term || c.title.toLowerCase().includes(term) || c.domain.toLowerCase().includes(term))
      .slice(0, 8);
  }, [all, chosenIds, q]);

  if (chosenIds.length >= MAX) return <p className="text-sm font-semibold text-ink-muted">That is the maximum of {MAX} careers.</p>;

  return (
    <div className="relative">
      <Button type="button" variant="inkOutline" size="md" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <Plus size={16} />
        Add a career
      </Button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-80 max-w-[85vw] rounded-3xl border-2 border-ink bg-surface p-3 shadow-pop-lg">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search careers…"
              aria-label="Search careers to compare"
              className="h-10 w-full rounded-full border-2 border-ink bg-paper pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-4 focus:ring-grape/25"
            />
          </div>
          <ul className="mt-2 max-h-64 overflow-y-auto">
            {options.length === 0 && <li className="px-3 py-4 text-center text-sm text-ink-muted">No careers found.</li>}
            {options.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    onAdd(c);
                    setQ("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left hover:bg-sunny/30"
                >
                  <span className="truncate text-sm font-bold text-ink">{c.title}</span>
                  <span className="shrink-0 text-xs font-semibold text-ink-faint">{c.domain}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Reveals who won after a short drumroll. Re-mount (key) to replay. */
function Verdict({ careers, wins }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 1700);
    return () => clearTimeout(t);
  }, []);

  const top = Math.max(...careers.map((c) => wins[c.id] ?? 0));
  const champs = careers.filter((c) => (wins[c.id] ?? 0) === top);
  const tie = champs.length > 1;

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-ink bg-sunny p-6 text-center text-night shadow-pop-lg">
      {shown ? (
        <>
          <Confetti key="verdict" count={50} />
          <Crown size={34} className="mx-auto" fill="currentColor" />
          <div className="mt-1 font-display text-3xl font-bold">
            {tie ? `It is a ${champs.length}-way tie!` : `${champs[0].title} wins!`}
          </div>
          <p className="mt-1 text-sm font-semibold">
            {tie
              ? `${champs.map((c) => c.title).join(" and ")} each took ${top} of ${AXES.length} rounds.`
              : `It took ${top} of ${AXES.length} rounds. Remember: the best career is the one that fits you, not just the one that wins on paper.`}
          </p>
        </>
      ) : (
        <div className="font-display text-2xl font-bold">
          Calculating
          <span className="animate-pulse">...</span>
        </div>
      )}
    </div>
  );
}

export default function CareerComparisonPage() {
  const compareList = useCareerStore((state) => state.compareList);
  const addToCompare = useCareerStore((state) => state.addToCompare);
  const removeFromCompare = useCareerStore((state) => state.removeFromCompare);
  const { data: all = [] } = useAllCareers();
  const [run, setRun] = useState(0);

  // Prefer fresh catalogue data over whatever was stored when the career was added.
  const careers = useMemo(() => compareList.map((c) => all.find((a) => a.id === c.id) ?? c), [compareList, all]);
  const scorer = useMemo(() => makeScorer(all.length ? all : careers), [all, careers]);

  const series = careers.map((c) => ({ id: c.id, name: c.title, values: AXES.map((a) => scorer(a, c)) }));
  const wins = useMemo(() => {
    const tally = {};
    if (careers.length > 1) AXES.forEach((a) => axisWinners(a, careers).forEach((id) => (tally[id] = (tally[id] ?? 0) + 1)));
    return tally;
  }, [careers]);

  const addByTitles = (titles) => {
    titles.forEach((t) => {
      const found = all.find((c) => c.title === t);
      if (found) addToCompare(found);
    });
    setRun((r) => r + 1);
  };

  const addCareer = (career) => {
    addToCompare(career);
    setRun((r) => r + 1);
  };

  return (
    <div className="flex flex-col gap-8">
      <SEOHead title="Compare Careers" />

      <PageHeader
        eyebrow="Arena"
        title="Compare Careers"
        subtitle="Pick up to 3 careers and see how they stack up on pay, demand, skills and ways in."
        action={<CareerPicker all={all} chosenIds={careers.map((c) => c.id)} onAdd={addCareer} />}
      />

      {careers.length === 0 ? (
        <EmptyState
          icon={Scale}
          title="Pick your contenders"
          description="Add 2 or 3 careers and watch them battle it out. Or try one of these matchups:"
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {MATCHUPS.map((m) => (
                <Button key={m.label} variant="sunny" size="sm" onClick={() => addByTitles(m.titles)} disabled={!all.length}>
                  {m.label}
                </Button>
              ))}
            </div>
          }
        />
      ) : (
        <>
          {/* Contenders */}
          <div className="flex flex-wrap gap-3">
            {careers.map((c, i) => (
              <div key={c.id} className="flex items-center gap-2 rounded-full border-2 border-ink bg-surface py-1.5 pl-3 pr-2 shadow-pop-sm">
                <span className="size-3 rounded-full border border-ink" style={{ background: SERIES_COLORS[i] }} />
                <Link to={`/careers/${c.id}`} className="text-sm font-bold text-ink hover:text-grape dark:hover:text-primary">
                  {c.title}
                </Link>
                <button type="button" onClick={() => removeFromCompare(c.id)} aria-label={`Remove ${c.title}`} className="rounded-full p-1 text-ink-faint hover:bg-bubblegum/30 hover:text-ink">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
            <div className="rounded-3xl border-2 border-ink bg-paper bg-dots p-4 shadow-pop">
              <RadarChart key={`radar-${run}-${careers.map((c) => c.id).join()}`} axes={AXES} series={series} />
            </div>

            <div className="flex flex-col gap-4">
              {careers.length < 2 ? (
                <p className="rounded-3xl border-2 border-dashed border-ink/40 p-6 text-center text-sm font-semibold text-ink-muted">
                  Add one more career to start the battle.
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-display text-xl font-semibold text-ink">Round by round</h2>
                    <Button variant="sunny" size="sm" onClick={() => setRun((r) => r + 1)}>
                      <Swords size={15} />
                      Fight again
                    </Button>
                  </div>

                  <div key={`rounds-${run}`} className="flex flex-col gap-3">
                    {AXES.map((axis, ai) => {
                      const winners = axisWinners(axis, careers);
                      return (
                        <motion.div
                          key={axis.key}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: ai * 0.25, duration: 0.4 }}
                          className="rounded-2xl border-2 border-ink bg-surface p-4 shadow-pop-sm"
                        >
                          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-faint">
                            Round {ai + 1}: {axis.label}
                          </div>
                          <div className="flex flex-col gap-2">
                            {careers.map((c, ci) => {
                              const score = scorer(axis, c);
                              const won = winners.includes(c.id);
                              return (
                                <div key={c.id} className="flex items-center gap-3">
                                  <span className="w-24 shrink-0 truncate text-xs font-bold text-ink sm:w-32">{c.title}</span>
                                  <span className="h-5 flex-1 overflow-hidden rounded-full border-2 border-ink bg-paper">
                                    <motion.span
                                      className="block h-full rounded-full"
                                      style={{ background: SERIES_COLORS[ci] }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${score}%` }}
                                      transition={{ delay: ai * 0.25 + 0.15, duration: 0.7, ease: "easeOut" }}
                                    />
                                  </span>
                                  <span className="flex w-24 shrink-0 items-center justify-end gap-1 text-xs font-bold capitalize text-ink">
                                    {won && <Crown size={13} className="text-sunny" fill="currentColor" />}
                                    {axis.show(c)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <Verdict key={`verdict-${run}`} careers={careers} wins={wins} />
                </>
              )}
            </div>
          </div>

          {/* Full details */}
          <section>
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">The details</h2>
            <div className="overflow-x-auto rounded-3xl border-2 border-ink bg-surface shadow-pop">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-ink">
                    <th className="w-28 px-4 py-3 sm:w-40" />
                    {careers.map((c) => (
                      <th key={c.id} className="min-w-44 px-4 py-3 font-display text-base font-semibold text-ink">
                        {c.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Domain", (c) => <DomainBadge domain={c.domain} />],
                    ["Salary range", (c) => c.salaryRange ?? "—"],
                    ["Education", (c) => c.educationLevel?.map((l) => EDUCATION_LABELS[l] ?? l).join(", ") || "—"],
                    ["Streams", (c) => c.streams?.join(", ") || "—"],
                    ["Skills", (c) => c.skills?.join(", ") || "—"],
                    ["Top colleges", (c) => c.topColleges?.join(", ") || "—"],
                  ].map(([label, render]) => (
                    <tr key={label} className="border-b border-rule last:border-0">
                      <td className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-faint">{label}</td>
                      {careers.map((c) => (
                        <td key={c.id} className={cn("px-4 py-3 align-top text-ink-muted", label === "Skills" && "text-xs")}>
                          {render(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
