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
      { label: "Career Quiz", to: "/onboarding" },
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
      <div className="flex items-center gap-2 rounded-full border-2 border-ink bg-mint px-4 py-3 text-sm font-bold text-night shadow-pop-sm">
        <Check size={16} />
        You're on the list!
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center gap-2 rounded-full border-2 border-ink bg-surface p-1.5 pl-4 shadow-pop-sm transition-shadow focus-within:shadow-pop">
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
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-grape text-white transition-transform hover:scale-105 disabled:opacity-40"
        >
          <ArrowRight size={16} />
        </button>
      </div>
      <p className="mt-3 text-xs text-ink-faint">
        One email when something worth knowing ships. No spam, promise.
      </p>
    </form>
  );
}

// Each wordmark letter gets its own brand colour — the footer signs off with
// the most playful version of the logo.
const WORDMARK = [
  ["N", "text-grape"],
  ["e", "text-bubblegum"],
  ["x", "text-tangerine"],
  ["S", "text-sunny"],
  ["t", "text-mint"],
  ["e", "text-sky"],
  ["p", "text-grape"],
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden rounded-t-[2.5rem] border-t-2 border-ink bg-surface px-6 pb-10 pt-16 sm:rounded-t-[4rem] sm:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 border-b-2 border-dashed border-rule pb-12">
          <div
            aria-label="NexStep"
            className="font-display text-[clamp(3.5rem,13vw,10rem)] font-bold leading-[0.85] tracking-tight"
          >
            {WORDMARK.map(([ch, color], i) => (
              <span
                key={i}
                aria-hidden
                className={`${color} inline-block transition-transform duration-300 hover:-translate-y-2 hover:rotate-6`}
              >
                {ch}
              </span>
            ))}
          </div>
          <p className="font-hand text-3xl text-ink-muted sm:text-4xl">your next step starts here ↗</p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <div className="mb-5 font-display text-lg font-semibold text-ink">{col.heading}</div>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm font-medium text-ink-muted transition-colors hover:text-grape dark:hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            <div className="mb-5 font-display text-lg font-semibold text-ink">Stay in the loop</div>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-rule pt-8">
          <Logo size="sm" mono />
          <p className="text-xs font-medium text-ink-faint">
            © {new Date().getFullYear()} NexStep — Final Year Project, B.Tech CSE.
          </p>
        </div>
      </div>
    </footer>
  );
}
