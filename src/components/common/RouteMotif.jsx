/**
 * Recurring shape language for the landing page: a dashed route line
 * stepping between node markers, ending at a solid "destination" node —
 * the same path/milestone idea as the Logo mark, echoed as a background
 * texture so a screenshot reads as NexStep specifically, not generic SaaS.
 * Purely decorative (aria-hidden); color comes from `currentColor` so it
 * follows whatever text-* class the caller sets, light or dark.
 */
export default function RouteMotif({ className, points }) {
  const pts =
    points ??
    [
      { x: 10, y: 85 },
      { x: 110, y: 30 },
      { x: 220, y: 95 },
      { x: 320, y: 25 },
      { x: 390, y: 60 },
    ];
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const last = pts[pts.length - 1];

  return (
    <svg aria-hidden viewBox="0 0 400 120" fill="none" className={className}>
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="1 9"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      {pts.slice(0, -1).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="currentColor" opacity="0.45" />
      ))}
      <circle cx={last.x} cy={last.y} r="11" fill="currentColor" opacity="0.15" />
      <circle cx={last.x} cy={last.y} r="5" fill="currentColor" />
    </svg>
  );
}
