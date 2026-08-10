import { Link } from "react-router-dom";
import FadeIn from "@/components/common/FadeIn";
import SectionHeading from "@/components/common/SectionHeading";
import DomainBadge from "@/components/career/DomainBadge";

const DOMAINS = ["tech", "healthcare", "arts", "commerce", "science", "law", "design"];

/** Clickable domain chip row → filters the Career Explorer. Guide § Landing Page. */
export default function DomainSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Browse by domain" title="Explore careers by field" />

        <FadeIn className="flex flex-wrap justify-center gap-3">
          {DOMAINS.map((domain) => (
            <Link key={domain} to={`/careers?domain=${domain}`}>
              <DomainBadge
                domain={domain}
                className="cursor-pointer px-4 py-2 text-sm capitalize transition-transform hover:scale-105"
              />
            </Link>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
