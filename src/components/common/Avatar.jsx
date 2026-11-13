import { Crown, GraduationCap, Glasses, Headphones, Sparkles } from "lucide-react";
import { AVATAR_COLORS, AVATAR_SHAPES } from "@/lib/avatar";
import { cn } from "@/lib/utils";

// Where each accessory sits, as classes relative to the avatar box.
const ACCESSORY = {
  glasses: { icon: Glasses, pos: "left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2", scale: 0.62 },
  crown: { icon: Crown, pos: "left-1/2 -top-[30%] -translate-x-1/2", scale: 0.55 },
  headphones: { icon: Headphones, pos: "left-1/2 -top-[22%] -translate-x-1/2", scale: 0.8 },
  cap: { icon: GraduationCap, pos: "left-1/2 -top-[30%] -translate-x-1/2", scale: 0.7 },
  sparkles: { icon: Sparkles, pos: "-right-[18%] -top-[18%]", scale: 0.42 },
};

/**
 * Profile avatar: a coloured shape with the student's initial and an optional
 * accessory. Entirely generated from a tiny choice object (see User.avatar),
 * so there are no uploads to store or moderate.
 */
export default function Avatar({ name = "S", avatar, size = 36, className }) {
  const { shape = "circle", color = "bubblegum", accessory = "none" } = avatar ?? {};
  const acc = ACCESSORY[accessory];
  const AccIcon = acc?.icon;
  const initial = (name ?? "S").trim().charAt(0).toUpperCase() || "S";

  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className={cn(
          "flex size-full items-center justify-center border-2 border-ink font-display font-bold",
          AVATAR_COLORS[color] ?? AVATAR_COLORS.bubblegum,
          AVATAR_SHAPES[shape] ?? AVATAR_SHAPES.circle,
        )}
        style={{ fontSize: size * 0.45 }}
      >
        <span className={shape === "diamond" ? "-rotate-45" : ""}>{initial}</span>
      </span>
      {AccIcon && (
        <span className={cn("pointer-events-none absolute text-ink", acc.pos)}>
          <AccIcon size={Math.round(size * acc.scale)} strokeWidth={2.4} />
        </span>
      )}
    </span>
  );
}
