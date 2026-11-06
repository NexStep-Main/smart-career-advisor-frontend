import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { animate } from "framer-motion";
import { ArrowRight, Lightbulb, ZoomOut } from "lucide-react";
import Button from "@/components/ui/Button";
import { DOMAIN_META } from "@/lib/landingDomains";
import { cn } from "@/lib/utils";

const W = 1000;
const H = 640;
const CX = W / 2;
const CY = H / 2;
const FULL_VIEW = [0, 0, W, H];

const DOMAINS = ["Technology", "Healthcare", "Arts", "Commerce", "Science", "Law", "Design"];
const COLORS = {
  Technology: "#7c3aed",
  Healthcare: "#2dd4a7",
  Arts: "#ff5c8a",
  Commerce: "#ffc933",
  Science: "#38bdf8",
  Law: "#ff8a3d",
  Design: "#e879f9",
};
const MAX_MOONS = 8;

// Deterministic pseudo-random so the star field is the same every render.
function stars(n) {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: rand() * W,
    y: rand() * H,
    r: 0.6 + rand() * 1.5,
    o: 0.25 + rand() * 0.6,
  }));
}
const STARS = stars(70);

function planetLayout() {
  const rx = 355;
  const ry = 215;
  return DOMAINS.map((domain, i) => {
    const a = (-90 + (360 / DOMAINS.length) * i) * (Math.PI / 180);
    return { domain, x: CX + rx * Math.cos(a), y: CY + ry * Math.sin(a) };
  });
}
const LAYOUT = planetLayout();

/** Tween the viewBox between two rectangles (zoom in on a planet / back out). */
function useViewBox() {
  const [vb, setVb] = useState(FULL_VIEW);
  const current = useRef(FULL_VIEW);
  const controls = useRef(null);

  const flyTo = useCallback((target) => {
    controls.current?.stop();
    const from = current.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    controls.current = animate(0, 1, {
      duration: reduce ? 0 : 0.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (t) => {
        const next = from.map((v, i) => v + (target[i] - v) * t);
        current.current = next;
        setVb(next);
      },
    });
  }, []);

  useEffect(() => () => controls.current?.stop(), []);
  return [vb, flyTo];
}

