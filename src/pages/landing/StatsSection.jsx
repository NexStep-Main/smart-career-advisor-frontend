import { useQuery } from "@tanstack/react-query";
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
    { value: data?.totalCareers, label: "Career paths" },
    { value: data?.totalDomains, label: "Domains covered" },
    { value: data?.totalStudents, label: "Students guided" },
    { value: data?.totalRoadmaps, label: "Roadmaps published" },
  ];

  return (
    <section className="border-b border-rule px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="mb-12 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
          Live from our database — not a projection
        </FadeIn>

        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4">
          {stats.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.08}>
              <div className="border-l border-rule pl-5">
                <div className="font-display text-6xl leading-none text-ink sm:text-7xl">
                  {isLoading ? (
                    <span className="text-ink-faint">—</span>
                  ) : (
                    <>
                      <CountUp value={stat.value ?? 0} />
                      <span className="text-ink-faint">+</span>
                    </>
                  )}
                </div>
                <div className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                  {stat.label}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
