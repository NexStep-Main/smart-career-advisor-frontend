import {
  Cpu,
  FlaskConical,
  Laptop,
  Palette,
  Scale,
  Stethoscope,
  Theater,
  TrendingUp,
} from "lucide-react";

// Career.domain is free-text (admin-entered, no enum) — these names match the
// values the seeded/admin-created careers actually use, so each link lands on
// a populated Explorer filter rather than an empty result set. `bg` holds the
// full Tailwind class (not a built string) so the compiler can see it.
export const DOMAIN_META = {
  Technology: { icon: Laptop, bg: "bg-grape text-white", tagline: "Build the future" },
  Healthcare: { icon: Stethoscope, bg: "bg-mint text-night", tagline: "Care for people" },
  Arts: { icon: Theater, bg: "bg-bubblegum text-night", tagline: "Tell stories" },
  Commerce: { icon: TrendingUp, bg: "bg-sunny text-night", tagline: "Run the money" },
  Science: { icon: FlaskConical, bg: "bg-sky text-night", tagline: "Ask big questions" },
  Law: { icon: Scale, bg: "bg-tangerine text-night", tagline: "Stand for what's right" },
  Design: { icon: Palette, bg: "bg-bubblegum text-night", tagline: "Make things beautiful" },
  Engineering: { icon: Cpu, bg: "bg-sky text-night", tagline: "Solve real problems" },
};

// Marquee-only extra so the strip has a bit more variety than the seven
// Explorer filters.
export const MARQUEE_DOMAINS = [
  "Technology",
  "Healthcare",
  "Commerce",
  "Science",
  "Arts",
  "Law",
  "Design",
  "Engineering",
];
