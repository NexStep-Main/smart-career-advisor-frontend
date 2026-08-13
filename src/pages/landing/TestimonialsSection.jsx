import { Star } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";
import SectionHeading from "@/components/common/SectionHeading";

const TESTIMONIALS = [
  {
    name: "Priya Mehta",
    role: "Class 12 Science, Kolkata",
    quote:
      "I had no idea what to do after boards. Smart Career Advisor showed me options in my stream I hadn't even heard of.",
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

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-y border-border bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Student stories" title="What students say" />

        <div className="grid gap-5 sm:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.08}>
              <div className="h-full rounded-xl border border-border bg-surface p-6">
                <div className="mb-3 flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mb-5 text-sm italic leading-relaxed text-slate-600">
                  “{t.quote}”
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary-dark">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
