import { useState } from "react";
import {
  GraduationCap, Bookmark, Map, MapPin, Bot, Bell, User, LogOut,
  BarChart3, Menu, X, Camera, Mail, Phone, MapPinned, Calendar,
  Edit3, Save, ChevronRight, Award, Target, TrendingUp,
  BookOpen, Briefcase, Shield, Eye, EyeOff, Lock, CheckCircle
} from "lucide-react";

/* ── Mock User Data ── */
const initialUser = {
  fullName: "Anirban Das",
  email: "anirban@example.com",
  phone: "+91 98765 43210",
  location: "Kolkata, West Bengal",
  joinedDate: "January 2026",
  avatar: "AD",
  bio: "B.Tech CSE final year student passionate about building software and exploring career opportunities in technology.",
  educationLevel: "Graduation",
  stream: "Engineering (B.Tech CSE)",
  interests: ["Technology", "Business", "Creative Arts"],
  workStyle: "Analytical",
  priority: "High Salary",
};

const activityStats = [
  { icon: Map, label: "Careers Explored", value: "24", color: "#6366f1" },
  { icon: Bookmark, label: "Careers Saved", value: "5", color: "#f59e0b" },
  { icon: MapPin, label: "Roadmaps Viewed", value: "8", color: "#22c55e" },
  { icon: Target, label: "Quiz Completed", value: "Yes", color: "#38bdf8" },
];

const achievements = [
  { icon: Award, title: "Quiz Champion", desc: "Completed the career quiz", color: "#6366f1", earned: true },
  { icon: Map, title: "Explorer", desc: "Viewed 10+ career paths", color: "#22c55e", earned: true },
  { icon: Bookmark, title: "Collector", desc: "Saved 5+ careers", color: "#f59e0b", earned: true },
  { icon: MapPin, title: "Roadmap Warrior", desc: "Viewed 5+ roadmaps", color: "#38bdf8", earned: true },
  { icon: TrendingUp, title: "Trending Tracker", desc: "Explored trending domains", color: "#ec4899", earned: false },
  { icon: BookOpen, title: "Resource Hunter", desc: "Opened 20+ resources", color: "#8b5cf6", earned: false },
];

