import { Link } from "react-router-dom";
import { ArrowRight, Map, MessageCircleQuestion, Rocket } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";
import EditorialHeading from "@/components/common/EditorialHeading";

const STEPS = [
  {
    num: 1,
    icon: MessageCircleQuestion,
    title: "Tell us about you",
    cta: "Take the quiz",
    to: "/onboarding",
    desc: "Answer a quick 5-step quiz about your education level, stream, interests, and priorities. No sign-up required to start.",
    bg: "bg-sunny",
    tilt: "-rotate-1",
  },
  {
    num: 2,
    icon: Map,
    title: "Get your roadmap",
    cta: "Browse careers",
    to: "/careers",
    desc: "Our recommendation engine analyses your profile and maps out the top career paths suited to your background and goals.",
    bg: "bg-mint",
    tilt: "rotate-1",
  },
  {
    num: 3,
    icon: Rocket,
    title: "Follow & track",
    cta: "See a roadmap",
    to: "/careers",
    desc: "Work through your personalised skill roadmap phase by phase, and access curated resources at every step.",
    bg: "bg-bubblegum",
    tilt: "-rotate-1",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="scroll-mt-24 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <EditorialHeading
            align="center"
            tone="pink"
            eyebrow="How it works"
            title="From “what now?” to “I've got a plan!”"
            subtitle="Three easy steps. Under ten minutes. No counsellor's fee."
          />
        </FadeIn>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          {/* Dashed trail connecting the cards on wide screens. */}
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-10 hidden border-t-4 border-dashed border-ink/30 md:block"
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <FadeIn key={step.num} delay={i * 0.1}>
                <Link
                  to={step.to}
                  className={`group relative block h-full rounded-3xl border-2 border-ink bg-surface p-7 pt-12 shadow-pop transition-all duration-300 hover:-translate-y-1 hover:rotate-0 hover:shadow-pop-lg ${step.tilt}`}
                >
                  <div
                    className={`absolute -top-7 left-7 flex size-16 items-center justify-center rounded-2xl border-2 border-ink font-display text-3xl font-bold text-night shadow-pop-sm ${step.bg}`}
                  >
                    {step.num}
                  </div>
                  <Icon
                    size={30}
                    strokeWidth={2.2}
                    className="absolute right-7 top-6 text-grape dark:text-primary"
                  />
                  <h3 className="font-display text-2xl font-semibold text-ink">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
                    {step.desc}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-grape dark:text-primary">
                    {step.cta}
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
