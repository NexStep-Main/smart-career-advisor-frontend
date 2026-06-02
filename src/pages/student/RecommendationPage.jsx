import { useState } from "react";
import {
  GraduationCap, Bot, Bookmark, TrendingUp, Briefcase,
  ChevronRight, RefreshCw, Sparkles, Map, MapPin,
  Bell, User, LogOut, BarChart3, Menu, X, Filter,
  ArrowRight, CheckCircle, Star, Zap, Target
} from "lucide-react";

/* ── Mock Recommendation Data ── */
const recommendations = [
  {
    id: 1, title: "Software Engineer", domain: "Technology",
    matchScore: 95, confidence: "Very High",
    salary: { min: 6, max: 25 },
    demandLevel: "High",
    skills: ["JavaScript", "React", "Node.js", "DSA"],
    description: "Build scalable applications and software systems used by millions of people worldwide.",
    reasons: [
      "Your quiz shows strong interest in Technology",
      "Engineering stream is a perfect fit",
      "High salary aligns with your priority",
      "Analytical work style matches this role",
    ],
    missingSkills: ["System Design", "Cloud Computing"],
    timeToReady: "6 - 12 months",
  },
  {
    id: 2, title: "Data Scientist", domain: "Technology",
    matchScore: 88, confidence: "High",
    salary: { min: 8, max: 30 },
    demandLevel: "High",
    skills: ["Python", "Machine Learning", "Statistics", "SQL"],
    description: "Analyse complex datasets and build predictive models to drive smarter business decisions.",
    reasons: [
      "Strong analytical work style preference",
      "Interest in Technology domain",
      "Science background supports this path",
      "High growth career aligns with your goals",
    ],
    missingSkills: ["Deep Learning", "TensorFlow"],
    timeToReady: "8 - 14 months",
  },
  {
    id: 7, title: "Product Manager", domain: "Business",
    matchScore: 82, confidence: "High",
    salary: { min: 10, max: 35 },
    demandLevel: "High",
    skills: ["Strategy", "Analytics", "Communication", "Roadmapping"],
    description: "Lead product vision and strategy, working across engineering, design and business teams.",
    reasons: [
      "Good mix of analytical and social skills",
      "Interest in both Technology and Business",
      "Leadership potential matches this role",
      "High salary career path",
    ],
    missingSkills: ["Product Analytics", "A/B Testing"],
    timeToReady: "4 - 8 months",
  },
  {
    id: 5, title: "UX Designer", domain: "Design",
    matchScore: 75, confidence: "Medium",
    salary: { min: 5, max: 20 },
    demandLevel: "Medium",
    skills: ["Figma", "User Research", "Prototyping", "UI Design"],
    description: "Design intuitive and beautiful digital experiences that users love to interact with.",
    reasons: [
      "Creative interest area detected",
      "Visual and analytical thinking combination",
      "Growing demand in Indian market",
      "Can transition from engineering background",
    ],
    missingSkills: ["Figma Advanced", "Design Systems"],
    timeToReady: "3 - 6 months",
  },
  {
    id: 12, title: "Digital Marketer", domain: "Business",
    matchScore: 70, confidence: "Medium",
    salary: { min: 3, max: 18 },
    demandLevel: "High",
    skills: ["SEO", "Social Media", "Google Ads", "Content Strategy"],
    description: "Grow brands and businesses online through strategic campaigns across digital channels.",
    reasons: [
      "Creative and analytical blend",
      "Business interest area matches",
      "Low barrier to entry",
      "High demand with flexible work options",
    ],
    missingSkills: ["Google Analytics", "Paid Ads"],
    timeToReady: "2 - 4 months",
  },
  {
    id: 4, title: "Chartered Accountant", domain: "Commerce",
    matchScore: 65, confidence: "Medium",
    salary: { min: 7, max: 35 },
    demandLevel: "High",
    skills: ["Accounting", "Taxation", "Audit", "Finance Law"],
    description: "Manage financial records, tax planning, and auditing for individuals and organisations.",
    reasons: [
      "Analytical work style is a good match",
      "High salary career option",
      "Evergreen demand in India",
      "Structured career progression",
    ],
    missingSkills: ["GST Knowledge", "Financial Modeling"],
    timeToReady: "3 - 5 years",
  },
];

/* ── User Quiz Profile (Mock) ── */
const userProfile = {
  educationLevel: "Graduation",
  stream: "Engineering (B.Tech CSE)",
  interests: ["Technology", "Business", "Creative Arts"],
  workStyle: "Analytical",
  priority: "High Salary",
};

