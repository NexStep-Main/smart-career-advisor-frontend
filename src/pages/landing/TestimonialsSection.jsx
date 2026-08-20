import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    name: "Priya Mehta",
    role: "Class 12 Science, Kolkata",
    quote:
      "I had no idea what to do after boards. NexStep showed me options in my stream I hadn't even heard of.",
  },
  {
    name: "Arjun Das",
    role: "B.Tech CSE, Final Year",
    quote:
      "The skill roadmap for Full Stack development is incredibly detailed. I know exactly what to learn this semester.",
  },
  {
    name: "Sneha Roy",
    role: "Commerce Student, Delhi",
    quote:
      "Compared CA vs MBA vs CFA in one click. The comparison table made my decision so much easier.",
  },
  {
    name: "Rahul Sharma",
    role: "Class 10, Pune",
    quote:
      "I was scared about stream selection. The quiz understood my interests better than my own teachers did.",
  },
];

const ROTATE_MS = 7000;

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((delta) => {
    setIndex((i) => (i + delta + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  // Auto-advance, but stop while the reader is interacting with the controls
  // (hover/focus) and for anyone who asked the OS to reduce motion.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => go(1), ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, go]);

  const active = TESTIMONIALS[index];

  return (
    <section
      id="testimonials"
      className="border-b border-rule px-6 py-24 sm:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-5xl">
        <FadeIn className="mb-12 flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
          <span className="text-ink-faint">§ 04</span>
          <span>Student stories</span>
        </FadeIn>

        <FadeIn>
          {/* Fixed min-height so rotating between quotes of different lengths
              doesn't make the whole section jump. */}
          <div className="min-h-64 sm:min-h-72">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-display text-3xl leading-[1.15] tracking-tight text-ink sm:text-5xl md:text-6xl">
                  &ldquo;{active.quote}&rdquo;
                </p>
                <footer className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                  {active.name}
                  <span className="text-ink-faint"> · {active.role}</span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-10 flex items-center justify-between border-t border-rule pt-6">
            <div className="flex gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setIndex(i)}
                  aria-label={`Show testimonial from ${t.name}`}
                  aria-current={i === index}
                  className={cn(
                    "h-px w-10 transition-colors",
                    i === index ? "bg-ink" : "bg-rule hover:bg-ink-faint",
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-ink-faint">
                {String(index + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
              </span>
              <button
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className="text-ink transition-opacity hover:opacity-50"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className="text-ink transition-opacity hover:opacity-50"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
