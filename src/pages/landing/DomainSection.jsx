import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";
import EditorialHeading from "@/components/common/EditorialHeading";
import Button from "@/components/ui/Button";
import { DOMAIN_META } from "@/lib/landingDomains";
import { getPublicStats } from "@/services/publicStats";

// Career.domain is free-text (admin-entered, no enum) — these match the
// values the seeded/admin-created careers actually use, so each link lands
// on a populated Explorer filter rather than an empty result set.
const DOMAINS = ["Technology", "Healthcare", "Arts", "Commerce", "Science", "Law", "Design"];

const TILTS = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

/** Colourful domain tiles → each filters the Career Explorer. */
export default function DomainSection() {
  // Shares StatsSection's query key, so no extra request.
  const { data } = useQuery({
    queryKey: ["publicStats"],
    queryFn: () => getPublicStats().then((res) => res.data.data),
  });
  const counts = data?.domainCounts;

  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <EditorialHeading
            align="center"
            tone="mint"
            eyebrow="Browse by domain"
            title="Seven fields. Dozens of paths."
            subtitle="Pick whatever sparks your curiosity — you can always change your mind."
          />
        </FadeIn>

        <div className="mt-14 grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-4">
          {DOMAINS.map((domain, i) => {
            const { icon: Icon, bg, tagline } = DOMAIN_META[domain];
            const count = counts?.[domain];
            // Only claim "coming soon" once we actually know the counts.
            const comingSoon = counts !== undefined && !count;
            return (
              <FadeIn key={domain} delay={i * 0.05}>
                <Link
                  to={`/careers?domain=${domain}`}
                  className={`group flex h-full flex-col justify-between rounded-3xl border-2 border-ink p-5 shadow-pop transition-all duration-300 hover:-translate-y-1.5 hover:rotate-0 hover:shadow-pop-lg sm:p-6 ${bg} ${TILTS[i]} ${comingSoon ? "opacity-70 saturate-75" : ""}`}
                >
                  <Icon
                    size={38}
                    strokeWidth={2.1}
                    className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                  />
                  <div className="mt-8">
                    <div className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
                      {domain}
                    </div>
                    <div className="mt-1 text-sm font-semibold opacity-80">{tagline}</div>
                    {counts !== undefined && (
                      <span className="mt-3 inline-block rounded-full border-2 border-night/70 px-2.5 py-0.5 text-xs font-bold">
                        {comingSoon ? "Coming soon" : `${count} career${count === 1 ? "" : "s"}`}
                      </span>
                    )}
                  </div>
                </Link>
              </FadeIn>
            );
          })}

          {/* Eighth tile — the "see everything" call to action. */}
          <FadeIn delay={0.35}>
            <Link
              to="/careers"
              className="group flex h-full min-h-40 flex-col items-start justify-between rounded-3xl border-2 border-dashed border-ink bg-surface p-5 transition-colors hover:bg-sunny/30 sm:p-6"
            >
              <ArrowRight
                size={34}
                className="text-ink transition-transform duration-300 group-hover:translate-x-2"
              />
              <div className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                See all careers
              </div>
            </Link>
          </FadeIn>
        </div>

        <FadeIn delay={0.2} className="mt-12 flex justify-center">
          <Button asChild variant="inkOutline" size="lg">
            <Link to="/careers">
              Explore every career
              <ArrowRight size={18} />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
