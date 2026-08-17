import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Bookmark, User, ArrowRight, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CareerCard from "@/components/career/CareerCard";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import SEOHead from "@/components/common/SEOHead";
import useAuthStore from "@/store/useAuthStore";
import { getRecommendations } from "@/services/recommendations";
import { getBookmarks } from "@/services/bookmarks";

// Profile completion is derived from the fields that actually make
// recommendations useful — not a stored value, so it can't drift out of
// sync with the account.
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

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const quizCompleted = user?.quizCompleted;

  const { data: recommendations, isLoading: loadingRecs } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => getRecommendations().then((res) => res.data.data.recommendations),
    enabled: !!quizCompleted,
  });

  const { data: bookmarks, isLoading: loadingBookmarks } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks().then((res) => res.data.data.careers),
  });

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
    { icon: User, label: "Profile completion", value: `${profileCompletion(user)}%` },
  ];

  return (
    <div className="flex flex-col gap-8">
      <SEOHead title="Dashboard" />

      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-50">
          Welcome back{user?.fullName ? `, ${user.fullName.split("")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Here's where your career journey stands today.
        </p>
      </div>

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
    </div>
  );
}
