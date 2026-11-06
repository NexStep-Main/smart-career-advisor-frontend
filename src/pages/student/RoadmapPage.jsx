import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Check, Clock, ExternalLink, PartyPopper, Search, Undo2 } from "lucide-react";
import toast from "react-hot-toast";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/ui/Button";
import Confetti from "@/components/common/Confetti";
import SEOHead from "@/components/common/SEOHead";
import PathMap from "@/components/roadmap/PathMap";
import { getRoadmapByCareer } from "@/services/roadmaps";
import { getCareerById } from "@/services/careers";
import useRequireAuth from "@/hooks/useRequireAuth";
import { getProgressByCareer, updateProgress as updateProgressRequest } from "@/services/roadmapProgress";
import { cn } from "@/lib/utils";

// Phase durations in the seed data assume roughly this many focused hours a week.
const BASELINE_HOURS = 10;
const HOURS_OPTIONS = [5, 10, 15, 20, 30];
const HOURS_KEY = "nexstep-hours-per-week";

function readHours() {
  try {
    const stored = Number(localStorage.getItem(HOURS_KEY));
    return HOURS_OPTIONS.includes(stored) ? stored : BASELINE_HOURS;
  } catch {
    return BASELINE_HOURS;
  }
}

/** 130 weeks -> "2 yrs 6 mo"; 14 weeks -> "3 months"; 2 weeks -> "2 weeks". */
function formatDuration(weeks) {
  if (weeks >= 52) {
    const years = Math.floor(weeks / 52);
    const months = Math.round((weeks - years * 52) / 4.345);
    return months > 0 ? `${years} yr${years > 1 ? "s" : ""} ${months} mo` : `${years} yr${years > 1 ? "s" : ""}`;
  }
  if (weeks >= 9) return `${Math.round(weeks / 4.345)} months`;
  return `${Math.round(weeks)} week${Math.round(weeks) === 1 ? "" : "s"}`;
}

