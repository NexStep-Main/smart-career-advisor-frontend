import { Map, MapPin, Bot, Scale } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";
import SectionHeading from "@/components/common/SectionHeading";
import Badge from "@/components/ui/Badge";

const FEATURES = [
  {
    icon: Map,
    title: "Career Explorer",
    desc: "Browse 100+ career paths across 10+ domains. Filter by stream, education level, and salary range.",
    tag: "Core",
  },
  {
    icon: MapPin,
    title: "Skill Roadmaps",
    desc: "Phase-by-phase visual learning paths that show exactly what to learn, when, and with which resources.",
    tag: "Core",
  },
  {
    icon: Bot,
    title: "AI Recommendations",
    desc: "A smart matching engine that scores and ranks careers based on your quiz answers and profile.",
    tag: "Smart",
  },
  {
    icon: Scale,
    title: "Career Comparison",
    desc: "Compare any two careers side-by-side across salary, skills, demand, and future scope.",
    tag: "Tool",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="border-y border-border bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="What we offer"
          title="Everything you need"
          subtitle="Tools built specifically for Indian students navigating career decisions"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {FEATURES.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.08}>
              <div className="flex h-full gap-4 rounded-xl border border-border bg-surface p-6">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                  <feature.icon size={20} className="text-primary" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="mb-1.5 flex items-center gap-2">
                    <h3 className="font-heading text-base font-semibold text-slate-900">
                      {feature.title}
                    </h3>
                    <Badge variant="primary">{feature.tag}</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-500">{feature.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
