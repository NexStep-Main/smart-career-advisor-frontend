import { useState, useEffect } from "react";
import {
  GraduationCap, Bell, Search, User, LogOut,
  Map, MapPin, Bot, Bookmark, TrendingUp,
  ChevronRight, ArrowRight, Star, Briefcase,
  Clock, Target, Zap, BarChart3, Menu, X
} from "lucide-react";

/* ── Mock Data ── */
const recommendedCareers = [
  {
    id: 1, title: "Software Engineer", domain: "Technology",
    match: 95, salary: "₹6L - ₹25L", demand: "High",
    skills: ["JavaScript", "React", "Node.js", "DSA"],
    description: "Build scalable applications and software systems used by millions.",
  },
  {
    id: 2, title: "Data Scientist", domain: "Technology",
    match: 88, salary: "₹8L - ₹30L", demand: "High",
    skills: ["Python", "ML", "Statistics", "SQL"],
    description: "Analyse complex data sets to drive business decisions and insights.",
  },
  {
    id: 3, title: "Product Manager", domain: "Business",
    match: 82, salary: "₹10L - ₹35L", demand: "High",
    skills: ["Strategy", "Analytics", "Communication", "UX"],
    description: "Lead product strategy and work with engineering and design teams.",
  },
  {
    id: 4, title: "UX Designer", domain: "Design",
    match: 78, salary: "₹5L - ₹20L", demand: "Medium",
    skills: ["Figma", "User Research", "Prototyping", "UI Design"],
    description: "Design intuitive and beautiful user experiences for digital products.",
  },
];

const recentActivity = [
  { icon: Map, text: "Explored Software Engineer career path", time: "2 hours ago", color: "#6366f1" },
  { icon: Bookmark, text: "Saved Data Scientist to bookmarks", time: "5 hours ago", color: "#f59e0b" },
  { icon: Target, text: "Completed onboarding quiz", time: "1 day ago", color: "#22c55e" },
  { icon: MapPin, text: "Viewed Full Stack Developer roadmap", time: "1 day ago", color: "#38bdf8" },
];

const quickStats = [
  { icon: Map, label: "Careers Explored", value: "12", trend: "+3 this week", color: "#6366f1" },
  { icon: Bookmark, label: "Saved Careers", value: "5", trend: "+2 this week", color: "#f59e0b" },
  { icon: MapPin, label: "Roadmaps Viewed", value: "4", trend: "+1 this week", color: "#22c55e" },
  { icon: Clock, label: "Time on Platform", value: "3.5h", trend: "Last 7 days", color: "#38bdf8" },
];

const trendingDomains = [
  { name: "Technology", careers: 35, growth: "+12%", color: "#6366f1" },
  { name: "Healthcare", careers: 22, growth: "+8%", color: "#22c55e" },
  { name: "Business", careers: 18, growth: "+5%", color: "#f59e0b" },
  { name: "Design", careers: 12, growth: "+15%", color: "#ec4899" },
];

