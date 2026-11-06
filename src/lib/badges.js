import { Bookmark, BookmarkCheck, Brain, Flame, Footprints, Rocket, Sparkles, Trophy } from "lucide-react";

export const BADGE_EVENT = "nexstep:new-badges";

// Titles and descriptions come from the API (Backend constants/badges.js is
// the single source of truth). This file only decides how each badge LOOKS.
// Full class strings so Tailwind can see them.
export const BADGE_STYLE = {
  first_quiz: { icon: Brain, bg: "bg-sky" },
  profile_complete: { icon: Sparkles, bg: "bg-bubblegum" },
  first_save: { icon: Bookmark, bg: "bg-mint" },
  five_saves: { icon: BookmarkCheck, bg: "bg-sunny" },
  first_phase: { icon: Footprints, bg: "bg-tangerine" },
  roadmap_done: { icon: Trophy, bg: "bg-grape text-white" },
  streak_3: { icon: Flame, bg: "bg-tangerine" },
  streak_7: { icon: Rocket, bg: "bg-bubblegum" },
};

export const FALLBACK_BADGE_STYLE = { icon: Trophy, bg: "bg-sunny" };
