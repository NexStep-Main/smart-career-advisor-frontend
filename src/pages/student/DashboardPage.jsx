import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ClipboardList, CheckCircle2, Circle } from "lucide-react";
import Button from "@/components/ui/Button";
import CareerCard from "@/components/career/CareerCard";
import DomainBadge from "@/components/career/DomainBadge";
import EmptyState from "@/components/common/EmptyState";
import LaborMarketWidget from "@/components/common/LaborMarketWidget";
import PageHeader from "@/components/common/PageHeader";
import SectionHeader from "@/components/common/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";
import SEOHead from "@/components/common/SEOHead";
import useAuthStore from "@/store/useAuthStore";
import { getRecommendations } from "@/services/recommendations";
import { getBookmarks } from "@/services/bookmarks";
import { getTrendingCareers } from "@/services/careers";
import { getAllProgress } from "@/services/roadmapProgress";
import { cn, timeAgo } from "@/lib/utils";

// Profile completion is derived from the fields that actually make
// recommendations useful — not a stored value, so it can't drift out of
// sync with the account.
const PROFILE_CHECKLIST = [
  { field: "educationLevel", label: "Set your education level", to: "/profile" },
  { field: "stream", label: "Set your stream", to: "/profile" },
  { field: "quizCompleted", label: "Take the career quiz", to: "/onboarding" },
];

