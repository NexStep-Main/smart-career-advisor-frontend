import { useState } from "react";
import {
  GraduationCap, Users, Map, MapPin, Bookmark, TrendingUp,
  BarChart3, Settings, LogOut, Menu, X, Bell, Search,
  ArrowUp, ArrowDown, Eye, FileText, Activity, Database,
  Shield, ChevronRight, Calendar, Clock
} from "lucide-react";

/* ── Mock Admin Data ── */
const platformStats = [
  { icon: Users, label: "Total Students", value: "5,247", change: "+128", trend: "up", period: "This month", color: "#6366f1" },
  { icon: Map, label: "Total Careers", value: "104", change: "+6", trend: "up", period: "This month", color: "#22c55e" },
  { icon: MapPin, label: "Total Roadmaps", value: "42", change: "+3", trend: "up", period: "This month", color: "#38bdf8" },
  { icon: Eye, label: "Page Views", value: "32.4K", change: "+12%", trend: "up", period: "vs last month", color: "#f59e0b" },
  { icon: FileText, label: "Quiz Completions", value: "3,892", change: "+246", trend: "up", period: "This month", color: "#ec4899" },
  { icon: Bookmark, label: "Career Saves", value: "12,845", change: "+892", trend: "up", period: "This month", color: "#8b5cf6" },
];

const recentStudents = [
  { name: "Priya Mehta", email: "priya@example.com", level: "Class 12", stream: "Science", joined: "2 hours ago", quizDone: true },
  { name: "Rahul Kumar", email: "rahul@example.com", level: "Graduation", stream: "Engineering", joined: "5 hours ago", quizDone: true },
  { name: "Sneha Roy", email: "sneha@example.com", level: "Class 12", stream: "Commerce", joined: "1 day ago", quizDone: false },
  { name: "Arjun Singh", email: "arjun@example.com", level: "Class 10", stream: "Not selected", joined: "1 day ago", quizDone: false },
  { name: "Kavya Nair", email: "kavya@example.com", level: "Graduation", stream: "Arts", joined: "2 days ago", quizDone: true },
];

const topCareers = [
  { title: "Software Engineer", views: 4521, saves: 1234, domain: "Technology" },
  { title: "Data Scientist", views: 3892, saves: 1102, domain: "Technology" },
  { title: "Doctor (MBBS)", views: 3245, saves: 987, domain: "Healthcare" },
  { title: "Product Manager", views: 2876, saves: 856, domain: "Business" },
  { title: "Chartered Accountant", views: 2543, saves: 743, domain: "Commerce" },
];

const recentActivity = [
  { action: "New student registered", detail: "Priya Mehta joined the platform", time: "2 hours ago", color: "#6366f1" },
  { action: "Career updated", detail: "Software Engineer salary data refreshed", time: "4 hours ago", color: "#22c55e" },
  { action: "New roadmap added", detail: "Cybersecurity Analyst roadmap published", time: "8 hours ago", color: "#38bdf8" },
  { action: "Quiz completed", detail: "Rahul Kumar completed career quiz", time: "12 hours ago", color: "#f59e0b" },
  { action: "Career added", detail: "Blockchain Developer career path created", time: "1 day ago", color: "#ec4899" },
];

const domainDistribution = [
  { domain: "Technology", count: 35, percentage: 34, color: "#6366f1" },
  { domain: "Healthcare", count: 22, percentage: 21, color: "#22c55e" },
  { domain: "Business", count: 18, percentage: 17, color: "#38bdf8" },
  { domain: "Commerce", count: 12, percentage: 12, color: "#f59e0b" },
  { domain: "Design", count: 8, percentage: 8, color: "#ec4899" },
  { domain: "Others", count: 9, percentage: 8, color: "#94a3b8" },
];

const adminSidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/admin/dashboard", active: true },
  { icon: Map, label: "Manage Careers", href: "/admin/careers" },
  { icon: Users, label: "Students", href: "/admin/dashboard" },
  { icon: MapPin, label: "Roadmaps", href: "/admin/dashboard" },
  { icon: Activity, label: "Analytics", href: "/admin/dashboard" },
  { icon: Settings, label: "Settings", href: "/admin/dashboard" },
];

