import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Filter } from "lucide-react";
import CareerCard from "@/components/career/CareerCard";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import Pagination from "@/components/common/Pagination";
import SEOHead from "@/components/common/SEOHead";
import PageHeader from "@/components/common/PageHeader";
import { getCareers } from "@/services/careers";

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
  // Seeded from the landing page's domain chips (/careers?domain=Technology) —
  // read once on mount so a direct link/back-nav still reflects the URL.
  const [domain, setDomain] = useState(() => searchParams.get("domain") ?? "");
  const [page, setPage] = useState(1);

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
    setDomain("");
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

      <PageHeader
        eyebrow="Explore"
        title="Explore Careers"
        subtitle="Browse career paths across every domain and education level."
      />

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
          title="No careers found"
          description="Try a different search term or clear your filters."
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
    </div>
  );
}
