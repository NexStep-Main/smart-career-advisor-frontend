import { useState } from "react";
import {
  GraduationCap, Bookmark, TrendingUp, Briefcase, Trash2,
  ChevronRight, Map, MapPin, Bot, Bell, User, LogOut,
  BarChart3, Menu, X, FolderOpen, Search, ArrowUpDown
} from "lucide-react";

/* ── Mock Saved Careers ── */
const initialSavedCareers = [
  {
    id: 1, title: "Software Engineer", domain: "Technology",
    salary: { min: 6, max: 25 }, demandLevel: "High",
    skills: ["JavaScript", "React", "Node.js", "DSA"],
    description: "Build scalable applications and software systems used by millions of people worldwide.",
    matchScore: 95, savedAt: "2 days ago",
  },
  {
    id: 2, title: "Data Scientist", domain: "Technology",
    salary: { min: 8, max: 30 }, demandLevel: "High",
    skills: ["Python", "Machine Learning", "Statistics", "SQL"],
    description: "Analyse complex datasets and build predictive models to drive smarter business decisions.",
    matchScore: 88, savedAt: "3 days ago",
  },
  {
    id: 7, title: "Product Manager", domain: "Business",
    salary: { min: 10, max: 35 }, demandLevel: "High",
    skills: ["Strategy", "Analytics", "Communication", "Roadmapping"],
    description: "Lead product vision and strategy, working across engineering, design and business teams.",
    matchScore: 82, savedAt: "5 days ago",
  },
  {
    id: 5, title: "UX Designer", domain: "Design",
    salary: { min: 5, max: 20 }, demandLevel: "Medium",
    skills: ["Figma", "User Research", "Prototyping", "UI Design"],
    description: "Design intuitive and beautiful digital experiences that users love to interact with.",
    matchScore: 75, savedAt: "1 week ago",
  },
  {
    id: 4, title: "Chartered Accountant", domain: "Commerce",
    salary: { min: 7, max: 35 }, demandLevel: "High",
    skills: ["Accounting", "Taxation", "Audit", "Finance Law"],
    description: "Manage financial records, tax planning, and auditing for individuals and organisations.",
    matchScore: 65, savedAt: "1 week ago",
  },
];

const domainColor = {
  Technology: "#6366f1", Healthcare: "#22c55e", Commerce: "#f59e0b",
  Design: "#ec4899", Government: "#64748b", Business: "#38bdf8",
  Law: "#8b5cf6", Engineering: "#f97316",
};

const demandColor = { High: "#22c55e", Medium: "#f59e0b", Low: "#ef4444" };

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Career Explorer", href: "/careers" },
  { icon: MapPin, label: "Skill Roadmaps", href: "/roadmaps" },
  { icon: Bot, label: "Recommendations", href: "/recommendations" },
  { icon: Bookmark, label: "Saved Careers", href: "/bookmarks", active: true },
  { icon: User, label: "My Profile", href: "/profile" },
];

const sortOptions = ["Recently Saved", "Highest Match", "Highest Salary", "A - Z"];

