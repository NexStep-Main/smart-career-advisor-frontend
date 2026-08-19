import { Link } from "react-router-dom";
import { Scale, X, Map } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DomainBadge from "@/components/career/DomainBadge";
import EmptyState from "@/components/common/EmptyState";
import SEOHead from "@/components/common/SEOHead";
import PageHeader from "@/components/common/PageHeader";
import useCareerStore from "@/store/useCareerStore";

const EDUCATION_LABELS = { class10: "Class 10", class12: "Class 12", graduation: "Graduation" };

const ROWS = [
  { label: "Domain", render: (c) => <DomainBadge domain={c.domain} /> },
  { label: "Salary Range", render: (c) => c.salaryRange ?? "—" },
  { label: "Demand", render: (c) => <span className="capitalize">{c.demandLevel}</span> },
  {
    label: "Education Level",
    render: (c) => c.educationLevel?.map((l) => EDUCATION_LABELS[l] ?? l).join(", ") || "—",
  },
  { label: "Streams", render: (c) => c.streams?.join(", ") || "—" },
  { label: "Skills", render: (c) => c.skills?.join(", ") || "—" },
  { label: "Top Colleges", render: (c) => c.topColleges?.join(", ") || "—" },
];

export default function CareerComparisonPage() {
  const compareList = useCareerStore((state) => state.compareList);
  const removeFromCompare = useCareerStore((state) => state.removeFromCompare);

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title="Compare Careers" />

      <PageHeader
        eyebrow="Side by side"
        title="Compare Careers"
        subtitle="Compare up to 3 careers side by side. Add careers from the Scale icon on any career card."
      />

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
                  <th className="w-28 px-4 py-4 sm:w-40 sm:px-5" />
                  {compareList.map((career) => (
                    <th key={career.id} className="min-w-48 px-4 py-4 align-top sm:min-w-56 sm:px-5">
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
                    <td className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 sm:px-5">
                      {row.label}
                    </td>
                    {compareList.map((career) => (
                      <td
                        key={career.id}
                        className="px-4 py-4 text-slate-700 dark:text-slate-200 sm:px-5"
                      >
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
