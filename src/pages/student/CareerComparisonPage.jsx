import { useState } from "react";
import {
  GraduationCap, Bookmark, Map, MapPin, Bot, Bell, User, LogOut,
  BarChart3, Menu, X, Scale, ChevronDown, ArrowRight, TrendingUp,
  Briefcase, Clock, BookOpen, Building, Target, Zap, CheckCircle,
  XCircle, Minus, RefreshCw, Star
} from "lucide-react";

/* ── Career Data for Comparison ── */
const careersForComparison = [
  {
    id: 1, title: "Software Engineer", domain: "Technology",
    salary: { min: 6, max: 25, avg: 12 },
    demandLevel: "High", demandScore: 95,
    difficulty: "Medium-High", difficultyScore: 75,
    educationLevel: ["Class 12", "Graduation"],
    timeToReady: "6 - 12 months",
    workStyle: "Remote / Hybrid / Office",
    jobSatisfaction: 88,
    futureScope: "Very High — AI, Cloud, and Digital Transformation driving massive demand globally.",
    topSkills: ["JavaScript", "React", "Node.js", "DSA", "System Design", "Git"],
    topCompanies: ["Google", "Microsoft", "Amazon", "Flipkart", "Razorpay"],
    topColleges: ["IIT Bombay", "IIT Delhi", "BITS Pilani", "NIT Trichy"],
    pros: ["Very high salary potential", "Remote work options", "Global opportunities", "Creative problem solving"],
    cons: ["Continuous learning required", "Can be sedentary", "Burnout risk in startups"],
    matchScore: 95,
  },
  {
    id: 2, title: "Data Scientist", domain: "Technology",
    salary: { min: 8, max: 30, avg: 15 },
    demandLevel: "High", demandScore: 90,
    difficulty: "High", difficultyScore: 85,
    educationLevel: ["Graduation", "Post Graduation"],
    timeToReady: "8 - 14 months",
    workStyle: "Hybrid / Office",
    jobSatisfaction: 85,
    futureScope: "Very High — Data-driven decisions becoming critical across every industry.",
    topSkills: ["Python", "Machine Learning", "Statistics", "SQL", "TensorFlow", "Deep Learning"],
    topCompanies: ["Google", "Meta", "Amazon", "Flipkart", "Tiger Analytics"],
    topColleges: ["ISI Kolkata", "IIT Madras", "IISc Bangalore", "CMI Chennai"],
    pros: ["Highest paying tech role", "Intellectual stimulation", "Research opportunities", "High demand"],
    cons: ["Steep learning curve", "Math-heavy", "Needs higher education usually"],
    matchScore: 88,
  },
  {
    id: 7, title: "Product Manager", domain: "Business",
    salary: { min: 10, max: 35, avg: 18 },
    demandLevel: "High", demandScore: 85,
    difficulty: "Medium", difficultyScore: 60,
    educationLevel: ["Graduation"],
    timeToReady: "4 - 8 months",
    workStyle: "Hybrid / Office",
    jobSatisfaction: 90,
    futureScope: "High — Every tech company needs product managers to drive strategy.",
    topSkills: ["Strategy", "Analytics", "Communication", "Roadmapping", "UX Sense"],
    topCompanies: ["Google", "Microsoft", "Razorpay", "Swiggy", "PhonePe"],
    topColleges: ["IIM Ahmedabad", "IIM Bangalore", "ISB Hyderabad", "XLRI"],
    pros: ["Leadership role", "High salary ceiling", "Creative + analytical mix", "No coding required"],
    cons: ["Needs experience usually", "High pressure", "Ambiguous role definition"],
    matchScore: 82,
  },
  {
    id: 5, title: "UX Designer", domain: "Design",
    salary: { min: 5, max: 20, avg: 10 },
    demandLevel: "Medium", demandScore: 70,
    difficulty: "Medium", difficultyScore: 50,
    educationLevel: ["Class 12", "Graduation"],
    timeToReady: "3 - 6 months",
    workStyle: "Remote / Hybrid",
    jobSatisfaction: 92,
    futureScope: "High — Design-driven companies growing; UX becoming essential for every digital product.",
    topSkills: ["Figma", "User Research", "Prototyping", "UI Design", "Design Systems"],
    topCompanies: ["Google", "Apple", "Swiggy", "Razorpay", "Flipkart"],
    topColleges: ["NID Ahmedabad", "IDC IIT Bombay", "Srishti Bangalore", "MIT Pune"],
    pros: ["Creative freedom", "Remote work friendly", "Growing demand", "Portfolio over degree"],
    cons: ["Lower salary ceiling than engineering", "Subjective feedback", "Role often misunderstood"],
    matchScore: 75,
  },
  {
    id: 4, title: "Chartered Accountant", domain: "Commerce",
    salary: { min: 7, max: 35, avg: 14 },
    demandLevel: "High", demandScore: 80,
    difficulty: "Very High", difficultyScore: 95,
    educationLevel: ["Class 12", "Graduation"],
    timeToReady: "3 - 5 years",
    workStyle: "Office",
    jobSatisfaction: 78,
    futureScope: "Stable — Every company needs accountants and auditors. Automation may change scope.",
    topSkills: ["Accounting", "Taxation", "Audit", "Finance Law", "GST", "Financial Modeling"],
    topCompanies: ["Deloitte", "EY", "PwC", "KPMG", "Grant Thornton"],
    topColleges: ["ICAI", "SRCC Delhi", "Loyola Chennai", "St. Xavier's Kolkata"],
    pros: ["Highly respected profession", "Guaranteed demand", "Own practice option", "Stable income"],
    cons: ["Very long preparation (3-5 yrs)", "High failure rate", "Stressful exam cycle"],
    matchScore: 65,
  },
  {
    id: 3, title: "Doctor (MBBS)", domain: "Healthcare",
    salary: { min: 8, max: 40, avg: 16 },
    demandLevel: "High", demandScore: 92,
    difficulty: "Very High", difficultyScore: 98,
    educationLevel: ["Class 12 (PCB)"],
    timeToReady: "5.5 - 8 years",
    workStyle: "Hospital / Clinic",
    jobSatisfaction: 82,
    futureScope: "Evergreen — Healthcare demand never decreases. Specialisation opens massive earning potential.",
    topSkills: ["Biology", "Clinical Skills", "Diagnosis", "Communication", "Anatomy", "Pharmacology"],
    topCompanies: ["AIIMS", "Apollo", "Fortis", "Max Healthcare", "Medanta"],
    topColleges: ["AIIMS Delhi", "CMC Vellore", "JIPMER", "Maulana Azad MC"],
    pros: ["Most respected profession", "Saves lives", "High earning after specialisation", "Job security"],
    cons: ["Very long education (5.5+ yrs)", "Expensive if private", "Extremely competitive entrance", "Burnout risk"],
    matchScore: 60,
  },
];

