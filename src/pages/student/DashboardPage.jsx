import { Link } from "react-router-dom";
import { Sparkles, Bookmark, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CareerCard from "@/components/career/CareerCard";
import EmptyState from "@/components/common/EmptyState";
import SEOHead from "@/components/common/SEOHead";
import useAuthStore from "@/store/useAuthStore";
import useCareerStore from "@/store/useCareerStore";
import { MOCK_RECOMMENDED_CAREERS } from "@/utils/mockCareers";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const savedCareers = useCareerStore((state) => state.savedCareers);

  const stats = [
    { icon: Sparkles, label: "Recommended matches", value: MOCK_RECOMMENDED_CAREERS.length },
    { icon: Bookmark, label: "Saved careers", value: savedCareers.length },
    { icon: User, label: "Profile completion", value: "60%" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <SEOHead title="Dashboard" />

      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
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
                <div className="font-heading text-xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-slate-900">Recommended for you</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/recommendations">
              View all
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>

        {MOCK_RECOMMENDED_CAREERS.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_RECOMMENDED_CAREERS.map((career) => (
              <CareerCard key={career.id} career={career} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No recommendations yet"
            description="Complete the onboarding quiz to get personalised career matches."
            action={
              <Button asChild size="sm">
                <Link to="/onboarding">Take the quiz</Link>
              </Button>
            }
          />
        )}
      </section>
    </div>
  );
}
