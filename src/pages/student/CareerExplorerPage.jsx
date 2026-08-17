import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Filter } from "lucide-react";
import CareerCard from "@/components/career/CareerCard";
import EmptyState from "@/components/common/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Pagination from "@/components/common/Pagination";
import SEOHead from "@/components/common/SEOHead";
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
  const [search, setSearch] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [demandLevel, setDemandLevel] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["careers", { search, educationLevel, demandLevel, page }],
    queryFn: () =>
      getCareers({
        search: search || undefined,
        educationLevel: educationLevel || undefined,
        demandLevel: demandLevel || undefined,
        page,
        limit: 12,
      }).then((res) => res.data.data),
  });

  const careers = data?.careers ?? [];
  const hasFilters = search || educationLevel || demandLevel;

  const clearFilters = () => {
    setSearch("");
    setEducationLevel("");
    setDemandLevel("");
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="Explore Careers" />

      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-50">
          Explore Careers
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Browse career paths across every domain and education level.
        </p>
      </div>

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

        <div className="flex items-center gap-2">
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
            className="h-11 rounded-lg border border-border bg-background px-3 text-sm text-slate-700 dark:text-slate-200 focus:border-primary focus:outline-none"
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
            className="h-11 rounded-lg border border-border bg-background px-3 text-sm text-slate-700 dark:text-slate-200 focus:border-primary focus:outline-none"
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
              className="flex items-center gap-1 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-3 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100"
            >
              <X size={13} />
              Clear
            </button>
          )}
        </div>
      </div>

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
              <button
                onClick={clearFilters}
                className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Clear all filters
              </button>
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
