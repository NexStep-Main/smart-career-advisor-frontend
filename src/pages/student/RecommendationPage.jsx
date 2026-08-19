import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, ClipboardList } from "lucide-react";
import CareerCard from "@/components/career/CareerCard";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import SEOHead from "@/components/common/SEOHead";
import useAuthStore from "@/store/useAuthStore";
import { getRecommendations } from "@/services/recommendations";

export default function RecommendationPage() {
  const quizCompleted = useAuthStore((state) => state.user?.quizCompleted);

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => getRecommendations().then((res) => res.data.data.recommendations),
    enabled: !!quizCompleted,
  });

  return (
    <div className="flex flex-col gap-8">
      <SEOHead title="Recommendations" />

      <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-linear-to-br from-white via-white to-indigo-50/80 p-6 shadow-[0_18px_45px_-32px_rgba(79,70,229,0.6)] dark:border-slate-700 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950/40">
        <div className="relative z-10">
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <Sparkles size={14} />
            Your career matches
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Recommended for <span className="text-primary">You</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Careers matched to your quiz answers, education level, and stream.
          </p>
        </div>
        <div className="absolute -right-12 -top-16 size-44 rounded-full bg-indigo-200/50 blur-3xl dark:bg-indigo-500/15" />
        <div className="absolute -bottom-20 right-24 size-32 rounded-full bg-primary/10 blur-2xl" />
      </div>

      {!quizCompleted ? (
        <EmptyState
          icon={ClipboardList}
          title="Take the quiz to unlock recommendations"
          description="Answer a few quick questions about your interests and background — we'll match you to careers that fit."
          action={
            <Button asChild size="sm">
              <Link to="/onboarding">Take the Quiz</Link>
            </Button>
          }
        />
      ) : isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-52 w-full rounded-xl" />
          ))}
        </div>
      ) : recommendations?.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No matches yet"
          description="We couldn't find strong matches for your profile. Try exploring careers directly instead."
          action={
            <Button asChild size="sm">
              <Link to="/careers">Explore Careers</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>
      )}
    </div>
  );
}
