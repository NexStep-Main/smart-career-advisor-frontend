import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import FadeIn from "@/components/common/FadeIn";
import EditorialHeading from "@/components/common/EditorialHeading";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Is NexStep free to use?",
    a: "Yes — 100% free for all students. We believe career guidance should be accessible to everyone, not just those who can afford counsellors.",
  },
  {
    q: "Which education levels does it support?",
    a: "We support students after Class 10 (stream selection), Class 12 (college and course selection), and Graduation (job or higher studies decisions).",
  },
  {
    q: "How accurate are the career recommendations?",
    a: "Recommendations are ranked against your education level, stream, and the priorities you set in the quiz — the more complete your profile, the sharper the matches. It's a starting point for research, not a verdict.",
  },
  {
    q: "Can I explore careers without taking the quiz?",
    a: "Absolutely. The Career Explorer is publicly accessible — browse, filter, and read detailed career pages without any login.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="border-b border-rule px-6 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
        <FadeIn>
          <div className="lg:sticky lg:top-32">
            <EditorialHeading index="§ 05" eyebrow="FAQ" title="Questions, answered." />
            <p className="mt-8 text-sm leading-relaxed text-ink-muted">
              Still unsure?{" "}
              <Link
                to="/register"
                className="text-ink underline underline-offset-4 transition-opacity hover:opacity-60"
              >
                Take the quiz
              </Link>{" "}
              — it takes two minutes and gives you a ranked shortlist.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="border-t border-rule">
            {FAQS.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={faq.q} className="border-b border-rule">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-baseline gap-6 py-7 text-left"
                  >
                    <span className="font-mono text-xs text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "flex-1 font-display text-2xl leading-snug transition-colors sm:text-3xl",
                        isOpen ? "text-ink" : "text-ink-muted",
                      )}
                    >
                      {faq.q}
                    </span>
                    {/* Plus/minus drawn from two rules — an icon glyph would
                        reintroduce the line-icon language this design drops. */}
                    <span aria-hidden className="relative mt-3 size-3 shrink-0">
                      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink" />
                      <span
                        className={cn(
                          "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink transition-transform duration-300",
                          isOpen ? "scale-y-0" : "scale-y-100",
                        )}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-lg pb-8 pl-12 text-sm leading-relaxed text-ink-muted sm:text-base">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
