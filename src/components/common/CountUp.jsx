import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Counts from 0 up to `value` once the element scrolls into view.
 *
 * Driven by requestAnimationFrame against a real timestamp rather than a
 * fixed per-frame increment, so the duration holds regardless of refresh
 * rate. Re-runs if `value` arrives late (the stats come from an API, so the
 * first render is usually 0/undefined).
 */
export default function CountUp({ value = 0, duration = 1400, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const target = Number(value) || 0;

    // Respect the OS "reduce motion" setting — a zero duration lands on the
    // final value on the very first frame, matching the marquee's behaviour.
    // Still driven through rAF rather than a direct setState here, so the
    // effect body stays free of synchronous state updates.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const effectiveDuration = prefersReduced ? 0 : duration;

    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress =
        effectiveDuration === 0 ? 1 : Math.min((now - start) / effectiveDuration, 1);
      // easeOutExpo — fast start, gentle settle, so the final number reads
      // as "landing" rather than stopping abruptly.
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
