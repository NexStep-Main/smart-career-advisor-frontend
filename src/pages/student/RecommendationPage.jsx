import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, ClipboardList } from "lucide-react";
import CareerCard from "@/components/career/CareerCard";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import SEOHead from "@/components/common/SEOHead";
import PageHeader from "@/components/common/PageHeader";
import useAuthStore from "@/store/useAuthStore";
import { getRecommendations } from "@/services/recommendations";

export default function RecommendationPage() {
  const quizCompleted = useAuthStore((state) => state.user?.quizCompleted);

  const {
    data: recommendations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => getRecommendations().then((res) => res.data?.data?.recommendations ?? []),
    enabled: !!quizCompleted,
  });

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="Recommendations" />

      <PageHeader
        eyebrow="Matches"
        title="Recommended for You"
        subtitle="Careers matched to your quiz answers, education level, and stream."
      />

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={Sparkles}
          title="Unable to load recommendations"
          description="We had trouble retrieving your matches. Please check your connection and try again."
          action={
            <Button asChild size="sm">
              <Link to="/careers">Explore Careers</Link>
            </Button>
          }
        />
      ) : !recommendations || recommendations.length === 0 ? (
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((career) => (
            <CareerCard key={career.id || career._id} career={career} />
          ))}
        </div>
      )}
    </div>
  );
}
