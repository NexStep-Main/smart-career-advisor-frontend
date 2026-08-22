import { useId, useMemo, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Multi-value tag/chip input with autocomplete against `suggestions` — the
 * values already in the DB for that field (see admin/careers/tag-values).
 * Replaces the old comma-separated text inputs (Streams/Skills/Top
 * colleges), which let the same value fragment across careers as
 * differently-cased/spaced free text with no way to notice.
 */
export default function TagInput({
  value = [],
  onChange,
  suggestions = [],
  placeholder,
  error,
  id,
}) {
  const [inputValue, setInputValue] = useState("");
  const [highlight, setHighlight] = useState(0);
  const [open, setOpen] = useState(false);
  const reactId = useId();
  const inputId = id ?? reactId;

  const normalized = new Set(value.map((v) => v.toLowerCase()));
  const filteredSuggestions = useMemo(() => {
    const query = inputValue.trim().toLowerCase();
    return suggestions
      .filter((s) => !normalized.has(s.toLowerCase()))
      .filter((s) => (query ? s.toLowerCase().includes(query) : true))
      .slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestions, inputValue, value]);

  const addTag = (raw) => {
    const tag = raw.trim();
    if (!tag) return;
    if (normalized.has(tag.toLowerCase())) {
      setInputValue("");
      return;
    }
    onChange([...value, tag]);
    setInputValue("");
    setHighlight(0);
  };

  const removeTag = (tag) => onChange(value.filter((v) => v !== tag));

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && (!open || filteredSuggestions.length === 0)) {
      e.preventDefault();
      addTag(inputValue);
      return;
    }
    if (e.key === "Enter" && open && filteredSuggestions.length > 0) {
      e.preventDefault();
      addTag(filteredSuggestions[highlight]);
      return;
    }
    if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
      return;
    }
    if (e.key === "ArrowDown" && open) {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filteredSuggestions.length - 1));
      return;
    }
    if (e.key === "ArrowUp" && open) {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
      return;
    }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-lg border bg-surface px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-primary/30",
          error ? "border-red-400 focus-within:border-red-400" : "border-border focus-within:border-primary",
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-md bg-admin-accent-light px-2 py-1 text-xs font-medium text-admin-accent-dark"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="text-admin-accent-dark/60 hover:text-admin-accent-dark"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          id={inputId}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // Let a suggestion's onMouseDown fire (it runs before blur)
            // before the dropdown disappears — otherwise the click never
            // lands because the list is already gone.
            setTimeout(() => setOpen(false), 100);
          }}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-24 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-50"
        />
      </div>

      {open && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg">
          {filteredSuggestions.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={() => addTag(s)}
                className={cn(
                  "block w-full px-3 py-1.5 text-left text-sm",
                  i === highlight
                    ? "bg-admin-accent-light text-admin-accent-dark"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60",
                )}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