const domainColor = {
  Technology: "#6366f1", Healthcare: "#22c55e", Commerce: "#f59e0b",
  Design: "#ec4899", Government: "#64748b", Business: "#38bdf8",
  Law: "#8b5cf6", Engineering: "#f97316",
};

const confidenceColor = {
  "Very High": "#22c55e", High: "#6366f1", Medium: "#f59e0b", Low: "#ef4444",
};

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Career Explorer", href: "/careers" },
  { icon: MapPin, label: "Skill Roadmaps", href: "/roadmaps" },
  { icon: Bot, label: "Recommendations", href: "/recommendations", active: true },
  { icon: Bookmark, label: "Saved Careers", href: "/bookmarks" },
  { icon: User, label: "My Profile", href: "/profile" },
];

export default function RecommendationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedCareers, setSavedCareers] = useState([]);
  const [showAllReasons, setShowAllReasons] = useState({});
  const [filterDomain, setFilterDomain] = useState("All");

  const toggleSave = (id) => {
    setSavedCareers(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const toggleReasons = (id) => {
    setShowAllReasons(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredRecs = filterDomain === "All"
    ? recommendations
    : recommendations.filter(r => r.domain === filterDomain);

  const uniqueDomains = ["All", ...new Set(recommendations.map(r => r.domain))];

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

        .rec-card { background: #ffffff; border: 1px solid rgba(99,102,241,0.1); border-radius: 16px; padding: 24px; transition: transform 0.2s, box-shadow 0.2s; }
        .rec-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(99,102,241,0.12); }

        .match-ring { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.1rem; flex-shrink: 0; }

        .reason-item { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; }

        .filter-chip { padding: 7px 16px; border-radius: 50px; border: 1.5px solid rgba(99,102,241,0.15); background: #ffffff; color: #64748b; font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .filter-chip:hover { border-color: rgba(99,102,241,0.35); color: #6366f1; }
        .filter-chip.active { background: #6366f1; color: #ffffff; border-color: #6366f1; }

        .bookmark-btn { width: 38px; height: 38px; border-radius: 10px; border: 1px solid rgba(99,102,241,0.15); background: #f8f9ff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
        .bookmark-btn:hover { background: rgba(99,102,241,0.06); border-color: rgba(99,102,241,0.3); }
        .bookmark-btn.saved { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); }

        .profile-tag { display: inline-flex; align-items: center; gap: 4px; background: #f8f9ff; color: #475569; padding: 5px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 500; border: 1px solid rgba(99,102,241,0.08); }

        .mobile-menu-btn { display: none; background: none; border: 1px solid rgba(99,102,241,0.2); border-radius: 8px; padding: 6px 10px; cursor: pointer; color: #1e293b; align-items: center; justify-content: center; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 45; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }

        .rec-layout { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }

        @media (max-width: 1100px) { .rec-layout { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); box-shadow: 8px 0 30px rgba(0,0,0,0.1); }
          .topbar { left: 0 !important; }
          .main-content { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 600px) {
          .main-inner { padding: 20px 14px !important; }
          .rec-card { padding: 18px !important; }
          .rec-top-row { flex-direction: column !important; gap: 12px !important; }
          .profile-tags { flex-wrap: wrap !important; }
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
            <Sparkles size={18} color="#6366f1" /> AI Recommendations
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
        <div className="main-inner fade-up" style={{ padding: "28px 28px", maxWidth: 1300 }}>

          {/* ── Hero Banner ── */}
          <div style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(56,189,248,0.06) 100%)",
            border: "1px solid rgba(99,102,241,0.15)",
            borderRadius: 16, padding: "24px 28px", marginBottom: 24,
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Bot size={20} color="#6366f1" />
                <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.3rem, 3vw, 1.7rem)", fontWeight: 800, color: "#1e293b" }}>
                  Your Career Recommendations
                </h1>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.93rem", maxWidth: 520 }}>
                Based on your quiz answers, we found <strong style={{ color: "#6366f1" }}>{recommendations.length} career paths</strong> that match your profile. Sorted by match score.
              </p>
            </div>
            <button style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#ffffff", color: "#6366f1",
              padding: "10px 20px", borderRadius: 10,
              fontWeight: 600, fontSize: "0.88rem",
              border: "1.5px solid rgba(99,102,241,0.2)",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.06)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; }}>
              <RefreshCw size={16} /> Retake Quiz
            </button>
          </div>

          {/* ── Domain Filters ── */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <Filter size={16} color="#6366f1" />
            {uniqueDomains.map(domain => (
              <button key={domain}
                className={`filter-chip ${filterDomain === domain ? "active" : ""}`}
                onClick={() => setFilterDomain(domain)}>
                {domain}
              </button>
            ))}
          </div>

          {/* ── Main Layout ── */}
          <div className="rec-layout">

            {/* Left — Recommendation Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filteredRecs.map((rec, index) => {
                const isSaved = savedCareers.includes(rec.id);
                const dColor = domainColor[rec.domain] || "#6366f1";
                const cColor = confidenceColor[rec.confidence] || "#6366f1";
                const showReasons = showAllReasons[rec.id];
                const matchColor = rec.matchScore >= 90 ? "#22c55e" : rec.matchScore >= 80 ? "#6366f1" : rec.matchScore >= 70 ? "#f59e0b" : "#94a3b8";

                return (
                  <div key={rec.id} className="rec-card">

                    {/* Top row — rank badge + match ring */}
                    <div className="rec-top-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flex: 1 }}>

                        {/* Match score ring */}
                        <div className="match-ring" style={{
                          background: `conic-gradient(${matchColor} ${rec.matchScore * 3.6}deg, rgba(99,102,241,0.08) 0deg)`,
                          color: matchColor,
                        }}>
                          <div style={{
                            width: 52, height: 52, borderRadius: "50%",
                            background: "#ffffff", display: "flex",
                            alignItems: "center", justifyContent: "center",
                          }}>
                            {rec.matchScore}%
                          </div>
                        </div>

                        <div style={{ flex: 1 }}>
                          {/* Badges */}
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                            {index === 0 && (
                              <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(34,197,94,0.08)", color: "#22c55e", padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 700, border: "1px solid rgba(34,197,94,0.2)" }}>
                                <Star size={11} fill="#22c55e" /> Best Match
                              </span>
                            )}
                            <span style={{ background: `${dColor}12`, color: dColor, padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 600, border: `1px solid ${dColor}25` }}>
                              {rec.domain}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 3, color: cColor, fontSize: "0.72rem", fontWeight: 600 }}>
                              <Target size={11} /> {rec.confidence} Confidence
                            </span>
                          </div>

                          {/* Title */}
                          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                            #{index + 1} {rec.title}
                          </h3>
                          <p style={{ color: "#475569", fontSize: "0.85rem", lineHeight: 1.6 }}>{rec.description}</p>
                        </div>
                      </div>

                      {/* Bookmark */}
                      <button className={`bookmark-btn ${isSaved ? "saved" : ""}`} onClick={() => toggleSave(rec.id)}>
                        <Bookmark size={16} color={isSaved ? "#6366f1" : "#94a3b8"} fill={isSaved ? "#6366f1" : "none"} />
                      </button>
                    </div>

                    {/* Info row */}
                    <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#64748b", fontSize: "0.82rem" }}>
                        <Briefcase size={13} color="#6366f1" />
                        ₹{rec.salary.min}L – ₹{rec.salary.max}L / yr
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.82rem" }}>
                        <TrendingUp size={13} color={rec.demandLevel === "High" ? "#22c55e" : "#f59e0b"} />
                        <span style={{ color: rec.demandLevel === "High" ? "#22c55e" : "#f59e0b", fontWeight: 600 }}>
                          {rec.demandLevel} Demand
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#64748b", fontSize: "0.82rem" }}>
                        <Zap size={13} color="#6366f1" />
                        Ready in {rec.timeToReady}
                      </div>
                    </div>

                    {/* Skills */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                      {rec.skills.map(skill => (
                        <span key={skill} style={{ background: "rgba(99,102,241,0.06)", color: "#6366f1", padding: "4px 10px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 500, border: "1px solid rgba(99,102,241,0.12)" }}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Why this career */}
                    <div style={{ background: "#f8f9ff", border: "1px solid rgba(99,102,241,0.08)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.82rem", fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: 6 }}>
                          <Sparkles size={14} color="#6366f1" /> Why this career?
                        </span>
                        {rec.reasons.length > 2 && (
                          <button onClick={() => toggleReasons(rec.id)}
                            style={{ background: "none", border: "none", color: "#6366f1", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                            {showReasons ? "Show less" : "Show all"}
                          </button>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {(showReasons ? rec.reasons : rec.reasons.slice(0, 2)).map((reason, i) => (
                          <div key={i} className="reason-item">
                            <CheckCircle size={14} color="#22c55e" style={{ marginTop: 2, flexShrink: 0 }} />
                            <span style={{ color: "#475569", fontSize: "0.82rem", lineHeight: 1.5 }}>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Missing skills */}
                    {rec.missingSkills.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 500 }}>Skills to learn:</span>
                        {rec.missingSkills.map(skill => (
                          <span key={skill} style={{ background: "rgba(245,158,11,0.08)", color: "#f59e0b", padding: "3px 10px", borderRadius: 6, fontSize: "0.72rem", fontWeight: 600, border: "1px solid rgba(245,158,11,0.2)" }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <a href={`/careers/${rec.id}`} style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "10px 0", borderRadius: 10,
                        background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                        color: "#fff", fontWeight: 600, fontSize: "0.85rem",
                        textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s",
                        minWidth: 140,
                      }}
                        onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 16px rgba(99,102,241,0.3)"; }}
                        onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}>
                        View Details <ChevronRight size={16} />
                      </a>
                      <a href={`/roadmap/${rec.id}`} style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "10px 0", borderRadius: 10,
                        background: "#ffffff", color: "#6366f1",
                        fontWeight: 600, fontSize: "0.85rem",
                        textDecoration: "none",
                        border: "1.5px solid rgba(99,102,241,0.2)",
                        transition: "all 0.2s", minWidth: 140,
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; e.currentTarget.style.background = "#ffffff"; }}>
                        <MapPin size={14} /> View Roadmap
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right — Profile Summary + Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Your Profile */}
              <div style={{ background: "#ffffff", border: "1px solid rgba(99,102,241,0.1)", borderRadius: 16, padding: "22px 24px", boxShadow: "0 2px 12px rgba(99,102,241,0.05)" }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <User size={16} color="#6366f1" /> Your Profile
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Education</div>
                    <span className="profile-tag">{userProfile.educationLevel}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Stream</div>
                    <span className="profile-tag">{userProfile.stream}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Interests</div>
                    <div className="profile-tags" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {userProfile.interests.map(i => (
                        <span key={i} className="profile-tag">{i}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Work Style</div>
                    <span className="profile-tag">{userProfile.workStyle}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Priority</div>
                    <span className="profile-tag">{userProfile.priority}</span>
                  </div>
                </div>
                <a href="/onboarding" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  marginTop: 16, padding: "10px 0", borderRadius: 10,
                  border: "1.5px solid rgba(99,102,241,0.2)", color: "#6366f1",
                  fontWeight: 600, fontSize: "0.85rem", textDecoration: "none",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.04)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; }}>
                  <RefreshCw size={14} /> Update Profile
                </a>
              </div>

              {/* Match Score Legend */}
              <div style={{ background: "#ffffff", border: "1px solid rgba(99,102,241,0.1)", borderRadius: 16, padding: "22px 24px", boxShadow: "0 2px 12px rgba(99,102,241,0.05)" }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>
                  Match Score Guide
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { range: "90 - 100%", label: "Excellent Match", color: "#22c55e" },
                    { range: "80 - 89%", label: "Strong Match", color: "#6366f1" },
                    { range: "70 - 79%", label: "Good Match", color: "#f59e0b" },
                    { range: "Below 70%", label: "Moderate Match", color: "#94a3b8" },
                  ].map(item => (
                    <div key={item.range} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem" }}>
                      <div style={{ width: 12, height: 12, borderRadius: 4, background: item.color, flexShrink: 0 }} />
                      <span style={{ color: "#64748b", flex: 1 }}>{item.range}</span>
                      <span style={{ color: item.color, fontWeight: 600, fontSize: "0.8rem" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How it works */}
              <div style={{ background: "#ffffff", border: "1px solid rgba(99,102,241,0.1)", borderRadius: 16, padding: "22px 24px", boxShadow: "0 2px 12px rgba(99,102,241,0.05)" }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <Bot size={16} color="#6366f1" /> How it works
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { step: "1", text: "We analyse your quiz answers — education, stream, interests, work style, and priority." },
                    { step: "2", text: "Our engine scores each career against your profile using weighted matching." },
                    { step: "3", text: "Results are ranked by match score and shown with reasons and confidence levels." },
                  ].map(item => (
                    <div key={item.step} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: "rgba(99,102,241,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "#6366f1", flexShrink: 0, border: "1px solid rgba(99,102,241,0.15)" }}>
                        {item.step}
                      </div>
                      <p style={{ color: "#475569", fontSize: "0.82rem", lineHeight: 1.5 }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(56,189,248,0.06))",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: 16, padding: "22px 24px", textAlign: "center",
              }}>
                <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                  Want to explore more?
                </h4>
                <p style={{ color: "#64748b", fontSize: "0.82rem", marginBottom: 14, lineHeight: 1.5 }}>
                  Browse all available careers across every domain.
                </p>
                <a href="/careers" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  color: "#fff", padding: "10px 22px", borderRadius: 10,
                  fontWeight: 600, fontSize: "0.85rem", textDecoration: "none",
                  transition: "transform 0.2s",
                }}
                  onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
                  <Map size={16} /> Browse All Careers
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}