const recentlyViewed = [
  { id: 1, title: "Software Engineer", domain: "Technology", viewedAt: "2 hours ago" },
  { id: 2, title: "Data Scientist", domain: "Technology", viewedAt: "5 hours ago" },
  { id: 7, title: "Product Manager", domain: "Business", viewedAt: "1 day ago" },
  { id: 5, title: "UX Designer", domain: "Design", viewedAt: "2 days ago" },
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
  { icon: User, label: "My Profile", href: "/profile", active: true },
];

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(initialUser);
  const [editData, setEditData] = useState(initialUser);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", newPass: "", confirm: "" });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleSaveProfile = () => {
    setUserData(editData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancelEdit = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const tabs = [
    { key: "profile", label: "Profile", icon: User },
    { key: "quiz", label: "Quiz Answers", icon: Target },
    { key: "achievements", label: "Achievements", icon: Award },
    { key: "security", label: "Security", icon: Shield },
  ];

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

        .profile-card { background: #ffffff; border: 1px solid rgba(99,102,241,0.1); border-radius: 16px; box-shadow: 0 2px 12px rgba(99,102,241,0.05); }

        .profile-input { width: 100%; padding: 12px 16px; border: 1.5px solid rgba(99,102,241,0.15); border-radius: 10px; font-size: 0.9rem; font-family: 'DM Sans', sans-serif; background: #ffffff; color: #1e293b; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .profile-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
        .profile-input::placeholder { color: #94a3b8; }
        .profile-input:disabled { background: #f8f9ff; color: #64748b; cursor: not-allowed; }

        .tab-btn { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border: none; border-radius: 10px; font-size: 0.88rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; background: transparent; color: #64748b; }
        .tab-btn:hover { background: rgba(99,102,241,0.06); color: #1e293b; }
        .tab-btn.active { background: #6366f1; color: #ffffff; font-weight: 600; }

        .achievement-card { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 12px; border: 1px solid rgba(99,102,241,0.08); transition: all 0.2s; }
        .achievement-card:hover { border-color: rgba(99,102,241,0.2); background: rgba(99,102,241,0.02); }
        .achievement-card.locked { opacity: 0.5; }

        .quiz-info-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid rgba(99,102,241,0.06); }
        .quiz-info-row:last-child { border-bottom: none; }

        .interest-tag { display: inline-flex; align-items: center; gap: 4px; background: rgba(99,102,241,0.06); color: #6366f1; padding: 5px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 500; border: 1px solid rgba(99,102,241,0.12); }

        .success-toast { position: fixed; top: 80px; right: 28px; background: #ffffff; border: 1px solid rgba(34,197,94,0.2); border-radius: 12px; padding: 14px 20px; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 30px rgba(0,0,0,0.1); z-index: 100; animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

        .mobile-menu-btn { display: none; background: none; border: 1px solid rgba(99,102,241,0.2); border-radius: 8px; padding: 6px 10px; cursor: pointer; color: #1e293b; align-items: center; justify-content: center; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 45; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }

        .profile-layout { display: grid; grid-template-columns: 300px 1fr; gap: 20px; }

        @media (max-width: 1100px) { .profile-layout { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); box-shadow: 8px 0 30px rgba(0,0,0,0.1); }
          .topbar { left: 0 !important; }
          .main-content { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 600px) {
          .main-inner { padding: 20px 14px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .tabs-row { flex-wrap: wrap !important; }
          .tab-btn { padding: 8px 14px !important; font-size: 0.82rem !important; }
          .achievements-grid { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
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
            <User size={18} color="#6366f1" /> My Profile
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 4 }}>
            <Bell size={20} color="#64748b" />
            <span style={{ position: "absolute", top: 2, right: 2, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: "2px solid #ffffff" }} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem", color: "#fff", cursor: "pointer" }}>
            {userData.avatar}
          </div>
        </div>
      </header>

      {/* Success toast */}
      {saveSuccess && (
        <div className="success-toast">
          <CheckCircle size={18} color="#22c55e" />
          <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1e293b" }}>Profile updated successfully!</span>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main className="main-content" style={{ marginLeft: 260, paddingTop: 68 }}>
        <div className="main-inner fade-up" style={{ padding: "28px 28px", maxWidth: 1200 }}>

          {/* ── Profile Layout ── */}
          <div className="profile-layout">

            {/* Left — Profile Card */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Avatar card */}
              <div className="profile-card" style={{ padding: "28px 24px", textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
                  <div style={{
                    width: 90, height: 90, borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#ffffff",
                    boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
                  }}>
                    {userData.avatar}
                  </div>
                  <button style={{
                    position: "absolute", bottom: 0, right: 0,
                    width: 30, height: 30, borderRadius: "50%",
                    background: "#ffffff", border: "2px solid rgba(99,102,241,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}>
                    <Camera size={13} color="#6366f1" />
                  </button>
                </div>

                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
                  {userData.fullName}
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 4 }}>{userData.stream}</p>
                <p style={{ color: "#94a3b8", fontSize: "0.78rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <Calendar size={12} /> Joined {userData.joinedDate}
                </p>

                {userData.bio && (
                  <p style={{ color: "#475569", fontSize: "0.83rem", lineHeight: 1.6, marginTop: 14, padding: "12px 14px", background: "#f8f9ff", borderRadius: 10, border: "1px solid rgba(99,102,241,0.06)" }}>
                    {userData.bio}
                  </p>
                )}
              </div>

              {/* Contact info */}
              <div className="profile-card" style={{ padding: "20px 24px" }}>
                <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>
                  Contact Info
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem" }}>
                    <Mail size={15} color="#6366f1" />
                    <span style={{ color: "#475569" }}>{userData.email}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem" }}>
                    <Phone size={15} color="#6366f1" />
                    <span style={{ color: "#475569" }}>{userData.phone}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem" }}>
                    <MapPinned size={15} color="#6366f1" />
                    <span style={{ color: "#475569" }}>{userData.location}</span>
                  </div>
                </div>
              </div>

              {/* Activity stats */}
              <div className="profile-card" style={{ padding: "20px 24px" }}>
                <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>
                  Activity Stats
                </h4>
                <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {activityStats.map((stat, i) => {
                    const IconComp = stat.icon;
                    return (
                      <div key={i} style={{ padding: "12px", borderRadius: 10, background: "#f8f9ff", border: "1px solid rgba(99,102,241,0.06)", textAlign: "center" }}>
                        <IconComp size={18} color={stat.color} style={{ marginBottom: 6 }} />
                        <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#1e293b" }}>{stat.value}</div>
                        <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recently viewed */}
              <div className="profile-card" style={{ padding: "20px 24px" }}>
                <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>
                  Recently Viewed
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {recentlyViewed.map(career => {
                    const dColor = domainColor[career.domain] || "#6366f1";
                    return (
                      <a key={career.id} href={`/careers/${career.id}`}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 10, background: "#f8f9ff", border: "1px solid rgba(99,102,241,0.06)", textDecoration: "none", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.06)"; e.currentTarget.style.background = "#f8f9ff"; }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1e293b" }}>{career.title}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                            <span style={{ fontSize: "0.72rem", color: dColor, fontWeight: 600 }}>{career.domain}</span>
                            <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>· {career.viewedAt}</span>
                          </div>
                        </div>
                        <ChevronRight size={14} color="#94a3b8" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right — Tabs Content */}
            <div>
              {/* Tabs */}
              <div className="tabs-row" style={{ display: "flex", gap: 6, marginBottom: 20, background: "#ffffff", padding: "6px", borderRadius: 12, border: "1px solid rgba(99,102,241,0.1)", width: "fit-content" }}>
                {tabs.map(tab => {
                  const TabIcon = tab.icon;
                  return (
                    <button key={tab.key}
                      className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                      onClick={() => setActiveTab(tab.key)}>
                      <TabIcon size={15} /> {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* ── PROFILE TAB ── */}
              {activeTab === "profile" && (
                <div className="profile-card" style={{ padding: "28px 28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b" }}>
                      Personal Information
                    </h3>
                    {!isEditing ? (
                      <button onClick={() => setIsEditing(true)} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 18px", borderRadius: 10,
                        border: "1.5px solid rgba(99,102,241,0.2)", background: "#ffffff",
                        color: "#6366f1", fontWeight: 600, fontSize: "0.85rem",
                        cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.04)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; }}>
                        <Edit3 size={14} /> Edit Profile
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={handleCancelEdit} style={{
                          padding: "8px 18px", borderRadius: 10,
                          border: "1.5px solid rgba(99,102,241,0.2)", background: "#ffffff",
                          color: "#64748b", fontWeight: 600, fontSize: "0.85rem",
                          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                        }}>
                          Cancel
                        </button>
                        <button onClick={handleSaveProfile} style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "8px 18px", borderRadius: 10,
                          border: "none", background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                          color: "#ffffff", fontWeight: 600, fontSize: "0.85rem",
                          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                          transition: "transform 0.2s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                          <Save size={14} /> Save Changes
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                    <div>
                      <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#1e293b" }}>Full Name</label>
                      <input className="profile-input" type="text" value={isEditing ? editData.fullName : userData.fullName}
                        onChange={e => handleEditChange("fullName", e.target.value)} disabled={!isEditing} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#1e293b" }}>Email Address</label>
                      <input className="profile-input" type="email" value={isEditing ? editData.email : userData.email}
                        onChange={e => handleEditChange("email", e.target.value)} disabled={!isEditing} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#1e293b" }}>Phone Number</label>
                      <input className="profile-input" type="tel" value={isEditing ? editData.phone : userData.phone}
                        onChange={e => handleEditChange("phone", e.target.value)} disabled={!isEditing} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#1e293b" }}>Location</label>
                      <input className="profile-input" type="text" value={isEditing ? editData.location : userData.location}
                        onChange={e => handleEditChange("location", e.target.value)} disabled={!isEditing} />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#1e293b" }}>Bio</label>
                      <textarea className="profile-input" rows={3} value={isEditing ? editData.bio : userData.bio}
                        onChange={e => handleEditChange("bio", e.target.value)} disabled={!isEditing}
                        style={{ resize: "vertical", fontFamily: "'DM Sans', sans-serif" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── QUIZ ANSWERS TAB ── */}
              {activeTab === "quiz" && (
                <div className="profile-card" style={{ padding: "28px 28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b" }}>
                      Your Quiz Answers
                    </h3>
                    <a href="/onboarding" style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 18px", borderRadius: 10,
                      border: "1.5px solid rgba(99,102,241,0.2)", background: "#ffffff",
                      color: "#6366f1", fontWeight: 600, fontSize: "0.85rem",
                      textDecoration: "none", transition: "all 0.2s",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.04)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.35)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; }}>
                      <Edit3 size={14} /> Retake Quiz
                    </a>
                  </div>

                  <p style={{ color: "#64748b", fontSize: "0.88rem", marginBottom: 20 }}>
                    These answers are used to generate your personalised career recommendations.
                  </p>

                  <div>
                    <div className="quiz-info-row">
                      <span style={{ color: "#64748b", fontSize: "0.88rem" }}>Education Level</span>
                      <span style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.88rem" }}>{userData.educationLevel}</span>
                    </div>
                    <div className="quiz-info-row">
                      <span style={{ color: "#64748b", fontSize: "0.88rem" }}>Stream</span>
                      <span style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.88rem" }}>{userData.stream}</span>
                    </div>
                    <div className="quiz-info-row">
                      <span style={{ color: "#64748b", fontSize: "0.88rem" }}>Interests</span>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {userData.interests.map(i => (
                          <span key={i} className="interest-tag">{i}</span>
                        ))}
                      </div>
                    </div>
                    <div className="quiz-info-row">
                      <span style={{ color: "#64748b", fontSize: "0.88rem" }}>Work Style</span>
                      <span style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.88rem" }}>{userData.workStyle}</span>
                    </div>
                    <div className="quiz-info-row">
                      <span style={{ color: "#64748b", fontSize: "0.88rem" }}>Career Priority</span>
                      <span style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.88rem" }}>{userData.priority}</span>
                    </div>
                  </div>

                  <div style={{
                    marginTop: 20, padding: "14px 18px",
                    background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.12)",
                    borderRadius: 12, display: "flex", alignItems: "flex-start", gap: 10,
                  }}>
                    <Target size={16} color="#6366f1" style={{ marginTop: 2, flexShrink: 0 }} />
                    <p style={{ color: "#475569", fontSize: "0.85rem", lineHeight: 1.6 }}>
                      <strong style={{ color: "#1e293b" }}>Tip:</strong> Retaking the quiz with updated answers will refresh your career recommendations to better match your current interests.
                    </p>
                  </div>
                </div>
              )}

              {/* ── ACHIEVEMENTS TAB ── */}
              {activeTab === "achievements" && (
                <div className="profile-card" style={{ padding: "28px 28px" }}>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                    Your Achievements
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "0.88rem", marginBottom: 20 }}>
                    Earned <strong style={{ color: "#6366f1" }}>{achievements.filter(a => a.earned).length}</strong> out of {achievements.length} badges
                  </p>

                  <div className="achievements-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {achievements.map((ach, i) => {
                      const AchIcon = ach.icon;
                      return (
                        <div key={i} className={`achievement-card ${!ach.earned ? "locked" : ""}`}
                          style={{ background: ach.earned ? "#ffffff" : "#f8f9ff" }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                            background: ach.earned ? `${ach.color}12` : "rgba(148,163,184,0.08)",
                            border: `1.5px solid ${ach.earned ? `${ach.color}30` : "rgba(148,163,184,0.15)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <AchIcon size={20} color={ach.earned ? ach.color : "#94a3b8"} />
                          </div>
                          <div>
                            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.88rem", fontWeight: 700, color: ach.earned ? "#1e293b" : "#94a3b8", marginBottom: 2 }}>
                              {ach.title}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: ach.earned ? "#64748b" : "#94a3b8" }}>
                              {ach.desc}
                            </div>
                            {ach.earned && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: "0.7rem", color: "#22c55e", fontWeight: 600 }}>
                                <CheckCircle size={11} /> Earned
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── SECURITY TAB ── */}
              {activeTab === "security" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Change password */}
                  <div className="profile-card" style={{ padding: "28px 28px" }}>
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                      <Lock size={18} color="#6366f1" /> Change Password
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 440 }}>
                      <div>
                        <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#1e293b" }}>Current Password</label>
                        <div style={{ position: "relative" }}>
                          <input className="profile-input" type={showPassword ? "text" : "password"} placeholder="Enter current password"
                            value={passwordData.current} onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                            style={{ paddingRight: 42 }} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                            {showPassword ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#1e293b" }}>New Password</label>
                        <input className="profile-input" type="password" placeholder="Enter new password"
                          value={passwordData.newPass} onChange={e => setPasswordData({ ...passwordData, newPass: e.target.value })} />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#1e293b" }}>Confirm New Password</label>
                        <input className="profile-input" type="password" placeholder="Confirm new password"
                          value={passwordData.confirm} onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })} />
                        {passwordData.confirm && passwordData.newPass !== passwordData.confirm && (
                          <span style={{ fontSize: "0.78rem", color: "#ef4444", marginTop: 4, display: "block" }}>Passwords do not match</span>
                        )}
                      </div>
                      <button style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "12px 0", borderRadius: 10, width: "100%",
                        background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                        color: "#fff", fontWeight: 600, fontSize: "0.9rem",
                        border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                        transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.3)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                        <Lock size={15} /> Update Password
                      </button>
                    </div>
                  </div>

                  {/* Danger zone */}
                  <div className="profile-card" style={{ padding: "24px 28px", borderColor: "rgba(239,68,68,0.15)" }}>
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#ef4444", marginBottom: 8 }}>
                      Danger Zone
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 16 }}>
                      Once you delete your account, there is no going back. All your data will be permanently removed.
                    </p>
                    <button style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "10px 20px", borderRadius: 10,
                      border: "1.5px solid rgba(239,68,68,0.25)",
                      background: "rgba(239,68,68,0.04)", color: "#ef4444",
                      fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.04)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"; }}>
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}