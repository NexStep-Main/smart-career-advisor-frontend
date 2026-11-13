import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, ClipboardList, BrainCircuit, AlertCircle } from "lucide-react";
import CareerCard from "@/components/career/CareerCard";
import EmptyState from "@/components/common/EmptyState";
import SectionHeader from "@/components/common/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import SEOHead from "@/components/common/SEOHead";
import PageHeader from "@/components/common/PageHeader";
import useAuthStore from "@/store/useAuthStore";
import { getRecommendations, getAiRecommendations } from "@/services/recommendations";

const TABS = [
  { id: "matched", label: "Matched for You", icon: Sparkles },
  { id: "ai", label: "AI Picks", icon: BrainCircuit },
];

/** Skeleton grid shown while either tab is loading. */
function RecommendationSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  );
}

/** Groq AI summary banner shown above the AI Picks grid. */
function AiSummaryBanner({ summary }) {
  if (!summary) return null;
  return (
    <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10">
      <CardContent className="flex gap-3 py-4">
        <BrainCircuit
          size={18}
          className="mt-0.5 shrink-0 text-primary"
          aria-hidden
        />
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {summary}
        </p>
      </CardContent>
    </Card>
  );
}

export default function RecommendationPage() {
  const [activeTab, setActiveTab] = useState("matched");
  const quizCompleted = useAuthStore((state) => state.user?.quizCompleted);

  // ── Tab: Matched (deterministic scoring) ───────────────────────────────
  const {
    data: matchedRecommendations,
    isLoading: matchedLoading,
  } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => getRecommendations().then((res) => res.data.data.recommendations),
    enabled: !!quizCompleted,
  });

  // ── Tab: AI Picks (Groq) — only fetched when the tab is active ─────────
  const {
    data: aiData,
    isLoading: aiLoading,
    isError: aiError,
    refetch: refetchAi,
  } = useQuery({
    queryKey: ["recommendations", "ai"],
    queryFn: () => getAiRecommendations().then((res) => res.data.data),
    enabled: !!quizCompleted && activeTab === "ai",
    // AI calls can be slow; a generous stale time avoids unnecessary re-fetches
    // when the user switches tabs back and forth.
    staleTime: 5 * 60 * 1000,
  });

  if (!quizCompleted) {
    return (
      <div className="flex flex-col gap-6">
        <SEOHead title="Recommendations" />
        <PageHeader
          eyebrow="Matches"
          title="Recommended for You"
          subtitle="Careers matched to your quiz answers, education level, and stream."
        />
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
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="Recommendations" />

      <PageHeader
        eyebrow="Matches"
        title="Recommended for You"
        subtitle="Careers matched to your quiz answers, education level, and stream."
      />

      {/* ── Tab switcher ─────────────────────────────────────────────── */}
      <div className="flex gap-1 rounded-xl border border-border bg-surface p-1 sm:w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={[
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === id
                ? "bg-primary text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50",
            ].join(" ")}
          >
            <Icon size={15} aria-hidden />
            {label}
          </button>
        ))}
      </div>

      {/* ── Matched tab ───────────────────────────────────────────────── */}
      {activeTab === "matched" && (
        <>
          <SectionHeader
            title="Scored Matches"
            action={
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Based on your profile &amp; quiz
              </span>
            }
          />
          {matchedLoading ? (
            <RecommendationSkeleton />
          ) : matchedRecommendations?.length === 0 ? (
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
              {matchedRecommendations?.map((career) => (
                <CareerCard key={career.id} career={career} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── AI Picks tab (Groq) ──────────────────────────────────────── */}
      {activeTab === "ai" && (
        <>
          <SectionHeader
            title="AI Picks"
            action={
              <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <BrainCircuit size={13} aria-hidden />
                Powered by Groq
              </span>
            }
          />

          {aiLoading ? (
            <RecommendationSkeleton />
          ) : aiError ? (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="flex flex-col items-start gap-3 py-6">
                <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertCircle size={16} aria-hidden />
                  AI recommendations are unavailable right now.
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  The Groq service could not be reached. Check that{" "}
                  <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">
                    GROQ_API_KEY
                  </code>{" "}
                  is set in your backend <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">.env</code> and{" "}
                  <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">AI_PROVIDER=groq</code> is active.
                </p>
                <Button size="sm" variant="outline" onClick={() => refetchAi()}>
                  Try again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <AiSummaryBanner summary={aiData?.summary} />
              {aiData?.recommendations?.length === 0 ? (
                <EmptyState
                  icon={BrainCircuit}
                  title="No AI picks yet"
                  description="Groq couldn't find matches for your current profile. Complete the quiz to get better results."
                  action={
                    <Button asChild size="sm">
                      <Link to="/onboarding">Retake Quiz</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {aiData?.recommendations?.map((career) => (
                    <CareerCard key={career.id} career={career} />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
