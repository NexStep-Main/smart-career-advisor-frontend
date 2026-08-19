import { useQuery } from "@tanstack/react-query";
import { Globe2, TrendingDown, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
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
export default function LaborMarketWidget() {
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
      icon: TrendingDown,
      label: "Unemployment rate",
      value: data?.unemploymentRate != null ? `${data.unemploymentRate.toFixed(1)}%` : null,
    },
    {
      icon: TrendingUp,
      label: "Youth unemployment (15–24)",
      value: data?.youthUnemploymentRate != null ? `${data.youthUnemploymentRate.toFixed(1)}%` : null,
    },
    {
      icon: Users,
      label: "Total labor force",
      value: formatCrores(data?.laborForce),
    },
  ];

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <Globe2 size={16} className="text-primary" />
          <h2 className="font-heading text-sm font-semibold text-slate-900 dark:text-slate-50">
            India Job Market Snapshot
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                <stat.icon size={16} className="text-primary" strokeWidth={1.8} />
              </div>
              <div>
                {isLoading || stat.value == null ? (
                  <Skeleton className="h-5 w-14" />
                ) : (
                  <div className="font-heading text-lg font-bold text-slate-900 dark:text-slate-50">
                    {stat.value}
                  </div>
                )}
                <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {data?.year && (
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            Source: {data.source} · {data.year} · modeled ILO estimate
          </p>
        )}
      </CardContent>
    </Card>
  );
}
