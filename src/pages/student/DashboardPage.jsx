import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ClipboardList,
  CheckCircle2,
  Circle,
  Compass,
  FlaskConical,
  Flame,
  Layers,
  Scale,
} from "lucide-react";
import Button from "@/components/ui/Button";
import CareerCard from "@/components/career/CareerCard";
import DomainBadge from "@/components/career/DomainBadge";
import EmptyState from "@/components/common/EmptyState";
import LaborMarketWidget from "@/components/common/LaborMarketWidget";
import SectionHeader from "@/components/common/SectionHeader";
import BadgeShelf from "@/components/progress/BadgeShelf";
import Skeleton from "@/components/ui/Skeleton";
import SEOHead from "@/components/common/SEOHead";
import useAuthStore from "@/store/useAuthStore";
import { useProgress } from "@/hooks/useProgress";
import { getRecommendations } from "@/services/recommendations";
import { getBookmarks } from "@/services/bookmarks";
import { getTrendingCareers } from "@/services/careers";
import { getAllProgress } from "@/services/roadmapProgress";
import { cn, timeAgo } from "@/lib/utils";

// Profile completion is derived from the fields that actually make
// recommendations useful: not a stored value, so it cannot drift out of
// sync with the account.
const PROFILE_CHECKLIST = [
  { field: "educationLevel", label: "Set your education level", to: "/profile" },
  { field: "stream", label: "Set your stream", to: "/profile" },
  { field: "quizCompleted", label: "Take the career quiz", to: "/onboarding" },
];

