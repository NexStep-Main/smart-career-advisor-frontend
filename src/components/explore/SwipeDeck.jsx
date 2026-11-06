import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Heart, RotateCcw, Undo2, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { DOMAIN_META } from "@/lib/landingDomains";
import { VIBES, getVibes } from "@/lib/vibes";
import useSwipeStore from "@/store/useSwipeStore";
import useAuthStore from "@/store/useAuthStore";

const SWIPE_DISTANCE = 110; // px dragged before a release counts as a decision
const SWIPE_VELOCITY = 500;

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Visual face of a career card — shared by the live card and the ones queued behind it. */
function CardFace({ career }) {
  const meta = DOMAIN_META[career.domain] ?? DOMAIN_META.Technology;
  const Icon = meta.icon;
  const vibes = getVibes(career);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border-2 border-ink bg-surface shadow-pop-lg">
      <div className={`relative flex h-40 items-center justify-center border-b-2 border-ink ${meta.bg}`}>
        <Icon size={72} strokeWidth={1.6} className="opacity-90" />
        <span className="absolute left-4 top-4 rounded-full border-2 border-night/70 bg-white/30 px-3 py-1 text-xs font-bold text-night">
          {career.domain}
        </span>
        <span className="absolute right-4 top-4 rounded-full border-2 border-night/70 bg-white/30 px-3 py-1 text-xs font-bold capitalize text-night">
          {career.demandLevel} demand
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-2xl font-semibold leading-tight text-ink">{career.title}</h3>
        <p className="text-sm font-bold text-grape dark:text-primary">{career.salaryRange}</p>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-muted">{career.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {vibes.map((v) => (
            <span key={v} className={`rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-bold ${VIBES[v].bg}`}>
              {VIBES[v].label}
            </span>
          ))}
        </div>

        {career.funFact && (
          <p className="mt-auto rounded-2xl border-2 border-dashed border-ink/40 bg-sunny/20 px-3 py-2 text-xs font-semibold text-ink">
            <span className="font-hand text-base">fun fact: </span>
            {career.funFact}
          </p>
        )}
      </div>
    </div>
  );
}

/** The top card — draggable, tilts as you drag, stamps LIKE / NOPE. */
function TopCard({ career, onDecide, flingRef }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 0, 250], [-14, 0, 14]);
  const likeOpacity = useTransform(x, [20, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-110, -20], [1, 0]);

  const fling = useCallback(
    (dir) => {
      animate(x, dir === "like" ? 700 : -700, { duration: 0.28, ease: "easeIn" }).then(() => onDecide(dir));
    },
    [x, onDecide],
  );

  // The buttons below call this via flingRef, so a click animates exactly
  // like a drag; arrow keys do the same.
  useEffect(() => {
    flingRef.current = fling;
    return () => {
      flingRef.current = null;
    };
  }, [fling, flingRef]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") fling("like");
      if (e.key === "ArrowLeft") fling("pass");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fling]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      style={{ x, rotate }}
      onDragEnd={(_, info) => {
        if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) fling("like");
        else if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) fling("pass");
        else animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
      }}
      className="absolute inset-0 z-20 cursor-grab touch-pan-y select-none active:cursor-grabbing"
    >
      <CardFace career={career} />
      <motion.div
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute left-6 top-24 -rotate-12 rounded-xl border-4 border-mint px-3 py-1 font-display text-3xl font-bold text-mint"
      >
        LIKE
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="pointer-events-none absolute right-6 top-24 rotate-12 rounded-xl border-4 border-bubblegum px-3 py-1 font-display text-3xl font-bold text-bubblegum"
      >
        NOPE
      </motion.div>
      {/* Exposed so a pointer-less user can still open the full page. */}
      <Link
        to={`/careers/${career.id}`}
        onPointerDownCapture={(e) => e.stopPropagation()}
        className="absolute bottom-3 right-4 rounded-full bg-surface/90 px-3 py-1 text-xs font-bold text-grape underline dark:text-primary"
      >
        Full details
      </Link>
    </motion.div>
  );
}

