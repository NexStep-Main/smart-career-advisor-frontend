import { useQuery } from "@tanstack/react-query";
import Skeleton from "@/components/ui/Skeleton";
import { getLaborMarketStats } from "@/services/publicStats";

function formatCrores(n) {
  if (n == null) return null;
  return `${(n / 10000000).toFixed(1)} Cr`;
}

/**
 * Real India employment context from the World Bank Open Data API (see
 * Backend services/laborMarket.service.js) — not app data, but genuine
 * macro context to ground a student's career decision in reality.
 */
export default function LaborMarketWidget({ index }) {
  const { data, isLoading } = useQuery({
    queryKey: ["laborMarketStats"],
    queryFn: () => getLaborMarketStats().then((res) => res.data.data),
    staleTime: 60 * 60 * 1000,
  });

  // If the World Bank API was unreachable, the backend still returns 200
  // with nulls — quietly hide the widget rather than show empty stats.
  if (!isLoading && data?.unemploymentRate == null && data?.laborForce == null) return null;

  const stats = [
    {
      label: "Unemployment rate",
      value: data?.unemploymentRate != null ? `${data.unemploymentRate.toFixed(1)}%` : null,
    },
    {
      label: "Youth unemployment (15–24)",
      value:
        data?.youthUnemploymentRate != null ? `${data.youthUnemploymentRate.toFixed(1)}%` : null,
    },
    {
      label: "Total labor force",
      value: formatCrores(data?.laborForce),
    },
  ];

  return (
    <section>
      <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-border pb-3">
        <div className="flex items-baseline gap-3">
          {index && (
            <span className="font-mono text-xs text-slate-400 dark:text-slate-500">{index}</span>
          )}
          <h2 className="font-display text-xl leading-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
            India job market snapshot
          </h2>
        </div>
        {data?.year && (
          <span className="shrink-0 font-mono text-xs text-slate-400 dark:text-slate-500">
            {data.year}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-background pb-1 pt-1 sm:px-5 sm:first:pl-0">
            {isLoading || stat.value == null ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="font-display text-3xl leading-none text-slate-900 dark:text-slate-50">
                {stat.value}
              </div>
            )}
            <div className="mt-2.5 font-mono text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {data?.year && (
        <p className="mt-5 font-mono text-xs text-slate-400 dark:text-slate-500">
          Source: {data.source} · modeled ILO estimate
        </p>
      )}
    </section>
  );
}
