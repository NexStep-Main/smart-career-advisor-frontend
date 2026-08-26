import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bookmark,
  TrendingUp,
  GraduationCap,
  IndianRupee,
  Route,
  CheckCircle2,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import DomainBadge from "@/components/career/DomainBadge";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import SEOHead from "@/components/common/SEOHead";
import { getCareerById } from "@/services/careers";
import { getRoadmapByCareer } from "@/services/roadmaps";
import { getBookmarks, addBookmark, removeBookmark } from "@/services/bookmarks";

const EDUCATION_LABELS = { class10: "Class 10", class12: "Class 12", graduation: "Graduation" };
const DEMAND_VARIANT = { high: "green", medium: "orange", low: "neutral" };

export default function CareerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: career,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["career", id],
    queryFn: () => getCareerById(id).then((res) => res.data.data.career),
  });

  const { data: roadmap } = useQuery({
    queryKey: ["roadmap", id],
    queryFn: () => getRoadmapByCareer(id).then((res) => res.data.data.roadmap),
    retry: false,
    enabled: !!career,
    // 404 just means no roadmap exists yet for this career — not a real error.
    throwOnError: false,
  });

  const { data: bookmarks = [] } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks().then((res) => res.data?.data?.careers ?? []),
  });
  const isSaved = bookmarks.some((c) => (c.id || c._id) === id);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
  const addMutation = useMutation({
    mutationFn: () => addBookmark(id),
    onSuccess: () => {
      toast.success("Saved to bookmarks");
      invalidate();
    },
    onError: () => toast.error("Couldn't save this career."),
  });
  const removeMutation = useMutation({
    mutationFn: () => removeBookmark(id),
    onSuccess: () => {
      toast.success("Removed from bookmarks");
      invalidate();
    },
    onError: () => toast.error("Couldn't remove this career."),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !career) {
    return (
      <EmptyState
        icon={Search}
        title="Career not found"
        description="The career you're looking for doesn't exist or was removed."
        action={
          <Button asChild size="sm">
            <Link to="/careers">Back to Explorer</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title={career.title} description={career.description} />

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      <Card>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <DomainBadge domain={career.domain} />
                <Badge variant={DEMAND_VARIANT[career.demandLevel] ?? "neutral"}>
                  {career.demandLevel} demand
                </Badge>
              </div>
              <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">
                {career.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {career.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-600 dark:text-slate-300">
                {career.salaryRange && (
                  <span className="flex items-center gap-1.5">
                    <IndianRupee size={15} className="text-primary" />
                    <strong className="text-slate-900 dark:text-slate-50">
                      {career.salaryRange}
                    </strong>
                  </span>
                )}
                {career.educationLevel?.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <GraduationCap size={15} className="text-primary" />
                    {career.educationLevel.map((l) => EDUCATION_LABELS[l] ?? l).join(", ")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2">
              {roadmap && (
                <Button asChild>
                  <Link to={`/roadmap/${id}`}>
                    <Route size={16} />
                    View Roadmap
                  </Link>
                </Button>
              )}
              <Button
                variant={isSaved ? "secondary" : "outline"}
                disabled={addMutation.isPending || removeMutation.isPending}
                onClick={() => (isSaved ? removeMutation.mutate() : addMutation.mutate())}
              >
                <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                {isSaved ? "Saved" : "Save Career"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          {career.skills?.length > 0 && (
            <Card>
              <CardContent>
                <h3 className="mb-4 font-heading text-base font-semibold text-slate-900 dark:text-slate-50">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {career.skills.map((skill) => (
                    <Badge key={skill} variant="primary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {career.futureScope && (
            <Card>
              <CardContent>
                <h3 className="mb-3 flex items-center gap-2 font-heading text-base font-semibold text-slate-900 dark:text-slate-50">
                  <TrendingUp size={17} className="text-primary" />
                  Future Scope & Growth
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {career.futureScope}
                </p>
              </CardContent>
            </Card>
          )}

          {career.streams?.length > 0 && (
            <Card>
              <CardContent>
                <h3 className="mb-4 font-heading text-base font-semibold text-slate-900 dark:text-slate-50">
                  Suitable Streams
                </h3>
                <div className="flex flex-col gap-2.5">
                  {career.streams.map((stream) => (
                    <div
                      key={stream}
                      className="flex items-center gap-2 text-sm capitalize text-slate-600 dark:text-slate-300"
                    >
                      <CheckCircle2 size={15} className="text-accent-green" />
                      {stream}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-5">
          {career.educationLevel?.length > 0 && (
            <Card>
              <CardContent>
                <h3 className="mb-3 font-heading text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Suitable After
                </h3>
                <div className="flex flex-wrap gap-2">
                  {career.educationLevel.map((level) => (
                    <Badge key={level} variant="neutral">
                      {EDUCATION_LABELS[level] ?? level}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {career.topColleges?.length > 0 && (
            <Card>
              <CardContent>
                <h3 className="mb-3 font-heading text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Top Colleges
                </h3>
                <div className="flex flex-col gap-2">
                  {career.topColleges.map((college) => (
                    <div
                      key={college}
                      className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                      {college}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {career.tags?.length > 0 && (
            <Card>
              <CardContent>
                <h3 className="mb-3 font-heading text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {career.tags.map((tag) => (
                    <Badge key={tag} variant="neutral">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {!roadmap && (
            <Card className="border-dashed">
              <CardContent className="text-center">
                <Route className="mx-auto mb-2 text-slate-300 dark:text-slate-600" size={24} />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No roadmap published for this career yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
