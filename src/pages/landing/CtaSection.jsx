import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
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
    <section className="px-6 py-28 sm:py-40">
      <FadeIn className="mx-auto max-w-6xl">
        <p className="mb-10 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
          {totalStudents >= SOCIAL_PROOF_THRESHOLD
            ? `Join ${totalStudents}+ students already mapping their path`
            : "Be one of the first students to map your path"}
        </p>

        <h2 className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] tracking-tight text-ink">
          Your next step
          <br />
          starts with <span className="italic">one quiz</span>
          <span className="text-ink-faint">.</span>
        </h2>

        <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-6 border-t border-rule pt-10">
          <Button asChild variant="ink" size="lg">
            <Link to="/register">
              Start free today
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Link
            to="/careers"
            className="font-mono text-xs uppercase tracking-[0.2em] text-ink underline underline-offset-8 transition-opacity hover:opacity-60"
          >
            Or browse careers first
          </Link>
          <p className="ml-auto max-w-xs text-sm text-ink-muted">
            Five minutes now saves months of second-guessing later. Free — no credit card, no catch.
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
