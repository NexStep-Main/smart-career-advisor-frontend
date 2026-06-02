import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GraduationCap, ArrowLeft, Bookmark, TrendingUp, Briefcase,
  MapPin, Clock, Star, ChevronRight, ExternalLink, CheckCircle,
  Map, Bell, User, LogOut, BarChart3, Bot, Menu, X,
  IndianRupee, Building, Users, BookOpen, Target, Zap
} from "lucide-react";

/* ── Full Career Data ── */
const careersData = [
  {
    id: 1, title: "Software Engineer", domain: "Technology",
    demandLevel: "High", tag: "Most Popular",
    salary: { min: 6, max: 25, avg: 12 },
    educationLevel: ["class12", "graduation"],
    streams: ["science", "engineering"],
    description: "Software Engineers design, develop, test, and maintain software applications and systems. They work across industries from startups to large corporations, building everything from mobile apps to complex distributed systems that serve millions of users.",
    skills: ["JavaScript", "React", "Node.js", "Data Structures", "Algorithms", "Git", "SQL", "System Design"],
    whatYouDo: [
      "Write clean, efficient, and maintainable code",
      "Design and build scalable software systems",
      "Collaborate with product managers and designers",
      "Debug and fix software defects and performance issues",
      "Participate in code reviews and technical discussions",
      "Deploy and monitor applications in production",
    ],
    eligibility: [
      "B.Tech / B.E. in Computer Science or related field",
      "BCA, MCA, or equivalent degree also accepted",
      "Strong fundamentals in programming and problem-solving",
      "Self-taught developers with strong portfolios also get hired",
    ],
    topColleges: [
      "IIT Bombay", "IIT Delhi", "IIT Madras", "BITS Pilani",
      "NIT Trichy", "IIIT Hyderabad", "DTU Delhi", "VIT Vellore",
    ],
    futureScope: "Software Engineering continues to be one of the highest-demand careers globally. With AI, cloud computing, and digital transformation accelerating, the demand for skilled engineers is projected to grow 25% over the next decade. India alone needs 1 million+ new software engineers by 2030.",
    dayInLife: [
      { time: "9:00 AM", activity: "Check emails, review pull requests from teammates" },
      { time: "10:00 AM", activity: "Daily standup meeting with the team" },
      { time: "10:30 AM", activity: "Deep coding session — building new features" },
      { time: "1:00 PM", activity: "Lunch break and informal tech discussions" },
      { time: "2:00 PM", activity: "Code review and debugging sessions" },
      { time: "4:00 PM", activity: "Technical design discussion for upcoming sprint" },
      { time: "5:30 PM", activity: "Documentation, learning, or side projects" },
    ],
    salaryProgression: [
      { year: "Fresher (0-1 yr)", range: "₹4L - ₹10L" },
      { year: "Junior (1-3 yrs)", range: "₹8L - ₹18L" },
      { year: "Mid-Level (3-5 yrs)", range: "₹15L - ₹30L" },
      { year: "Senior (5-8 yrs)", range: "₹25L - ₹50L" },
      { year: "Staff/Lead (8+ yrs)", range: "₹40L - ₹1Cr+" },
    ],
    topCompanies: ["Google", "Microsoft", "Amazon", "Flipkart", "Razorpay", "Zerodha", "Atlassian", "Adobe"],
    resources: [
      { name: "freeCodeCamp", url: "https://freecodecamp.org", type: "Free Course" },
      { name: "CS50 by Harvard", url: "https://cs50.harvard.edu", type: "Free Course" },
      { name: "LeetCode", url: "https://leetcode.com", type: "Practice" },
      { name: "The Odin Project", url: "https://theodinproject.com", type: "Free Course" },
    ],
    relatedCareers: [
      { id: 2, title: "Data Scientist", domain: "Technology" },
      { id: 7, title: "Product Manager", domain: "Business" },
      { id: 5, title: "UX Designer", domain: "Design" },
    ],
  },
  {
    id: 2, title: "Data Scientist", domain: "Technology",
    demandLevel: "High", tag: "High Paying",
    salary: { min: 8, max: 30, avg: 15 },
    educationLevel: ["graduation"],
    streams: ["science", "engineering"],
    description: "Data Scientists analyse complex datasets using statistical methods and machine learning to extract insights that drive business decisions. They build predictive models and work with large-scale data to solve real-world problems across industries.",
    skills: ["Python", "Machine Learning", "Statistics", "SQL", "TensorFlow", "Pandas", "Data Visualization", "Deep Learning"],
    whatYouDo: [
      "Collect, clean, and preprocess large datasets",
      "Build and train machine learning models",
      "Create dashboards and data visualizations",
      "Present findings to stakeholders and leadership",
      "Collaborate with engineering to deploy ML models",
      "Run A/B tests and statistical experiments",
    ],
    eligibility: [
      "B.Tech / M.Tech in CS, Statistics, or Mathematics",
      "Strong foundation in statistics and linear algebra",
      "MSc in Data Science or related quantitative field",
      "Online certifications also valued with strong portfolio",
    ],
    topColleges: [
      "ISI Kolkata", "IIT Madras", "IIT Bombay", "IISc Bangalore",
      "CMI Chennai", "IIIT Hyderabad", "IIT Kharagpur", "DTU Delhi",
    ],
    futureScope: "Data Science is one of the fastest-growing fields globally. By 2027, the global data science market is expected to reach $322 billion. India is the second-largest hub for data science jobs, with demand growing 45% year-over-year.",
    dayInLife: [
      { time: "9:00 AM", activity: "Review model performance metrics from overnight runs" },
      { time: "10:00 AM", activity: "Team sync and project priority discussion" },
      { time: "10:30 AM", activity: "Data exploration and feature engineering" },
      { time: "1:00 PM", activity: "Lunch and research paper reading" },
      { time: "2:00 PM", activity: "Model training and hyperparameter tuning" },
      { time: "4:00 PM", activity: "Stakeholder presentation of insights" },
      { time: "5:30 PM", activity: "Documentation and Kaggle competitions" },
    ],
    salaryProgression: [
      { year: "Fresher (0-1 yr)", range: "₹6L - ₹12L" },
      { year: "Junior (1-3 yrs)", range: "₹12L - ₹22L" },
      { year: "Mid-Level (3-5 yrs)", range: "₹20L - ₹40L" },
      { year: "Senior (5-8 yrs)", range: "₹35L - ₹60L" },
      { year: "Lead/Principal (8+ yrs)", range: "₹50L - ₹1.2Cr+" },
    ],
    topCompanies: ["Google", "Meta", "Amazon", "Flipkart", "Swiggy", "PhonePe", "Tiger Analytics", "Fractal"],
    resources: [
      { name: "Andrew Ng ML Course", url: "https://coursera.org/learn/machine-learning", type: "Free Course" },
      { name: "Kaggle Learn", url: "https://kaggle.com/learn", type: "Practice" },
      { name: "StatQuest YouTube", url: "https://youtube.com/statquest", type: "Video" },
      { name: "Fast.ai", url: "https://fast.ai", type: "Free Course" },
    ],
    relatedCareers: [
      { id: 1, title: "Software Engineer", domain: "Technology" },
      { id: 7, title: "Product Manager", domain: "Business" },
    ],
  },
];