export default function BookmarksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedCareers, setSavedCareers] = useState(initialSavedCareers);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Recently Saved");
  const [removeConfirm, setRemoveConfirm] = useState(null);

  const removeSavedCareer = (id) => {
    setSavedCareers(prev => prev.filter(c => c.id !== id));
    setRemoveConfirm(null);
  };

  const filteredCareers = savedCareers
    .filter(career =>
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "Highest Match") return b.matchScore - a.matchScore;
      if (sortBy === "Highest Salary") return b.salary.max - a.salary.max;
      if (sortBy === "A - Z") return a.title.localeCompare(b.title);
      return 0;
    });

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

        .bookmark-card { background: #ffffff; border: 1px solid rgba(99,102,241,0.1); border-radius: 16px; padding: 22px; transition: transform 0.2s, box-shadow 0.2s; position: relative; }
        .bookmark-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(99,102,241,0.12); }

        .search-input { padding: 10px 16px 10px 42px; border: 1.5px solid rgba(99,102,241,0.12); border-radius: 10px; font-size: 0.9rem; font-family: 'DM Sans', sans-serif; background: #ffffff; color: #1e293b; outline: none; width: 100%; transition: border-color 0.2s, box-shadow 0.2s; }
        .search-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .search-input::placeholder { color: #94a3b8; }

        .sort-select { padding: 9px 14px; border-radius: 10px; border: 1.5px solid rgba(99,102,241,0.15); background: #ffffff; color: #64748b; font-size: 0.85rem; font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; }
        .sort-select:focus { border-color: #6366f1; }

        .remove-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; border: 1px solid rgba(239,68,68,0.15); background: #ffffff; cursor: pointer; transition: all 0.2s; color: #94a3b8; }
        .remove-btn:hover { background: rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.3); color: #ef4444; }

        .confirm-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.95); border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; z-index: 2; backdrop-filter: blur(4px); }

        .mobile-menu-btn { display: none; background: none; border: 1px solid rgba(99,102,241,0.2); border-radius: 8px; padding: 6px 10px; cursor: pointer; color: #1e293b; align-items: center; justify-content: center; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 45; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }

        @keyframes fadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }

        .bookmarks-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

        @media (max-width: 1100px) { .bookmarks-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); box-shadow: 8px 0 30px rgba(0,0,0,0.1); }
          .topbar { left: 0 !important; }
          .main-content { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 600px) {
          .main-inner { padding: 20px 14px !important; }
          .bookmark-card { padding: 16px !important; }
          .controls-row { flex-direction: column !important; }
          .search-wrap { width: 100% !important; }
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
            <Bookmark size={18} color="#6366f1" /> Saved Careers
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
        <div className="main-inner fade-up" style={{ padding: "28px 28px", maxWidth: 1200 }}>

          {/* ── Page Header ── */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.4rem, 3vw, 1.8rem)", fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>
              Your Saved Careers
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.93rem" }}>
              You have <strong style={{ color: "#6366f1" }}>{savedCareers.length} career{savedCareers.length !== 1 ? "s" : ""}</strong> saved. Review, compare, or start learning.
            </p>
          </div>

          {/* ── Controls Row ── */}
          <div className="controls-row" style={{
            display: "flex", gap: 12, marginBottom: 24, alignItems: "center",
            flexWrap: "wrap",
          }}>
            {/* Search */}
            <div className="search-wrap" style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <Search size={16} color="#94a3b8" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text" placeholder="Search saved careers..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                  <X size={14} color="#94a3b8" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ArrowUpDown size={14} color="#64748b" />
              <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {sortOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Clear all */}
            {savedCareers.length > 0 && (
              <button onClick={() => setSavedCareers([])}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 16px", borderRadius: 10,
                  border: "1px solid rgba(239,68,68,0.2)",
                  background: "rgba(239,68,68,0.04)", color: "#ef4444",
                  fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.04)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; }}>
                <Trash2 size={14} /> Clear All
              </button>
            )}
          </div>

          {/* ── Bookmarks Grid ── */}
          {filteredCareers.length > 0 ? (
            <div className="bookmarks-grid">
              {filteredCareers.map((career) => {
                const dColor = domainColor[career.domain] || "#6366f1";
                const matchColor = career.matchScore >= 90 ? "#22c55e" : career.matchScore >= 80 ? "#6366f1" : career.matchScore >= 70 ? "#f59e0b" : "#94a3b8";

                return (
                  <div key={career.id} className="bookmark-card">

                    {/* Remove confirmation overlay */}
                    {removeConfirm === career.id && (
                      <div className="confirm-overlay">
                        <Trash2 size={28} color="#ef4444" />
                        <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#1e293b" }}>
                          Remove {career.title}?
                        </p>
                        <p style={{ color: "#64748b", fontSize: "0.82rem" }}>This career will be removed from your saved list.</p>
                        <div style={{ display: "flex", gap: 10 }}>
                          <button onClick={() => setRemoveConfirm(null)}
                            style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid rgba(99,102,241,0.2)", background: "#ffffff", color: "#64748b", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                            Cancel
                          </button>
                          <button onClick={() => removeSavedCareer(career.id)}
                            style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#ef4444", color: "#ffffff", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Top row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                          <span style={{ background: `${dColor}12`, color: dColor, padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 600, border: `1px solid ${dColor}25` }}>
                            {career.domain}
                          </span>
                          <span style={{ background: `${matchColor}12`, color: matchColor, padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 700, border: `1px solid ${matchColor}25` }}>
                            {career.matchScore}% match
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 3, color: demandColor[career.demandLevel], fontSize: "0.72rem", fontWeight: 600 }}>
                            <TrendingUp size={12} /> {career.demandLevel}
                          </span>
                        </div>
                        <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#1e293b", lineHeight: 1.3 }}>
                          {career.title}
                        </h3>
                      </div>

                      {/* Remove button */}
                      <button className="remove-btn" onClick={() => setRemoveConfirm(career.id)} title="Remove from saved">
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Description */}
                    <p style={{ color: "#475569", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: 14 }}>
                      {career.description}
                    </p>

                    {/* Salary */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, color: "#64748b", fontSize: "0.82rem" }}>
                      <Briefcase size={13} color="#6366f1" />
                      ₹{career.salary.min}L – ₹{career.salary.max}L / yr
                    </div>

                    {/* Skills */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                      {career.skills.map(skill => (
                        <span key={skill} style={{ background: "rgba(99,102,241,0.06)", color: "#6366f1", padding: "4px 10px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 500, border: "1px solid rgba(99,102,241,0.12)" }}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Saved time */}
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 16 }}>
                      Saved {career.savedAt}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 10 }}>
                      <a href={`/careers/${career.id}`} style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "10px 0", borderRadius: 10,
                        background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                        color: "#fff", fontWeight: 600, fontSize: "0.85rem",
                        textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                        onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 16px rgba(99,102,241,0.3)"; }}
                        onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}>
                        View Details <ChevronRight size={16} />
                      </a>
                      <a href={`/roadmap/${career.id}`} style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "10px 0", borderRadius: 10,
                        background: "#ffffff", color: "#6366f1",
                        fontWeight: 600, fontSize: "0.85rem", textDecoration: "none",
                        border: "1.5px solid rgba(99,102,241,0.2)", transition: "all 0.2s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; e.currentTarget.style.background = "#ffffff"; }}>
                        <MapPin size={14} /> Roadmap
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : savedCareers.length === 0 ? (

            /* ── Empty state — No saved careers ── */
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <FolderOpen size={36} color="#6366f1" />
              </div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                No saved careers yet
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.93rem", marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>
                Explore career paths and save the ones you like. They will appear here for quick access.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="/careers" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  color: "#fff", padding: "12px 28px", borderRadius: 10,
                  fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
                  transition: "transform 0.2s",
                }}
                  onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
                  <Map size={16} /> Explore Careers
                </a>
                <a href="/recommendations" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#ffffff", color: "#6366f1",
                  padding: "12px 28px", borderRadius: 10,
                  fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
                  border: "1.5px solid rgba(99,102,241,0.2)", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; e.currentTarget.style.background = "#ffffff"; }}>
                  <Bot size={16} /> View Recommendations
                </a>
              </div>
            </div>
          ) : (

            /* ── Empty state — No search results ── */
            <div style={{ textAlign: "center", padding: "60px 24px" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                No results found
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: 20 }}>
                Try a different search term.
              </p>
              <button onClick={() => setSearchQuery("")}
                style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Clear Search
              </button>
            </div>
          )}

          {/* ── Quick Stats Bar ── */}
          {savedCareers.length > 0 && (
            <div style={{
              display: "flex", justifyContent: "center", gap: 32,
              marginTop: 32, padding: "20px 24px",
              background: "#ffffff", border: "1px solid rgba(99,102,241,0.1)",
              borderRadius: 14, flexWrap: "wrap",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#6366f1" }}>
                  {savedCareers.length}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.78rem" }}>Careers Saved</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#22c55e" }}>
                  {Math.round(savedCareers.reduce((acc, c) => acc + c.matchScore, 0) / savedCareers.length)}%
                </div>
                <div style={{ color: "#64748b", fontSize: "0.78rem" }}>Avg Match Score</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#f59e0b" }}>
                  {new Set(savedCareers.map(c => c.domain)).size}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.78rem" }}>Domains Covered</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#1e293b" }}>
                  ₹{Math.max(...savedCareers.map(c => c.salary.max))}L
                </div>
                <div style={{ color: "#64748b", fontSize: "0.78rem" }}>Highest Salary</div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}