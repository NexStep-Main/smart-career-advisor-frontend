import { useQuery } from "@tanstack/react-query";
import { BookOpen, Compass, GraduationCap, Map } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";
import CountUp from "@/components/common/CountUp";
import { getPublicStats } from "@/services/publicStats";

export default function StatsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["publicStats"],
    queryFn: () => getPublicStats().then((res) => res.data.data),
  });

  // Real counts from the live database — no hardcoded marketing numbers.
  // Grows on its own as careers/roadmaps/students are added, instead of
  // drifting out of sync with an inflated number nobody remembers to update.
  const stats = [
    { value: data?.totalCareers, label: "Career paths", icon: Compass, bg: "bg-grape text-white", tilt: "-rotate-2" },
    { value: data?.totalDomains, label: "Domains covered", icon: BookOpen, bg: "bg-sunny text-night", tilt: "rotate-1" },
    { value: data?.totalStudents, label: "Students guided", icon: GraduationCap, bg: "bg-mint text-night", tilt: "-rotate-1" },
    { value: data?.totalRoadmaps, label: "Roadmaps published", icon: Map, bg: "bg-bubblegum text-night", tilt: "rotate-2" },
  ];

  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="mb-10 text-center">
          <span className="font-hand text-3xl text-ink-muted sm:text-4xl">
            real numbers, live from our database
          </span>
        </FadeIn>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <FadeIn key={stat.label} delay={i * 0.08}>
                <div
                  className={`rounded-3xl border-2 border-ink p-5 shadow-pop transition-transform duration-300 hover:rotate-0 hover:-translate-y-1 sm:p-6 ${stat.bg} ${stat.tilt}`}
                >
                  <Icon size={28} strokeWidth={2.2} />
                  <div className="mt-4 font-display text-5xl font-bold leading-none sm:text-6xl">
                    {isLoading ? (
                      <span className="opacity-50">—</span>
                    ) : (
                      <>
                        <CountUp value={stat.value ?? 0} />
                        <span className="opacity-70">+</span>
                      </>
                    )}
                  </div>
                  <div className="mt-3 text-sm font-bold">{stat.label}</div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
