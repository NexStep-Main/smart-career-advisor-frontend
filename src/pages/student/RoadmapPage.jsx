import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  ChevronDown,
  Route,
  Search,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/ui/Button";
import SEOHead from "@/components/common/SEOHead";
import { getRoadmapByCareer } from "@/services/roadmaps";
import { getCareerById } from "@/services/careers";
import { getProgressByCareer, updateProgress as updateProgressRequest } from "@/services/roadmapProgress";
import { cn } from "@/lib/utils";

function PhaseCard({ phase, index, defaultOpen, completed, onToggleComplete }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className={completed ? "border-accent-green/40" : undefined}>
      <div className="flex w-full items-center gap-4 p-5 text-left">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          aria-label={completed ? "Mark phase incomplete" : "Mark phase complete"}
          className="shrink-0 text-accent-green transition-transform hover:scale-110"
        >
          {completed ? (
            <CheckCircle2 size={22} className="fill-accent-green/15" />
          ) : (
            <Circle size={22} className="text-slate-300 dark:text-slate-600" />
          )}
        </button>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center justify-between gap-4 text-left"
        >
          <div className="flex items-center gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-light font-heading text-sm font-bold text-primary-dark">
              {index + 1}
            </span>
            <div>
              <h3
                className={cn(
                  "font-heading text-base font-semibold",
                  completed
                    ? "text-slate-500 line-through dark:text-slate-400"
                    : "text-slate-900 dark:text-slate-50",
                )}
              >
                {phase.title}
              </h3>
              {phase.durationWeeks && (
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Clock size={12} />
                  {phase.durationWeeks} week{phase.durationWeeks === 1 ? "" : "s"}
                </p>
              )}
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`shrink-0 text-slate-400 dark:text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && (
        <CardContent className="flex flex-col gap-4 border-t border-border pt-4">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {phase.description}
          </p>

          {phase.skills?.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Skills covered
              </h4>
              <div className="flex flex-wrap gap-2">
                {phase.skills.map((skill) => (
                  <Badge key={skill} variant="primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {phase.resources?.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Resources
              </h4>
              <div className="flex flex-col gap-2">
                {phase.resources.map((res) => (
                  <a
                    key={res.url}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5 text-sm hover:border-primary/40 hover:bg-primary-light/40"
                  >
                    <span className="text-slate-700 dark:text-slate-200">
                      {res.name}
                      <span className="ml-2 text-xs capitalize text-slate-400 dark:text-slate-500">
                        ({res.type})
                      </span>
                    </span>
                    <ExternalLink
                      size={14}
                      className="shrink-0 text-slate-400 dark:text-slate-500"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function RoadmapPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const { data: completedPhases = [] } = useQuery({
    queryKey: ["roadmapProgress", id],
    queryFn: () => getProgressByCareer(id).then((res) => res.data.data.completedPhases),
    enabled: !!roadmap,
  });

  const { mutate: toggleProgress } = useMutation({
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

  const togglePhase = (phaseNumber) => {
    const next = completedPhases.includes(phaseNumber)
      ? completedPhases.filter((n) => n !== phaseNumber)
      : [...completedPhases, phaseNumber];
    toggleProgress(next);
  };

  const progressPercent = roadmap?.phases.length
    ? Math.round((completedPhases.length / roadmap.phases.length) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title={roadmap ? roadmap.title : "Roadmap"} />

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : isError || !roadmap ? (
        <EmptyState
          icon={Search}
          title="No roadmap available"
          description={
            career
              ? `There's no published roadmap for ${career.title} yet.`
              : "This roadmap doesn't exist or was removed."
          }
          action={
            <Button asChild size="sm">
              <Link to="/careers">Back to Explorer</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-primary">
              <Route size={15} />
              {career?.title ?? "Career"}
            </div>
            <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-50">
              {roadmap.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {roadmap.phases.length} phase{roadmap.phases.length === 1 ? "" : "s"} to get
              job-ready.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-primary-light">
                <div
                  className="h-full rounded-full bg-accent-green transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="shrink-0 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {completedPhases.length}/{roadmap.phases.length} complete
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {roadmap.phases.map((phase, index) => (
              <PhaseCard
                key={phase.phaseNumber}
                phase={phase}
                index={index}
                defaultOpen={index === 0}
                completed={completedPhases.includes(phase.phaseNumber)}
                onToggleComplete={() => togglePhase(phase.phaseNumber)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
