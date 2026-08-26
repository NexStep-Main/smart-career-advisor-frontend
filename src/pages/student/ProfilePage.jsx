import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Bookmark, ClipboardCheck, RefreshCw, User, ArrowRight, Compass } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
import SEOHead from "@/components/common/SEOHead";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import CareerCard from "@/components/career/CareerCard";
import useAuthStore from "@/store/useAuthStore";
import { updateProfileRequest } from "@/services/auth";
import { getBookmarks } from "@/services/bookmarks";
import { profileFormSchema } from "@/utils/schemas";

const EDUCATION_LEVELS = [
  { value: "class10", label: "Class 10" },
  { value: "class12", label: "Class 12" },
  { value: "graduation", label: "Graduation" },
];
const STREAMS = [
  { value: "science", label: "Science" },
  { value: "commerce", label: "Commerce" },
  { value: "arts", label: "Arts" },
  { value: "engineering", label: "Engineering" },
];

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const { data: bookmarks = [], isLoading: loadingBookmarks } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks().then((res) => res.data?.data?.careers ?? []),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      educationLevel: user?.educationLevel ?? "",
      stream: user?.stream ?? "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const { data } = await updateProfileRequest(values);
      updateProfile(data.data.user);
      toast.success("Profile updated");
    } catch {
      toast.error("Couldn't update your profile.");
    }
  };

  const stats = [
    {
      icon: Bookmark,
      label: "Careers saved",
      value: loadingBookmarks ? "…" : bookmarks.length,
      to: "/bookmarks",
    },
    {
      icon: ClipboardCheck,
      label: "Quiz status",
      value: user?.quizCompleted ? "Completed" : "Pending",
      to: "/onboarding",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <SEOHead title="My Profile" />

      <PageHeader eyebrow="Account" title="My Profile" subtitle="Manage your account details and view saved bookmarks." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary-dark font-heading text-xl font-bold text-white">
                {(user?.fullName ?? "S").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="truncate font-heading text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {user?.fullName}
                </div>
                <div className="truncate text-sm text-slate-500 dark:text-slate-400">
                  {user?.email}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="mb-4 font-heading text-base font-semibold text-slate-900 dark:text-slate-50">
                Account details
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" error={!!errors.fullName} {...register("fullName")} />
                  <FormError message={errors.fullName?.message} />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input value={user?.email ?? ""} disabled />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="educationLevel">Education level</Label>
                    <select
                      id="educationLevel"
                      className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm text-slate-900 dark:text-slate-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      {...register("educationLevel")}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {EDUCATION_LEVELS.map((l) => (
                        <option key={l.value} value={l.value}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                    <FormError message={errors.educationLevel?.message} />
                  </div>
                  <div>
                    <Label htmlFor="stream">Stream</Label>
                    <select
                      id="stream"
                      className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm text-slate-900 dark:text-slate-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      {...register("stream")}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {STREAMS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <FormError message={errors.stream?.message} />
                  </div>
                </div>

                <Button type="submit" disabled={!isDirty || isSubmitting} className="self-start">
                  {isSubmitting ? "Saving…" : "Save changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="transition-shadow hover:shadow-md">
              <Link to={stat.to} className="block">
                <CardContent className="flex items-center gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                    <stat.icon size={18} className="text-primary" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-heading text-lg font-bold text-slate-900 dark:text-slate-50">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                  </div>
                  <ArrowRight size={15} className="text-slate-400 dark:text-slate-500" />
                </CardContent>
              </Link>
            </Card>
          ))}

          <Card>
            <CardContent>
              <div className="mb-3 flex items-center gap-2">
                <User size={16} className="text-primary" />
                <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Career quiz
                </h3>
              </div>
              <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                {user?.quizCompleted
                  ? "Retake the quiz any time — your recommendations update automatically."
                  : "Take the quiz to unlock personalised career recommendations."}
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/onboarding">
                  <RefreshCw size={14} />
                  {user?.quizCompleted ? "Retake Quiz" : "Take Quiz"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bookmarked Careers Section */}
      <section className="flex flex-col gap-4 border-t border-border pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2.5 font-heading text-lg font-bold text-slate-900 dark:text-slate-50">
              <Bookmark size={20} className="text-primary" />
              Bookmarked Careers
              {bookmarks.length > 0 && (
                <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary-dark">
                  {bookmarks.length}
                </span>
              )}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Careers and pathways you have saved for quick access and planning.
            </p>
          </div>

          {bookmarks.length > 0 && (
            <Button asChild variant="outline" size="sm">
              <Link to="/bookmarks" className="flex items-center gap-1.5">
                <span>View Full Library</span>
                <ArrowRight size={14} />
              </Link>
            </Button>
          )}
        </div>

        {loadingBookmarks ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No bookmarks saved yet"
            description="Explore career paths and click the bookmark icon to save them to your profile."
            action={
              <Button asChild size="sm">
                <Link to="/careers">
                  <Compass size={15} />
                  Explore Careers
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((career) => (
              <CareerCard key={career.id || career._id} career={career} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
