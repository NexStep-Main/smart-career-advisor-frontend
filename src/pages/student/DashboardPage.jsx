import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  Bookmark,
  User,
  ArrowRight,
  ClipboardList,
  Route,
  Flame,
  CheckCircle2,
  Circle,
  Compass,
  Scale,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CareerCard from "@/components/career/CareerCard";
import DomainBadge from "@/components/career/DomainBadge";
import EmptyState from "@/components/common/EmptyState";
import LaborMarketWidget from "@/components/common/LaborMarketWidget";
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
  const fields = [user?.fullName, user?.email, user?.educationLevel, user?.stream, user?.quizCompleted];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

const QUICK_ACTIONS = [
  { icon: Compass, label: "Explore careers", to: "/careers" },
  { icon: Sparkles, label: "Recommendations", to: "/recommendations" },
  { icon: Scale, label: "Compare careers", to: "/compare" },
  { icon: RefreshCw, label: "Retake quiz", to: "/onboarding" },
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

  const stats = [
    {
      icon: Sparkles,
      label: "Recommended matches",
      value: !quizCompleted ? "—" : loadingRecs ? null : (recommendations?.length ?? 0),
    },
    {
      icon: Bookmark,
      label: "Saved careers",
      value: loadingBookmarks ? null : (bookmarks?.length ?? 0),
    },
    { icon: User, label: "Profile completion", value: `${completion}%` },
  ];

  return (
    <div className="flex flex-col gap-8">
      <SEOHead title="Dashboard" />

      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-50">
          Welcome back{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here's where your career journey stands today.
        </p>
      </div>

      {completion < 100 && (
        <Card className="border-primary/20 bg-primary-light/40">
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-base font-semibold text-slate-900 dark:text-slate-50">
                Finish setting up your profile
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                A complete profile gets you sharper, more relevant recommendations.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:min-w-56">
              {PROFILE_CHECKLIST.map((item) => {
                const done = !!user?.[item.field];
                return (
                  <Link
                    key={item.field}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2 text-sm",
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
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                <stat.icon size={20} className="text-primary" strokeWidth={1.8} />
              </div>
              <div>
                {stat.value === null ? (
                  <Skeleton className="h-6 w-10" />
                ) : (
                  <div className="font-heading text-xl font-bold text-slate-900 dark:text-slate-50">
                    {stat.value}
                  </div>
                )}
                <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-light">
              <action.icon size={17} className="text-primary" strokeWidth={1.8} />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      {!loadingProgress && activeRoadmap && (
        <section>
          <h2 className="mb-4 font-heading text-lg font-semibold text-slate-900 dark:text-slate-50">
            Continue where you left off
          </h2>
          <Card>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Route size={15} className="text-primary" />
                  <DomainBadge domain={activeRoadmap.career.domain} />
                </div>
                <h3 className="font-heading text-base font-semibold text-slate-900 dark:text-slate-50">
                  {activeRoadmap.career.title}
                </h3>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 w-full max-w-64 overflow-hidden rounded-full bg-primary-light">
                    <div
                      className="h-full rounded-full bg-accent-green transition-all duration-300"
                      style={{ width: `${activeRoadmapPercent}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {activeRoadmap.completedPhases.length}/{activeRoadmap.totalPhases} phases
                  </span>
                </div>
              </div>
              <Button asChild size="sm" className="shrink-0">
                <Link to={`/roadmap/${activeRoadmap.career.id}`}>
                  {activeRoadmapPercent >= 100 ? "Review roadmap" : "Resume"}
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-50">
            Recommended for you
          </h2>
          {quizCompleted && (
            <Button asChild variant="ghost" size="sm">
              <Link to="/recommendations">
                View all
                <ArrowRight size={14} />
              </Link>
            </Button>
          )}
        </div>

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
        trending?.length > 0 && (
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Flame size={18} className="text-secondary-dark" />
              <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-50">
                Trending with other students
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trending.map((career) => (
                <CareerCard key={career.id} career={career} />
              ))}
            </div>
          </section>
        )
      )}

      {!loadingBookmarks && recentBookmarks.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-50">
              Recently saved
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/bookmarks">
                View all
                <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {recentBookmarks.map((career) => (
              <Link
                key={career.id}
                to={`/careers/${career.id}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <DomainBadge domain={career.domain} />
                  <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {career.title}
                  </span>
                </div>
                {career.savedAt && (
                  <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                    Saved {timeAgo(career.savedAt)}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <LaborMarketWidget />
    </div>
  );
}
