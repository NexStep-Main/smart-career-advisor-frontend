import Marquee from "@/components/common/Marquee";

// Real domains — these are the values seeded Career documents actually use
// (same list the Explorer filters by), not invented partner logos. Nothing
// here claims an endorsement the project doesn't have.
const DOMAINS = [
  "Technology",
  "Healthcare",
  "Commerce",
  "Science",
  "Arts",
  "Law",
  "Design",
  "Engineering",
];

export default function MarqueeSection() {
  return (
    <section aria-label="Career domains covered" className="border-b border-rule py-8">
      <Marquee items={DOMAINS} duration={45} />
    </section>
  );
}
