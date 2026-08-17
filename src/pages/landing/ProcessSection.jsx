import FadeIn from "@/components/common/FadeIn";
import SectionHeading from "@/components/common/SectionHeading";

const STEPS = [
  {
    num: "01",
    title: "Tell us about you",
    desc: "Answer a quick 5-step quiz about your education level, stream, interests, and priorities. No sign-up required to start.",
  },
  {
    num: "02",
    title: "Get your roadmap",
    desc: "Our recommendation engine analyses your profile and maps out the top career paths suited to your background and goals.",
  },
  {
    num: "03",
    title: "Follow & track",
    desc: "Work through your personalised skill roadmap phase by phase, and access curated resources at every step.",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="How it works"
          title="Our proven process"
          subtitle="From confusion to clarity in three simple steps"
        />

        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.1}>
              <div className="h-full rounded-xl border border-border bg-surface p-6">
                <div className="mb-4 font-heading text-2xl font-bold text-primary">{step.num}</div>
                <h3 className="mb-2 font-heading text-base font-semibold text-slate-900 dark:text-slate-50">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {step.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
