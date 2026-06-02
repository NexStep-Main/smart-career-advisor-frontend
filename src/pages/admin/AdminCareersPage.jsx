import { useState } from "react";
import {
  GraduationCap, Users, Map, MapPin, Bookmark, TrendingUp,
  BarChart3, Settings, LogOut, Menu, X, Bell, Search,
  Plus, Edit3, Trash2, Eye, ChevronDown, Filter,
  Activity, Shield, CheckCircle, XCircle
} from "lucide-react";

/* ── Mock Career Data ── */
const initialCareers = [
  { id: 1, title: "Software Engineer", domain: "Technology", demandLevel: "High", salary: "₹6L - ₹25L", educationLevel: "Class 12+", status: "Active", views: 4521, saves: 1234, hasRoadmap: true },
  { id: 2, title: "Data Scientist", domain: "Technology", demandLevel: "High", salary: "₹8L - ₹30L", educationLevel: "Graduation", status: "Active", views: 3892, saves: 1102, hasRoadmap: true },
  { id: 3, title: "Doctor (MBBS)", domain: "Healthcare", demandLevel: "High", salary: "₹8L - ₹40L", educationLevel: "Class 12 (PCB)", status: "Active", views: 3245, saves: 987, hasRoadmap: false },
  { id: 4, title: "Chartered Accountant", domain: "Commerce", demandLevel: "High", salary: "₹7L - ₹35L", educationLevel: "Class 12+", status: "Active", views: 2543, saves: 743, hasRoadmap: false },
  { id: 5, title: "UX Designer", domain: "Design", demandLevel: "Medium", salary: "₹5L - ₹20L", educationLevel: "Class 12+", status: "Active", views: 2187, saves: 634, hasRoadmap: false },
  { id: 6, title: "Civil Services (IAS)", domain: "Government", demandLevel: "Medium", salary: "₹6L - ₹18L", educationLevel: "Graduation", status: "Active", views: 1987, saves: 567, hasRoadmap: false },
  { id: 7, title: "Product Manager", domain: "Business", demandLevel: "High", salary: "₹10L - ₹35L", educationLevel: "Graduation", status: "Active", views: 2876, saves: 856, hasRoadmap: false },
  { id: 8, title: "Lawyer (LLB)", domain: "Law", demandLevel: "Medium", salary: "₹4L - ₹30L", educationLevel: "Graduation", status: "Draft", views: 0, saves: 0, hasRoadmap: false },
  { id: 9, title: "Mechanical Engineer", domain: "Engineering", demandLevel: "Medium", salary: "₹4L - ₹18L", educationLevel: "Class 12+", status: "Active", views: 1654, saves: 432, hasRoadmap: false },
  { id: 10, title: "Graphic Designer", domain: "Design", demandLevel: "Medium", salary: "₹3L - ₹15L", educationLevel: "Class 10+", status: "Active", views: 1432, saves: 389, hasRoadmap: false },
];

const domainColor = {
  Technology: "#6366f1", Healthcare: "#22c55e", Commerce: "#f59e0b",
  Design: "#ec4899", Government: "#64748b", Business: "#38bdf8",
  Law: "#8b5cf6", Engineering: "#f97316",
};

const domains = ["All", "Technology", "Healthcare", "Commerce", "Design", "Government", "Business", "Law", "Engineering"];

const adminSidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Map, label: "Manage Careers", href: "/admin/careers", active: true },
  { icon: Users, label: "Students", href: "/admin/dashboard" },
  { icon: MapPin, label: "Roadmaps", href: "/admin/dashboard" },
  { icon: Activity, label: "Analytics", href: "/admin/dashboard" },
  { icon: Settings, label: "Settings", href: "/admin/dashboard" },
];

