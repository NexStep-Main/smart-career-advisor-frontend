import { Link } from "react-router-dom";
import { ArrowUpRight, GitCompareArrows, Map, Search, WandSparkles } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";
import useAuthStore from "@/store/useAuthStore";
import EditorialHeading from "@/components/common/EditorialHeading";

const FEATURES = [
  {
    icon: Search,
    title: "Career Explorer",
    desc: "Every career path, filterable by stream, education level, and salary — so you stop scrolling forums and start comparing facts.",
    to: "/careers",
    bg: "bg-sky",
    span: "md:col-span-3",
  },
  {
    icon: Map,
    title: "Skill Roadmaps",
    desc: "Phase-by-phase learning paths with the exact skills, order, and resources — no more guessing what to learn first.",
    to: "/careers",
    bg: "bg-mint",
    span: "md:col-span-3",
  },
  {
    icon: WandSparkles,
    title: "Smart Recommendations",
    desc: "A matching engine that ranks careers against your education level, stream, and priorities — sharper the more you tell it.",
    to: "/recommendations",
    bg: "bg-bubblegum",
    span: "md:col-span-3",
  },
  {
    icon: GitCompareArrows,
    title: "Career Comparison",
    desc: "Line up three careers side-by-side across salary, skills, demand, and future scope before you commit to one.",
    to: "/compare",
    bg: "bg-sunny",
    span: "md:col-span-3",
  },
];

export default function FeaturesSection() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section id="features" className="scroll-mt-24 bg-grape/10 px-6 py-20 sm:py-28 dark:bg-grape/15">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <EditorialHeading
            tone="sunny"
            eyebrow="What you get"
            title="Everything you need, nothing you don't."
            subtitle="Four tools that work together to take you from curious to confident."
          />
        </FadeIn>

        <div className="mt-14 grid gap-6 md:grid-cols-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            // Recommendations need a profile — guests start with the quiz.
            const to = feature.to === "/recommendations" && !isAuthenticated ? "/onboarding" : feature.to;
            return (
              <FadeIn key={feature.title} delay={i * 0.07} className={feature.span}>
                <Link
                  to={to}
                  className="group flex h-full flex-col rounded-3xl border-2 border-ink bg-surface p-7 shadow-pop transition-all duration-300 hover:-translate-y-1.5 hover:shadow-pop-lg"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex size-14 items-center justify-center rounded-2xl border-2 border-ink text-night transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 ${feature.bg}`}
                    >
                      <Icon size={26} strokeWidth={2.3} />
                    </div>
                    <span className="flex size-10 items-center justify-center rounded-full border-2 border-ink bg-paper text-ink transition-colors group-hover:bg-sunny group-hover:text-night">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-semibold text-ink sm:text-3xl">
                    {feature.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted sm:text-base">
                    {feature.desc}
                  </p>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