export default function AdminDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

        .admin-card { background: #1e293b; border: 1px solid rgba(99,102,241,0.12); border-radius: 16px; transition: box-shadow 0.2s; }
        .admin-card:hover { box-shadow: 0 8px 32px rgba(99,102,241,0.08); }

        .admin-stat-card { background: #1e293b; border: 1px solid rgba(99,102,241,0.12); border-radius: 14px; padding: 20px; transition: transform 0.2s, box-shadow 0.2s; }
        .admin-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.12); }

        .admin-table th { padding: 12px 16px; text-align: left; font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid rgba(99,102,241,0.08); }
        .admin-table td { padding: 12px 16px; font-size: 0.85rem; color: #cbd5e1; border-bottom: 1px solid rgba(99,102,241,0.06); }
        .admin-table tr:hover td { background: rgba(99,102,241,0.04); }

        .domain-bar-bg { height: 8px; border-radius: 8px; background: rgba(99,102,241,0.08); overflow: hidden; }
        .domain-bar-fill { height: 100%; border-radius: 8px; transition: width 0.6s ease; }

        .mobile-menu-btn { display: none; background: none; border: 1px solid rgba(99,102,241,0.25); border-radius: 8px; padding: 6px 10px; cursor: pointer; color: #e2e8f0; align-items: center; justify-content: center; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 45; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }

        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        @media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 900px) {
          .admin-sidebar { transform: translateX(-100%); }
          .admin-sidebar.open { transform: translateX(0); box-shadow: 8px 0 30px rgba(0,0,0,0.3); }
          .admin-topbar { left: 0 !important; }
          .admin-main { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .admin-main-inner { padding: 20px 14px !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
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
            Admin Dashboard
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 4 }}>
            <Bell size={20} color="#94a3b8" />
            <span style={{ position: "absolute", top: 2, right: 2, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: "2px solid #1e293b" }} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", color: "#fff", cursor: "pointer" }}>A</div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="admin-main" style={{ marginLeft: 260, paddingTop: 68 }}>
        <div className="admin-main-inner fade-up" style={{ padding: "28px 28px", maxWidth: 1300 }}>

          {/* Welcome */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.3rem, 3vw, 1.7rem)", fontWeight: 800, color: "#e2e8f0", marginBottom: 4 }}>
              Welcome back, Admin 👋
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Here's what's happening on the platform today.
            </p>
          </div>

          {/* ── Stats Grid ── */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            {platformStats.map((stat, i) => {
              const IconComp = stat.icon;
              return (
                <div key={i} className="admin-stat-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: `${stat.color}15`, border: `1px solid ${stat.color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconComp size={18} color={stat.color} />
                    </div>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.75rem", fontWeight: 600, color: stat.trend === "up" ? "#22c55e" : "#ef4444", background: stat.trend === "up" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: 50 }}>
                      {stat.trend === "up" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                      {stat.change}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#e2e8f0", marginBottom: 2 }}>{stat.value}</div>
                  <div style={{ color: "#64748b", fontSize: "0.78rem" }}>{stat.label} · {stat.period}</div>
                </div>
              );
            })}
          </div>

          {/* ── Recent Students Table ── */}
          <div className="admin-card" style={{ padding: "22px 24px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#e2e8f0" }}>Recent Students</h3>
              <span style={{ fontSize: "0.78rem", color: "#818cf8", fontWeight: 600, cursor: "pointer" }}>View All →</span>
            </div>
            <div className="table-wrap">
              <table style={{ width: "100%", borderCollapse: "collapse" }} className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Education</th>
                    <th>Stream</th>
                    <th>Quiz</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((student, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.7rem", color: "#818cf8", flexShrink: 0 }}>
                            {student.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "#e2e8f0", fontSize: "0.85rem" }}>{student.name}</div>
                            <div style={{ fontSize: "0.72rem", color: "#475569" }}>{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{student.level}</td>
                      <td>{student.stream}</td>
                      <td>
                        <span style={{
                          padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 600,
                          background: student.quizDone ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                          color: student.quizDone ? "#22c55e" : "#f59e0b",
                          border: `1px solid ${student.quizDone ? "rgba(34,197,94,0.2)" : "rgba(245,158,11,0.2)"}`,
                        }}>
                          {student.quizDone ? "Done" : "Pending"}
                        </span>
                      </td>
                      <td style={{ color: "#64748b", fontSize: "0.82rem" }}>{student.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Bottom Grid ── */}
          <div className="bottom-grid">

            {/* Top Careers */}
            <div className="admin-card" style={{ padding: "22px 24px" }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", marginBottom: 16 }}>
                Top Careers by Views
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {topCareers.map((career, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 10, background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "0.82rem", color: "#475569", width: 20 }}>
                        #{i + 1}
                      </span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#e2e8f0" }}>{career.title}</div>
                        <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{career.domain} · {career.saves} saves</div>
                      </div>
                    </div>
                    <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#818cf8" }}>
                      {career.views.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Domain Distribution + Activity */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Domain Distribution */}
              <div className="admin-card" style={{ padding: "22px 24px" }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", marginBottom: 16 }}>
                  Careers by Domain
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {domainDistribution.map((d, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: "0.82rem", color: "#cbd5e1", fontWeight: 500 }}>{d.domain}</span>
                        <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{d.count} ({d.percentage}%)</span>
                      </div>
                      <div className="domain-bar-bg">
                        <div className="domain-bar-fill" style={{ width: `${d.percentage}%`, background: d.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="admin-card" style={{ padding: "22px 24px" }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", marginBottom: 16 }}>
                  Recent Activity
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {recentActivity.map((act, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: act.color, marginTop: 7, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0" }}>{act.action}</div>
                        <div style={{ fontSize: "0.75rem", color: "#475569" }}>{act.detail}</div>
                        <div style={{ fontSize: "0.7rem", color: "#334155", marginTop: 2 }}>{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}