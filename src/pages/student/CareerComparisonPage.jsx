import { Link } from "react-router-dom";
import { Scale, X, Map } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DomainBadge from "@/components/career/DomainBadge";
import EmptyState from "@/components/common/EmptyState";
import SEOHead from "@/components/common/SEOHead";
import useCareerStore from "@/store/useCareerStore";

const EDUCATION_LABELS = { class10: "Class 10", class12: "Class 12", graduation: "Graduation" };

const ROWS = [
  { label: "Domain", render: (c) => <DomainBadge domain={c.domain} /> },
  { label: "Salary Range", render: (c) => c.salaryRange ?? "—" },
  { label: "Demand", render: (c) => <span className="capitalize">{c.demandLevel}</span> },
  {
    label: "Education Level",
    render: (c) => c.educationLevel?.map((l) => EDUCATION_LABELS[l] ?? l).join(",") || "—",
  },
  { label: "Streams", render: (c) => c.streams?.join(",") || "—" },
  { label: "Skills", render: (c) => c.skills?.join(",") || "—" },
  { label: "Top Colleges", render: (c) => c.topColleges?.join(",") || "—" },
];

export default function CareerComparisonPage() {
  const compareList = useCareerStore((state) => state.compareList);
  const removeFromCompare = useCareerStore((state) => state.removeFromCompare);

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="Compare Careers" />

      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-50">
          Compare Careers
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Compare up to 3 careers side by side. Add careers from the Scale icon on any career card.
        </p>
      </div>

      {compareList.length === 0 ? (
        <EmptyState
          icon={Scale}
          title="Nothing to compare yet"
          description="Browse careers and tap the compare icon on a card to add it here."
          action={
            <Button asChild size="sm">
              <Link to="/careers">
                <Map size={15} />
                Explore Careers
              </Link>
            </Button>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-40 px-5 py-4" />
                  {compareList.map((career) => (
                    <th key={career.id} className="min-w-56 px-5 py-4 align-top">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/careers/${career.id}`}
                          className="font-heading text-base font-semibold text-slate-900 dark:text-slate-50 hover:text-primary"
                        >
                          {career.title}
                        </Link>
                        <button
                          onClick={() => removeFromCompare(career.id)}
                          className="shrink-0 text-slate-400 dark:text-slate-500 hover:text-red-500"
                          aria-label={`Remove ${career.title}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <td className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      {row.label}
                    </td>
                    {compareList.map((career) => (
                      <td key={career.id} className="px-5 py-4 text-slate-700 dark:text-slate-200">
                        {row.render(career)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
