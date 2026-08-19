import FadeIn from "@/components/common/FadeIn";
import EditorialHeading from "@/components/common/EditorialHeading";

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

// Split-screen: the heading holds the left rail while the steps scroll past
// on the right — deliberately not the centred heading-over-grid pattern the
// rest of the page used to repeat.
export default function ProcessSection() {
  return (
    <section id="process" className="border-b border-rule px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <FadeIn>
          <div className="lg:sticky lg:top-32">
            <EditorialHeading
              index="§ 01"
              eyebrow="How it works"
              title="From confusion to clarity."
              subtitle="Three steps. Under ten minutes. No counsellor's fee."
            />
          </div>
        </FadeIn>

        <div>
          {STEPS.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.1}>
              <div className="grid grid-cols-[auto_1fr] gap-6 border-t border-rule py-10 first:border-t-0 first:pt-0 sm:gap-10">
                {/* The numeral is the graphic — oversized display type where
                    an icon-in-a-box used to sit. */}
                <div className="font-display text-5xl leading-none text-ink-faint sm:text-7xl">
                  {step.num}
                </div>
                <div className="pt-1 sm:pt-2">
                  <h3 className="font-display text-2xl text-ink sm:text-3xl">{step.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted sm:text-base">
                    {step.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