const skillsToLearn = [
  { name: "JavaScript", progress: 75, level: "Intermediate" },
  { name: "React", progress: 45, level: "Beginner" },
  { name: "Python", progress: 30, level: "Beginner" },
  { name: "Data Structures", progress: 60, level: "Intermediate" },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const sidebarLinks = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard", active: true },
    { icon: Map, label: "Career Explorer", href: "/careers" },
    { icon: MapPin, label: "Skill Roadmaps", href: "/roadmaps" },
    { icon: Bot, label: "Recommendations", href: "/recommendations" },
    { icon: Bookmark, label: "Saved Careers", href: "/bookmarks" },
    { icon: User, label: "My Profile", href: "/profile" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9ff", fontFamily: "'DM Sans', sans-serif" }}>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f8f9ff; }

        .grad-text {
          background: linear-gradient(135deg, #1e293b 20%, #6366f1 70%, #38bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Sidebar */
        .sidebar {
          width: 260px;
          background: #ffffff;
          border-right: 1px solid rgba(99,102,241,0.1);
          height: 100vh;
          position: fixed;
          top: 0; left: 0;
          z-index: 50;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          border-radius: 10px;
          margin: 2px 12px;
          font-size: 0.9rem;
          color: #64748b;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          background: none;
          width: calc(100% - 24px);
          text-align: left;
          font-family: 'DM Sans', sans-serif;
        }
        .sidebar-link:hover { background: rgba(99,102,241,0.06); color: #1e293b; }
        .sidebar-link.active {
          background: rgba(99,102,241,0.1);
          color: #6366f1;
          font-weight: 600;
        }

        /* Top bar */
        .topbar {
          height: 68px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(99,102,241,0.1);
          position: fixed;
          top: 0;
          right: 0;
          left: 260px;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
        }

        /* Search input */
        .search-input {
          padding: 10px 16px 10px 40px;
          border: 1.5px solid rgba(99,102,241,0.12);
          border-radius: 10px;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          background: #f8f9ff;
          color: #1e293b;
          outline: none;
          width: 320px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
          background: #ffffff;
        }
        .search-input::placeholder { color: #94a3b8; }

        /* Card hover */
        .dash-card {
          background: #ffffff;
          border: 1px solid rgba(99,102,241,0.1);
          border-radius: 16px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .dash-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(99,102,241,0.12);
        }

        /* Career card */
        .career-card {
          background: #ffffff;
          border: 1px solid rgba(99,102,241,0.1);
          border-radius: 16px;
          padding: 24px;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .career-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(99,102,241,0.14);
        }

        /* Skill progress bar */
        .skill-bar-bg {
          height: 6px;
          border-radius: 6px;
          background: rgba(99,102,241,0.1);
          overflow: hidden;
        }
        .skill-bar-fill {
          height: 100%;
          border-radius: 6px;
          background: linear-gradient(90deg, #6366f1, #818cf8);
          transition: width 0.5s ease;
        }

        /* Match badge */
        .match-badge {
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        /* Overlay for mobile sidebar */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.3);
          z-index: 45;
        }

        /* Mobile menu button */
        .mobile-menu-btn {
          display: none;
          background: none;
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 8px;
          padding: 6px 10px;
          cursor: pointer;
          color: #1e293b;
          align-items: center;
          justify-content: center;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.3s; opacity: 0; }
        .delay-4 { animation-delay: 0.4s; opacity: 0; }

        /* Desktop */
        @media (min-width: 901px) {
          .sidebar-overlay { display: none !important; }
        }

        /* Tablet + Mobile */
        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); box-shadow: 8px 0 30px rgba(0,0,0,0.1); }
          .topbar { left: 0 !important; }
          .main-content { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
          .search-input { width: 180px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .careers-grid { grid-template-columns: 1fr !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 500px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .search-input { width: 140px !important; }
          .topbar { padding: 0 16px !important; }
          .main-content-inner { padding: 24px 16px !important; }
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 24px", borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <GraduationCap size={22} color="#6366f1" />
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1rem" }}>
              <span className="grad-text">Smart Career</span>
              <span style={{ color: "#6366f1" }}> Advisor</span>
            </span>
          </a>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
          <div style={{ padding: "0 20px 8px", fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Main Menu
          </div>
          {sidebarLinks.map((link) => {
            const IconComp = link.icon;
            return (
              <a key={link.label} href={link.href}
                className={`sidebar-link ${link.active ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}>
                <IconComp size={18} />
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(99,102,241,0.08)" }}>
          <button className="sidebar-link" style={{ color: "#ef4444" }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── TOP BAR ── */}
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={{ position: "relative" }}>
            <Search size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input type="text" placeholder="Search careers, skills, domains..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="search-input" />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 4 }}>
            <Bell size={20} color="#64748b" />
            <span style={{ position: "absolute", top: 2, right: 2, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: "2px solid #ffffff" }} />
          </button>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: "0.8rem", color: "#fff", cursor: "pointer",
          }}>
            AD
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content" style={{ marginLeft: 260, paddingTop: 68 }}>
        <div className="main-content-inner" style={{ padding: "32px 28px", maxWidth: 1200 }}>

          {/* ── Welcome banner ── */}
          <div className="fade-up" style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(56,189,248,0.06) 100%)",
            border: "1px solid rgba(99,102,241,0.15)",
            borderRadius: 20, padding: "28px 32px",
            marginBottom: 28,
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
          }}>
            <div>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>
                {greeting}, Anirban! 👋
              </h1>
              <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                You have <strong style={{ color: "#6366f1" }}>4 new career recommendations</strong> based on your profile. Let's explore!
              </p>
            </div>
            <a href="/careers" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#fff", padding: "10px 22px", borderRadius: 10,
              fontWeight: 600, fontSize: "0.88rem", textDecoration: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 20px rgba(99,102,241,0.3)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}>
              Explore Careers <ArrowRight size={16} />
            </a>
          </div>

          {/* ── Quick Stats ── */}
          <div className="fade-up delay-1 stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            {quickStats.map((stat, i) => {
              const IconComp = stat.icon;
              return (
                <div key={i} className="dash-card" style={{ padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 10,
                      background: `${stat.color}12`, border: `1px solid ${stat.color}25`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <IconComp size={18} color={stat.color} />
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "#22c55e", fontWeight: 600, background: "rgba(34,197,94,0.08)", padding: "2px 8px", borderRadius: 50 }}>
                      {stat.trend}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", marginBottom: 2 }}>
                    {stat.value}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "0.82rem" }}>{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* ── Recommended Careers ── */}
          <div className="fade-up delay-2" style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#1e293b" }}>
                  Recommended For You
                </h2>
                <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: 2 }}>Based on your quiz answers and interests</p>
              </div>
              <a href="/recommendations" style={{ color: "#6366f1", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                View All <ChevronRight size={16} />
              </a>
            </div>

            <div className="careers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {recommendedCareers.map((career) => (
                <div key={career.id} className="career-card">
                  {/* Top row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ background: "rgba(99,102,241,0.08)", color: "#6366f1", padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 600, border: "1px solid rgba(99,102,241,0.2)" }}>
                          {career.domain}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3, color: "#f59e0b", fontSize: "0.75rem" }}>
                          <TrendingUp size={12} /> {career.demand}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#1e293b" }}>
                        {career.title}
                      </h3>
                    </div>
                    <span className="match-badge" style={{
                      background: career.match >= 90 ? "rgba(34,197,94,0.1)" : career.match >= 80 ? "rgba(99,102,241,0.1)" : "rgba(245,158,11,0.1)",
                      color: career.match >= 90 ? "#22c55e" : career.match >= 80 ? "#6366f1" : "#f59e0b",
                      border: `1px solid ${career.match >= 90 ? "rgba(34,197,94,0.2)" : career.match >= 80 ? "rgba(99,102,241,0.2)" : "rgba(245,158,11,0.2)"}`,
                    }}>
                      {career.match}% match
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{ color: "#475569", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: 14 }}>
                    {career.description}
                  </p>

                  {/* Salary */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, color: "#64748b", fontSize: "0.82rem" }}>
                    <Briefcase size={14} color="#6366f1" />
                    <span>{career.salary} / year</span>
                  </div>

                  {/* Skills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {career.skills.map((skill) => (
                      <span key={skill} style={{
                        background: "#f8f9ff", color: "#475569",
                        padding: "4px 10px", borderRadius: 6, fontSize: "0.75rem",
                        fontWeight: 500, border: "1px solid rgba(99,102,241,0.08)",
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Action */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <a href={`/careers/${career.id}`} style={{
                      flex: 1, textAlign: "center", padding: "10px 0", borderRadius: 10,
                      background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                      color: "#fff", fontWeight: 600, fontSize: "0.85rem",
                      textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                      onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 16px rgba(99,102,241,0.3)"; }}
                      onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}>
                      View Details
                    </a>
                    <button style={{
                      width: 42, height: 42, borderRadius: 10,
                      border: "1px solid rgba(99,102,241,0.15)",
                      background: "#ffffff", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background 0.2s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.06)"}
                      onMouseLeave={e => e.currentTarget.style.background = "#ffffff"}>
                      <Bookmark size={16} color="#64748b" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom Grid: Activity + Skills + Trending ── */}
          <div className="fade-up delay-3 bottom-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

            {/* Recent Activity */}
            <div className="dash-card" style={{ padding: "22px 24px" }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 18 }}>
                Recent Activity
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {recentActivity.map((act, i) => {
                  const IconComp = act.icon;
                  return (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                        background: `${act.color}12`, border: `1px solid ${act.color}25`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <IconComp size={15} color={act.color} />
                      </div>
                      <div>
                        <p style={{ fontSize: "0.83rem", color: "#1e293b", lineHeight: 1.4 }}>{act.text}</p>
                        <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{act.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skills to Learn */}
            <div className="dash-card" style={{ padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b" }}>
                  Skills to Learn
                </h3>
                <a href="/roadmaps" style={{ color: "#6366f1", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none" }}>
                  View All
                </a>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {skillsToLearn.map((skill, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1e293b" }}>{skill.name}</span>
                      <span style={{ fontSize: "0.72rem", color: "#6366f1", fontWeight: 600, background: "rgba(99,102,241,0.08)", padding: "2px 8px", borderRadius: 50 }}>
                        {skill.level}
                      </span>
                    </div>
                    <div className="skill-bar-bg">
                      <div className="skill-bar-fill" style={{ width: `${skill.progress}%` }} />
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: 2, display: "block" }}>{skill.progress}% completed</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Domains */}
            <div className="dash-card" style={{ padding: "22px 24px" }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 18 }}>
                Trending Domains
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {trendingDomains.map((domain, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 14px", borderRadius: 10,
                    background: "#f8f9ff", border: "1px solid rgba(99,102,241,0.06)",
                    cursor: "pointer", transition: "background 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "#f8f9ff"}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: domain.color }} />
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1e293b" }}>{domain.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{domain.careers} careers</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#22c55e" }}>{domain.growth}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}