import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Marquee from "@/components/common/Marquee";
import { getPublicStats } from "@/services/publicStats";
import { DOMAIN_META, MARQUEE_DOMAINS } from "@/lib/landingDomains";

// Real domains — the values seeded Career documents actually use (same list
// the Explorer filters by), not invented partner logos. Nothing here claims
// an endorsement the project doesn't have.
function DomainChip(name, hasCareers) {
  const { icon: Icon, bg } = DOMAIN_META[name];
  const className = `inline-flex items-center gap-2.5 rounded-full border-2 border-night px-5 py-2.5 font-display text-xl font-semibold shadow-[3px_3px_0_0_#1b1640] ${bg}`;
  const content = (
    <>
      <Icon size={20} strokeWidth={2.4} />
      {name}
    </>
  );

  // Chips are links only when that domain really has careers to show.
  return hasCareers ? (
    <Link
      to={`/careers?domain=${name}`}
      className={`${className} transition-transform hover:-translate-y-0.5 hover:scale-105`}
    >
      {content}
    </Link>
  ) : (
    <span className={className}>{content}</span>
  );
}

/** Slightly tilted ribbon of domain chips running between hero and stats. */
export default function MarqueeSection() {
  const { data } = useQuery({
    queryKey: ["publicStats"],
    queryFn: () => getPublicStats().then((res) => res.data.data),
  });
  const counts = data?.domainCounts;

  return (
    <section aria-label="Career domains covered" className="relative overflow-hidden py-10">
      <div className="-rotate-1 scale-105 border-y-2 border-ink bg-night py-5">
        <Marquee items={MARQUEE_DOMAINS} duration={45} renderItem={(name) => DomainChip(name, Boolean(counts?.[name]))} />
      </div>
    </section>
  );
}
