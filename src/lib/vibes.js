import { Brain, Cpu, HeartHandshake, Palette } from "lucide-react";

// "Vibes" describe how a career feels day to day. They mirror the quiz's
// work-style answers so swipes, Skill Lab and the quiz all speak the same
// language. Full class strings (not built ones) so Tailwind can see them.
export const VIBES = {
  analytical: {
    label: "Analytical",
    icon: Brain,
    bg: "bg-sky text-night",
    persona: "The Strategist",
    blurb: "You love patterns, evidence and figuring out why things work.",
  },
  creative: {
    label: "Creative",
    icon: Palette,
    bg: "bg-bubblegum text-night",
    persona: "The Creator",
    blurb: "You light up when you get to imagine and make something new.",
  },
  social: {
    label: "People-person",
    icon: HeartHandshake,
    bg: "bg-mint text-night",
    persona: "The Connector",
    blurb: "You do your best work with and for other people.",
  },
  technical: {
    label: "Hands-on tech",
    icon: Cpu,
    bg: "bg-sunny text-night",
    persona: "The Builder",
    blurb: "You enjoy tools, systems and making things actually work.",
  },
};

// Older / admin-created careers may have no `vibes` — guess from the domain
// so every career still shows up in Swipe and Skill Lab.
const DOMAIN_FALLBACK = {
  Technology: ["technical", "analytical"],
  Healthcare: ["social"],
  Arts: ["creative"],
  Commerce: ["analytical"],
  Science: ["analytical"],
  Law: ["analytical", "social"],
  Design: ["creative"],
};

export function getVibes(career) {
  if (career.vibes?.length) return career.vibes;
  return DOMAIN_FALLBACK[career.domain] ?? ["analytical"];
}
