import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
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
    <section id="faq" className="scroll-mt-24 px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <FadeIn>
          <div className="lg:sticky lg:top-32">
            <EditorialHeading tone="tangerine" eyebrow="FAQ" title="Got questions? We've got answers." />
            <p className="mt-8 text-base leading-relaxed text-ink-muted">
              Still unsure?{" "}
              <Link
                to="/onboarding"
                className="font-bold text-grape underline decoration-sunny decoration-4 underline-offset-4 transition-opacity hover:opacity-70 dark:text-primary"
              >
                Take the quiz
              </Link>{" "}
              — it takes two minutes and gives you a ranked shortlist.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-4">
            {FAQS.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={faq.q}
                  className={cn(
                    "rounded-3xl border-2 border-ink bg-surface transition-shadow",
                    isOpen ? "shadow-pop" : "shadow-pop-sm",
                  )}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
                  >
                    <span className="flex-1 font-display text-lg font-semibold leading-snug text-ink sm:text-xl">
                      {faq.q}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-ink transition-all duration-300",
                        isOpen ? "rotate-45 bg-bubblegum text-night" : "bg-sunny text-night",
                      )}
                    >
                      <Plus size={18} strokeWidth={3} />
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
                        <p className="px-5 pb-6 text-sm leading-relaxed text-ink-muted sm:px-6 sm:text-base">
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
