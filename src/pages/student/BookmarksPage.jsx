import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, X, Bookmark, Map, KanbanSquare, LayoutGrid } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import CareerCard from "@/components/career/CareerCard";
import CareerBoard from "@/components/board/CareerBoard";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import SEOHead from "@/components/common/SEOHead";
import PageHeader from "@/components/common/PageHeader";
import { getBookmarks, removeBookmark, saveBoard, saveNote } from "@/services/bookmarks";
import { cn } from "@/lib/utils";

const VIEWS = [
  { key: "board", label: "Board", icon: KanbanSquare },
  { key: "list", label: "List", icon: LayoutGrid },
];

export default function BookmarksPage() {
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") === "list" ? "list" : "board";
  const queryClient = useQueryClient();

  const { data: careers, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks().then((res) => res.data.data.careers),
  });

  const filtered = useMemo(() => {
    if (!careers) return [];
    const q = search.toLowerCase();
    return careers.filter((c) => c.title.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q));
  }, [careers, search]);

  // Reflect a board change in the cache straight away so Board and List stay in step.
  const applyLayout = (items) =>
    queryClient.setQueryData(["bookmarks"], (old) =>
      old?.map((c) => {
        const it = items.find((i) => i.careerId === c.id);
        return it ? { ...c, tier: it.tier, order: it.order } : c;
      }),
    );

  const boardMutation = useMutation({
    mutationFn: (items) => saveBoard(items),
    onMutate: applyLayout,
    onError: () => {
      toast.error("Couldn't save your board. Please try again.");
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });

  const noteMutation = useMutation({
    mutationFn: ({ id, note }) => saveNote(id, note),
    onMutate: ({ id, note }) =>
      queryClient.setQueryData(["bookmarks"], (old) => old?.map((c) => (c.id === id ? { ...c, note } : c))),
    onError: () => toast.error("Couldn't save that note."),
  });

  const removeMutation = useMutation({
    mutationFn: (id) => removeBookmark(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
    onError: () => toast.error("Couldn't remove that career."),
  });

  const setView = (key) =>
    setSearchParams((params) => {
      if (key === "board") params.delete("view");
      else params.set("view", key);
      return params;
    });

  // Re-mount the board only when the saved set itself changes (added or
  // removed elsewhere), not on every drag, so dragging never fights a refetch.
  const boardKey = (careers ?? []).map((c) => c.id).sort().join(",");

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="Saved Careers" />

      <PageHeader
        eyebrow="Library"
        title="Saved Careers"
        subtitle={
          isLoading
            ? "Loading…"
            : view === "board"
              ? "Drag careers into Dream, Maybe and Backup to make your shortlist. Add a note to remember why."
              : `${careers?.length ?? 0} career${careers?.length === 1 ? "" : "s"} saved for later.`
        }
        action={
          careers?.length > 0 && (
            <div role="tablist" aria-label="Saved view" className="flex gap-2">
              {VIEWS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={view === key}
                  onClick={() => setView(key)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 text-sm font-bold transition-all",
                    view === key ? "bg-ink text-paper shadow-pop-sm" : "bg-surface text-ink hover:bg-sunny/30",
                  )}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          )
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : careers?.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved careers yet"
          description="Explore careers or swipe through them and save the ones you like. They will show up here, ready to sort."
          action={
            <Button asChild variant="ink" size="md">
              <Link to="/careers">
                <Map size={15} />
                Explore careers
              </Link>
            </Button>
          }
        />
      ) : view === "board" ? (
        <CareerBoard
          key={boardKey}
          careers={careers}
          onSave={(items) => boardMutation.mutate(items)}
          onNote={(id, note) => noteMutation.mutate({ id, note })}
          onRemove={(id) => removeMutation.mutate(id)}
        />
      ) : (
        <>
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              placeholder="Search saved careers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-full border-2 border-ink bg-surface pl-10 pr-9 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-4 focus:ring-grape/25"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink">
                <X size={14} />
              </button>
            )}
          </div>
          {filtered.length === 0 ? (
            <EmptyState icon={Search} title="No results" description="Try a different search term." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((career) => (
                <CareerCard key={career.id} career={career} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
