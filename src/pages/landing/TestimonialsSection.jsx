import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";
import EditorialHeading from "@/components/common/EditorialHeading";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    name: "Priya Mehta",
    role: "Class 12 Science, Kolkata",
    quote:
      "I had no idea what to do after boards. NexStep showed me options in my stream I hadn't even heard of.",
    avatar: "bg-bubblegum",
  },
  {
    name: "Arjun Das",
    role: "B.Tech CSE, Final Year",
    quote:
      "The skill roadmap for Full Stack development is incredibly detailed. I know exactly what to learn this semester.",
    avatar: "bg-sky",
  },
  {
    name: "Sneha Roy",
    role: "Commerce Student, Delhi",
    quote:
      "Compared CA vs MBA vs CFA in one click. The comparison table made my decision so much easier.",
    avatar: "bg-sunny",
  },
  {
    name: "Rahul Sharma",
    role: "Class 10, Pune",
    quote:
      "I was scared about stream selection. The quiz understood my interests better than my own teachers did.",
    avatar: "bg-mint",
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
  const initials = active.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 bg-sunny/20 px-6 py-20 sm:py-28 dark:bg-sunny/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <EditorialHeading
            align="center"
            tone="sky"
            eyebrow="Student stories"
            title="Students like you, finding their way."
          />
        </FadeIn>

        <FadeIn delay={0.1} className="mt-14">
          {/* Fixed min-height so rotating between quotes of different lengths
              doesn't make the whole section jump. */}
          <div className="relative min-h-80 rounded-[2rem] border-2 border-ink bg-surface p-7 shadow-pop-lg sm:min-h-72 sm:p-10">
            <Quote
              aria-hidden
              size={56}
              strokeWidth={1.5}
              className="absolute -top-6 left-8 rotate-6 rounded-2xl border-2 border-ink bg-grape p-3 text-white"
            />
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="pt-6"
              >
                <p className="font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">
                  &ldquo;{active.quote}&rdquo;
                </p>
                <footer className="mt-8 flex items-center gap-4">
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full border-2 border-ink font-display text-lg font-bold text-night",
                      active.avatar,
                    )}
                  >
                    {initials}
                  </span>
                  <span>
                    <span className="block font-bold text-ink">{active.name}</span>
                    <span className="block text-sm text-ink-muted">{active.role}</span>
                  </span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2.5">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setIndex(i)}
                  aria-label={`Show testimonial from ${t.name}`}
                  aria-current={i === index}
                  className={cn(
                    "h-4 rounded-full border-2 border-ink transition-all duration-300",
                    i === index ? "w-10 bg-grape" : "w-4 bg-surface hover:bg-sunny",
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className="flex size-11 items-center justify-center rounded-full border-2 border-ink bg-surface text-ink shadow-pop-sm transition-all hover:-translate-y-0.5 hover:bg-sunny hover:text-night hover:shadow-pop active:translate-y-0.5 active:shadow-none"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className="flex size-11 items-center justify-center rounded-full border-2 border-ink bg-surface text-ink shadow-pop-sm transition-all hover:-translate-y-0.5 hover:bg-sunny hover:text-night hover:shadow-pop active:translate-y-0.5 active:shadow-none"
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
