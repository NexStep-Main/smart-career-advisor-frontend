import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Users, Briefcase, Route, Bookmark, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/common/EmptyState";
import SEOHead from "@/components/common/SEOHead";
import { getAdminStats } from "@/services/admin";

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
        <h1 className="font-display text-3xl text-slate-900 dark:text-slate-50">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Platform overview at a glance.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-6">
              <stat.icon
                size={22}
                className="shrink-0 text-slate-400 dark:text-slate-500"
                strokeWidth={1.6}
              />
              <div className="min-w-0">
                {isLoading ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  <div className="font-display text-2xl leading-none text-slate-900 dark:text-slate-50 sm:text-3xl">
                    {stat.value ?? 0}
                  </div>
                )}
                <div className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-slate-900 dark:text-slate-50">
            Recent students
          </h2>
          <Link
            to="/admin/students"
            className="flex items-center gap-1 text-sm font-medium text-admin-accent hover:underline"
          >
            View all
            <ArrowRight size={14} />
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
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    <th className="px-4 py-3 font-semibold sm:px-6">Name</th>
                    <th className="px-4 py-3 font-semibold sm:px-6">Education</th>
                    <th className="px-4 py-3 font-semibold sm:px-6">Quiz</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentUsers.map((student) => (
                    <tr key={student.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 sm:px-6">
                        <div className="font-medium text-slate-900 dark:text-slate-50">
                          {student.fullName}
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500">
                          {student.email}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 sm:px-6">
                        {EDUCATION_LABELS[student.educationLevel] ?? "—"}
                      </td>
                      <td className="px-4 py-3 sm:px-6">
                        <Badge variant={student.quizCompleted ? "accent" : "neutral"}>
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