export default function CareerUniverse({ careers, onSuggest }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [vb, flyTo] = useViewBox();

  const byDomain = useMemo(() => {
    const map = Object.fromEntries(DOMAINS.map((d) => [d, []]));
    careers.forEach((c) => map[c.domain]?.push(c));
    return map;
  }, [careers]);

  const focus = (domain) => {
    if (domain === active) return;
    setActive(domain);
    if (!domain) {
      flyTo(FULL_VIEW);
      return;
    }
    const p = LAYOUT.find((l) => l.domain === domain);
    // Wide enough that the longest career label on the left/right still fits.
    const w = 600;
    const h = w * (H / W);
    flyTo([p.x - w / 2, p.y - h / 2, w, h]);
  };

  const activeCareers = active ? byDomain[active] : [];
  const meta = active ? DOMAIN_META[active] : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="relative overflow-hidden rounded-3xl border-2 border-ink bg-night shadow-pop-lg">
        <svg
          viewBox={vb.join(" ")}
          className="block h-auto w-full"
          role="group"
          aria-label="Career universe: each planet is a field, each moon a career"
        >
          <defs>
            <radialGradient id="cu-sun">
              <stop offset="0%" stopColor="#fff6e5" />
              <stop offset="55%" stopColor="#ffc933" />
              <stop offset="100%" stopColor="#ff8a3d" />
            </radialGradient>
            <radialGradient id="cu-glow">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={W} height={H} fill="#1b1640" />
          <circle cx={CX} cy={CY} r="330" fill="url(#cu-glow)" />
          {STARS.map((s) => (
            <circle key={s.id} cx={s.x} cy={s.y} r={s.r} fill="#fff6e5" opacity={s.o} />
          ))}

          {/* Orbit track */}
          <ellipse cx={CX} cy={CY} rx="355" ry="215" fill="none" stroke="#fff6e5" strokeOpacity="0.14" strokeDasharray="4 8" />

          {/* Centre */}
          <circle cx={CX} cy={CY} r="46" fill="url(#cu-sun)" />
          <text x={CX} y={CY - 2} textAnchor="middle" fontSize="15" fontWeight="700" fill="#1b1640" style={{ fontFamily: "Fredoka, sans-serif" }}>
            You are
          </text>
          <text x={CX} y={CY + 16} textAnchor="middle" fontSize="15" fontWeight="700" fill="#1b1640" style={{ fontFamily: "Fredoka, sans-serif" }}>
            here
          </text>

          {LAYOUT.map(({ domain, x, y }) => {
            const list = byDomain[domain];
            const count = list.length;
            const isEmpty = count === 0;
            const r = isEmpty ? 24 : 30 + Math.min(count, 8) * 3;
            const isActive = active === domain;
            const dimmed = active && !isActive;
            const color = COLORS[domain];
            const moons = list.slice(0, MAX_MOONS);

            return (
              <g key={domain} opacity={dimmed ? 0.22 : 1} style={{ transition: "opacity 0.4s" }}>
                {/* Moons: orbiting normally, laid out and labelled when focused. */}
                {moons.map((career, i) => {
                  if (isActive) {
                    const a = ((360 / moons.length) * i - 90) * (Math.PI / 180);
                    const mr = r + 52;
                    const mx = x + mr * Math.cos(a);
                    const my = y + mr * Math.sin(a);
                    const right = Math.cos(a) >= 0;
                    return (
                      <g
                        key={career.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/careers/${career.id}`)}
                        role="link"
                        tabIndex={0}
                        aria-label={career.title}
                        onKeyDown={(e) => e.key === "Enter" && navigate(`/careers/${career.id}`)}
                      >
                        <line x1={x} y1={y} x2={mx} y2={my} stroke={color} strokeOpacity="0.35" />
                        <circle cx={mx} cy={my} r="8" fill={color} stroke="#fff6e5" strokeWidth="2" />
                        <text
                          x={mx + (right ? 14 : -14)}
                          y={my + 4}
                          textAnchor={right ? "start" : "end"}
                          fontSize="12"
                          fontWeight="700"
                          fill="#fff6e5"
                          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                        >
                          {career.title}
                        </text>
                      </g>
                    );
                  }

                  const orbit = r + 16 + (i % 3) * 11;
                  const period = 9 + i * 1.8;
                  return (
                    <g key={career.id}>
                      <circle cx={x} cy={y} r={orbit} fill="none" stroke={color} strokeOpacity="0.18" />
                      <g
                        className="cursor-pointer"
                        onMouseEnter={() => setHovered(career.title)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => navigate(`/careers/${career.id}`)}
                      >
                        <circle cx={x + orbit} cy={y} r="6" fill={color} stroke="#fff6e5" strokeWidth="1.5">
                          <title>{career.title}</title>
                        </circle>
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from={`${(i * 47) % 360} ${x} ${y}`}
                          to={`${((i * 47) % 360) + 360} ${x} ${y}`}
                          dur={`${period}s`}
                          repeatCount="indefinite"
                        />
                      </g>
                    </g>
                  );
                })}

                {/* Planet */}
                <g
                  className="cursor-pointer outline-none"
                  role="button"
                  tabIndex={0}
                  aria-label={`${domain}, ${count} career${count === 1 ? "" : "s"}. Zoom in`}
                  onClick={() => focus(isActive ? null : domain)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && focus(isActive ? null : domain)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={r}
                    fill={isEmpty ? "none" : color}
                    stroke={isEmpty ? color : "#fff6e5"}
                    strokeWidth={isEmpty ? 2.5 : 3}
                    strokeDasharray={isEmpty ? "6 6" : undefined}
                  />
                  {!isEmpty && <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.45} fill="#fff" opacity="0.28" />}
                  {/* Unfocused: label sits below the orbit rings. Focused: it moves
                      inside the planet so it can't collide with the labelled moons. */}
                  <text
                    x={x}
                    y={isActive ? y - 2 : y + r + 50}
                    textAnchor="middle"
                    fontSize={isActive ? 16 : 15}
                    fontWeight="700"
                    fill={isActive ? (domain === "Technology" ? "#fff6e5" : "#1b1640") : "#fff6e5"}
                    style={{ fontFamily: "Fredoka, sans-serif" }}
                  >
                    {domain}
                  </text>
                  <text
                    x={x}
                    y={isActive ? y + 18 : y + r + 66}
                    textAnchor="middle"
                    fontSize="11"
                    fill={isActive ? (domain === "Technology" ? "#fff6e5" : "#1b1640") : "#fff6e5"}
                    opacity={isActive ? 0.85 : 0.7}
                  >
                    {isEmpty ? "unexplored" : `${count} career${count === 1 ? "" : "s"}`}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {hovered && !active && (
          <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full border-2 border-ink bg-sunny px-4 py-1 text-sm font-bold text-night shadow-pop-sm">
            {hovered}
          </div>
        )}

        {active && (
          <button
            type="button"
            onClick={() => focus(null)}
            className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border-2 border-ink bg-surface px-3.5 py-1.5 text-sm font-bold text-ink shadow-pop-sm hover:bg-sunny/40"
          >
            <ZoomOut size={15} />
            Zoom out
          </button>
        )}
      </div>

      {/* Keyboard / touch friendly list + details for the focused field */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Jump to a field">
        {DOMAINS.map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={active === d}
            onClick={() => focus(active === d ? null : d)}
            className={cn(
              "rounded-full border-2 border-ink px-3.5 py-1.5 text-sm font-bold transition-all",
              active === d ? `${DOMAIN_META[d].bg} shadow-pop-sm` : "bg-surface text-ink hover:bg-sunny/30",
            )}
          >
            {d}
          </button>
        ))}
      </div>

      {active ? (
        <div className="rounded-3xl border-2 border-ink bg-surface p-5 shadow-pop">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl font-semibold text-ink">{active}</h3>
              <p className="text-sm text-ink-muted">{meta.tagline}</p>
            </div>
            {activeCareers.length === 0 && (
              <Button variant="sunny" size="sm" onClick={() => onSuggest(active)}>
                <Lightbulb size={15} />
                Request a {active} career
              </Button>
            )}
          </div>
          {activeCareers.length === 0 ? (
            <p className="mt-3 text-sm font-semibold text-ink-muted">
              This planet is unexplored. No careers here yet, so suggest one and help us map it!
            </p>
          ) : (
            <ul className="mt-4 flex flex-wrap gap-2">
              {activeCareers.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/careers/${c.id}`}
                    className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:bg-sunny/30"
                  >
                    {c.title}
                    <ArrowRight size={13} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="text-center text-sm font-semibold text-ink-muted">
          Tap a planet to zoom in. Each moon is a career. Tap one to open it.
        </p>
      )}
    </div>
  );
}