function ResultSummary({ careers, onRestart }) {
  const liked = useSwipeStore((s) => s.liked);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const picks = careers.filter((c) => liked.includes(c.id));

  // Personality = the vibe that shows up most across the careers you liked.
  const tally = {};
  picks.forEach((c) => getVibes(c).forEach((v) => (tally[v] = (tally[v] ?? 0) + 1)));
  const topVibe = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0];

  if (picks.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border-2 border-ink bg-surface p-8 text-center shadow-pop">
        <h3 className="font-display text-2xl font-semibold text-ink">Nothing caught your eye?</h3>
        <p className="mt-2 text-sm text-ink-muted">
          That is useful too. Try the Skill Lab to start from what you are good at instead.
        </p>
        <Button variant="ink" className="mt-6" onClick={onRestart}>
          <RotateCcw size={16} />
          Swipe again
        </Button>
      </div>
    );
  }

  const persona = VIBES[topVibe];

  return (
    <div className="mx-auto max-w-xl">
      <div className={`rounded-3xl border-2 border-ink p-6 text-center shadow-pop-lg ${persona.bg}`}>
        <persona.icon size={40} className="mx-auto" strokeWidth={1.8} />
        <p className="mt-2 font-hand text-2xl">your career personality</p>
        <h3 className="font-display text-4xl font-bold">{persona.persona}</h3>
        <p className="mt-2 text-sm font-semibold opacity-80">{persona.blurb}</p>
      </div>

      <h4 className="mb-3 mt-8 font-display text-lg font-semibold text-ink">
        Your {picks.length} pick{picks.length === 1 ? "" : "s"}
      </h4>
      <ul className="flex flex-col gap-2.5">
        {picks.map((c) => (
          <li key={c.id}>
            <Link
              to={`/careers/${c.id}`}
              className="flex items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-surface p-3.5 shadow-pop-sm transition-all hover:-translate-y-0.5 hover:shadow-pop"
            >
              <span className="min-w-0">
                <span className="block truncate font-bold text-ink">{c.title}</span>
                <span className="block text-xs text-ink-muted">
                  {c.domain} · {c.salaryRange}
                </span>
              </span>
              <ArrowRight size={16} className="shrink-0 text-ink-muted" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {isAuthenticated ? (
          <p className="text-sm font-semibold text-ink-muted">Saved to your bookmarks automatically.</p>
        ) : (
          <Button asChild variant="ink">
            <Link to="/register">
              Create an account to keep these
              <ArrowRight size={16} />
            </Link>
          </Button>
        )}
        <Button variant="inkOutline" onClick={onRestart}>
          <RotateCcw size={16} />
          Swipe again
        </Button>
      </div>
      {!isAuthenticated && (
        <p className="mt-3 text-xs text-ink-faint">
          Your picks are saved on this device and will be added to your account when you sign up.
        </p>
      )}
    </div>
  );
}

export default function SwipeDeck({ careers }) {
  const swipe = useSwipeStore((s) => s.swipe);
  const undo = useSwipeStore((s) => s.undo);
  const reset = useSwipeStore((s) => s.reset);
  const seen = useSwipeStore((s) => s.history.length);

  // Fixed order for this session: unseen careers shuffled once on mount.
  const [queue, setQueue] = useState(() => {
    const { liked, passed } = useSwipeStore.getState();
    const done = new Set([...liked, ...passed]);
    const fresh = careers.filter((c) => !done.has(c.id));
    return shuffle(fresh.length > 0 ? fresh : careers);
  });
  const [index, setIndex] = useState(0);
  const flingRef = useRef(null);

  const decide = useCallback(
    (dir) => {
      const career = queue[index];
      if (!career) return;
      swipe(career.id, dir);
      setIndex((i) => i + 1);
    },
    [queue, index, swipe],
  );

  const handleUndo = () => {
    const last = undo();
    if (last) setIndex((i) => Math.max(0, i - 1));
  };

  const restart = () => {
    reset();
    setQueue(shuffle(careers));
    setIndex(0);
  };

  const remaining = queue.length - index;
  const stack = useMemo(() => queue.slice(index, index + 3), [queue, index]);

  if (remaining <= 0) {
    return <ResultSummary careers={careers} onRestart={restart} />;
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center">
      <p className="mb-4 text-sm font-semibold text-ink-muted">
        {index + 1} of {queue.length} · drag the card, or use the buttons / arrow keys
      </p>

      <div className="relative h-[27rem] w-full">
        {/* Queued cards sit behind, scaled down, so the pile feels real. */}
        {stack
          .slice(1)
          .reverse()
          .map((career, i, arr) => {
            const depth = arr.length - i; // 2 = furthest back
            return (
              <div
                key={career.id}
                aria-hidden
                className="absolute inset-0 transition-transform duration-300"
                style={{ transform: `translateY(${depth * 12}px) scale(${1 - depth * 0.04})`, zIndex: 10 - depth }}
              >
                <CardFace career={career} />
              </div>
            );
          })}
        <TopCard key={stack[0].id} career={stack[0]} onDecide={decide} flingRef={flingRef} />
      </div>

      <div className="mt-10 flex items-center gap-5">
        <button
          onClick={() => flingRef.current?.("pass")}
          aria-label="Skip this career"
          className="flex size-16 items-center justify-center rounded-full border-2 border-ink bg-surface text-bubblegum shadow-pop transition-all hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-y-0.5 active:shadow-none"
        >
          <X size={30} strokeWidth={3} />
        </button>
        <button
          onClick={handleUndo}
          disabled={seen === 0 || index === 0}
          aria-label="Undo last swipe"
          className="flex size-11 items-center justify-center rounded-full border-2 border-ink bg-surface text-ink-muted shadow-pop-sm transition-all hover:bg-sunny/40 disabled:opacity-40"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={() => flingRef.current?.("like")}
          aria-label="I like this career"
          className="flex size-16 items-center justify-center rounded-full border-2 border-ink bg-mint text-night shadow-pop transition-all hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-y-0.5 active:shadow-none"
        >
          <Heart size={28} strokeWidth={2.6} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