function profileCompletion(user) {
  const fields = [
    user?.fullName,
    user?.email,
    user?.educationLevel,
    user?.stream,
    user?.quizCompleted,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

const QUICK_ACTIONS = [
  { label: "Explore careers", to: "/careers" },
  { label: "Recommendations", to: "/recommendations" },
  { label: "Compare careers", to: "/compare" },
  { label: "Retake quiz", to: "/onboarding" },
];

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const quizCompleted = user?.quizCompleted;
  const completion = profileCompletion(user);

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

  // Several sections only render when they have data, so section numbers are
  // derived from what's actually on screen — hardcoding them leaves gaps
  // (01, 03, 06…) for any student missing a roadmap or saved careers.
  const showContinue = !loadingProgress && !!activeRoadmap;
  const showTrending = !loadingTrending && trending?.length > 0;
  const showRecentlySaved = !loadingBookmarks && recentBookmarks.length > 0;

  const sectionOrder = [
    "quickActions",
    showContinue && "continue",
    "recommended",
    showTrending && "trending",
    showRecentlySaved && "saved",
    "market",
  ].filter(Boolean);
  const idx = (key) => String(sectionOrder.indexOf(key) + 1).padStart(2, "0");

  const stats = [
    {
      label: "Recommended matches",
      value: !quizCompleted ? "—" : loadingRecs ? null : (recommendations?.length ?? 0),
    },
    {
      label: "Saved careers",
      value: loadingBookmarks ? null : (bookmarks?.length ?? 0),
    },
    { label: "Profile completion", value: `${completion}%` },
  ];

  return (
    <div className="flex flex-col gap-10">
      <SEOHead title="Dashboard" />

      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back${user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}`}
        subtitle="Here's where your career journey stands today."
      />

      {completion < 100 && (
        <section className="rounded-xl border border-primary/25 bg-primary-light/40 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-display text-xl text-slate-900 dark:text-slate-50">
                Finish setting up your profile
              </h2>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                A complete profile gets you sharper, more relevant recommendations.
              </p>
            </div>
            {/* Check/circle glyphs stay: these are binary status indicators
                a student scans down, and a numeral can't carry done/not-done.
                They lost the surrounding tinted box, not the icon. */}
            <div className="flex flex-col gap-2.5 sm:min-w-60">
              {PROFILE_CHECKLIST.map((item) => {
                const done = !!user?.[item.field];
                return (
                  <Link
                    key={item.field}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2.5 text-sm",
                      done
                        ? "text-slate-400 line-through dark:text-slate-500"
                        : "font-medium text-slate-700 hover:text-primary dark:text-slate-200",
                    )}
                  >
                    {done ? (
                      <CheckCircle2 size={16} className="shrink-0 text-accent-green" />
                    ) : (
                      <Circle size={16} className="shrink-0 text-slate-300 dark:text-slate-600" />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Stat row — typographic numerals on hairline-divided cells. The
          `gap-px` over a border-coloured background is what draws the
          interior hairlines without nesting extra border elements. */}
      <section className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
        {stats.map((stat, i) => (
          <div key={stat.label} className="bg-surface p-5">
            <div className="font-mono text-xs text-slate-400 dark:text-slate-500">
              {String(i + 1).padStart(2, "0")}
            </div>
            {stat.value === null ? (
              <Skeleton className="mt-2 h-9 w-14" />
            ) : (
              <div className="mt-2 font-display text-4xl leading-none text-slate-900 dark:text-slate-50">
                {stat.value}
              </div>
            )}
            <div className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* Quick actions — ruled rows with an index, replacing the icon-tile
          grid. Scanability is unchanged (still one label per row) but the
          treatment now matches the landing page's ruled link lists. */}
      <section>
        <SectionHeader index={idx("quickActions")} title="Quick actions" />
        <div className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action, i) => (
            <Link
              key={action.label}
              to={action.to}
              className="group flex items-center gap-3 border-b border-border py-4 pr-4 transition-colors hover:bg-primary-light/40 sm:border-r sm:px-4"
            >
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                {action.label}
              </span>
              <ArrowRight
                size={14}
                className="shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary dark:text-slate-600"
              />
            </Link>
          ))}
        </div>
      </section>

      {showContinue && (
        <section>
          <SectionHeader index={idx("continue")} title="Continue where you left off" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <DomainBadge domain={activeRoadmap.career.domain} />
              <h3 className="mt-2.5 font-display text-2xl text-slate-900 dark:text-slate-50">
                {activeRoadmap.career.title}
              </h3>
              <div className="mt-4 flex items-center gap-4">
                {/* Hairline progress track — thinner than the old pill bar,
                    but emerald still carries the "how far along" signal. */}
                <div className="h-px w-full max-w-72 bg-border">
                  <div
                    className="h-px bg-accent-green transition-all duration-500"
                    style={{ width: `${activeRoadmapPercent}%` }}
                  />
                </div>
                <span className="shrink-0 font-mono text-xs text-slate-500 dark:text-slate-400">
                  {activeRoadmap.completedPhases.length}/{activeRoadmap.totalPhases} phases ·{" "}
                  <span className="text-accent-green">{activeRoadmapPercent}%</span>
                </span>
              </div>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link to={`/roadmap/${activeRoadmap.career.id}`}>
                {activeRoadmapPercent >= 100 ? "Review roadmap" : "Resume"}
                <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </section>
      )}

      <section>
        <SectionHeader
          index={idx("recommended")}
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
            description="Answer a few quick questions and we'll recommend careers that fit your interests and background."
            action={
              <Button asChild size="sm">
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
            description="We couldn't find strong matches for your profile yet. Try exploring careers directly."
            action={
              <Button asChild size="sm">
                <Link to="/careers">Explore Careers</Link>
              </Button>
            }
          />
        )}
      </section>

      {loadingTrending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : (
        showTrending && (
          <section>
            <SectionHeader index={idx("trending")} title="Trending with other students" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trending.map((career) => (
                <CareerCard key={career.id} career={career} />
              ))}
            </div>
          </section>
        )
      )}

      {showRecentlySaved && (
        <section>
          <SectionHeader
            index={idx("saved")}
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
          <div className="border-t border-border">
            {recentBookmarks.map((career) => (
              <Link
                key={career.id}
                to={`/careers/${career.id}`}
                className="group flex items-center justify-between gap-3 border-b border-border py-4 transition-colors hover:bg-primary-light/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <DomainBadge domain={career.domain} />
                  <span className="truncate text-sm font-medium text-slate-800 group-hover:text-primary dark:text-slate-100">
                    {career.title}
                  </span>
                </div>
                {career.savedAt && (
                  <span className="shrink-0 font-mono text-xs text-slate-400 dark:text-slate-500">
                    {timeAgo(career.savedAt)}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <LaborMarketWidget index={idx("market")} />
    </div>
  );
}
