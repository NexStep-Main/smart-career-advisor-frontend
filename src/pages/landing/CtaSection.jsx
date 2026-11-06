import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";
import Button from "@/components/ui/Button";
import { getPublicStats } from "@/services/publicStats";

// Below this, a raw headcount reads as embarrassing rather than reassuring
// ("Join 3 students") — falls back to an honest invite instead of a
// fabricated-sounding number. Shares StatsSection's query cache/key, so this
// costs no extra request.
const SOCIAL_PROOF_THRESHOLD = 20;

export default function CtaSection() {
  const { data } = useQuery({
    queryKey: ["publicStats"],
    queryFn: () => getPublicStats().then((res) => res.data.data),
  });
  const totalStudents = data?.totalStudents ?? 0;

  return (
    <section className="px-4 pb-24 pt-8 sm:px-6 sm:pb-32">
      <FadeIn className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink bg-grape px-6 py-16 text-center text-white shadow-pop-lg sm:px-12 sm:py-24">
          {/* Decorative shapes */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-16 -top-16 size-56 rounded-full bg-bubblegum/60 blur-2xl" />
            <div className="absolute -bottom-20 -right-10 size-64 rounded-full bg-sunny/50 blur-2xl" />
            <Star
              size={44}
              fill="currentColor"
              className="animate-wiggle absolute left-[8%] top-[18%] hidden text-sunny sm:block"
            />
            <Sparkles
              size={40}
              className="animate-float absolute right-[10%] top-[16%] hidden text-mint sm:block"
            />
            <div
              className="animate-float-slow absolute bottom-[16%] left-[12%] hidden size-12 rounded-2xl border-2 border-white/80 bg-sky sm:block"
              style={{ "--r": "14deg" }}
            />
            <div className="animate-float absolute bottom-[20%] right-[12%] hidden size-9 rounded-full border-2 border-white/80 bg-tangerine sm:block" />
          </div>

          <div className="relative">
            <span className="inline-block -rotate-2 rounded-full border-2 border-night bg-sunny px-4 py-1 text-sm font-bold text-night shadow-[3px_3px_0_0_#1b1640]">
              {totalStudents >= SOCIAL_PROOF_THRESHOLD
                ? `Join ${totalStudents}+ students already mapping their path`
                : "Be one of the first students to map your path"}
            </span>

            <h2 className="mx-auto mt-8 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              Your next step starts with <span className="text-sunny">one quiz</span>.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base text-white/85 sm:text-lg">
              Five minutes now saves months of second-guessing later. Free — no credit card, no catch.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button asChild variant="sunny" size="lg">
                <Link to="/onboarding">
                  Take the quiz now
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild variant="white" size="lg">
                <Link to="/register">Create free account</Link>
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
