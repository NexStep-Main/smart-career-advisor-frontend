import FadeIn from "@/components/common/FadeIn";

const STATS = [
  { value: "100+", label: "Career paths" },
  { value: "10+", label: "Domains covered" },
  { value: "5,000+", label: "Students guided" },
  { value: "14", label: "Platform pages" },
];

export default function StatsSection() {
  return (
    <section className="border-y border-border bg-surface px-6 py-16">
      <FadeIn className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </FadeIn>
    </section>
  );
}