function profileCompletion(user) {
  const fields = [user?.fullName, user?.email, user?.educationLevel, user?.stream, user?.quizCompleted];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

const QUICK_ACTIONS = [
  { label: "Explore careers", hint: "Browse everything", to: "/careers", icon: Compass, bg: "bg-sky" },
  { label: "Swipe careers", hint: "Like or skip", to: "/careers?view=swipe", icon: Layers, bg: "bg-bubblegum" },
  { label: "Skill Lab", hint: "Match by skills", to: "/careers?view=skills", icon: FlaskConical, bg: "bg-mint" },
  { label: "Compare", hint: "Side by side", to: "/compare", icon: Scale, bg: "bg-sunny" },
];

/** What the student should do next, in priority order. */
function pickNextStep({ quizCompleted, activeRoadmap, activePercent, bookmarks }) {
  if (!quizCompleted) {
    return {
      title: "Take the 5-minute career quiz",
      desc: "Answer a few questions and we will match you to careers that fit.",
      to: "/onboarding",
      cta: "Start the quiz",
    };
  }
  if (activeRoadmap && activePercent < 100) {
    const done = activeRoadmap.completedPhases.length;
    return {
      title: `Resume: ${activeRoadmap.career.title}`,
      desc: `Phase ${done + 1} of ${activeRoadmap.totalPhases} is waiting for you.`,
      to: `/roadmap/${activeRoadmap.career.id}`,
      cta: "Resume roadmap",
    };
  }
  if (!bookmarks || bookmarks.length === 0) {
    return {
      title: "Find careers you like",
      desc: "Swipe through careers and save the ones that catch your eye.",
      to: "/careers?view=swipe",
      cta: "Start swiping",
    };
  }
  const pick = bookmarks[0];
  return {
    title: `Start a roadmap for ${pick.title}`,
    desc: "See exactly what to learn, in order, and track your progress.",
    to: `/roadmap/${pick.id}`,
    cta: "See the roadmap",
  };
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const quizCompleted = user?.quizCompleted;
  const completion = profileCompletion(user);
  const firstName = user?.fullName?.split(" ")[0];

  const { data: progress } = useProgress();

  const { data: recommendations, isLoading: loadingRecs } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => getRecommendations().then((res) => res.data.data.recommendations),
    enabled: !!quizCompleted,
  });

  const { data: bookmarks, isLoading: loadingBookmarks } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks().then((res) => res.data.data.careers),
  });

  const { data: trending, isLoading: loadingTrending } = useQuery({
    queryKey: ["trendingCareers"],
    queryFn: () => getTrendingCareers(3).then((res) => res.data.data.careers),
  });

  const { data: roadmapProgress, isLoading: loadingProgress } = useQuery({
    queryKey: ["roadmapProgress"],
    queryFn: () => getAllProgress().then((res) => res.data.data.progress),
  });

  const activeRoadmap = roadmapProgress?.[0];
  const activeRoadmapPercent = activeRoadmap
    ? Math.round((activeRoadmap.completedPhases.length / activeRoadmap.totalPhases) * 100)
    : 0;
  const recentBookmarks = bookmarks?.slice(0, 3) ?? [];

  const nextStep = pickNextStep({
    quizCompleted,
    activeRoadmap,
    activePercent: activeRoadmapPercent,
    bookmarks,
  });
  const streak = progress?.streak ?? 0;

  const stats = [
    {
      label: "Matches",
      value: !quizCompleted ? "—" : loadingRecs ? null : (recommendations?.length ?? 0),
      bg: "bg-mint",
    },
    { label: "Saved careers", value: loadingBookmarks ? null : (bookmarks?.length ?? 0), bg: "bg-sunny" },
    { label: "Profile complete", value: `${completion}%`, bg: "bg-bubblegum" },
  ];

  return (
    <div className="flex flex-col gap-10">
      <SEOHead title="Dashboard" />

      {/* Greeting + the one thing to do next */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-ink bg-grape p-6 text-white shadow-pop-lg sm:p-8">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-10 -top-10 size-48 rounded-full bg-bubblegum/60 blur-2xl" />
          <div className="absolute -bottom-14 left-1/3 size-44 rounded-full bg-sunny/40 blur-2xl" />
        </div>
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            {streak > 0 && (
              <span className="mb-3 inline-flex -rotate-2 items-center gap-1.5 rounded-full border-2 border-night bg-tangerine px-3 py-1 text-xs font-bold text-night">
                <Flame size={14} fill="currentColor" />
                {streak}-day streak
              </span>
            )}
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              Hey{firstName ? ` ${firstName}` : ""}!
            </h1>
            <p className="mt-2 max-w-md text-sm text-white/85 sm:text-base">
              {streak > 1 ? "Nice, you are on a roll. Keep it going." : "Here is where your career journey stands today."}
            </p>
          </div>

          <div className="rounded-3xl border-2 border-ink bg-surface p-5 text-ink shadow-pop">
            <span className="text-xs font-bold uppercase tracking-wider text-grape dark:text-primary">Your next step</span>
            <h2 className="mt-1 font-display text-xl font-semibold leading-snug">{nextStep.title}</h2>
            <p className="mt-1 text-sm text-ink-muted">{nextStep.desc}</p>
            <Button asChild variant="sunny" size="md" className="mt-4">
              <Link to={nextStep.to}>
                {nextStep.cta}
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stat tiles */}
      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className={cn("rounded-3xl border-2 border-ink p-5 text-night shadow-pop", stat.bg)}>
            {stat.value === null ? (
              <Skeleton className="h-10 w-16" />
            ) : (
              <div className="font-display text-5xl font-bold leading-none">{stat.value}</div>
            )}
            <div className="mt-2 text-sm font-bold">{stat.label}</div>
          </div>
        ))}
      </section>

      {completion < 100 && (
        <section className="rounded-3xl border-2 border-ink bg-surface p-6 shadow-pop">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h2 className="font-display text-xl font-semibold text-ink">Finish setting up your profile</h2>
              <p className="mt-1.5 text-sm text-ink-muted">A complete profile gets you sharper recommendations.</p>
              <div className="mt-4 h-4 max-w-xs overflow-hidden rounded-full border-2 border-ink bg-paper">
                <div className="h-full rounded-full bg-mint transition-all duration-500" style={{ width: `${completion}%` }} />
              </div>
            </div>
            <div className="flex flex-col gap-2.5 sm:min-w-60">
              {PROFILE_CHECKLIST.map((item) => {
                const done = !!user?.[item.field];
                return (
                  <Link
                    key={item.field}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2.5 text-sm",
                      done ? "text-ink-faint line-through" : "font-bold text-ink hover:text-grape dark:hover:text-primary",
                    )}
                  >
                    {done ? (
                      <CheckCircle2 size={18} className="shrink-0 text-mint" />
                    ) : (
                      <Circle size={18} className="shrink-0 text-ink-faint" />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Quick actions */}
      <section>
        <SectionHeader title="Jump in" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {QUICK_ACTIONS.map(({ label, hint, to, icon: Icon, bg }) => (
            <Link
              key={label}
              to={to}
              className="group flex flex-col gap-3 rounded-3xl border-2 border-ink bg-surface p-4 shadow-pop-sm transition-all hover:-translate-y-1 hover:shadow-pop"
            >
              <span className={cn("flex size-11 items-center justify-center rounded-2xl border-2 border-ink text-night transition-transform group-hover:rotate-6", bg)}>
                <Icon size={20} strokeWidth={2.3} />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold leading-tight text-ink">{label}</span>
                <span className="block text-xs text-ink-muted">{hint}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {!loadingProgress && activeRoadmap && (
        <section>
          <SectionHeader title="Continue where you left off" />
          <div className="rounded-3xl border-2 border-ink bg-surface p-5 shadow-pop sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0 flex-1">
                <DomainBadge domain={activeRoadmap.career.domain} />
                <h3 className="mt-2.5 font-display text-2xl font-semibold text-ink">{activeRoadmap.career.title}</h3>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-4 w-full max-w-sm overflow-hidden rounded-full border-2 border-ink bg-paper">
                    <div className="h-full rounded-full bg-mint transition-all duration-500" style={{ width: `${activeRoadmapPercent}%` }} />
                  </div>
                  <span className="shrink-0 text-sm font-bold text-ink-muted">
                    {activeRoadmap.completedPhases.length}/{activeRoadmap.totalPhases} phases
                  </span>
                </div>
              </div>
              <Button asChild variant="ink" size="md" className="shrink-0">
                <Link to={`/roadmap/${activeRoadmap.career.id}`}>
                  {activeRoadmapPercent >= 100 ? "Review roadmap" : "Resume"}
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Badges */}
      <section>
        <SectionHeader title="Your badges" />
        <BadgeShelf />
      </section>

      <section>
        <SectionHeader
          title="Recommended for you"
          action={
            quizCompleted && (
              <Button asChild variant="ghost" size="sm">
                <Link to="/recommendations">
                  View all
                  <ArrowRight size={14} />
                </Link>
              </Button>
            )
          }
        />

        {!quizCompleted ? (
          <EmptyState
            icon={ClipboardList}
            title="Take the quiz to get matched"
            description="Answer a few quick questions and we will recommend careers that fit your interests and background."
            action={
              <Button asChild variant="ink" size="md">
                <Link to="/onboarding">Take the quiz</Link>
              </Button>
            }
          />
        ) : loadingRecs ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : recommendations?.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.slice(0, 3).map((career) => (
              <CareerCard key={career.id} career={career} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No recommendations yet"
            description="We could not find strong matches for your profile yet. Try exploring careers directly."
            action={
              <Button asChild variant="ink" size="md">
                <Link to="/careers">Explore careers</Link>
              </Button>
            }
          />
        )}
      </section>

      {!loadingTrending && trending?.length > 0 && (
        <section>
          <SectionHeader title="Trending with other students" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((career) => (
              <CareerCard key={career.id} career={career} />
            ))}
          </div>
        </section>
      )}

      {!loadingBookmarks && recentBookmarks.length > 0 && (
        <section>
          <SectionHeader
            title="Recently saved"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link to="/bookmarks">
                  View all
                  <ArrowRight size={14} />
                </Link>
              </Button>
            }
          />
          <div className="flex flex-col gap-3">
            {recentBookmarks.map((career) => (
              <Link
                key={career.id}
                to={`/careers/${career.id}`}
                className="group flex items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-surface p-4 shadow-pop-sm transition-all hover:-translate-y-0.5 hover:shadow-pop"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <DomainBadge domain={career.domain} />
                  <span className="truncate font-bold text-ink">{career.title}</span>
                </div>
                {career.savedAt && <span className="shrink-0 text-xs font-semibold text-ink-faint">{timeAgo(career.savedAt)}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}

      <LaborMarketWidget />
    </div>
  );
}
