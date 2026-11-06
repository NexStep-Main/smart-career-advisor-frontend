import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Filter, LayoutGrid, Layers, FlaskConical, Dices, Orbit, BarChart3, Lightbulb } from "lucide-react";
import CareerCard from "@/components/career/CareerCard";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import Pagination from "@/components/common/Pagination";
import SEOHead from "@/components/common/SEOHead";
import SwipeDeck from "@/components/explore/SwipeDeck";
import SkillLab from "@/components/explore/SkillLab";
import SpinWheel from "@/components/explore/SpinWheel";
import CareerUniverse from "@/components/explore/CareerUniverse";
import SalaryRace from "@/components/explore/SalaryRace";
import Wishlist from "@/components/explore/Wishlist";
import useAllCareers from "@/hooks/useAllCareers";
import { cn } from "@/lib/utils";
import { getCareers } from "@/services/careers";

// Ways to explore the same catalogue. `view` lives in the URL so a view is
// linkable and survives refresh / back-forward.
const VIEWS = [
  { key: "grid", label: "Browse", icon: LayoutGrid },
  { key: "swipe", label: "Swipe", icon: Layers },
  { key: "skills", label: "Skill Lab", icon: FlaskConical },
  { key: "universe", label: "Universe", icon: Orbit },
  { key: "race", label: "Salary Race", icon: BarChart3 },
  { key: "wishlist", label: "Request a career", icon: Lightbulb },
];

const EDUCATION_LEVELS = [
  { value: "", label: "All levels" },
  { value: "class10", label: "Class 10" },
  { value: "class12", label: "Class 12" },
  { value: "graduation", label: "Graduation" },
];

const DEMAND_LEVELS = [
  { value: "", label: "All demand" },
  { value: "high", label: "High demand" },
  { value: "medium", label: "Medium demand" },
  { value: "low", label: "Low demand" },
];