export default function AdminCareersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [careers, setCareers] = useState(initialCareers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDomain, setFilterDomain] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCareer, setNewCareer] = useState({ title: "", domain: "Technology", demandLevel: "High", salary: "", educationLevel: "" });

  const filteredCareers = careers.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) || career.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = filterDomain === "All" || career.domain === filterDomain;
    const matchesStatus = filterStatus === "All" || career.status === filterStatus;
    return matchesSearch && matchesDomain && matchesStatus;
  });

  const deleteCareer = (id) => {
    setCareers(prev => prev.filter(c => c.id !== id));
    setDeleteConfirm(null);
  };

  const toggleStatus = (id) => {
    setCareers(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "Active" ? "Draft" : "Active" } : c));
  };

  const addCareer = () => {
    if (!newCareer.title || !newCareer.salary || !newCareer.educationLevel) return;
    const career = {
      ...newCareer,
      id: Date.now(),
      status: "Draft",
      views: 0, saves: 0, hasRoadmap: false,
    };
    setCareers(prev => [career, ...prev]);
    setNewCareer({ title: "", domain: "Technology", demandLevel: "High", salary: "", educationLevel: "" });
    setShowAddModal(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0" }}>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f172a; }

        .admin-sidebar { width: 260px; background: #1e293b; border-right: 1px solid rgba(99,102,241,0.12); height: 100vh; position: fixed; top: 0; left: 0; z-index: 50; display: flex; flex-direction: column; transition: transform 0.3s ease; }
        .admin-sidebar-link { display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 10px; margin: 2px 12px; font-size: 0.9rem; color: #94a3b8; text-decoration: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .admin-sidebar-link:hover { background: rgba(99,102,241,0.08); color: #e2e8f0; }
        .admin-sidebar-link.active { background: rgba(99,102,241,0.15); color: #818cf8; font-weight: 600; }

        .admin-topbar { height: 68px; background: rgba(30,41,59,0.92); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(99,102,241,0.12); position: fixed; top: 0; right: 0; left: 260px; z-index: 40; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; }

        .admin-search { padding: 10px 16px 10px 42px; border: 1.5px solid rgba(99,102,241,0.2); border-radius: 10px; font-size: 0.9rem; font-family: 'DM Sans', sans-serif; background: rgba(15,23,42,0.6); color: #e2e8f0; outline: none; width: 300px; transition: border-color 0.2s, box-shadow 0.2s; }
        .admin-search:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .admin-search::placeholder { color: #475569; }

        .admin-select { padding: 9px 14px; border-radius: 10px; border: 1.5px solid rgba(99,102,241,0.2); background: rgba(15,23,42,0.6); color: #94a3b8; font-size: 0.85rem; font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; }
        .admin-select:focus { border-color: #6366f1; }

        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { padding: 12px 14px; text-align: left; font-size: 0.72rem; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid rgba(99,102,241,0.08); }
        .admin-table td { padding: 12px 14px; font-size: 0.85rem; color: #cbd5e1; border-bottom: 1px solid rgba(99,102,241,0.06); }
        .admin-table tr:hover td { background: rgba(99,102,241,0.04); }

        .action-btn { width: 34px; height: 34px; border-radius: 8px; border: 1px solid rgba(99,102,241,0.15); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: #94a3b8; }
        .action-btn:hover { background: rgba(99,102,241,0.08); color: #e2e8f0; }
        .action-btn.delete:hover { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.2); }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-card { background: #1e293b; border: 1px solid rgba(99,102,241,0.2); border-radius: 20px; padding: 32px; width: 100%; max-width: 480px; }
        .modal-input { width: 100%; padding: 12px 16px; border: 1.5px solid rgba(99,102,241,0.2); border-radius: 10px; font-size: 0.9rem; font-family: 'DM Sans', sans-serif; background: rgba(15,23,42,0.6); color: #e2e8f0; outline: none; transition: border-color 0.2s; }
        .modal-input:focus { border-color: #6366f1; }
        .modal-input::placeholder { color: #475569; }

        .mobile-menu-btn { display: none; background: none; border: 1px solid rgba(99,102,241,0.25); border-radius: 8px; padding: 6px 10px; cursor: pointer; color: #e2e8f0; align-items: center; justify-content: center; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 45; }

        .delete-overlay { position: absolute; inset: 0; background: rgba(30,41,59,0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; z-index: 5; border-radius: 0; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }

        @media (max-width: 900px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0); box-shadow: 8px 0 30px rgba(0,0,0,0.3); }
          .admin-topbar { left: 0 !important; }
          .admin-main { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
          .admin-search { width: 180px !important; }
          .controls-wrap { flex-wrap: wrap !important; }
        }
        @media (max-width: 600px) {
          .admin-main-inner { padding: 20px 14px !important; }
          .admin-search { width: 100% !important; }
          .controls-wrap { flex-direction: column !important; }
          .table-wrap { overflow-x: auto; }
        }
        @media (min-width: 901px) { .sidebar-overlay { display: none !important; } }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div style={{ padding: "20px 20px 24px", borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
          <a href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <Shield size={22} color="#818cf8" />
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#e2e8f0" }}>
              Admin <span style={{ color: "#818cf8" }}>Panel</span>
            </span>
          </a>
        </div>
        <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
          <div style={{ padding: "0 20px 8px", fontSize: "0.72rem", fontWeight: 600, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Management</div>
          {adminSidebarLinks.map((link) => {
            const IconComp = link.icon;
            return (
              <a key={link.label} href={link.href} className={`admin-sidebar-link ${link.active ? "active" : ""}`} onClick={() => setSidebarOpen(false)}>
                <IconComp size={18} />{link.label}
              </a>
            );
          })}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(99,102,241,0.1)" }}>
          <a href="/admin/login" className="admin-sidebar-link" style={{ color: "#ef4444" }}><LogOut size={18} /> Logout</a>
        </div>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── TOPBAR ── */}
      <header className="admin-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#e2e8f0" }}>
            Manage Careers
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 4 }}>
            <Bell size={20} color="#94a3b8" />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", color: "#fff", cursor: "pointer" }}>A</div>
        </div>
      </header>

      {/* ── Add Career Modal ── */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#e2e8f0", marginBottom: 20 }}>
              Add New Career
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8" }}>Career Title</label>
                <input className="modal-input" placeholder="e.g. Cybersecurity Analyst" value={newCareer.title}
                  onChange={e => setNewCareer({ ...newCareer, title: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8" }}>Domain</label>
                  <select className="modal-input" style={{ cursor: "pointer" }} value={newCareer.domain}
                    onChange={e => setNewCareer({ ...newCareer, domain: e.target.value })}>
                    {domains.filter(d => d !== "All").map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8" }}>Demand Level</label>
                  <select className="modal-input" style={{ cursor: "pointer" }} value={newCareer.demandLevel}
                    onChange={e => setNewCareer({ ...newCareer, demandLevel: e.target.value })}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8" }}>Salary Range</label>
                <input className="modal-input" placeholder="e.g. ₹6L - ₹25L" value={newCareer.salary}
                  onChange={e => setNewCareer({ ...newCareer, salary: e.target.value })} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8" }}>Education Level</label>
                <input className="modal-input" placeholder="e.g. Graduation" value={newCareer.educationLevel}
                  onChange={e => setNewCareer({ ...newCareer, educationLevel: e.target.value })} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowAddModal(false)}
                style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "1px solid rgba(99,102,241,0.2)", background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Cancel
              </button>
              <button onClick={addCareer}
                style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#ffffff", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "transform 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                Add Career
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="admin-main" style={{ marginLeft: 260, paddingTop: 68 }}>
        <div className="admin-main-inner fade-up" style={{ padding: "28px 28px", maxWidth: 1300 }}>

          {/* Page Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.3rem, 3vw, 1.7rem)", fontWeight: 800, color: "#e2e8f0", marginBottom: 4 }}>
                Manage Careers
              </h1>
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                <strong style={{ color: "#818cf8" }}>{careers.length}</strong> careers on the platform · <strong style={{ color: "#22c55e" }}>{careers.filter(c => c.status === "Active").length}</strong> active
              </p>
            </div>
            <button onClick={() => setShowAddModal(true)} style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#fff", padding: "10px 22px", borderRadius: 10,
              fontWeight: 600, fontSize: "0.88rem", border: "none",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <Plus size={18} /> Add Career
            </button>
          </div>

          {/* Controls */}
          <div className="controls-wrap" style={{
            display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap",
            background: "#1e293b", border: "1px solid rgba(99,102,241,0.12)",
            borderRadius: 14, padding: "14px 18px",
          }}>
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <Search size={16} color="#475569" style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
              <input type="text" placeholder="Search careers..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} className="admin-search" style={{ width: "100%" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Filter size={14} color="#64748b" />
              <select className="admin-select" value={filterDomain} onChange={e => setFilterDomain(e.target.value)}>
                {domains.map(d => <option key={d} value={d}>{d === "All" ? "All Domains" : d}</option>)}
              </select>
            </div>
            <select className="admin-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Table */}
          <div style={{ background: "#1e293b", border: "1px solid rgba(99,102,241,0.12)", borderRadius: 16, overflow: "hidden" }}>
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Career</th>
                    <th>Domain</th>
                    <th>Demand</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Roadmap</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCareers.map((career) => {
                    const dColor = domainColor[career.domain] || "#6366f1";
                    return (
                      <tr key={career.id} style={{ position: "relative" }}>
                        <td>
                          <div style={{ fontWeight: 600, color: "#e2e8f0" }}>{career.title}</div>
                          <div style={{ fontSize: "0.72rem", color: "#475569" }}>{career.educationLevel}</div>
                        </td>
                        <td>
                          <span style={{ background: `${dColor}15`, color: dColor, padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 600, border: `1px solid ${dColor}25` }}>
                            {career.domain}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            color: career.demandLevel === "High" ? "#22c55e" : career.demandLevel === "Medium" ? "#f59e0b" : "#ef4444",
                            fontWeight: 600, fontSize: "0.82rem",
                          }}>
                            {career.demandLevel}
                          </span>
                        </td>
                        <td style={{ fontWeight: 500, fontSize: "0.82rem" }}>{career.salary}</td>
                        <td>
                          <button onClick={() => toggleStatus(career.id)} style={{
                            display: "flex", alignItems: "center", gap: 4,
                            padding: "3px 10px", borderRadius: 50, border: "none",
                            fontSize: "0.72rem", fontWeight: 600, cursor: "pointer",
                            background: career.status === "Active" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                            color: career.status === "Active" ? "#22c55e" : "#f59e0b",
                          }}>
                            {career.status === "Active" ? <CheckCircle size={11} /> : <XCircle size={11} />}
                            {career.status}
                          </button>
                        </td>
                        <td style={{ fontSize: "0.82rem", color: "#94a3b8" }}>{career.views.toLocaleString()}</td>
                        <td>
                          <span style={{
                            padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 600,
                            background: career.hasRoadmap ? "rgba(99,102,241,0.1)" : "rgba(148,163,184,0.08)",
                            color: career.hasRoadmap ? "#818cf8" : "#475569",
                          }}>
                            {career.hasRoadmap ? "Yes" : "No"}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <a href={`/careers/${career.id}`} className="action-btn" title="View"><Eye size={14} /></a>
                            <button className="action-btn" title="Edit"><Edit3 size={14} /></button>
                            <button className="action-btn delete" title="Delete"
                              onClick={() => setDeleteConfirm(career.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Delete confirmation */}
                          {deleteConfirm === career.id && (
                            <div style={{
                              position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                              background: "#1e293b", border: "1px solid rgba(239,68,68,0.2)",
                              borderRadius: 16, padding: "28px", zIndex: 200,
                              boxShadow: "0 20px 60px rgba(0,0,0,0.5)", textAlign: "center", minWidth: 300,
                            }}>
                              <Trash2 size={28} color="#ef4444" style={{ marginBottom: 12 }} />
                              <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#e2e8f0", marginBottom: 4 }}>
                                Delete {career.title}?
                              </p>
                              <p style={{ color: "#64748b", fontSize: "0.82rem", marginBottom: 20 }}>
                                This action cannot be undone.
                              </p>
                              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                                <button onClick={() => setDeleteConfirm(null)}
                                  style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid rgba(99,102,241,0.2)", background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                                  Cancel
                                </button>
                                <button onClick={() => deleteCareer(career.id)}
                                  style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#ef4444", color: "#ffffff", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredCareers.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 24px" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔍</div>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>No careers match your search or filters.</p>
              </div>
            )}

            {/* Table footer */}
            <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(99,102,241,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", color: "#475569" }}>
                Showing {filteredCareers.length} of {careers.length} careers
              </span>
            </div>
          </div>

        </div>
      </main>

      {/* Delete overlay background */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 199 }}
          onClick={() => setDeleteConfirm(null)} />
      )}
    </div>
  );
}