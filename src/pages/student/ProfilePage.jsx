import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Award, Bookmark, Flame, Footprints, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
import SEOHead from "@/components/common/SEOHead";
import PageHeader from "@/components/common/PageHeader";
import SectionHeader from "@/components/common/SectionHeader";
import Avatar from "@/components/common/Avatar";
import AvatarBuilder from "@/components/profile/AvatarBuilder";
import PersonalityCard from "@/components/profile/PersonalityCard";
import useAuthStore from "@/store/useAuthStore";
import { useProgress } from "@/hooks/useProgress";
import { updateProfileRequest } from "@/services/auth";
import { getBookmarks } from "@/services/bookmarks";
import { getAllProgress } from "@/services/roadmapProgress";
import { computePersonality } from "@/lib/personality";
import { STREAMS } from "@/lib/constants";
import { profileFormSchema } from "@/utils/schemas";

const EDUCATION_LEVELS = [
  { value: "class10", label: "Class 10" },
  { value: "class12", label: "Class 12" },
  { value: "graduation", label: "Graduation" },
];

const selectClass =
  "h-11 w-full rounded-2xl border-2 border-ink bg-surface px-4 text-sm text-ink focus:outline-none focus:ring-4 focus:ring-grape/25";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const { data: progress } = useProgress();

  const { data: bookmarks } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks().then((res) => res.data.data.careers),
  });
  const { data: roadmapProgress } = useQuery({
    queryKey: ["roadmapProgress"],
    queryFn: () => getAllProgress().then((res) => res.data.data.progress),
  });

  const personality = useMemo(() => computePersonality(user, bookmarks ?? []), [user, bookmarks]);
  const phasesDone = roadmapProgress?.reduce((sum, r) => sum + r.completedPhases.length, 0);

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
    { icon: Bookmark, label: "Careers saved", value: bookmarks?.length ?? "—", bg: "bg-sunny" },
    { icon: Footprints, label: "Phases done", value: phasesDone ?? "—", bg: "bg-mint" },
    { icon: Flame, label: "Best streak", value: progress?.bestStreak ?? "—", bg: "bg-tangerine" },
    { icon: Award, label: "Badges", value: progress ? `${progress.badges.length}/${progress.catalog.length}` : "—", bg: "bg-bubblegum" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <SEOHead title="My Profile" />

      <PageHeader eyebrow="Account" title="My Profile" subtitle="Make it yours: your details, your look and your career personality." />

      {/* Identity + lifetime stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-1">
          <CardContent className="flex items-center gap-4">
            <Avatar name={user?.fullName} avatar={user?.avatar} size={64} className="mt-2" />
            <div className="min-w-0">
              <div className="truncate font-display text-xl font-semibold text-ink">{user?.fullName}</div>
              <div className="truncate text-sm text-ink-muted">{user?.email}</div>
            </div>
          </CardContent>
        </Card>
        <div className="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-4 lg:col-span-2">
          {stats.map(({ icon: Icon, label, value, bg }) => (
            <div key={label} className={`rounded-3xl border-2 border-ink p-4 text-night shadow-pop-sm ${bg}`}>
              <Icon size={18} strokeWidth={2.4} />
              <div className="mt-2 font-display text-3xl font-bold leading-none">{value}</div>
              <div className="mt-1.5 text-xs font-bold">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="min-w-0">
          <SectionHeader title="Your career personality" />
          <PersonalityCard name={user?.fullName?.split(" ")[0] ?? "My"} personality={personality} />
        </section>

        <section className="min-w-0">
          <SectionHeader title="Your avatar" />
          <Card>
            <CardContent>
              <AvatarBuilder key={JSON.stringify(user?.avatar ?? {})} user={user} />
            </CardContent>
          </Card>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="min-w-0 lg:col-span-2">
          <SectionHeader title="Account details" />
          <Card>
            <CardContent>
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
                    <select id="educationLevel" className={selectClass} {...register("educationLevel")}>
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
                    <select id="stream" className={selectClass} {...register("stream")}>
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

                <Button type="submit" variant="ink" size="md" disabled={!isDirty || isSubmitting} className="self-start">
                  {isSubmitting ? "Saving…" : "Save changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="min-w-0">
          <SectionHeader title="Career quiz" />
          <Card>
            <CardContent>
              <p className="mb-4 text-sm text-ink-muted">
                {user?.quizCompleted
                  ? "Retake the quiz any time. Your matches and personality update automatically."
                  : "Take the quiz to unlock personalised career recommendations."}
              </p>
              <Button asChild variant="inkOutline" size="md">
                <Link to="/onboarding">
                  <RefreshCw size={14} />
                  {user?.quizCompleted ? "Retake quiz" : "Take quiz"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