export default function CareerExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [demandLevel, setDemandLevel] = useState("");
  // Lives in the URL (/careers?domain=Technology) so landing tiles, footer
  // links and back/forward navigation all re-filter this page in place.
  const domain = searchParams.get("domain") ?? "";
  const [page, setPage] = useState(1);
  const [wheelOpen, setWheelOpen] = useState(false);

  const viewParam = searchParams.get("view");
  const view = VIEWS.some((v) => v.key === viewParam) ? viewParam : "grid";
  const setView = (key) =>
    setSearchParams((params) => {
      if (key === "grid") params.delete("view");
      else params.set("view", key);
      params.delete("suggest");
      return params;
    });

  // From an unexplored planet: jump to the wishlist with that field preselected.
  const suggestIn = (domainName) =>
    setSearchParams((params) => {
      params.set("view", "wishlist");
      params.set("suggest", domainName);
      return params;
    });

  // Swipe, Skill Lab, Universe, Salary Race and the wheel need the whole catalogue (one cached call).
  const { data: allCareers, isLoading: allLoading } = useAllCareers();

  const { data, isLoading } = useQuery({
    queryKey: ["careers", { search, educationLevel, demandLevel, domain, page }],
    queryFn: () =>
      getCareers({
        search: search || undefined,
        educationLevel: educationLevel || undefined,
        demandLevel: demandLevel || undefined,
        domain: domain || undefined,
        page,
        limit: 12,
      }).then((res) => res.data.data),
  });

  const careers = data?.careers ?? [];
  const hasFilters = search || educationLevel || demandLevel || domain;

  const clearDomain = () => {
    setPage(1);
    setSearchParams((params) => {
      params.delete("domain");
      return params;
    });
  };

  const clearFilters = () => {
    setSearch("");
    setEducationLevel("");
    setDemandLevel("");
    clearDomain();
  };

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="Explore Careers" />

      {/* Hero — the page's personality lives here. */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-ink bg-grape p-6 text-white shadow-pop-lg sm:p-8">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-10 -top-10 size-48 rounded-full bg-bubblegum/60 blur-2xl" />
          <div className="absolute -bottom-12 left-1/3 size-40 rounded-full bg-sunny/40 blur-2xl" />
        </div>
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <span className="inline-block -rotate-2 rounded-full border-2 border-night bg-sunny px-3 py-0.5 text-xs font-bold text-night">
              {allCareers ? `${allCareers.length} careers to discover` : "Explore"}
            </span>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Find your thing.
            </h1>
            <p className="mt-2 max-w-md text-sm text-white/85 sm:text-base">
              Browse, swipe, fly through the universe, or race salaries. There is no wrong way to explore.
            </p>
          </div>
          <Button
            variant="sunny"
            size="lg"
            onClick={() => setWheelOpen(true)}
            disabled={!allCareers?.length}
            className="shrink-0"
          >
            <Dices size={18} />
            Surprise me
          </Button>
        </div>
      </div>

      {/* View switcher */}
      <div role="tablist" aria-label="How to explore" className="flex flex-wrap gap-2">
        {VIEWS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            role="tab"
            aria-selected={view === key}
            onClick={() => setView(key)}
            className={cn(
              "flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 text-sm font-bold transition-all",
              view === key
                ? "bg-ink text-paper shadow-pop-sm"
                : "bg-surface text-ink hover:-translate-y-0.5 hover:bg-sunny/30",
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {wheelOpen && allCareers && (
        <SpinWheel careers={allCareers} onClose={() => setWheelOpen(false)} />
      )}

      {view === "wishlist" ? (
        <Wishlist key={searchParams.get("suggest") ?? ""} initialDomain={searchParams.get("suggest") ?? ""} />
      ) : view !== "grid" ? (
        allLoading || !allCareers ? (
          <Skeleton className="h-96 w-full" />
        ) : view === "swipe" ? (
          <SwipeDeck careers={allCareers} />
        ) : view === "universe" ? (
          <CareerUniverse careers={allCareers} onSuggest={suggestIn} />
        ) : view === "race" ? (
          <SalaryRace careers={allCareers} />
        ) : (
          <SkillLab careers={allCareers} />
        )
      ) : (
        <>
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <input
            type="text"
            placeholder="Search careers, skills, domains…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter
            size={15}
            className="hidden shrink-0 text-slate-400 dark:text-slate-500 sm:block"
          />
          <select
            value={educationLevel}
            onChange={(e) => {
              setEducationLevel(e.target.value);
              setPage(1);
            }}
            className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-slate-700 dark:text-slate-200 focus:border-primary focus:outline-none sm:flex-none"
          >
            {EDUCATION_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          <select
            value={demandLevel}
            onChange={(e) => {
              setDemandLevel(e.target.value);
              setPage(1);
            }}
            className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-slate-700 dark:text-slate-200 focus:border-primary focus:outline-none sm:flex-none"
          >
            {DEMAND_LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-500"
            >
              <X size={13} />
              Clear
            </button>
          )}
        </div>
      </div>

      {domain && (
        <div className="flex items-center gap-2">
          <button
            onClick={clearDomain}
            className="flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary-dark hover:bg-primary-light/70"
          >
            Domain: {domain}
            <X size={12} />
          </button>
        </div>
      )}

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {isLoading ? "Loading…" : `Showing ${careers.length} of ${data?.total ?? 0} careers`}
      </p>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : careers.length === 0 ? (
        <EmptyState
          icon={Search}
          title={domain && !search ? `No ${domain} careers yet` : "No careers found"}
          description={
            domain && !search
              ? "We're still adding careers in this field. Clear the filter to see what's available."
              : "Try a different search term or clear your filters."
          }
          action={
            hasFilters && (
              <Button size="sm" onClick={clearFilters}>
                Clear all filters
              </Button>
            )
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {careers.map((career) => (
              <CareerCard key={career.id} career={career} />
            ))}
          </div>
          {data?.totalPages > 1 && (
            <div className="rounded-xl border border-border bg-surface">
              <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
        </>
      )}
    </div>
  );
}
