import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";
import SectionHeading from "@/components/common/SectionHeading";
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
    a: "Recommendations are based on your quiz answers, education level, stream, and interests. The more accurately you fill in your profile, the better the matches.",
  },
  {
    q: "Can I explore careers without taking the quiz?",
    a: "Absolutely. The Career Explorer is publicly accessible — browse, filter, and read detailed career pages without any login.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <SectionHeading eyebrow="FAQ" title="Your questions, answered" />

        <FadeIn className="flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q} className="rounded-xl border border-border bg-surface">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "shrink-0 text-primary transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </FadeIn>
      </div>
    </section>
  );
}
