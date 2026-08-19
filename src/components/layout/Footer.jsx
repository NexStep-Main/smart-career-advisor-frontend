import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowRight, Check } from "lucide-react";
import Logo from "@/components/common/Logo";
import { subscribeToNewsletter } from "@/services/newsletter";

// Company/About/Contact/Blog are deliberately omitted — none of those pages
// exist (this is a student project, not a company), and linking to pages
// that don't exist would be worse than a shorter footer. "Get Started"
// takes that column slot instead, since every link in it is real.
const COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Career Explorer", to: "/careers" },
      { label: "Skill Roadmaps", to: "/careers" },
      { label: "Recommendations", to: "/recommendations" },
      { label: "Compare Careers", to: "/compare" },
    ],
  },
  {
    heading: "Domains",
    links: [
      { label: "Technology", to: "/careers?domain=Technology" },
      { label: "Healthcare", to: "/careers?domain=Healthcare" },
      { label: "Commerce", to: "/careers?domain=Commerce" },
      { label: "Arts", to: "/careers?domain=Arts" },
      { label: "Science", to: "/careers?domain=Science" },
      { label: "Law", to: "/careers?domain=Law" },
      { label: "Design", to: "/careers?domain=Design" },
    ],
  },
  {
    heading: "Get Started",
    links: [
      { label: "Log in", to: "/login" },
      { label: "Create free account", to: "/register" },
      { label: "How it works", to: "/#process" },
      { label: "FAQ", to: "/#faq" },
    ],
  },
];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await subscribeToNewsletter(email);
      setStatus("done");
    } catch {
      setStatus("idle");
      toast.error("Couldn't subscribe — try again in a moment.");
    }
  };

  if (status === "done") {
    return (
      <div className="flex items-center gap-2 border-b border-ink pb-3 text-sm text-ink">
        <Check size={15} />
        You're on the list.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center gap-3 border-b border-rule pb-3 transition-colors focus-within:border-ink">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full min-w-0 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Subscribe"
          className="shrink-0 text-ink transition-opacity hover:opacity-50 disabled:opacity-40"
        >
          <ArrowRight size={16} />
        </button>
      </div>
      <p className="mt-3 text-xs text-ink-faint">
        One email when something worth knowing ships. No spam.
      </p>
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-rule px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Oversized wordmark as the closing visual — the type signs off the
            page instead of a logo lockup shrinking into a corner. */}
        <div className="mb-20 border-b border-rule pb-16">
          <div className="font-display text-[clamp(3rem,14vw,11rem)] leading-[0.85] tracking-tight text-ink">
            NexStep
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <div className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
                {col.heading}
              </div>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            <div className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
              Stay in the loop
            </div>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-8">
          <Logo size="sm" mono />
          <p className="font-mono text-xs text-ink-faint">
            © {new Date().getFullYear()} NexStep — Final Year Project, B.Tech CSE.
          </p>
        </div>
      </div>
    </footer>
  );
}
