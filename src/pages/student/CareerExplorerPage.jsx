import { useState, useMemo } from "react";
import {
  GraduationCap, Search, Filter, X, ChevronRight,
  Bookmark, TrendingUp, Briefcase, Users, ArrowUpDown,
  Map, Bell, User, LogOut, BarChart3, MapPin, Bot, Menu
} from "lucide-react";

/* ── Career Data ── */
const allCareers = [
  {
    id: 1, title: "Software Engineer", domain: "Technology",
    educationLevel: ["class12", "graduation"], streams: ["science", "engineering"],
    salary: { min: 6, max: 25 }, demandLevel: "High",
    skills: ["JavaScript", "React", "Node.js", "DSA"],
    description: "Build scalable applications and software systems used by millions of people worldwide.",
    tag: "Most Popular",
  },
  {
    id: 2, title: "Data Scientist", domain: "Technology",
    educationLevel: ["graduation"], streams: ["science", "engineering"],
    salary: { min: 8, max: 30 }, demandLevel: "High",
    skills: ["Python", "Machine Learning", "Statistics", "SQL"],
    description: "Analyse complex datasets and build predictive models to drive smarter business decisions.",
    tag: "High Paying",
  },
  {
    id: 3, title: "Doctor (MBBS)", domain: "Healthcare",
    educationLevel: ["class12"], streams: ["science_bio"],
    salary: { min: 8, max: 40 }, demandLevel: "High",
    skills: ["Biology", "Clinical Skills", "Diagnosis", "Communication"],
    description: "Diagnose and treat illnesses, helping patients live healthier and better lives.",
    tag: "High Demand",
  },
  {
    id: 4, title: "Chartered Accountant", domain: "Commerce",
    educationLevel: ["class12", "graduation"], streams: ["commerce"],
    salary: { min: 7, max: 35 }, demandLevel: "High",
    skills: ["Accounting", "Taxation", "Audit", "Finance Law"],
    description: "Manage financial records, tax planning, and auditing for individuals and organisations.",
    tag: "Evergreen",
  },
  {
    id: 5, title: "UX Designer", domain: "Design",
    educationLevel: ["class12", "graduation"], streams: ["arts", "science", "engineering"],
    salary: { min: 5, max: 20 }, demandLevel: "Medium",
    skills: ["Figma", "User Research", "Prototyping", "UI Design"],
    description: "Design intuitive and beautiful digital experiences that users love to interact with.",
    tag: "Creative",
  },
  {
    id: 6, title: "Civil Services Officer (IAS)", domain: "Government",
    educationLevel: ["graduation"], streams: ["arts", "science", "commerce", "engineering"],
    salary: { min: 6, max: 18 }, demandLevel: "Medium",
    skills: ["GK", "Essay Writing", "Leadership", "Ethics"],
    description: "Serve the nation by managing public administration, policy making and governance.",
    tag: "Prestigious",
  },
  {
    id: 7, title: "Product Manager", domain: "Business",
    educationLevel: ["graduation"], streams: ["engineering", "commerce"],
    salary: { min: 10, max: 35 }, demandLevel: "High",
    skills: ["Strategy", "Analytics", "Communication", "Roadmapping"],
    description: "Lead product vision and strategy, working across engineering, design and business teams.",
    tag: "High Paying",
  },
  {
    id: 8, title: "Lawyer (LLB)", domain: "Law",
    educationLevel: ["graduation"], streams: ["arts", "commerce", "science"],
    salary: { min: 4, max: 30 }, demandLevel: "Medium",
    skills: ["Legal Research", "Argumentation", "Writing", "Critical Thinking"],
    description: "Represent clients in legal matters, draft documents and provide expert legal counsel.",
    tag: "Evergreen",
  },
  {
    id: 9, title: "Mechanical Engineer", domain: "Engineering",
    educationLevel: ["class12", "graduation"], streams: ["science", "engineering"],
    salary: { min: 4, max: 18 }, demandLevel: "Medium",
    skills: ["CAD", "Thermodynamics", "Manufacturing", "AutoCAD"],
    description: "Design, analyse and manufacture mechanical systems and machines used in every industry.",
    tag: null,
  },
  {
    id: 10, title: "Graphic Designer", domain: "Design",
    educationLevel: ["class10", "class12", "graduation"], streams: ["arts", "science", "commerce"],
    salary: { min: 3, max: 15 }, demandLevel: "Medium",
    skills: ["Adobe Photoshop", "Illustrator", "Typography", "Branding"],
    description: "Create visual content including logos, posters, social media graphics and brand identities.",
    tag: "Creative",
  },
  {
    id: 11, title: "Pharmacist", domain: "Healthcare",
    educationLevel: ["class12", "graduation"], streams: ["science_bio"],
    salary: { min: 4, max: 16 }, demandLevel: "High",
    skills: ["Pharmacology", "Drug Interactions", "Patient Counselling", "Chemistry"],
    description: "Dispense medications and advise patients on safe and effective use of prescriptions.",
    tag: "High Demand",
  },
  {
    id: 12, title: "Digital Marketer", domain: "Business",
    educationLevel: ["class12", "graduation"], streams: ["arts", "commerce", "science"],
    salary: { min: 3, max: 18 }, demandLevel: "High",
    skills: ["SEO", "Social Media", "Google Ads", "Content Strategy"],
    description: "Grow brands and businesses online through strategic campaigns across digital channels.",
    tag: null,
  },
];

