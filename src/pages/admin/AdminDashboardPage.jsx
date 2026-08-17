import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Users, Briefcase, Route, Bookmark, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
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
        <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-50">
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
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-light sm:size-11">
                <stat.icon size={18} className="text-primary" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                {isLoading ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  <div className="font-heading text-lg font-bold text-slate-900 dark:text-slate-50 sm:text-xl">
                    {stat.value ?? 0}
                  </div>
                )}
                <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-50">
            Recent students
          </h2>
          <Link
            to="/admin/students"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
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
                        <span
                          className={
                            student.quizCompleted
                              ? "rounded-lg bg-primary-light px-2.5 py-1 text-xs font-semibold text-primary-dark"
                              : "rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400"
                          }
                        >
                          {student.quizCompleted ? "Done" : "Pending"}
                        </span>
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
