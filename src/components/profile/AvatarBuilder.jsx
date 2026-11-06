import { useState } from "react";
import { Shuffle } from "lucide-react";
import toast from "react-hot-toast";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/ui/Button";
import { AVATAR_ACCESSORIES, AVATAR_COLORS, AVATAR_SHAPES } from "@/lib/avatar";
import useAuthStore from "@/store/useAuthStore";
import { updateProfileRequest } from "@/services/auth";
import { cn } from "@/lib/utils";

const DEFAULT = { shape: "circle", color: "bubblegum", accessory: "none" };
const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

function OptionRow({ label, children }) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-faint">{label}</div>
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </div>
  );
}

/** Build-your-own avatar: shape, colour and accessory with a live preview. */
export default function AvatarBuilder({ user }) {
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const saved = { ...DEFAULT, ...(user?.avatar ?? {}) };
  const [draft, setDraft] = useState(saved);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await updateProfileRequest({ avatar: draft });
      updateProfile(data.data.user);
      toast.success("Looking good! Avatar saved.");
    } catch {
      toast.error("Couldn't save your avatar.");
    } finally {
      setSaving(false);
    }
  };

  const shuffle = () =>
    setDraft({
      shape: pickRandom(Object.keys(AVATAR_SHAPES)),
      color: pickRandom(Object.keys(AVATAR_COLORS)),
      accessory: pickRandom(AVATAR_ACCESSORIES),
    });

  return (
    <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
      <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-ink bg-paper bg-dots px-8 pb-6 pt-10">
        <Avatar name={user?.fullName} avatar={draft} size={96} />
        <button type="button" onClick={shuffle} className="mt-3 flex items-center gap-1.5 rounded-full border-2 border-ink bg-surface px-3 py-1 text-xs font-bold text-ink shadow-pop-sm hover:bg-sunny/40">
          <Shuffle size={13} />
          Surprise me
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <OptionRow label="Shape">
          {Object.keys(AVATAR_SHAPES).map((shape) => (
            <button
              key={shape}
              type="button"
              aria-pressed={draft.shape === shape}
              onClick={() => set("shape", shape)}
              className={cn("rounded-2xl border-2 p-1.5 transition-all", draft.shape === shape ? "border-ink bg-sunny/40 shadow-pop-sm" : "border-transparent hover:border-ink/30")}
              aria-label={`${shape} shape`}
            >
              <Avatar name={user?.fullName} avatar={{ ...draft, shape, accessory: "none" }} size={36} />
            </button>
          ))}
        </OptionRow>

        <OptionRow label="Colour">
          {Object.keys(AVATAR_COLORS).map((color) => (
            <button
              key={color}
              type="button"
              aria-pressed={draft.color === color}
              onClick={() => set("color", color)}
              aria-label={`${color} colour`}
              className={cn("size-9 rounded-full border-2 border-ink transition-transform hover:scale-110", AVATAR_COLORS[color], draft.color === color && "ring-4 ring-sunny")}
            />
          ))}
        </OptionRow>

        <OptionRow label="Accessory">
          {AVATAR_ACCESSORIES.map((accessory) => (
            <button
              key={accessory}
              type="button"
              aria-pressed={draft.accessory === accessory}
              onClick={() => set("accessory", accessory)}
              className={cn(
                "rounded-full border-2 px-3.5 py-1 text-xs font-bold capitalize transition-all",
                draft.accessory === accessory ? "border-ink bg-grape text-white shadow-pop-sm" : "border-ink/40 bg-surface text-ink hover:border-ink hover:bg-sunny/30",
              )}
            >
              {accessory}
            </button>
          ))}
        </OptionRow>

        <Button variant="ink" size="md" className="self-start" onClick={save} disabled={!dirty || saving}>
          {saving ? "Saving…" : "Save avatar"}
        </Button>
      </div>
    </div>
  );
}