const domains = ["All", "Technology", "Healthcare", "Commerce", "Design", "Government", "Business", "Law", "Engineering"];
const educationLevels = ["All", "class10", "class12", "graduation"];
const demandLevels = ["All", "High", "Medium", "Low"];
const sortOptions = ["Best Match", "Highest Salary", "Lowest Salary", "A - Z"];

const educationLabel = { class10: "Class 10", class12: "Class 12", graduation: "Graduation" };
const demandColor = { High: "#22c55e", Medium: "#f59e0b", Low: "#ef4444" };
const domainColor = {
  Technology: "#6366f1", Healthcare: "#22c55e", Commerce: "#f59e0b",
  Design: "#ec4899", Government: "#64748b", Business: "#38bdf8",
  Law: "#8b5cf6", Engineering: "#f97316",
};

/* ── Sidebar links ── */
const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Career Explorer", href: "/careers", active: true },
  { icon: MapPin, label: "Skill Roadmaps", href: "/roadmaps" },
  { icon: Bot, label: "Recommendations", href: "/recommendations" },
  { icon: Bookmark, label: "Saved Careers", href: "/bookmarks" },
  { icon: User, label: "My Profile", href: "/profile" },
];

export default function CareerExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedEducation, setSelectedEducation] = useState("All");
  const [selectedDemand, setSelectedDemand] = useState("All");
  const [sortBy, setSortBy] = useState("Best Match");
  const [savedCareers, setSavedCareers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── Filter + Search + Sort logic ── */
  const filteredCareers = useMemo(() => {
    let result = allCareers.filter(career => {
      const matchesSearch =
        career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDomain = selectedDomain === "All" || career.domain === selectedDomain;
      const matchesEducation = selectedEducation === "All" || career.educationLevel.includes(selectedEducation);
      const matchesDemand = selectedDemand === "All" || career.demandLevel === selectedDemand;
      return matchesSearch && matchesDomain && matchesEducation && matchesDemand;
    });

    if (sortBy === "Highest Salary") result = [...result].sort((a, b) => b.salary.max - a.salary.max);
    else if (sortBy === "Lowest Salary") result = [...result].sort((a, b) => a.salary.min - b.salary.min);
    else if (sortBy === "A - Z") result = [...result].sort((a, b) => a.title.localeCompare(b.title));

    return result;
  }, [searchQuery, selectedDomain, selectedEducation, selectedDemand, sortBy]);

  /* Toggle bookmark */
  const toggleSave = (id) => {
    setSavedCareers(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  /* Clear all filters */
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDomain("All");
    setSelectedEducation("All");
    setSelectedDemand("All");
    setSortBy("Best Match");
  };

  const hasActiveFilters = selectedDomain !== "All" || selectedEducation !== "All" || selectedDemand !== "All" || searchQuery !== "";

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
          width: 260px; background: #ffffff;
          border-right: 1px solid rgba(99,102,241,0.1);
          height: 100vh; position: fixed; top: 0; left: 0;
          z-index: 50; display: flex; flex-direction: column;
          transition: transform 0.3s ease;
        }
        .sidebar-link {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 20px; border-radius: 10px; margin: 2px 12px;
          font-size: 0.9rem; color: #64748b; text-decoration: none;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .sidebar-link:hover { background: rgba(99,102,241,0.06); color: #1e293b; }
        .sidebar-link.active { background: rgba(99,102,241,0.1); color: #6366f1; font-weight: 600; }

        /* Topbar */
        .topbar {
          height: 68px; background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(99,102,241,0.1);
          position: fixed; top: 0; right: 0; left: 260px;
          z-index: 40; display: flex; align-items: center;
          justify-content: space-between; padding: 0 28px;
        }

        /* Search */
        .search-input {
          padding: 10px 16px 10px 42px;
          border: 1.5px solid rgba(99,102,241,0.12);
          border-radius: 10px; font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          background: #f8f9ff; color: #1e293b;
          outline: none; width: 340px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
          background: #ffffff;
        }
        .search-input::placeholder { color: #94a3b8; }

        /* Filter chips */
        .filter-chip {
          padding: 8px 16px; border-radius: 50px;
          border: 1.5px solid rgba(99,102,241,0.15);
          background: #ffffff; color: #64748b;
          font-size: 0.82rem; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .filter-chip:hover { border-color: rgba(99,102,241,0.35); color: #6366f1; }
        .filter-chip.active {
          background: #6366f1; color: #ffffff;
          border-color: #6366f1;
        }

        /* Select dropdown */
        .filter-select {
          padding: 8px 14px; border-radius: 10px;
          border: 1.5px solid rgba(99,102,241,0.15);
          background: #ffffff; color: #64748b;
          font-size: 0.85rem; font-family: 'DM Sans', sans-serif;
          cursor: pointer; outline: none;
          transition: border-color 0.2s;
        }
        .filter-select:focus { border-color: #6366f1; }

        /* Career card */
        .career-card {
          background: #ffffff;
          border: 1px solid rgba(99,102,241,0.1);
          border-radius: 16px; padding: 22px;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer; display: flex; flex-direction: column;
        }
        .career-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(99,102,241,0.13);
          border-color: rgba(99,102,241,0.2);
        }

        /* Bookmark button */
        .bookmark-btn {
          width: 38px; height: 38px; border-radius: 10px;
          border: 1px solid rgba(99,102,241,0.15);
          background: #f8f9ff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .bookmark-btn:hover { background: rgba(99,102,241,0.06); border-color: rgba(99,102,241,0.3); }
        .bookmark-btn.saved { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); }

        /* Mobile menu */
        .mobile-menu-btn {
          display: none; background: none;
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 8px; padding: 6px 10px;
          cursor: pointer; color: #1e293b;
          align-items: center; justify-content: center;
        }
        .sidebar-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.3); z-index: 45;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; }

        /* Careers grid */
        .careers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .careers-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); box-shadow: 8px 0 30px rgba(0,0,0,0.1); }
          .topbar { left: 0 !important; }
          .main-content { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
          .search-input { width: 200px !important; }
          .chips-row { flex-wrap: wrap !important; }
        }
        @media (max-width: 600px) {
          .careers-grid { grid-template-columns: 1fr !important; }
          .search-input { width: 150px !important; }
          .main-content-inner { padding: 20px 14px !important; }
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div style={{ padding: "20px 20px 24px", borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <GraduationCap size={22} color="#6366f1" />
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1rem" }}>
              <span className="grad-text">Smart Career</span>
              <span style={{ color: "#6366f1" }}> Advisor</span>
            </span>
          </a>
        </div>
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
                <IconComp size={18} />{link.label}
              </a>
            );
          })}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(99,102,241,0.08)" }}>
          <a href="/login" className="sidebar-link" style={{ color: "#ef4444" }}>
            <LogOut size={18} /> Logout
          </a>
        </div>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── TOPBAR ── */}
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={{ position: "relative" }}>
            <Search size={16} color="#94a3b8" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text" placeholder="Search careers, skills, domains..."
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
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 4 }}>
            <Bell size={20} color="#64748b" />
            <span style={{ position: "absolute", top: 2, right: 2, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: "2px solid #ffffff" }} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", color: "#fff", cursor: "pointer" }}>
            AD
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content" style={{ marginLeft: 260, paddingTop: 68 }}>
        <div className="main-content-inner fade-up" style={{ padding: "28px 28px", maxWidth: 1300 }}>

          {/* Page header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>
              Career Explorer
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.93rem" }}>
              Discover and explore <strong style={{ color: "#6366f1" }}>{allCareers.length}+ career paths</strong> across all domains and education levels.
            </p>
          </div>

          {/* ── Filters Row ── */}
          <div style={{
            background: "#ffffff", border: "1px solid rgba(99,102,241,0.1)",
            borderRadius: 16, padding: "18px 20px", marginBottom: 24,
            boxShadow: "0 2px 12px rgba(99,102,241,0.05)",
          }}>

            {/* Top filter row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#1e293b", fontWeight: 600, fontSize: "0.88rem" }}>
                <Filter size={16} color="#6366f1" /> Filters
              </div>

              {/* Education Level */}
              <select className="filter-select" value={selectedEducation} onChange={e => setSelectedEducation(e.target.value)}>
                <option value="All">All Levels</option>
                <option value="class10">Class 10</option>
                <option value="class12">Class 12</option>
                <option value="graduation">Graduation</option>
              </select>

              {/* Demand Level */}
              <select className="filter-select" value={selectedDemand} onChange={e => setSelectedDemand(e.target.value)}>
                <option value="All">All Demand</option>
                <option value="High">High Demand</option>
                <option value="Medium">Medium Demand</option>
                <option value="Low">Low Demand</option>
              </select>

              {/* Sort */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
                <ArrowUpDown size={14} color="#64748b" />
                <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  {sortOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button onClick={clearFilters}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 50, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)", color: "#ef4444", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  <X size={13} /> Clear
                </button>
              )}
            </div>

            {/* Domain chips */}
            <div className="chips-row" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {domains.map(domain => (
                <button key={domain}
                  className={`filter-chip ${selectedDomain === domain ? "active" : ""}`}
                  onClick={() => setSelectedDomain(domain)}>
                  {domain}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ color: "#64748b", fontSize: "0.88rem" }}>
              Showing <strong style={{ color: "#1e293b" }}>{filteredCareers.length}</strong> careers
              {hasActiveFilters && <span style={{ color: "#6366f1" }}> (filtered)</span>}
            </p>
            {savedCareers.length > 0 && (
              <span style={{ fontSize: "0.82rem", color: "#6366f1", fontWeight: 600, background: "rgba(99,102,241,0.08)", padding: "4px 12px", borderRadius: 50 }}>
                {savedCareers.length} saved
              </span>
            )}
          </div>

          {/* ── Career Cards Grid ── */}
          {filteredCareers.length > 0 ? (
            <div className="careers-grid">
              {filteredCareers.map((career) => {
                const isSaved = savedCareers.includes(career.id);
                const dColor = domainColor[career.domain] || "#6366f1";
                return (
                  <div key={career.id} className="career-card">

                    {/* Top row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div style={{ flex: 1 }}>

                        {/* Domain + tag badges */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                          <span style={{
                            background: `${dColor}12`, color: dColor,
                            padding: "3px 10px", borderRadius: 50,
                            fontSize: "0.72rem", fontWeight: 600,
                            border: `1px solid ${dColor}25`,
                          }}>
                            {career.domain}
                          </span>
                          {career.tag && (
                            <span style={{
                              background: "rgba(99,102,241,0.06)", color: "#6366f1",
                              padding: "3px 10px", borderRadius: 50,
                              fontSize: "0.7rem", fontWeight: 600,
                              border: "1px solid rgba(99,102,241,0.15)",
                            }}>
                              {career.tag}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", lineHeight: 1.3 }}>
                          {career.title}
                        </h3>
                      </div>

                      {/* Bookmark */}
                      <button className={`bookmark-btn ${isSaved ? "saved" : ""}`} onClick={() => toggleSave(career.id)}>
                        <Bookmark size={16} color={isSaved ? "#6366f1" : "#94a3b8"} fill={isSaved ? "#6366f1" : "none"} />
                      </button>
                    </div>

                    {/* Description */}
                    <p style={{ color: "#475569", fontSize: "0.83rem", lineHeight: 1.6, marginBottom: 14, flex: 1 }}>
                      {career.description}
                    </p>

                    {/* Salary + Demand */}
                    <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#64748b", fontSize: "0.8rem" }}>
                        <Briefcase size={13} color="#6366f1" />
                        ₹{career.salary.min}L – ₹{career.salary.max}L / yr
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem" }}>
                        <TrendingUp size={13} color={demandColor[career.demandLevel]} />
                        <span style={{ color: demandColor[career.demandLevel], fontWeight: 600 }}>
                          {career.demandLevel} Demand
                        </span>
                      </div>
                    </div>

                    {/* Education levels */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                      {career.educationLevel.map(level => (
                        <span key={level} style={{
                          background: "#f8f9ff", color: "#475569",
                          padding: "3px 10px", borderRadius: 6,
                          fontSize: "0.72rem", fontWeight: 500,
                          border: "1px solid rgba(99,102,241,0.08)",
                        }}>
                          {educationLabel[level]}
                        </span>
                      ))}
                    </div>

                    {/* Skills */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18 }}>
                      {career.skills.slice(0, 3).map(skill => (
                        <span key={skill} style={{
                          background: "rgba(99,102,241,0.06)", color: "#6366f1",
                          padding: "3px 10px", borderRadius: 6,
                          fontSize: "0.72rem", fontWeight: 500,
                          border: "1px solid rgba(99,102,241,0.12)",
                        }}>
                          {skill}
                        </span>
                      ))}
                      {career.skills.length > 3 && (
                        <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: "0.72rem", color: "#94a3b8", border: "1px solid rgba(99,102,241,0.08)" }}>
                          +{career.skills.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* View Details button */}
                    <a href={`/careers/${career.id}`}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "10px 0", borderRadius: 10,
                        background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                        color: "#fff", fontWeight: 600, fontSize: "0.85rem",
                        textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s",
                        marginTop: "auto",
                      }}
                      onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 16px rgba(99,102,241,0.3)"; }}
                      onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}>
                      View Details <ChevronRight size={16} />
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── Empty state ── */
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                No careers found
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: 20 }}>
                Try adjusting your search or filters to find more results.
              </p>
              <button onClick={clearFilters}
                style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Clear All Filters
              </button>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}