const educationLabel = { class10: "Class 10", class12: "Class 12", graduation: "Graduation" };
const demandColor = { High: "#22c55e", Medium: "#f59e0b", Low: "#ef4444" };
const domainColor = {
  Technology: "#6366f1", Healthcare: "#22c55e", Commerce: "#f59e0b",
  Design: "#ec4899", Government: "#64748b", Business: "#38bdf8",
  Law: "#8b5cf6", Engineering: "#f97316",
};

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Career Explorer", href: "/careers", active: true },
  { icon: MapPin, label: "Skill Roadmaps", href: "/roadmaps" },
  { icon: Bot, label: "Recommendations", href: "/recommendations" },
  { icon: Bookmark, label: "Saved Careers", href: "/bookmarks" },
  { icon: User, label: "My Profile", href: "/profile" },
];

export default function CareerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const career = careersData.find(c => c.id === parseInt(id));

  if (!career) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", background: "#f8f9ff" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>Career not found</h2>
          <p style={{ color: "#64748b", marginBottom: 24 }}>The career you are looking for does not exist.</p>
          <a href="/careers" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", padding: "10px 24px", borderRadius: 10, fontWeight: 600, textDecoration: "none" }}>
            Back to Explorer
          </a>
        </div>
      </div>
    );
  }

  const dColor = domainColor[career.domain] || "#6366f1";
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "salary", label: "Salary & Growth" },
    { key: "dayinlife", label: "Day in Life" },
    { key: "resources", label: "Resources" },
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

        .detail-card { background: #ffffff; border: 1px solid rgba(99,102,241,0.1); border-radius: 16px; box-shadow: 0 2px 12px rgba(99,102,241,0.05); }

        .tab-btn { padding: 10px 20px; border: none; border-radius: 10px; font-size: 0.88rem; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; background: transparent; color: #64748b; }
        .tab-btn:hover { background: rgba(99,102,241,0.06); color: #1e293b; }
        .tab-btn.active { background: #6366f1; color: #ffffff; font-weight: 600; }

        .info-row { display: flex; align-items: center; gap: 8px; padding: 12px 0; border-bottom: 1px solid rgba(99,102,241,0.06); }
        .info-row:last-child { border-bottom: none; }

        .timeline-item { display: flex; gap: 16px; position: relative; padding-bottom: 20px; }
        .timeline-item:last-child { padding-bottom: 0; }
        .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: #6366f1; margin-top: 6px; flex-shrink: 0; z-index: 1; }
        .timeline-line { position: absolute; left: 4px; top: 16px; bottom: 0; width: 2px; background: rgba(99,102,241,0.12); }
        .timeline-item:last-child .timeline-line { display: none; }

        .mobile-menu-btn { display: none; background: none; border: 1px solid rgba(99,102,241,0.2); border-radius: 8px; padding: 6px 10px; cursor: pointer; color: #1e293b; align-items: center; justify-content: center; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 45; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }

        .content-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }

        @media (max-width: 1100px) { .content-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); box-shadow: 8px 0 30px rgba(0,0,0,0.1); }
          .topbar { left: 0 !important; }
          .main-content { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 600px) {
          .main-inner { padding: 20px 14px !important; }
          .tabs-row { flex-wrap: wrap !important; }
          .tab-btn { padding: 8px 14px !important; font-size: 0.82rem !important; }
          .hero-stats { flex-direction: column !important; gap: 8px !important; }
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
          <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 8, padding: "6px 14px", cursor: "pointer", color: "#64748b", fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif" }}>
            <ArrowLeft size={16} /> Back
          </button>
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

          {/* ── Career Hero Section ── */}
          <div className="detail-card" style={{ padding: "28px 32px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  <span style={{ background: `${dColor}12`, color: dColor, padding: "4px 12px", borderRadius: 50, fontSize: "0.78rem", fontWeight: 600, border: `1px solid ${dColor}25` }}>
                    {career.domain}
                  </span>
                  {career.tag && (
                    <span style={{ background: "rgba(99,102,241,0.06)", color: "#6366f1", padding: "4px 12px", borderRadius: 50, fontSize: "0.75rem", fontWeight: 600, border: "1px solid rgba(99,102,241,0.15)" }}>
                      {career.tag}
                    </span>
                  )}
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", fontWeight: 600, color: demandColor[career.demandLevel] }}>
                    <TrendingUp size={14} /> {career.demandLevel} Demand
                  </span>
                </div>

                <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, color: "#1e293b", marginBottom: 10, lineHeight: 1.2 }}>
                  {career.title}
                </h1>
                <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 680 }}>
                  {career.description}
                </p>

                {/* Quick stats */}
                <div className="hero-stats" style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: "0.88rem" }}>
                    <IndianRupee size={16} color="#6366f1" />
                    <span><strong style={{ color: "#1e293b" }}>₹{career.salary.min}L – ₹{career.salary.max}L</strong> / year</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: "0.88rem" }}>
                    <GraduationCap size={16} color="#6366f1" />
                    {career.educationLevel.map(l => educationLabel[l]).join(", ")}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: "0.88rem" }}>
                    <Building size={16} color="#6366f1" />
                    {career.topCompanies.length}+ top companies hiring
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href={`/roadmap/${career.id}`} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  color: "#fff", padding: "12px 24px", borderRadius: 12,
                  fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 20px rgba(99,102,241,0.3)"; }}
                  onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}>
                  <MapPin size={16} /> View Roadmap
                </a>
                <button onClick={() => setSaved(!saved)} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: saved ? "rgba(99,102,241,0.08)" : "#ffffff",
                  color: saved ? "#6366f1" : "#64748b",
                  padding: "12px 24px", borderRadius: 12,
                  fontWeight: 600, fontSize: "0.9rem",
                  border: `1.5px solid ${saved ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.15)"}`,
                  cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  <Bookmark size={16} fill={saved ? "#6366f1" : "none"} /> {saved ? "Saved" : "Save Career"}
                </button>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="tabs-row" style={{ display: "flex", gap: 6, marginBottom: 20, background: "#ffffff", padding: "6px", borderRadius: 12, border: "1px solid rgba(99,102,241,0.1)", width: "fit-content" }}>
            {tabs.map(tab => (
              <button key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Content Grid ── */}
          <div className="content-grid">

            {/* Left column — Main content */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <>
                  {/* What You'll Do */}
                  <div className="detail-card" style={{ padding: "24px 28px" }}>
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                      <Target size={18} color="#6366f1" /> What You'll Do
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {career.whatYouDo.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <CheckCircle size={16} color="#22c55e" style={{ marginTop: 3, flexShrink: 0 }} />
                          <span style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.6 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Eligibility */}
                  <div className="detail-card" style={{ padding: "24px 28px" }}>
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                      <BookOpen size={18} color="#6366f1" /> Eligibility & Qualifications
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {career.eligibility.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <ChevronRight size={16} color="#6366f1" style={{ marginTop: 3, flexShrink: 0 }} />
                          <span style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.6 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Future Scope */}
                  <div className="detail-card" style={{ padding: "24px 28px" }}>
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                      <TrendingUp size={18} color="#6366f1" /> Future Scope & Growth
                    </h3>
                    <p style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.8 }}>{career.futureScope}</p>
                  </div>
                </>
              )}

              {/* SALARY TAB */}
              {activeTab === "salary" && (
                <>
                  <div className="detail-card" style={{ padding: "24px 28px" }}>
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                      <IndianRupee size={18} color="#6366f1" /> Salary Progression
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {career.salaryProgression.map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 10, background: i % 2 === 0 ? "#f8f9ff" : "transparent" }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b" }}>{item.year}</div>
                          </div>
                          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#6366f1" }}>{item.range}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="detail-card" style={{ padding: "24px 28px" }}>
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                      <Building size={18} color="#6366f1" /> Top Companies Hiring
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {career.topCompanies.map(company => (
                        <span key={company} style={{ background: "#f8f9ff", color: "#1e293b", padding: "8px 16px", borderRadius: 10, fontSize: "0.85rem", fontWeight: 500, border: "1px solid rgba(99,102,241,0.1)" }}>
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* DAY IN LIFE TAB */}
              {activeTab === "dayinlife" && (
                <div className="detail-card" style={{ padding: "24px 28px" }}>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                    <Clock size={18} color="#6366f1" /> A Day in the Life
                  </h3>
                  <div>
                    {career.dayInLife.map((item, i) => (
                      <div key={i} className="timeline-item">
                        <div style={{ position: "relative" }}>
                          <div className="timeline-dot" />
                          <div className="timeline-line" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#6366f1", marginBottom: 4 }}>
                            {item.time}
                          </div>
                          <p style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.6 }}>{item.activity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RESOURCES TAB */}
              {activeTab === "resources" && (
                <div className="detail-card" style={{ padding: "24px 28px" }}>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <BookOpen size={18} color="#6366f1" /> Learning Resources
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {career.resources.map((res, i) => (
                      <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 12, background: "#f8f9ff", border: "1px solid rgba(99,102,241,0.08)", textDecoration: "none", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)"; e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.08)"; e.currentTarget.style.background = "#f8f9ff"; }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b", marginBottom: 2 }}>{res.name}</div>
                          <span style={{ fontSize: "0.78rem", color: "#6366f1", fontWeight: 500 }}>{res.type}</span>
                        </div>
                        <ExternalLink size={16} color="#94a3b8" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column — Sidebar info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Required Skills */}
              <div className="detail-card" style={{ padding: "22px 24px" }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <Zap size={16} color="#6366f1" /> Required Skills
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {career.skills.map(skill => (
                    <span key={skill} style={{ background: "rgba(99,102,241,0.06)", color: "#6366f1", padding: "6px 12px", borderRadius: 8, fontSize: "0.8rem", fontWeight: 500, border: "1px solid rgba(99,102,241,0.12)" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Colleges */}
              <div className="detail-card" style={{ padding: "22px 24px" }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <GraduationCap size={16} color="#6366f1" /> Top Colleges
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {career.topColleges.map((college, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "#475569" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", flexShrink: 0 }} />
                      {college}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Levels */}
              <div className="detail-card" style={{ padding: "22px 24px" }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <BookOpen size={16} color="#6366f1" /> Suitable After
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {career.educationLevel.map(level => (
                    <span key={level} style={{ background: "#f8f9ff", color: "#1e293b", padding: "6px 14px", borderRadius: 8, fontSize: "0.82rem", fontWeight: 500, border: "1px solid rgba(99,102,241,0.1)" }}>
                      {educationLabel[level]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related Careers */}
              {career.relatedCareers && career.relatedCareers.length > 0 && (
                <div className="detail-card" style={{ padding: "22px 24px" }}>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <Users size={16} color="#6366f1" /> Related Careers
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {career.relatedCareers.map(related => {
                      const rColor = domainColor[related.domain] || "#6366f1";
                      return (
                        <a key={related.id} href={`/careers/${related.id}`}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 10, background: "#f8f9ff", border: "1px solid rgba(99,102,241,0.06)", textDecoration: "none", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.06)"; e.currentTarget.style.background = "#f8f9ff"; }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1e293b" }}>{related.title}</div>
                            <span style={{ fontSize: "0.72rem", color: rColor }}>{related.domain}</span>
                          </div>
                          <ChevronRight size={16} color="#94a3b8" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(56,189,248,0.06))",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: 16, padding: "22px 24px", textAlign: "center",
              }}>
                <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                  Ready to start this career?
                </h4>
                <p style={{ color: "#64748b", fontSize: "0.82rem", marginBottom: 14, lineHeight: 1.5 }}>
                  View the complete step-by-step roadmap to get started.
                </p>
                <a href={`/roadmap/${career.id}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  color: "#fff", padding: "10px 22px", borderRadius: 10,
                  fontWeight: 600, fontSize: "0.85rem", textDecoration: "none",
                  transition: "transform 0.2s",
                }}
                  onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
                  View Roadmap <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}