const domainColor = {
  Technology: "#6366f1", Healthcare: "#22c55e", Commerce: "#f59e0b",
  Design: "#ec4899", Government: "#64748b", Business: "#38bdf8",
};

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Career Explorer", href: "/careers" },
  { icon: MapPin, label: "Skill Roadmaps", href: "/roadmaps" },
  { icon: Bot, label: "Recommendations", href: "/recommendations" },
  { icon: Bookmark, label: "Saved Careers", href: "/bookmarks" },
  { icon: User, label: "My Profile", href: "/profile" },
];

/* ── Compare Bar Component ── */
function CompareBar({ label, value1, value2, max, color1, color2 }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: color1 }}>{value1}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 8, background: "rgba(99,102,241,0.08)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 8, background: `linear-gradient(90deg, ${color1}, ${color1}cc)`, width: `${(value1 / max) * 100}%`, transition: "width 0.6s ease" }} />
          </div>
        </div>
        <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 500 }}>vs</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: color2 }}>{value2}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 8, background: "rgba(99,102,241,0.08)", overflow: "hidden", direction: "rtl" }}>
            <div style={{ height: "100%", borderRadius: 8, background: `linear-gradient(90deg, ${color2}cc, ${color2})`, width: `${(value2 / max) * 100}%`, transition: "width 0.6s ease" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CareerComparisonPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [career1Id, setCareer1Id] = useState(1);
  const [career2Id, setCareer2Id] = useState(2);
  const [dropdown1Open, setDropdown1Open] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);

  const career1 = careersForComparison.find(c => c.id === career1Id);
  const career2 = careersForComparison.find(c => c.id === career2Id);

  const swapCareers = () => {
    setCareer1Id(career2Id);
    setCareer2Id(career1Id);
  };

  const getBetter = (val1, val2, higherIsBetter = true) => {
    if (val1 === val2) return "tie";
    if (higherIsBetter) return val1 > val2 ? "left" : "right";
    return val1 < val2 ? "left" : "right";
  };

  const color1 = domainColor[career1.domain] || "#6366f1";
  const color2 = domainColor[career2.domain] || "#6366f1";

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9ff", fontFamily: "'DM Sans', sans-serif" }}>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f8f9ff; }
        .grad-text { background: linear-gradient(135deg, #1e293b 20%, #6366f1 70%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        .sidebar { width: 260px; background: #ffffff; border-right: 1px solid rgba(99,102,241,0.1); height: 100vh; position: fixed; top: 0; left: 0; z-index: 50; display: flex; flex-direction: column; transition: transform 0.3s ease; }
        .sidebar-link { display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 10px; margin: 2px 12px; font-size: 0.9rem; color: #64748b; text-decoration: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .sidebar-link:hover { background: rgba(99,102,241,0.06); color: #1e293b; }
        .sidebar-link.active { background: rgba(99,102,241,0.1); color: #6366f1; font-weight: 600; }

        .topbar { height: 68px; background: rgba(255,255,255,0.92); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(99,102,241,0.1); position: fixed; top: 0; right: 0; left: 260px; z-index: 40; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; }

        .compare-card { background: #ffffff; border: 1px solid rgba(99,102,241,0.1); border-radius: 16px; box-shadow: 0 2px 12px rgba(99,102,241,0.05); }

        .career-selector { position: relative; }
        .selector-btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 14px 18px; border: 2px solid rgba(99,102,241,0.15); border-radius: 12px; background: #ffffff; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: border-color 0.2s; }
        .selector-btn:hover { border-color: rgba(99,102,241,0.35); }
        .selector-btn.active { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

        .selector-dropdown { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: #ffffff; border: 1px solid rgba(99,102,241,0.15); border-radius: 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.12); z-index: 20; max-height: 280px; overflow-y: auto; }
        .selector-option { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid rgba(99,102,241,0.05); }
        .selector-option:hover { background: rgba(99,102,241,0.04); }
        .selector-option:last-child { border-bottom: none; }
        .selector-option.selected { background: rgba(99,102,241,0.06); }

        .compare-row { display: grid; grid-template-columns: 1fr auto 1fr; gap: 0; align-items: center; padding: 14px 0; border-bottom: 1px solid rgba(99,102,241,0.06); }
        .compare-row:last-child { border-bottom: none; }

        .compare-label { text-align: center; font-size: 0.78rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; padding: 0 12px; white-space: nowrap; }
        .compare-value { font-size: 0.9rem; font-weight: 600; color: #1e293b; }
        .compare-value.winner { color: #22c55e; }
        .compare-value.left { text-align: right; padding-right: 16px; }
        .compare-value.right { text-align: left; padding-left: 16px; }

        .swap-btn { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; border: 2px solid rgba(99,102,241,0.2); background: #ffffff; cursor: pointer; transition: all 0.3s; z-index: 5; }
        .swap-btn:hover { border-color: #6366f1; background: rgba(99,102,241,0.06); transform: rotate(180deg); }

        .pro-con-item { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; font-size: 0.83rem; line-height: 1.5; }

        .mobile-menu-btn { display: none; background: none; border: 1px solid rgba(99,102,241,0.2); border-radius: 8px; padding: 6px 10px; cursor: pointer; color: #1e293b; align-items: center; justify-content: center; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 45; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }

        .selector-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: center; }

        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); box-shadow: 8px 0 30px rgba(0,0,0,0.1); }
          .topbar { left: 0 !important; }
          .main-content { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 700px) {
          .main-inner { padding: 20px 14px !important; }
          .selector-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
          .swap-btn-wrap { display: flex; justify-content: center; }
          .compare-row { grid-template-columns: 1fr !important; gap: 6px !important; text-align: center !important; }
          .compare-value.left, .compare-value.right { text-align: center !important; padding: 0 !important; }
          .compare-label { padding: 4px 0 !important; }
          .bars-grid { grid-template-columns: 1fr !important; }
          .procon-grid { grid-template-columns: 1fr !important; }
          .skills-compare { flex-direction: column !important; }
        }
        @media (min-width: 901px) { .sidebar-overlay { display: none !important; } }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div style={{ padding: "20px 20px 24px", borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <GraduationCap size={22} color="#6366f1" />
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1rem" }}>
              <span className="grad-text">Smart Career</span><span style={{ color: "#6366f1" }}> Advisor</span>
            </span>
          </a>
        </div>
        <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
          <div style={{ padding: "0 20px 8px", fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>Main Menu</div>
          {sidebarLinks.map((link) => {
            const IconComp = link.icon;
            return (
              <a key={link.label} href={link.href} className={`sidebar-link ${link.active ? "active" : ""}`} onClick={() => setSidebarOpen(false)}>
                <IconComp size={18} />{link.label}
              </a>
            );
          })}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(99,102,241,0.08)" }}>
          <a href="/login" className="sidebar-link" style={{ color: "#ef4444" }}><LogOut size={18} /> Logout</a>
        </div>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── TOPBAR ── */}
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: 8 }}>
            <Scale size={18} color="#6366f1" /> Compare Careers
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 4 }}>
            <Bell size={20} color="#64748b" />
            <span style={{ position: "absolute", top: 2, right: 2, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: "2px solid #ffffff" }} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", color: "#fff", cursor: "pointer" }}>AD</div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content" style={{ marginLeft: 260, paddingTop: 68 }}>
        <div className="main-inner fade-up" style={{ padding: "28px 28px", maxWidth: 1100 }}>

          {/* ── Page Header ── */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.4rem, 3vw, 1.8rem)", fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>
              Compare Careers Side-by-Side
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.93rem" }}>
              Select two careers to compare across salary, demand, difficulty, skills, and more.
            </p>
          </div>

          {/* ── Career Selectors ── */}
          <div className="selector-grid" style={{ marginBottom: 28 }}>

            {/* Career 1 Selector */}
            <div className="career-selector">
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: color1, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Career A</div>
              <button className={`selector-btn ${dropdown1Open ? "active" : ""}`} onClick={() => { setDropdown1Open(!dropdown1Open); setDropdown2Open(false); }}
                style={{ borderColor: dropdown1Open ? color1 : undefined }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: color1 }} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b" }}>{career1.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{career1.domain}</div>
                  </div>
                </div>
                <ChevronDown size={18} color="#94a3b8" style={{ transition: "transform 0.2s", transform: dropdown1Open ? "rotate(180deg)" : "rotate(0)" }} />
              </button>
              {dropdown1Open && (
                <div className="selector-dropdown">
                  {careersForComparison.filter(c => c.id !== career2Id).map(c => {
                    const dCol = domainColor[c.domain] || "#6366f1";
                    return (
                      <div key={c.id} className={`selector-option ${c.id === career1Id ? "selected" : ""}`}
                        onClick={() => { setCareer1Id(c.id); setDropdown1Open(false); }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: dCol }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1e293b" }}>{c.title}</div>
                            <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{c.domain} · {c.matchScore}% match</div>
                          </div>
                        </div>
                        {c.id === career1Id && <CheckCircle size={16} color="#6366f1" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="swap-btn-wrap" style={{ display: "flex", alignItems: "flex-end", paddingBottom: 4 }}>
              <button className="swap-btn" onClick={swapCareers} title="Swap careers">
                <RefreshCw size={18} color="#6366f1" />
              </button>
            </div>

            {/* Career 2 Selector */}
            <div className="career-selector">
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: color2, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Career B</div>
              <button className={`selector-btn ${dropdown2Open ? "active" : ""}`} onClick={() => { setDropdown2Open(!dropdown2Open); setDropdown1Open(false); }}
                style={{ borderColor: dropdown2Open ? color2 : undefined }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: color2 }} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b" }}>{career2.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{career2.domain}</div>
                  </div>
                </div>
                <ChevronDown size={18} color="#94a3b8" style={{ transition: "transform 0.2s", transform: dropdown2Open ? "rotate(180deg)" : "rotate(0)" }} />
              </button>
              {dropdown2Open && (
                <div className="selector-dropdown">
                  {careersForComparison.filter(c => c.id !== career1Id).map(c => {
                    const dCol = domainColor[c.domain] || "#6366f1";
                    return (
                      <div key={c.id} className={`selector-option ${c.id === career2Id ? "selected" : ""}`}
                        onClick={() => { setCareer2Id(c.id); setDropdown2Open(false); }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: dCol }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1e293b" }}>{c.title}</div>
                            <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{c.domain} · {c.matchScore}% match</div>
                          </div>
                        </div>
                        {c.id === career2Id && <CheckCircle size={16} color="#6366f1" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Visual Comparison Bars ── */}
          <div className="compare-card" style={{ padding: "24px 28px", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <BarChart3 size={18} color="#6366f1" /> Visual Comparison
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: color1 }}>{career1.title}</span>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: color2 }}>{career2.title}</span>
            </div>
            <CompareBar label="Match Score" value1={career1.matchScore} value2={career2.matchScore} max={100} color1={color1} color2={color2} />
            <CompareBar label="Market Demand" value1={career1.demandScore} value2={career2.demandScore} max={100} color1={color1} color2={color2} />
            <CompareBar label="Difficulty Level" value1={career1.difficultyScore} value2={career2.difficultyScore} max={100} color1={color1} color2={color2} />
            <CompareBar label="Job Satisfaction" value1={career1.jobSatisfaction} value2={career2.jobSatisfaction} max={100} color1={color1} color2={color2} />
          </div>

          {/* ── Detail Comparison Table ── */}
          <div className="compare-card" style={{ padding: "24px 28px", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <Briefcase size={18} color="#6366f1" /> Detailed Comparison
            </h3>

            {[
              { label: "Avg Salary", left: `₹${career1.salary.avg}L/yr`, right: `₹${career2.salary.avg}L/yr`, better: getBetter(career1.salary.avg, career2.salary.avg) },
              { label: "Salary Range", left: `₹${career1.salary.min}L - ₹${career1.salary.max}L`, right: `₹${career2.salary.min}L - ₹${career2.salary.max}L`, better: getBetter(career1.salary.max, career2.salary.max) },
              { label: "Demand", left: career1.demandLevel, right: career2.demandLevel, better: getBetter(career1.demandScore, career2.demandScore) },
              { label: "Difficulty", left: career1.difficulty, right: career2.difficulty, better: getBetter(career1.difficultyScore, career2.difficultyScore, false) },
              { label: "Time to Ready", left: career1.timeToReady, right: career2.timeToReady, better: "tie" },
              { label: "Work Style", left: career1.workStyle, right: career2.workStyle, better: "tie" },
              { label: "Education", left: career1.educationLevel.join(", "), right: career2.educationLevel.join(", "), better: "tie" },
              { label: "Match Score", left: `${career1.matchScore}%`, right: `${career2.matchScore}%`, better: getBetter(career1.matchScore, career2.matchScore) },
            ].map((row, i) => (
              <div key={i} className="compare-row">
                <div className={`compare-value left ${row.better === "left" ? "winner" : ""}`}>
                  {row.better === "left" && <Star size={12} fill="#22c55e" color="#22c55e" style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />}
                  {row.left}
                </div>
                <div className="compare-label">{row.label}</div>
                <div className={`compare-value right ${row.better === "right" ? "winner" : ""}`}>
                  {row.right}
                  {row.better === "right" && <Star size={12} fill="#22c55e" color="#22c55e" style={{ display: "inline", marginLeft: 4, verticalAlign: "middle" }} />}
                </div>
              </div>
            ))}
          </div>

          {/* ── Skills Comparison ── */}
          <div className="compare-card" style={{ padding: "24px 28px", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <Zap size={18} color="#6366f1" /> Skills Required
            </h3>
            <div className="skills-compare" style={{ display: "flex", gap: 24 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: color1, marginBottom: 10 }}>{career1.title}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {career1.topSkills.map(skill => (
                    <span key={skill} style={{ background: `${color1}10`, color: color1, padding: "5px 12px", borderRadius: 8, fontSize: "0.78rem", fontWeight: 500, border: `1px solid ${color1}25` }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ width: 1, background: "rgba(99,102,241,0.1)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: color2, marginBottom: 10 }}>{career2.title}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {career2.topSkills.map(skill => (
                    <span key={skill} style={{ background: `${color2}10`, color: color2, padding: "5px 12px", borderRadius: 8, fontSize: "0.78rem", fontWeight: 500, border: `1px solid ${color2}25` }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Pros & Cons ── */}
          <div className="procon-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

            {/* Career 1 Pros/Cons */}
            <div className="compare-card" style={{ padding: "22px 24px" }}>
              <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#1e293b", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: color1 }} />
                {career1.title}
              </h4>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#22c55e", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Pros</div>
                {career1.pros.map((pro, i) => (
                  <div key={i} className="pro-con-item">
                    <CheckCircle size={14} color="#22c55e" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ color: "#475569" }}>{pro}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ef4444", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Cons</div>
                {career1.cons.map((con, i) => (
                  <div key={i} className="pro-con-item">
                    <XCircle size={14} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ color: "#475569" }}>{con}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Career 2 Pros/Cons */}
            <div className="compare-card" style={{ padding: "22px 24px" }}>
              <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#1e293b", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: color2 }} />
                {career2.title}
              </h4>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#22c55e", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Pros</div>
                {career2.pros.map((pro, i) => (
                  <div key={i} className="pro-con-item">
                    <CheckCircle size={14} color="#22c55e" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ color: "#475569" }}>{pro}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ef4444", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Cons</div>
                {career2.cons.map((con, i) => (
                  <div key={i} className="pro-con-item">
                    <XCircle size={14} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ color: "#475569" }}>{con}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Future Scope ── */}
          <div className="procon-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div className="compare-card" style={{ padding: "22px 24px" }}>
              <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1e293b", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <TrendingUp size={16} color={color1} /> Future Scope
              </h4>
              <p style={{ color: "#475569", fontSize: "0.85rem", lineHeight: 1.7 }}>{career1.futureScope}</p>
            </div>
            <div className="compare-card" style={{ padding: "22px 24px" }}>
              <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1e293b", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <TrendingUp size={16} color={color2} /> Future Scope
              </h4>
              <p style={{ color: "#475569", fontSize: "0.85rem", lineHeight: 1.7 }}>{career2.futureScope}</p>
            </div>
          </div>

          {/* ── Top Companies ── */}
          <div className="procon-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div className="compare-card" style={{ padding: "22px 24px" }}>
              <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1e293b", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Building size={16} color={color1} /> Top Companies
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {career1.topCompanies.map(c => (
                  <span key={c} style={{ background: "#f8f9ff", color: "#1e293b", padding: "6px 14px", borderRadius: 8, fontSize: "0.82rem", fontWeight: 500, border: "1px solid rgba(99,102,241,0.08)" }}>{c}</span>
                ))}
              </div>
            </div>
            <div className="compare-card" style={{ padding: "22px 24px" }}>
              <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1e293b", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Building size={16} color={color2} /> Top Companies
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {career2.topCompanies.map(c => (
                  <span key={c} style={{ background: "#f8f9ff", color: "#1e293b", padding: "6px 14px", borderRadius: 8, fontSize: "0.82rem", fontWeight: 500, border: "1px solid rgba(99,102,241,0.08)" }}>{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Action CTA ── */}
          <div style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(56,189,248,0.06))",
            border: "1px solid rgba(99,102,241,0.15)",
            borderRadius: 16, padding: "24px 28px", textAlign: "center",
          }}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
              Made your decision?
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.88rem", marginBottom: 20 }}>
              View the detailed roadmap to start your journey.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href={`/roadmap/${career1.id}`} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "#fff", padding: "12px 24px", borderRadius: 10,
                fontWeight: 600, fontSize: "0.88rem", textDecoration: "none",
                transition: "transform 0.2s",
              }}
                onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
                {career1.title} Roadmap <ArrowRight size={16} />
              </a>
              <a href={`/roadmap/${career2.id}`} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#ffffff", color: "#6366f1",
                padding: "12px 24px", borderRadius: 10,
                fontWeight: 600, fontSize: "0.88rem", textDecoration: "none",
                border: "1.5px solid rgba(99,102,241,0.2)", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; e.currentTarget.style.background = "#ffffff"; }}>
                {career2.title} Roadmap <ArrowRight size={16} />
              </a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}