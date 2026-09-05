import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Bookmark, ClipboardCheck, RefreshCw, User } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
import SEOHead from "@/components/common/SEOHead";
import PageHeader from "@/components/common/PageHeader";
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

  const { data: bookmarks } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks().then((res) => res.data.data.careers),
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
    { icon: Bookmark, label: "Careers saved", value: bookmarks?.length ?? "—" },
    {
      icon: ClipboardCheck,
      label: "Quiz status",
      value: user?.quizCompleted ? "Completed" : "Pending",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="My Profile" />

      <PageHeader eyebrow="Account" title="My Profile" subtitle="Manage your account details." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-border font-display text-2xl text-slate-900 dark:text-slate-50">
                {(user?.fullName ?? "S").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="truncate font-display text-xl text-slate-900 dark:text-slate-50">
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
              <h2 className="mb-4 font-display text-lg text-slate-900 dark:text-slate-50">
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
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4">
                <stat.icon size={20} className="shrink-0 text-slate-400 dark:text-slate-500" strokeWidth={1.6} />
                <div>
                  <div className="font-display text-2xl leading-none text-slate-900 dark:text-slate-50">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent>
              <div className="mb-3 flex items-center gap-2">
                <User size={16} className="text-primary" />
                <h3 className="font-display text-base text-slate-900 dark:text-slate-50">
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
    </div>
  );
}
