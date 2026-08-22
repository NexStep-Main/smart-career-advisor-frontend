import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Users, Briefcase, Route, Bookmark, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import SEOHead from "@/components/common/SEOHead";
import { getAdminStats } from "@/services/admin";
import { cn } from "@/lib/utils";

const EDUCATION_LABELS = { class10: "Class 10", class12: "Class 12", graduation: "Graduation" };

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => getAdminStats().then((res) => res.data.data),
  });

  const stats = [
    { icon: Users, label: "Total students", value: data?.totalUsers },
    { icon: Briefcase, label: "Total careers", value: data?.totalCareers },
    { icon: Route, label: "Total roadmaps", value: data?.totalRoadmaps },
    { icon: Bookmark, label: "Career bookmarks", value: data?.totalBookmarks },
  ];

  return (
    <div className="flex flex-col gap-8">
      <SEOHead title="Admin Dashboard" />

      <div>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500">
          Console / Overview
        </span>
        <h1 className="mt-1 font-display text-3xl text-slate-900 dark:text-slate-50">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Platform overview at a glance.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          // Zero roadmaps is a real content gap, not a neutral reading — the
          // console's one accent color is reserved for exactly this kind of
          // "needs attention" number, not decoration.
          const isCritical = stat.label === "Total roadmaps" && (stat.value ?? 0) === 0;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-4 sm:gap-3.5 sm:p-5">
                <stat.icon
                  size={20}
                  className="shrink-0 text-slate-500 dark:text-slate-500"
                  strokeWidth={1.6}
                />
                <div className="min-w-0">
                  {isLoading ? (
                    <Skeleton className="h-6 w-12" />
                  ) : (
                    <div
                      className={cn(
                        "font-mono text-2xl font-bold leading-none tabular-nums sm:text-[28px]",
                        isCritical ? "text-admin-accent" : "text-slate-900 dark:text-slate-50",
                      )}
                    >
                      {String(stat.value ?? 0).padStart(2, "0")}
                    </div>
                  )}
                  <div className="mt-1.5 truncate font-mono text-[10.5px] uppercase tracking-[0.06em] text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-sm font-bold uppercase tracking-[0.06em] text-slate-300 dark:text-slate-300">
            Recent students
          </h2>
          <Link
            to="/admin/students"
            className="flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-[0.04em] text-admin-accent hover:underline"
          >
            View all
            <ArrowRight size={12} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : data?.recentUsers?.length ? (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border font-mono text-[10.5px] uppercase tracking-wide text-slate-500 dark:text-slate-500">
                    <th className="px-4 py-2.5 font-semibold sm:px-6">Name</th>
                    <th className="px-4 py-2.5 font-semibold sm:px-6">Education</th>
                    <th className="px-4 py-2.5 font-semibold sm:px-6">Quiz</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentUsers.map((student) => (
                    <tr key={student.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 sm:px-6">
                        <div className="font-medium text-slate-900 dark:text-slate-50">
                          {student.fullName}
                        </div>
                        <div className="font-mono text-xs text-slate-500 dark:text-slate-500">
                          {student.email}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300 sm:px-6">
                        {EDUCATION_LABELS[student.educationLevel] ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 sm:px-6">
                        <Badge variant={student.quizCompleted ? "green" : "neutral"}>
                          {student.quizCompleted ? "Done" : "Pending"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <EmptyState title="No students yet" description="New registrations will show up here." />
        )}
      </section>
    </div>
  );
}
