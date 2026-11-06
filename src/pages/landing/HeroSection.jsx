import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Compass, Sparkles, Star } from "lucide-react";
import Button from "@/components/ui/Button";
import { Stagger } from "@/components/common/FadeIn";
import { staggerItem } from "@/lib/motion";
import { DOMAIN_META } from "@/lib/landingDomains";
import useAuthStore from "@/store/useAuthStore";
import { getAllProgress } from "@/services/roadmapProgress";

/**
 * Returning-user strip — real roadmap progress from the API, drawn as a
 * chunky card with a thick progress bar instead of a hairline.
 */
function ActiveRoadmapStrip({ roadmap, percent }) {
  const { career, completedPhases, totalPhases } = roadmap;

  return (
    <motion.div
      variants={staggerItem()}
      className="mt-10 w-full max-w-xl rounded-3xl border-2 border-ink bg-surface p-5 shadow-pop"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-grape dark:text-primary">
            Your active roadmap
          </div>
          <div className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
            {career.title}
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-4xl font-bold leading-none text-ink">{percent}%</div>
          <div className="mt-1 text-xs font-semibold text-ink-muted">
            {completedPhases.length}/{totalPhases} phases
          </div>
        </div>
      </div>
      <div className="mt-4 h-4 w-full overflow-hidden rounded-full border-2 border-ink bg-paper">
        <div
          className="h-full rounded-full bg-mint transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
    </motion.div>
  );
}

const QUIZ_OPTIONS = [
  { label: "Solving puzzles", domain: "Science", active: false },
  { label: "Designing things", domain: "Design", active: true },
  { label: "Helping people", domain: "Healthcare", active: false },
];

/** One floating domain sticker around the quiz card. */
function Floating({ domain, className, delay = "0s", rotate = "0deg" }) {
  const { icon: Icon, bg } = DOMAIN_META[domain];
  return (
    <div
      className={`animate-float absolute flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 text-sm font-bold shadow-pop-sm ${bg} ${className}`}
      style={{ animationDelay: delay, "--r": rotate }}
    >
      <Icon size={18} strokeWidth={2.4} />
      {domain}
    </div>
  );
}

/**
 * Decorative hero illustration — a mock quiz card surrounded by floating
 * domain stickers. Pure presentation (aria-hidden): it previews the product
 * without claiming any real data.
 */
