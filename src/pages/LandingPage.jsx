import { useState, useEffect, useRef } from "react";
import { FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import {
  Map, MapPin, Bot, Scale,
  Zap, Target, TrendingUp, Puzzle, Lock, Smartphone,
  GraduationCap, ChevronDown, Menu, X
} from "lucide-react";

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function StatCounter({ value, suffix, label, inView }) {
  const count = useCountUp(value, 2000, inView);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, fontFamily: "'Sora', sans-serif", background: "linear-gradient(135deg, #1e293b 0%, #6366f1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {count}{suffix}
      </div>
      <div style={{ color: "#64748b", fontSize: "0.95rem", marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
    </div>
  );
}

const logos = ["Class 10", "Class 12", "Graduation", "Engineering", "Medical", "Arts", "Commerce", "Science", "Law", "Design", "Management", "Research"];

const steps = [
  { num: "01", title: "Tell Us About You", desc: "Answer a quick 5-step quiz about your education level, stream, interests, and career priorities. No sign-up required to start." },
  { num: "02", title: "Get Your Roadmap", desc: "Our recommendation engine analyses your profile and maps out the top career paths suited specifically to your background and goals." },
  { num: "03", title: "Follow & Track", desc: "Work through your personalised skill roadmap phase by phase, mark milestones, and access curated resources at every step." },
];

const features = [
  { icon: Map, title: "Career Explorer", desc: "Browse 100+ career paths across 10+ domains. Filter by stream, education level, salary range, and more.", tag: "Core" },
  { icon: MapPin, title: "Skill Roadmaps", desc: "Phase-by-phase visual learning paths that show exactly what to learn, when, and with which resources.", tag: "Core" },
  { icon: Bot, title: "AI Recommendations", desc: "Smart matching engine that scores and ranks careers based on your unique quiz answers and profile.", tag: "Smart" },
  { icon: Scale, title: "Career Comparison", desc: "Compare any two careers side-by-side across salary, skills, demand, difficulty, and future scope.", tag: "Tool" },
];

const benefits = [
  { icon: Zap, title: "Instant Clarity", desc: "Stop spending months confused. Get structured direction in minutes." },
  { icon: Target, title: "Personalised Paths", desc: "Not generic advice — recommendations built specifically for your stream, level, and interests." },
  { icon: TrendingUp, title: "Real Salary Data", desc: "Every career shows verified salary ranges and 5-year demand projections." },
  { icon: Puzzle, title: "Skill Gap Analysis", desc: "Know exactly which skills you're missing and what resources fill those gaps." },
  { icon: Lock, title: "100% Free", desc: "The entire platform is free for students. No paywalls, no hidden costs." },
  { icon: Smartphone, title: "Works Everywhere", desc: "Fully responsive — use it on your phone, tablet, or desktop during college hours." },
];

const testimonials = [
  { name: "Priya Mehta", role: "Class 12 Science, Kolkata", quote: "I had no idea what to do after boards. Smart Career Advisor showed me 6 great options in my stream I hadn't even heard of.", avatar: "PM" },
  { name: "Arjun Das", role: "B.Tech CSE, Final Year", quote: "The skill roadmap for Full Stack development is incredibly detailed. I know exactly what to learn this semester.", avatar: "AD" },
  { name: "Sneha Roy", role: "Commerce Student, Delhi", quote: "Compared CA vs MBA vs CFA in one click. The comparison table made my decision so much easier.", avatar: "SR" },
  { name: "Rahul Sharma", role: "Class 10, Pune", quote: "I was scared about stream selection. The quiz understood my interests better than my own teachers did.", avatar: "RS" },
];

const faqs = [
  { q: "Is Smart Career Advisor free to use?", a: "Yes — 100% free for all students. We believe career guidance should be accessible to everyone, not just those who can afford counsellors." },
  { q: "Which education levels does it support?", a: "We support students after Class 10 (stream selection), Class 12 (college and course selection), and Graduation (job, higher studies, or specialisation decisions)." },
  { q: "How accurate are the career recommendations?", a: "Recommendations are based on your quiz answers, education level, stream, and interests. The more accurately you fill in your profile, the better the matches." },
  { q: "Can I explore careers without taking the quiz?", a: "Absolutely. The Career Explorer is publicly accessible — browse, filter, and read detailed career pages without any login." },
  { q: "How do the skill roadmaps work?", a: "Each career has a phase-based roadmap — typically 3-5 phases covering foundations, core skills, projects, and job readiness — with resource links at every step." },
];

const navLinks = ["Process", "Features", "Benefits", "Testimonials", "FAQ"];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [statsRef, statsInView] = useInView(0.3);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close mobile menu on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Prevent body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div style={{ background: "#f8f9ff", color: "#1e293b", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #f8f9ff; }

        .grid-bg {
          background-image: linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px);
          background-size: 60px 60px;
          background-color: #f8f9ff;
        }

        .orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none; z-index: 0;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track { display: flex; animation: marquee 22s linear infinite; width: max-content; }
        .marquee-track:hover { animation-play-state: paused; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .delay-1 { animation-delay: 0.15s; opacity: 0; }
        .delay-2 { animation-delay: 0.30s; opacity: 0; }
        .delay-3 { animation-delay: 0.45s; opacity: 0; }
        .delay-4 { animation-delay: 0.60s; opacity: 0; }

        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-5px); box-shadow: 0 20px 60px rgba(99,102,241,0.15); }

        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
          70%  { box-shadow: 0 0 0 14px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        .btn-primary { animation: pulse-ring 2.5s ease-out infinite; }
        .btn-primary:hover { animation: none; transform: scale(1.04); }

        .nav-blur {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .grad-text {
          background: linear-gradient(135deg, #1e293b 20%, #6366f1 70%, #38bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stars { color: #f59e0b; letter-spacing: 2px; }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu { animation: slideDown 0.2s ease forwards; }

        .faq-answer { overflow: hidden; transition: max-height 0.35s ease, opacity 0.35s ease; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 3px; }

        /* ── Desktop: show nav links + login/CTA, hide hamburger ── */
        .desktop-nav { display: flex; }
        .desktop-right { display: flex; }
        .hamburger { display: none; }

        /* ── Mobile: hide nav links + login/CTA, show hamburger ── */
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-right { display: none !important; }
          .hamburger { display: flex !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .benefits-grid { grid-template-columns: 1fr 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-heading { font-size: 2.2rem !important; }
          .cta-banner-inner { padding: 32px 20px !important; }
        }
        @media (max-width: 480px) {
          .benefits-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(99,102,241,0.15)" : "none",
      }} className={scrolled ? "nav-blur" : ""}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.2rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <GraduationCap size={24} color="#6366f1" />
            <span className="grad-text">Smart Career</span>
            <span style={{ color: "#6366f1", marginLeft: 2 }}>Advisor</span>
          </div>

          {/* Desktop nav links — hidden on mobile */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
            {navLinks.map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())}
                style={{ background: "none", border: "none", color: "#64748b", fontSize: "0.9rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#1e293b"}
                onMouseLeave={e => e.target.style.color = "#64748b"}>
                {l}
              </button>
            ))}
          </div>

          {/* Desktop Login + Get Started — hidden on mobile */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }} className="desktop-right">
            <a href="/login" style={{ color: "#64748b", fontSize: "0.9rem", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>Login</a>
            <a href="/register" style={{
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#fff", padding: "9px 20px", borderRadius: 50, fontSize: "0.875rem",
              fontWeight: 600, textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
              border: "1px solid rgba(99,102,241,0.4)", transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = "0 0 20px rgba(99,102,241,0.4)"; }}
              onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}>
              Get Started
            </a>
          </div>

          {/* Hamburger — only visible on mobile */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#1e293b", alignItems: "center", justifyContent: "center" }}
            className="hamburger">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Mobile dropdown menu with nav links + Login + Get Started ── */}
        {menuOpen && (
          <div className="mobile-menu" style={{
            background: "rgba(255,255,255,0.98)",
            borderTop: "1px solid rgba(99,102,241,0.15)",
            padding: "16px 24px 24px",
            maxHeight: "calc(100vh - 68px)",
            overflowY: "auto",
          }}>
            {navLinks.map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())}
                style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", color: "#64748b", fontSize: "1rem", padding: "14px 0", cursor: "pointer", borderBottom: "1px solid rgba(99,102,241,0.08)", fontFamily: "'DM Sans', sans-serif" }}>
                {l}
              </button>
            ))}

            {/* Login + Get Started inside mobile menu */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(99,102,241,0.12)" }}>
              <a href="/login" onClick={() => setMenuOpen(false)} style={{
                display: "block", textAlign: "center", padding: "12px 0", borderRadius: 50,
                border: "1px solid rgba(99,102,241,0.2)", color: "#1e293b", fontSize: "0.95rem",
                fontWeight: 500, textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                background: "#ffffff",
              }}>
                Login
              </a>
              <a href="/register" onClick={() => setMenuOpen(false)} style={{
                display: "block", textAlign: "center", padding: "12px 0", borderRadius: 50,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff",
                fontSize: "0.95rem", fontWeight: 600, textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif", border: "1px solid rgba(99,102,241,0.4)",
              }}>
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section id="hero" className="grid-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", paddingTop: 80, overflow: "hidden" }}>
        <div className="orb" style={{ width: 500, height: 500, background: "rgba(99,102,241,0.12)", top: -100, right: -100 }} />
        <div className="orb" style={{ width: 350, height: 350, background: "rgba(56,189,248,0.08)", bottom: 50, left: -80 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%", position: "relative", zIndex: 1 }}>

          <div className="fade-up" style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <span style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 50, padding: "6px 18px", fontSize: "0.8rem", color: "#6366f1", fontWeight: 500, letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 6 }}>
              <GraduationCap size={14} /> Free career guidance for every Indian student
            </span>
          </div>

          <h1 className="fade-up delay-1" style={{ textAlign: "center", fontSize: "clamp(2rem, 6vw, 5rem)", fontWeight: 800, fontFamily: "'Sora', sans-serif", lineHeight: 1.1, marginBottom: 24, maxWidth: 820, margin: "0 auto 24px" }}>
            <span className="grad-text">Discover Your Perfect</span>
            <br />Career Path After
            <br /><span style={{ color: "#6366f1" }}>Class 10, 12 & Graduation</span>
          </h1>

          <p className="fade-up delay-2" style={{ textAlign: "center", color: "#64748b", fontSize: "clamp(0.95rem, 2.5vw, 1.2rem)", maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.7, fontWeight: 300 }}>
            Personalised roadmaps, skill plans, and AI-powered recommendations — so you always know exactly what to do next.
          </p>

          <div className="fade-up delay-3" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/register" className="btn-primary" style={{
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#fff", padding: "14px 32px", borderRadius: 50, fontSize: "1rem",
              fontWeight: 600, textDecoration: "none", display: "inline-block",
              fontFamily: "'DM Sans', sans-serif", border: "1px solid rgba(99,102,241,0.5)",
              transition: "transform 0.2s",
            }}>
              Start for Free →
            </a>
            <a href="/explore" style={{
              background: "#ffffff", color: "#1e293b",
              padding: "14px 32px", borderRadius: 50, fontSize: "1rem",
              fontWeight: 500, textDecoration: "none", display: "inline-block",
              fontFamily: "'DM Sans', sans-serif",
              border: "1px solid rgba(99,102,241,0.2)",
              boxShadow: "0 2px 8px rgba(99,102,241,0.08)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.target.style.borderColor = "rgba(99,102,241,0.4)"; e.target.style.boxShadow = "0 4px 16px rgba(99,102,241,0.15)"; }}
              onMouseLeave={e => { e.target.style.borderColor = "rgba(99,102,241,0.2)"; e.target.style.boxShadow = "0 2px 8px rgba(99,102,241,0.08)"; }}>
              Browse Careers
            </a>
          </div>

          <div className="fade-up delay-4" style={{ textAlign: "center", marginTop: 28, color: "#94a3b8", fontSize: "0.85rem" }}>
            ✓ No credit card &nbsp;·&nbsp; ✓ No sign-up to browse &nbsp;·&nbsp; ✓ 100% free forever
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div style={{ borderTop: "1px solid rgba(99,102,241,0.1)", borderBottom: "1px solid rgba(99,102,241,0.1)", padding: "20px 0", overflow: "hidden", background: "rgba(99,102,241,0.04)" }}>
        <div className="marquee-track">
          {[...logos, ...logos].map((l, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 36px", color: "#94a3b8", fontSize: "0.9rem", fontWeight: 500, whiteSpace: "nowrap", letterSpacing: "0.03em" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS SECTION ── */}
      <section ref={statsRef} style={{ padding: "80px 24px", background: "#ffffff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
            <StatCounter value={100} suffix="+" label="Career Paths" inView={statsInView} />
            <StatCounter value={10} suffix="+" label="Domains Covered" inView={statsInView} />
            <StatCounter value={5000} suffix="+" label="Students Guided" inView={statsInView} />
            <StatCounter value={14} suffix="" label="Platform Pages" inView={statsInView} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS / PROCESS ── */}
      <section id="process" style={{ padding: "80px 24px 100px", position: "relative", background: "#f8f9ff" }}>
        <div className="orb" style={{ width: 400, height: 400, background: "rgba(56,189,248,0.06)", top: 0, right: "10%" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ color: "#6366f1", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>How it works</span>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, marginTop: 12, color: "#1e293b", lineHeight: 1.2 }}>
              Our Proven Process
            </h2>
            <p style={{ color: "#64748b", marginTop: 14, fontSize: "1.05rem", maxWidth: 500, margin: "14px auto 0" }}>
              From confusion to clarity in three simple steps
            </p>
          </div>

          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {steps.map((s, i) => (
              <div key={i} className="card-hover" style={{
                background: "#ffffff",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: 20, padding: "36px 28px", position: "relative", overflow: "hidden",
                boxShadow: "0 2px 16px rgba(99,102,241,0.06)",
              }}>
                <div style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, fontFamily: "'Sora', sans-serif", color: "#6366f1", marginBottom: 20, lineHeight: 1 }}>
                  {s.num}
                </div>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: 12, color: "#1e293b" }}>
                  {s.title}
                </h3>
                <p style={{ color: "#475569", lineHeight: 1.7, fontSize: "0.95rem" }}>{s.desc}</p>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #6366f1, transparent)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" style={{ padding: "80px 24px 100px", background: "#f1f5f9", borderTop: "1px solid rgba(99,102,241,0.1)", borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ color: "#6366f1", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>What we offer</span>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, marginTop: 12, color: "#1e293b" }}>
              Everything You Need
            </h2>
            <p style={{ color: "#64748b", marginTop: 14, fontSize: "1.05rem", maxWidth: 480, margin: "14px auto 0" }}>
              Innovative tools built specifically for Indian students navigating career decisions
            </p>
          </div>

          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {features.map((f, i) => {
              const IconComponent = f.icon;
              return (
                <div key={i} className="card-hover" style={{
                  background: "#ffffff",
                  border: "1px solid rgba(99,102,241,0.12)",
                  borderRadius: 20, padding: "32px 28px", display: "flex", gap: 20, alignItems: "flex-start",
                  boxShadow: "0 2px 16px rgba(99,102,241,0.06)",
                }}>
                  <div style={{ flexShrink: 0, width: 52, height: 52, background: "rgba(99,102,241,0.08)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(99,102,241,0.15)" }}>
                    <IconComponent size={24} color="#6366f1" strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                      <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b" }}>{f.title}</h3>
                      <span style={{ background: "rgba(99,102,241,0.08)", color: "#6366f1", padding: "2px 10px", borderRadius: 50, fontSize: "0.7rem", fontWeight: 600, border: "1px solid rgba(99,102,241,0.2)" }}>{f.tag}</span>
                    </div>
                    <p style={{ color: "#475569", lineHeight: 1.7, fontSize: "0.9rem" }}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BENEFITS SECTION ── */}
      <section id="benefits" style={{ padding: "80px 24px 100px", position: "relative", background: "#f8f9ff" }}>
        <div className="orb" style={{ width: 350, height: 350, background: "rgba(99,102,241,0.07)", bottom: 0, left: "5%" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ color: "#6366f1", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Why choose us</span>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, marginTop: 12, color: "#1e293b" }}>
              The Smart Career Advantage
            </h2>
          </div>

          <div className="benefits-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {benefits.map((b, i) => {
              const IconComponent = b.icon;
              return (
                <div key={i} className="card-hover" style={{
                  background: "#ffffff",
                  border: "1px solid rgba(99,102,241,0.1)",
                  borderRadius: 16, padding: "28px 24px",
                  boxShadow: "0 2px 16px rgba(99,102,241,0.06)",
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <IconComponent size={20} color="#6366f1" strokeWidth={1.8} />
                  </div>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>{b.title}</h3>
                  <p style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.6 }}>{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ── */}
      <section id="testimonials" style={{ padding: "80px 24px 100px", background: "#f1f5f9", borderTop: "1px solid rgba(99,102,241,0.1)", borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ color: "#6366f1", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Student stories</span>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, marginTop: 12, color: "#1e293b" }}>
              What Students Say
            </h2>
          </div>

          <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card-hover" style={{
                background: "#ffffff",
                border: "1px solid rgba(99,102,241,0.12)",
                borderRadius: 20, padding: "28px 28px 24px",
                boxShadow: "0 2px 16px rgba(99,102,241,0.06)",
              }}>
                <div className="stars" style={{ marginBottom: 14, fontSize: "0.9rem" }}>★★★★★</div>
                <p style={{ color: "#334155", lineHeight: 1.7, fontSize: "0.95rem", fontStyle: "italic", marginBottom: 20 }}>
                  "{t.quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: "0.85rem", color: "#fff", flexShrink: 0,
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b" }}>{t.name}</div>
                    <div style={{ color: "#64748b", fontSize: "0.8rem" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section id="faq" style={{ padding: "80px 24px 100px", background: "#f8f9ff" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ color: "#6366f1", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>FAQ</span>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, marginTop: 12, color: "#1e293b" }}>
              Your Questions, Answered
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faqs.map((f, i) => (
              <div key={i} style={{
                background: "#ffffff",
                border: "1px solid",
                borderColor: openFaq === i ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.12)",
                borderRadius: 14, overflow: "hidden", transition: "border-color 0.25s",
                boxShadow: "0 2px 8px rgba(99,102,241,0.05)",
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", background: "none", border: "none", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", gap: 16 }}>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "#1e293b" }}>{f.q}</span>
                  <ChevronDown size={18} color="#6366f1" style={{ flexShrink: 0, transition: "transform 0.25s", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>
                <div className="faq-answer" style={{ maxHeight: openFaq === i ? 200 : 0, opacity: openFaq === i ? 1 : 0 }}>
                  <p style={{ padding: "0 24px 20px", color: "#475569", lineHeight: 1.7, fontSize: "0.9rem" }}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: "60px 24px 80px", background: "#f8f9ff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="cta-banner-inner" style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(79,70,229,0.05) 50%, rgba(56,189,248,0.06) 100%)",
            border: "1px solid rgba(99,102,241,0.2)", borderRadius: 24,
            padding: "clamp(40px, 6vw, 72px) clamp(24px, 5vw, 64px)",
            textAlign: "center", position: "relative", overflow: "hidden",
            boxShadow: "0 8px 40px rgba(99,102,241,0.08)",
          }}>
            <div className="orb" style={{ width: 250, height: 250, background: "rgba(99,102,241,0.08)", top: -60, right: -60 }} />
            <div className="orb" style={{ width: 200, height: 200, background: "rgba(56,189,248,0.06)", bottom: -40, left: -40 }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.4rem, 4vw, 2.6rem)", fontWeight: 800, marginBottom: 14, lineHeight: 1.2, color: "#1e293b" }}>
                Ready to Find Your<br />
                <span className="grad-text">Perfect Career Path?</span>
              </h2>
              <p style={{ color: "#64748b", fontSize: "clamp(0.9rem, 2vw, 1.05rem)", marginBottom: 36, maxWidth: 440, margin: "0 auto 36px" }}>
                Join thousands of students who found their direction using Smart Career Advisor. It's completely free.
              </p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/register" className="btn-primary" style={{
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  color: "#fff", padding: "14px 36px", borderRadius: 50,
                  fontSize: "1rem", fontWeight: 600, textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif", border: "1px solid rgba(99,102,241,0.4)",
                  display: "inline-block", transition: "transform 0.2s",
                }}>
                  Start Free Today →
                </a>
                <a href="/explore" style={{
                  background: "#ffffff", color: "#1e293b",
                  padding: "14px 32px", borderRadius: 50, fontSize: "1rem",
                  fontWeight: 500, textDecoration: "none", display: "inline-block",
                  fontFamily: "'DM Sans', sans-serif",
                  border: "1px solid rgba(99,102,241,0.2)",
                  boxShadow: "0 2px 8px rgba(99,102,241,0.08)",
                }}>
                  Browse Careers
                </a>
              </div>
              <div style={{ marginTop: 20, color: "#94a3b8", fontSize: "0.82rem" }}>
                ✓ No sign-up required to explore &nbsp;·&nbsp; ✓ 100% free forever
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(99,102,241,0.1)", padding: "48px 24px 32px", background: "#f1f5f9" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>

            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.1rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <GraduationCap size={20} color="#6366f1" />
                <span className="grad-text">Smart Career</span>
                <span style={{ color: "#6366f1" }}> Advisor</span>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.7, maxWidth: 260 }}>
                Free career guidance for Indian students after Class 10, 12, and Graduation.
              </p>
              {/* ── Social icons — LinkedIn, Facebook, Instagram ── */}
              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                {[
                  { icon: FaLinkedinIn, label: "LinkedIn" },
                  { icon: FaFacebookF, label: "Facebook" },
                  { icon: FaInstagram, label: "Instagram" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} title={label} style={{ width: 36, height: 36, borderRadius: 8, background: "#ffffff", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(99,102,241,0.08)", transition: "background 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#6366f1"; e.currentTarget.querySelector("svg").style.color = "#ffffff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.querySelector("svg").style.color = "#6366f1"; }}>
                    <Icon size={15} color="#6366f1" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#1e293b", marginBottom: 16, letterSpacing: "0.04em" }}>Platform</div>
              {["Career Explorer", "Skill Roadmaps", "Recommendations", "Compare Careers", "Saved Careers"].map(l => (
                <a key={l} href="#" style={{ display: "block", color: "#64748b", fontSize: "0.875rem", marginBottom: 10, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "#6366f1"}
                  onMouseLeave={e => e.target.style.color = "#64748b"}>{l}</a>
              ))}
            </div>

            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#1e293b", marginBottom: 16, letterSpacing: "0.04em" }}>Domains</div>
              {["Technology", "Healthcare", "Commerce", "Arts", "Science", "Law"].map(l => (
                <a key={l} href="#" style={{ display: "block", color: "#64748b", fontSize: "0.875rem", marginBottom: 10, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "#6366f1"}
                  onMouseLeave={e => e.target.style.color = "#64748b"}>{l}</a>
              ))}
            </div>

            <div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#1e293b", marginBottom: 16, letterSpacing: "0.04em" }}>Support</div>
              {["About", "Contact Us", "Privacy Policy", "Terms of Use", "Sitemap"].map(l => (
                <a key={l} href="#" style={{ display: "block", color: "#64748b", fontSize: "0.875rem", marginBottom: 10, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "#6366f1"}
                  onMouseLeave={e => e.target.style.color = "#64748b"}>{l}</a>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(99,102,241,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>© 2026 Smart Career Advisor. Final Year Project — B.Tech CSE.</span>
            <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>Made with ❤️ for Indian students</span>
          </div>
        </div>
      </footer>

    </div>
  );
}