import Logo from "@/components/common/Logo";

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
    <footer className="border-t border-indigo-100 bg-white/80 px-6 py-16 shadow-[0_-10px_25px_rgba(15,23,42,0.02)] dark:border-slate-700 dark:bg-slate-950/60">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-3">
            <Logo size="md" />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Free career guidance for Indian students after Class 10, 12, and Graduation.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <div className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-50">
              {col.heading}
            </div>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-indigo-100 pt-6 text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
        © {new Date().getFullYear()} NexStep. Final Year Project — B.Tech CSE.
      </div>
    </footer>
  );
}
