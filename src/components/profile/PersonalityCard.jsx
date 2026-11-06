import { useState } from "react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { VIBES } from "@/lib/vibes";
import { renderPersonalityCard } from "@/lib/personality";

/** The student's career personality as a sticker card, downloadable as a PNG to share. */
export default function PersonalityCard({ name, personality }) {
  const [busy, setBusy] = useState(false);

  if (!personality) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-ink/40 p-6 text-center">
        <div className="font-display text-lg font-semibold text-ink">Your career personality is a mystery</div>
        <p className="mt-1 text-sm text-ink-muted">Take the quiz or save a few careers and we will work it out.</p>
        <Button asChild variant="ink" size="md" className="mt-4">
          <Link to="/onboarding">Take the quiz</Link>
        </Button>
      </div>
    );
  }

  const vibe = VIBES[personality.vibe];
  const Icon = vibe.icon;

  const download = async () => {
    setBusy(true);
    try {
      const blob = await renderPersonalityCard({ name, personality });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-nexstep-personality.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Couldn't create the image. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className={`rounded-3xl border-2 border-ink p-6 text-center shadow-pop-lg ${vibe.bg}`}>
        <Icon size={38} className="mx-auto" strokeWidth={1.8} />
        <p className="mt-1 font-hand text-2xl">your career personality</p>
        <h3 className="font-display text-4xl font-bold">{personality.persona}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm font-semibold opacity-85">{personality.blurb}</p>
        {(personality.interests.length > 0 || personality.secondary) && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {personality.interests.map((i) => (
              <span key={i} className="rounded-full border-2 border-ink bg-white/60 px-3 py-0.5 text-xs font-bold">
                {i}
              </span>
            ))}
            {personality.secondary && (
              <span className="rounded-full border-2 border-ink bg-white/60 px-3 py-0.5 text-xs font-bold">also {personality.secondary}</span>
            )}
          </div>
        )}
      </div>
      <Button variant="inkOutline" size="md" className="mt-4" onClick={download} disabled={busy}>
        <Download size={16} />
        {busy ? "Making your card…" : "Download as image"}
      </Button>
    </div>
  );
}
