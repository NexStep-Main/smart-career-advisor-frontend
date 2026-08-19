import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { Stagger } from "@/components/common/FadeIn";
import { staggerItem } from "@/lib/motion";
import useAuthStore from "@/store/useAuthStore";
import { getAllProgress } from "@/services/roadmapProgress";

/**
 * Returning-user strip — the retention hook, restated editorially. Same data
 * as before (real roadmap progress from the API), but rendered as a ruled
 * row with a hairline progress bar instead of an elevated card, so it sits
 * inside the type layout rather than competing with it.
 */
function ActiveRoadmapStrip({ roadmap, percent }) {
  const { career, completedPhases, totalPhases } = roadmap;

  return (
    <motion.div
      variants={staggerItem()}
      className="mt-14 w-full border-t border-rule pt-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
            Your active roadmap
          </div>
          <div className="mt-2 font-display text-2xl text-ink sm:text-3xl">{career.title}</div>
        </div>
        <div className="text-right">
          <div className="font-display text-4xl text-ink sm:text-5xl">{percent}%</div>
          <div className="font-mono text-xs text-ink-muted">
            {completedPhases.length}/{totalPhases} phases
          </div>
        </div>
      </div>
      <div className="mt-4 h-px w-full bg-rule">
        <div className="h-px bg-ink transition-all duration-700" style={{ width: `${percent}%` }} />
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const { data: roadmapProgress } = useQuery({
    queryKey: ["roadmapProgress"],
    queryFn: () => getAllProgress().then((res) => res.data.data.progress),
    enabled: isAuthenticated,
  });

  const activeRoadmap = roadmapProgress?.[0];
  const activeRoadmapPercent = activeRoadmap
    ? Math.round((activeRoadmap.completedPhases.length / activeRoadmap.totalPhases) * 100)
    : 0;
  const firstName = user?.fullName?.split(" ")[0];

  return (
    <section className="relative border-b border-rule px-6 pb-20 pt-40 sm:pt-48">
      <Stagger className="mx-auto max-w-6xl">
        <motion.div
          variants={staggerItem()}
          className="mb-10 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted"
        >
          <span className="h-px w-12 bg-ink" />
          {isAuthenticated ? "Welcome back" : "Career guidance · India · Free"}
        </motion.div>

        {/* The headline IS the hero visual — oversized display serif, tight
            leading, allowed to run wide. No card, no illustration beside it. */}
        {isAuthenticated ? (
          <motion.h1
            variants={staggerItem()}
            className="font-display text-[clamp(2.75rem,9vw,8rem)] leading-[0.92] tracking-tight text-ink"
          >
            {firstName ? (
              <>
                Good to see you,
                <br />
                <span className="italic">{firstName}</span>
              </>
            ) : (
              <>
                Good to see
                <br />
                you <span className="italic">back</span>
              </>
            )}
          </motion.h1>
        ) : (
          <motion.h1
            variants={staggerItem()}
            className="font-display text-[clamp(2.75rem,9vw,8rem)] leading-[0.92] tracking-tight text-ink"
          >
            Know your
            <br />
            next step<span className="text-ink-faint">.</span>
            <br />
            <span className="italic text-ink-muted">Not just your marks.</span>
          </motion.h1>
        )}

        <div className="mt-12 grid gap-10 border-t border-rule pt-10 md:grid-cols-[1fr_auto] md:items-end">
          <motion.p
            variants={staggerItem()}
            className="max-w-md text-base leading-relaxed text-ink-muted sm:text-lg"
          >
            {isAuthenticated
              ? activeRoadmap
                ? `You're ${activeRoadmapPercent}% through ${activeRoadmap.career.title}. Pick up right where you left off.`
                : "Your dashboard, recommendations, and saved careers are ready whenever you are."
              : "Personalised roadmaps, skill plans, and data-backed recommendations for Indian students after Class 10, 12, and Graduation."}
          </motion.p>

          <motion.div variants={staggerItem()} className="flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button asChild variant="ink" size="lg">
                  <Link to={activeRoadmap ? `/roadmap/${activeRoadmap.career.id}` : "/dashboard"}>
                    {activeRoadmap ? "Resume roadmap" : "Go to dashboard"}
                    <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button asChild variant="inkOutline" size="lg">
                  <Link to="/careers">Explore careers</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ink" size="lg">
                  <Link to="/register">
                    Start for free
                    <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button asChild variant="inkOutline" size="lg">
                  <Link to="/careers">Browse careers</Link>
                </Button>
              </>
            )}
          </motion.div>
        </div>

        {isAuthenticated && activeRoadmap && (
          <ActiveRoadmapStrip roadmap={activeRoadmap} percent={activeRoadmapPercent} />
        )}

        {!isAuthenticated && (
          <motion.p
            variants={staggerItem()}
            className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-ink-faint"
          >
            No credit card · No sign-up to browse · Free forever
          </motion.p>
        )}
      </Stagger>
    </section>
  );
}
