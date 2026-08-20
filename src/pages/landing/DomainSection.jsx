import { Link } from "react-router-dom";
import FadeIn from "@/components/common/FadeIn";
import EditorialHeading from "@/components/common/EditorialHeading";

// Career.domain is free-text (admin-entered, no enum) — these match the
// values the seeded/admin-created careers actually use, so each link lands
// on a populated Explorer filter rather than an empty result set.
const DOMAINS = [
  "Technology",
  "Healthcare",
  "Arts",
  "Commerce",
  "Science",
  "Law",
  "Design",
];

/** Typographic domain index → filters the Career Explorer. */
export default function DomainSection() {
  return (
    <section className="border-b border-rule px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="mb-16">
          <EditorialHeading
            index="§ 03"
            eyebrow="Browse by domain"
            title="Seven fields. Dozens of paths."
          />
        </FadeIn>

        <div>
          {DOMAINS.map((domain, i) => (
            <FadeIn key={domain} delay={i * 0.05}>
              <Link
                to={`/careers?domain=${domain}`}
                className="group flex items-baseline justify-between gap-6 border-b border-rule py-5 first:border-t first:border-rule"
              >
                <span className="flex items-baseline gap-6">
                  <span className="font-mono text-xs text-ink-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-4xl leading-tight text-ink transition-all duration-300 group-hover:translate-x-2 group-hover:italic sm:text-6xl">
                    {domain}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-xs uppercase tracking-[0.18em] text-ink-faint opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2} className="mt-10">
          <Link
            to="/careers"
            className="font-mono text-xs uppercase tracking-[0.2em] text-ink underline underline-offset-8 transition-opacity hover:opacity-60"
          >
            View all careers
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
