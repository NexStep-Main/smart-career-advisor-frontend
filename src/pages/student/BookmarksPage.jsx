import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Bookmark, Map } from "lucide-react";
import { Link } from "react-router-dom";
import CareerCard from "@/components/career/CareerCard";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import SEOHead from "@/components/common/SEOHead";
import { getBookmarks } from "@/services/bookmarks";

export default function BookmarksPage() {
  const [search, setSearch] = useState("");

  const { data: careers, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getBookmarks().then((res) => res.data.data.careers),
  });

  const filtered = useMemo(() => {
    if (!careers) return [];
    const q = search.toLowerCase();
    return careers.filter(
      (c) => c.title.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q),
    );
  }, [careers, search]);

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="Saved Careers" />

      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-50">
          Saved Careers
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isLoading
            ? "Loading…"
            : `${careers?.length ?? 0} career${careers?.length === 1 ? "" : "s"} saved for later.`}
        </p>
      </div>

      {!isLoading && careers?.length > 0 && (
        <div className="relative max-w-sm">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <input
            type="text"
            placeholder="Search saved careers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-surface pl-10 pr-9 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

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
          description="Explore career paths and save the ones you like — they'll show up here for quick access."
          action={
            <Button asChild size="sm">
              <Link to="/careers">
                <Map size={15} />
                Explore Careers
              </Link>
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="No results" description="Try a different search term." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>
      )}
    </div>
  );
}
