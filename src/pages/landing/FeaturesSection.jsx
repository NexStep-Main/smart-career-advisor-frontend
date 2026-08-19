import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";
import EditorialHeading from "@/components/common/EditorialHeading";

const FEATURES = [
  {
    num: "01",
    title: "Career Explorer",
    desc: "Every career path, filterable by stream, education level, and salary — so you stop scrolling forums and start comparing facts.",
    to: "/careers",
  },
  {
    num: "02",
    title: "Skill Roadmaps",
    desc: "Phase-by-phase learning paths with the exact skills, order, and resources — no more guessing what to learn first.",
    to: "/careers",
  },
  {
    num: "03",
    title: "Smart Recommendations",
    desc: "A matching engine that ranks careers against your education level, stream, and priorities — sharper the more you tell it.",
    to: "/recommendations",
  },
  {
    num: "04",
    title: "Career Comparison",
    desc: "Line up three careers side-by-side across salary, skills, demand, and future scope before you commit to one.",
    to: "/compare",
  },
];

// Full-bleed ruled rows that reveal on hover — no cards, no icon boxes. The
// heading sits right-aligned here so this section doesn't mirror Process's
// left rail directly above it.
export default function FeaturesSection() {
  return (
    <section id="features" className="border-b border-rule px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="mb-16 flex justify-end">
          <EditorialHeading
            index="§ 02"
            eyebrow="What we offer"
            title="Everything you need, nothing you don't."
            className="text-right"
          />
        </FadeIn>

        <div className="border-t border-rule">
          {FEATURES.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.06}>
              <Link
                to={feature.to}
                className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-3 border-b border-rule py-8 transition-colors hover:bg-ink/3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:py-10"
              >
                <span className="font-mono text-xs text-ink-faint sm:pl-2">{feature.num}</span>

                <span className="flex items-baseline gap-4">
                  <span className="font-display text-3xl text-ink transition-transform duration-300 group-hover:translate-x-1 sm:text-4xl">
                    {feature.title}
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="shrink-0 text-ink-faint opacity-0 transition-all duration-300 group-hover:opacity-100"
                  />
                </span>

                <span className="max-w-sm text-sm leading-relaxed text-ink-muted sm:pr-2">
                  {feature.desc}
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