function HeroArt() {
  return (
    <div aria-hidden className="relative mx-auto h-[26rem] w-full max-w-md sm:h-[30rem]">
      {/* Backdrop blob */}
      <div className="absolute inset-x-6 inset-y-8 rotate-3 rounded-[3rem] border-2 border-ink bg-sunny/70 dark:bg-sunny/25" />

      {/* Quiz card */}
      <div className="absolute inset-x-4 top-14 -rotate-2 rounded-3xl border-2 border-ink bg-surface p-5 shadow-pop-lg sm:inset-x-6 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-grape px-3 py-1 text-xs font-bold text-white">
            Question 2 of 5
          </span>
          <Compass size={20} className="text-grape dark:text-primary" />
        </div>
        <p className="mt-4 font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">
          What could you do for hours without getting bored?
        </p>
        <div className="mt-4 flex flex-col gap-2.5">
          {QUIZ_OPTIONS.map((o) => (
            <div
              key={o.label}
              className={`flex items-center justify-between rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold ${
                o.active
                  ? "border-ink bg-bubblegum text-night shadow-pop-sm"
                  : "border-rule bg-paper text-ink-muted"
              }`}
            >
              {o.label}
              {o.active && <Star size={16} fill="currentColor" />}
            </div>
          ))}
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full border-2 border-ink bg-paper">
          <div className="h-full w-2/5 rounded-full bg-mint" />
        </div>
      </div>

      {/* Floating domain stickers */}
      <Floating domain="Technology" className="-left-2 top-2 sm:-left-6" rotate="-6deg" />
      <Floating domain="Healthcare" className="-right-2 top-[12.75rem] sm:-right-6" delay="0.8s" rotate="5deg" />
      <Floating domain="Law" className="-left-1 bottom-10 sm:-left-8" delay="1.6s" rotate="4deg" />
      <Floating domain="Commerce" className="-right-1 bottom-2 sm:-right-4" delay="2.4s" rotate="-5deg" />

      {/* Spinning "free" badge */}
      <div className="absolute -top-2 right-4 flex size-20 items-center justify-center sm:right-10">
        <div className="animate-spin-slow absolute inset-0 rounded-full border-2 border-dashed border-ink bg-tangerine" />
        <span className="relative font-display text-lg font-bold leading-none text-night">
          100%
          <br />
          free
        </span>
      </div>

      <Sparkles
        size={26}
        className="animate-wiggle absolute bottom-24 left-1/2 text-grape dark:text-primary"
      />
    </div>
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
    <section className="bg-dots relative overflow-hidden px-6 pb-20 pt-32 sm:pb-28 sm:pt-40">
      {/* Soft colour blobs behind the content. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 size-96 rounded-full bg-grape/20 blur-3xl" />
        <div className="absolute -right-20 top-40 size-96 rounded-full bg-bubblegum/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-sunny/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <Stagger>
          <motion.div
            variants={staggerItem()}
            className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-surface px-4 py-1.5 text-sm font-bold text-ink shadow-pop-sm"
          >
            <span className="size-2.5 rounded-full bg-mint" />
            {isAuthenticated ? "Welcome back" : "Career guidance for Class 10, 12 & College"}
          </motion.div>

          {isAuthenticated ? (
            <motion.h1
              variants={staggerItem()}
              className="font-display text-[2.5rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl"
            >
              {firstName ? (
                <>
                  Hey {firstName},
                  <br />
                  <span className="text-grape dark:text-primary">ready to level up?</span>
                </>
              ) : (
                <>
                  Hey there,
                  <br />
                  <span className="text-grape dark:text-primary">ready to level up?</span>
                </>
              )}
            </motion.h1>
          ) : (
            <motion.h1
              variants={staggerItem()}
              className="font-display text-[2.5rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl"
            >
              Find a career that{" "}
              <span className="relative inline-block whitespace-nowrap text-grape dark:text-primary">
                feels like you
                <svg
                  aria-hidden
                  viewBox="0 0 300 14"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-3 w-full text-sunny"
                  fill="none"
                >
                  <path
                    d="M3 9 C 50 2, 90 13, 150 7 S 250 3, 297 9"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </motion.h1>
          )}

          <motion.p
            variants={staggerItem()}
            className="mt-8 max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg"
          >
            {isAuthenticated
              ? activeRoadmap
                ? `You're ${activeRoadmapPercent}% through ${activeRoadmap.career.title}. Pick up right where you left off.`
                : "Your dashboard, recommendations, and saved careers are ready whenever you are."
              : "Not sure what to do after school? Take a fun 5-minute quiz, explore real careers, and get a step-by-step roadmap built just for you."}
          </motion.p>

          <motion.div variants={staggerItem()} className="mt-8 flex flex-wrap items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button asChild variant="ink" size="lg">
                  <Link to={activeRoadmap ? `/roadmap/${activeRoadmap.career.id}` : "/dashboard"}>
                    {activeRoadmap ? "Resume roadmap" : "Go to dashboard"}
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild variant="inkOutline" size="lg">
                  <Link to="/careers">Explore careers</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ink" size="lg">
                  <Link to="/onboarding">
                    Take the 5-min quiz
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild variant="inkOutline" size="lg">
                  <Link to="/careers">Browse careers</Link>
                </Button>
              </>
            )}
          </motion.div>

          {isAuthenticated && activeRoadmap && (
            <ActiveRoadmapStrip roadmap={activeRoadmap} percent={activeRoadmapPercent} />
          )}

          {!isAuthenticated && (
            <motion.ul
              variants={staggerItem()}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink-muted"
            >
              {["No credit card", "Browse without signing up", "Free forever"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full border-2 border-ink bg-mint text-[10px] font-bold text-night">
                    ✓
                  </span>
                  {t}
                </li>
              ))}
            </motion.ul>
          )}
        </Stagger>

        <HeroArt />
      </div>
    </section>
  );
}