/** "If you study N hours a week, you finish by ..." card. */
function Planner({ phases, completed }) {
  const [hours, setHours] = useState(readHours);
  const [now] = useState(() => Date.now()); // fixed at mount: render stays pure

  const remainingWeeks = phases
    .filter((p) => !completed.has(p.phaseNumber))
    .reduce((sum, p) => sum + (p.durationWeeks ?? 0), 0);
  const scaledWeeks = (remainingWeeks * BASELINE_HOURS) / hours;
  const finish = new Date(now + scaledWeeks * 7 * 86_400_000);

  const choose = (h) => {
    setHours(h);
    try {
      localStorage.setItem(HOURS_KEY, String(h));
    } catch {
      // Storage blocked: the choice just will not persist.
    }
  };

  return (
    <div className="rounded-3xl border-2 border-ink bg-surface p-5 shadow-pop">
      <div className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
        <CalendarDays size={20} className="text-grape dark:text-primary" />
        Plan your pace
      </div>
      <p className="mt-1 text-sm text-ink-muted">How many hours a week can you give this?</p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Hours per week">
        {HOURS_OPTIONS.map((h) => (
          <button
            key={h}
            type="button"
            aria-pressed={hours === h}
            onClick={() => choose(h)}
            className={cn(
              "rounded-full border-2 border-ink px-3.5 py-1.5 text-sm font-bold transition-all",
              hours === h ? "bg-grape text-white shadow-pop-sm" : "bg-surface text-ink hover:bg-sunny/30",
            )}
          >
            {h} hrs
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-sunny/25 px-4 py-3 text-sm font-semibold text-ink">
        About <span className="font-bold">{formatDuration(scaledWeeks)}</span> to go. You could finish around{" "}
        <span className="font-bold">
          {finish.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </span>
        .
      </div>
      <p className="mt-2 text-xs text-ink-faint">
        An estimate based on about {BASELINE_HOURS} hours a week per phase duration. Real timelines vary (degrees and exams
        have fixed dates).
      </p>
    </div>
  );
}

function PhaseDetail({ phase, total, completed, onToggle, celebrateKey }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-ink bg-surface p-6 shadow-pop">
      {celebrateKey > 0 && completed && <Confetti key={celebrateKey} />}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border-2 border-ink bg-grape px-3 py-0.5 text-xs font-bold text-white">
          Phase {phase.phaseNumber} of {total}
        </span>
        {phase.durationWeeks && (
          <span className="flex items-center gap-1.5 rounded-full border-2 border-ink/30 px-3 py-0.5 text-xs font-bold text-ink-muted">
            <Clock size={12} />
            {formatDuration(phase.durationWeeks)}
          </span>
        )}
        {completed && (
          <span className="flex items-center gap-1 rounded-full border-2 border-ink bg-mint px-3 py-0.5 text-xs font-bold text-night">
            <Check size={12} strokeWidth={3} />
            Done
          </span>
        )}
      </div>

      <h2 className="mt-3 font-display text-2xl font-bold text-ink">{phase.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">{phase.description}</p>

      {phase.skills?.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-faint">You will learn</h3>
          <div className="flex flex-wrap gap-2">
            {phase.skills.map((skill) => (
              <span key={skill} className="rounded-full border-2 border-ink bg-sky px-3 py-1 text-xs font-bold text-night">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {phase.resources?.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-faint">Start here</h3>
          <div className="flex flex-col gap-2">
            {phase.resources.map((res) => (
              <a
                key={res.url}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-paper px-4 py-2.5 text-sm font-bold text-ink shadow-pop-sm transition-all hover:-translate-y-0.5 hover:bg-sunny/30 hover:shadow-pop"
              >
                <span className="min-w-0">
                  <span className="block truncate">{res.name}</span>
                  <span className="text-xs font-semibold capitalize text-ink-muted">{res.type}</span>
                </span>
                <ExternalLink size={15} className="shrink-0 text-ink-muted" />
              </a>
            ))}
          </div>
        </div>
      )}

      <Button
        variant={completed ? "inkOutline" : "ink"}
        size="lg"
        className="mt-6 w-full"
        onClick={onToggle}
      >
        {completed ? (
          <>
            <Undo2 size={16} />
            Mark as not done
          </>
        ) : (
          <>
            <Check size={18} strokeWidth={3} />
            I finished this phase
          </>
        )}
      </Button>
    </div>
  );
}

export default function RoadmapPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, requireAuth } = useRequireAuth();

  const [selected, setSelected] = useState(null);
  const [celebrateKey, setCelebrateKey] = useState(0);

  const { data: career } = useQuery({
    queryKey: ["career", id],
    queryFn: () => getCareerById(id).then((res) => res.data.data.career),
  });

  const {
    data: roadmap,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["roadmap", id],
    queryFn: () => getRoadmapByCareer(id).then((res) => res.data.data.roadmap),
    retry: false,
  });

  // Progress is per-account; guests see the roadmap read-only.
  const { data: completedList = [] } = useQuery({
    queryKey: ["roadmapProgress", id],
    queryFn: () => getProgressByCareer(id).then((res) => res.data.data.completedPhases),
    enabled: !!roadmap && isAuthenticated,
  });

  const { mutate: saveProgress } = useMutation({
    mutationFn: (nextCompleted) => updateProgressRequest(id, nextCompleted),
    onMutate: async (nextCompleted) => {
      await queryClient.cancelQueries({ queryKey: ["roadmapProgress", id] });
      queryClient.setQueryData(["roadmapProgress", id], nextCompleted);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmapProgress", id] });
      queryClient.invalidateQueries({ queryKey: ["roadmapProgress"] });
    },
  });

  const completed = useMemo(() => new Set(completedList), [completedList]);
  const phases = roadmap?.phases ?? [];
  const total = phases.length;
  const allDone = total > 0 && phases.every((p) => completed.has(p.phaseNumber));
  const percent = total ? Math.round((completed.size / total) * 100) : 0;

  const currentNumber = phases.find((p) => !completed.has(p.phaseNumber))?.phaseNumber ?? phases[0]?.phaseNumber;
  const selectedNumber = selected ?? currentNumber;
  const selectedPhase = phases.find((p) => p.phaseNumber === selectedNumber);

  const togglePhase = (phaseNumber) => {
    const wasDone = completed.has(phaseNumber);
    const next = wasDone ? completedList.filter((n) => n !== phaseNumber) : [...completedList, phaseNumber];
    saveProgress(next);

    if (wasDone) return;
    setCelebrateKey((k) => k + 1);
    const nowAllDone = phases.every((p) => next.includes(p.phaseNumber));
    if (nowAllDone) {
      toast.success("Roadmap complete! You are career ready.", { icon: "🏆", duration: 5000 });
    } else {
      toast.success("Phase complete! Nice work.", { icon: "🎉" });
      // Move on to the next phase that is not done yet.
      const upcoming = phases.find((p) => !next.includes(p.phaseNumber));
      if (upcoming) setSelected(upcoming.phaseNumber);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title={roadmap ? roadmap.title : "Roadmap"} />

      <button
        onClick={() => navigate(-1)}
        className="flex w-fit items-center gap-1.5 rounded-full px-2 py-1 text-sm font-bold text-ink-muted hover:bg-sunny/30 hover:text-ink"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : isError || !roadmap ? (
        <EmptyState
          icon={Search}
          title="No roadmap available"
          description={
            career ? `There is no published roadmap for ${career.title} yet.` : "This roadmap does not exist or was removed."
          }
          action={
            <Button asChild variant="ink" size="md">
              <Link to="/careers">Back to Explorer</Link>
            </Button>
          }
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <span className="inline-block -rotate-2 rounded-full border-2 border-ink bg-mint px-3 py-0.5 text-xs font-bold text-night shadow-pop-sm">
                {career?.title ?? "Career"} roadmap
              </span>
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{roadmap.title}</h1>
              <p className="mt-1 text-sm text-ink-muted">
                {total} phase{total === 1 ? "" : "s"} to get you there. Tap a node to see what to do.
              </p>
            </div>
            <div className="flex w-full items-center gap-3 sm:w-64">
              <div className="h-4 flex-1 overflow-hidden rounded-full border-2 border-ink bg-paper">
                <div className="h-full rounded-full bg-mint transition-all duration-500" style={{ width: `${percent}%` }} />
              </div>
              <span className="shrink-0 font-display text-xl font-bold text-ink">{percent}%</span>
            </div>
          </div>

          {!isAuthenticated && (
            <p className="rounded-2xl border-2 border-dashed border-ink/40 px-4 py-3 text-sm font-semibold text-ink-muted">
              You are browsing as a guest.{" "}
              <Link to="/login" state={{ from: { pathname: `/roadmap/${id}` } }} className="font-bold text-grape underline dark:text-primary">
                Log in
              </Link>{" "}
              to tick off phases and track your progress.
            </p>
          )}

          <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
            {/* Path map */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-ink bg-paper bg-dots px-4 py-6">
              {allDone && <Confetti key={`done-${celebrateKey}`} count={60} />}
              <PathMap
                phases={phases}
                completed={completed}
                selectedNumber={selectedNumber}
                onSelect={setSelected}
                allDone={allDone}
              />
            </div>

            {/* Details + planner */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-0">
              {allDone && (
                <div className="flex items-center gap-4 rounded-3xl border-2 border-ink bg-sunny p-5 text-night shadow-pop">
                  <PartyPopper size={36} className="shrink-0" />
                  <div>
                    <div className="font-display text-xl font-bold">You finished this roadmap!</div>
                    <Link to="/careers" className="text-sm font-bold underline">
                      Explore another career
                    </Link>
                  </div>
                </div>
              )}
              {selectedPhase && (
                <PhaseDetail
                  key={selectedPhase.phaseNumber}
                  phase={selectedPhase}
                  total={total}
                  completed={completed.has(selectedPhase.phaseNumber)}
                  celebrateKey={celebrateKey}
                  onToggle={() =>
                    requireAuth(() => togglePhase(selectedPhase.phaseNumber), "Log in to track your progress. It is free!")
                  }
                />
              )}
              {!allDone && <Planner phases={phases} completed={completed} />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
