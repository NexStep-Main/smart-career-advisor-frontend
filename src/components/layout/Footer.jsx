import { GraduationCap } from "lucide-react";

const COLUMNS = [
  {
    heading: "Platform",
    links: ["Career Explorer", "Skill Roadmaps", "Recommendations", "Compare Careers"],
  },
  {
    heading: "Domains",
    links: ["Technology", "Healthcare", "Commerce", "Arts", "Science", "Law"],
  },
  {
    heading: "Support",
    links: ["About", "Contact Us", "Privacy Policy", "Terms of Use"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-slate-50 px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-3 flex items-center gap-2 font-heading text-base font-bold text-slate-900">
            <GraduationCap className="text-primary" size={20} />
            Smart Career Advisor
          </div>
          <p className="max-w-xs text-sm text-slate-500">
            Free career guidance for Indian students after Class 10, 12, and Graduation.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <div className="mb-4 text-sm font-semibold text-slate-900">{col.heading}</div>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-slate-500 hover:text-primary">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-border pt-6 text-sm text-slate-400">
        © {new Date().getFullYear()} Smart Career Advisor. Final Year Project — B.Tech CSE.
      </div>
    </footer>
  );
}
