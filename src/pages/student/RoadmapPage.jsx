import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GraduationCap, ArrowLeft, Bookmark, CheckCircle, Circle, Lock,
  Clock, ExternalLink, ChevronDown, ChevronRight, Map, MapPin,
  Bot, Bell, User, LogOut, BarChart3, Menu, X, BookOpen,
  Code, Database, Server, Globe, Layers, Award, Target, Play
} from "lucide-react";

/* ── Roadmap Data ── */
const roadmapsData = [
  {
    id: 1, careerId: 1, title: "Software Engineer Roadmap",
    careerTitle: "Software Engineer", domain: "Technology",
    estimatedTime: "6 - 12 months",
    description: "A complete phase-by-phase guide to becoming a job-ready Software Engineer. Follow each phase in order, build projects, and track your progress.",
    phases: [
      {
        phaseNumber: 1, title: "Programming Foundations",
        icon: Code, color: "#6366f1",
        description: "Master the fundamentals of programming with one language. Build a strong base before moving to advanced topics.",
        durationWeeks: 6, status: "completed",
        skills: ["Variables & Data Types", "Loops & Conditionals", "Functions", "Arrays & Strings", "Basic OOP"],
        resources: [
          { name: "CS50 Introduction to Computer Science", url: "https://cs50.harvard.edu", type: "Course" },
          { name: "JavaScript.info — Modern JS Tutorial", url: "https://javascript.info", type: "Tutorial" },
          { name: "freeCodeCamp JavaScript Course", url: "https://freecodecamp.org", type: "Course" },
        ],
        projects: [
          "Build a calculator app",
          "Create a to-do list application",
          "Build a number guessing game",
        ],
        tips: "Focus on one language first — JavaScript or Python. Don't switch between languages at this stage.",
      },
      {
        phaseNumber: 2, title: "Data Structures & Algorithms",
        icon: Database, color: "#22c55e",
        description: "Learn the core DSA concepts that are essential for coding interviews and writing efficient code.",
        durationWeeks: 8, status: "in-progress",
        skills: ["Arrays & Hashing", "Linked Lists", "Stacks & Queues", "Trees & Graphs", "Sorting & Searching", "Recursion", "Dynamic Programming"],
        resources: [
          { name: "NeetCode 150 Problems", url: "https://neetcode.io", type: "Practice" },
          { name: "Striver's DSA Sheet", url: "https://takeuforward.org/strivers-a2z-dsa-course", type: "Practice" },
          { name: "Abdul Bari Algorithms YouTube", url: "https://youtube.com/@abdul_bari", type: "Video" },
        ],
        projects: [
          "Solve 100+ LeetCode problems",
          "Implement all sorting algorithms from scratch",
          "Build a maze solver using BFS/DFS",
        ],
        tips: "Solve at least 2-3 problems daily. Focus on understanding patterns, not memorizing solutions.",
      },
      {
        phaseNumber: 3, title: "Frontend Development",
        icon: Globe, color: "#38bdf8",
        description: "Learn to build beautiful, responsive user interfaces using modern frontend technologies.",
        durationWeeks: 8, status: "locked",
        skills: ["HTML5 & CSS3", "JavaScript ES6+", "React.js", "Tailwind CSS", "Responsive Design", "State Management", "API Integration"],
        resources: [
          { name: "The Odin Project — Full Stack", url: "https://theodinproject.com", type: "Course" },
          { name: "React Official Tutorial", url: "https://react.dev/learn", type: "Tutorial" },
          { name: "Tailwind CSS Documentation", url: "https://tailwindcss.com/docs", type: "Docs" },
        ],
        projects: [
          "Build a portfolio website",
          "Create a weather app using API",
          "Build a full e-commerce product page",
        ],
        tips: "Build projects after every concept. Don't just watch tutorials — code along and experiment.",
      },
      {
        phaseNumber: 4, title: "Backend Development",
        icon: Server, color: "#f59e0b",
        description: "Learn server-side programming, databases, APIs, and how to build robust backend systems.",
        durationWeeks: 8, status: "locked",
        skills: ["Node.js & Express", "REST APIs", "MongoDB", "PostgreSQL", "Authentication (JWT)", "Error Handling", "File Uploads"],
        resources: [
          { name: "Node.js Official Getting Started", url: "https://nodejs.org/en/learn", type: "Tutorial" },
          { name: "MongoDB University Free Courses", url: "https://university.mongodb.com", type: "Course" },
          { name: "Traversy Media Express Crash Course", url: "https://youtube.com/@TraversyMedia", type: "Video" },
        ],
        projects: [
          "Build a REST API for a blog platform",
          "Create an authentication system with JWT",
          "Build a URL shortener service",
        ],
        tips: "Understand how HTTP works first. Learn to debug APIs using Postman before connecting with frontend.",
      },
      {
        phaseNumber: 5, title: "Full Stack Projects & Job Prep",
        icon: Layers, color: "#ec4899",
        description: "Combine everything you learned. Build full stack projects, prepare your resume, and start applying.",
        durationWeeks: 10, status: "locked",
        skills: ["Full Stack Architecture", "Deployment (Vercel/Render)", "Git & GitHub", "System Design Basics", "Resume Building", "Interview Preparation"],
        resources: [
          { name: "FullStackOpen by University of Helsinki", url: "https://fullstackopen.com", type: "Course" },
          { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", type: "Guide" },
          { name: "Tech Interview Handbook", url: "https://techinterviewhandbook.org", type: "Guide" },
        ],
        projects: [
          "Build a complete project management tool (like Trello)",
          "Create a real-time chat application",
          "Build your capstone portfolio project",
        ],
        tips: "Focus on 2-3 strong projects rather than 10 small ones. Deploy everything. Make your GitHub profile shine.",
      },
    ],
  },
  {
    id: 2, careerId: 2, title: "Data Scientist Roadmap",
    careerTitle: "Data Scientist", domain: "Technology",
    estimatedTime: "8 - 14 months",
    description: "A structured path to becoming a Data Scientist. From Python basics to machine learning and real-world projects.",
    phases: [
      {
        phaseNumber: 1, title: "Python & Mathematics",
        icon: Code, color: "#6366f1",
        description: "Build a strong foundation in Python programming and the mathematical concepts essential for data science.",
        durationWeeks: 6, status: "completed",
        skills: ["Python Basics", "NumPy", "Pandas", "Linear Algebra", "Probability", "Statistics"],
        resources: [
          { name: "Python for Everybody — Dr. Chuck", url: "https://py4e.com", type: "Course" },
          { name: "Khan Academy — Linear Algebra", url: "https://khanacademy.org/math/linear-algebra", type: "Course" },
          { name: "StatQuest YouTube Channel", url: "https://youtube.com/@statquest", type: "Video" },
        ],
        projects: [
          "Analyse a CSV dataset using Pandas",
          "Build a statistical calculator",
          "Visualize population data with Matplotlib",
        ],
        tips: "Don't skip the math. Statistics and linear algebra are the backbone of every ML algorithm.",
      },
      {
        phaseNumber: 2, title: "Data Analysis & Visualization",
        icon: Target, color: "#22c55e",
        description: "Learn to explore, clean, and visualize data to extract meaningful insights.",
        durationWeeks: 6, status: "in-progress",
        skills: ["Matplotlib", "Seaborn", "Plotly", "Data Cleaning", "EDA", "SQL"],
        resources: [
          { name: "Kaggle Learn — Data Visualization", url: "https://kaggle.com/learn/data-visualization", type: "Course" },
          { name: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial", type: "Tutorial" },
          { name: "Python Data Science Handbook", url: "https://jakevdp.github.io/PythonDataScienceHandbook", type: "Book" },
        ],
        projects: [
          "Perform EDA on Titanic dataset",
          "Build an interactive dashboard with Plotly",
          "Analyse and visualize COVID-19 data",
        ],
        tips: "Kaggle is your best friend. Start with their free datasets and participate in beginner competitions.",
      },
      {
        phaseNumber: 3, title: "Machine Learning",
        icon: Database, color: "#38bdf8",
        description: "Learn supervised and unsupervised ML algorithms and how to build predictive models.",
        durationWeeks: 10, status: "locked",
        skills: ["Scikit-learn", "Regression", "Classification", "Clustering", "Decision Trees", "Random Forest", "Model Evaluation"],
        resources: [
          { name: "Andrew Ng ML Course — Coursera", url: "https://coursera.org/learn/machine-learning", type: "Course" },
          { name: "Hands-On ML Book by Aurélien Géron", url: "https://oreilly.com/library/view/hands-on-machine-learning", type: "Book" },
          { name: "Kaggle Learn — Intro to ML", url: "https://kaggle.com/learn/intro-to-machine-learning", type: "Course" },
        ],
        projects: [
          "Build a house price predictor",
          "Create a spam email classifier",
          "Build a customer segmentation model",
        ],
        tips: "Implement algorithms from scratch at least once. Then use Scikit-learn for speed.",
      },
      {
        phaseNumber: 4, title: "Deep Learning & Deployment",
        icon: Layers, color: "#f59e0b",
        description: "Dive into neural networks, deep learning frameworks, and learn to deploy ML models.",
        durationWeeks: 10, status: "locked",
        skills: ["TensorFlow", "PyTorch", "Neural Networks", "CNNs", "NLP Basics", "Model Deployment", "Flask/Streamlit"],
        resources: [
          { name: "Fast.ai Practical Deep Learning", url: "https://fast.ai", type: "Course" },
          { name: "Deep Learning Specialization — Coursera", url: "https://coursera.org/specializations/deep-learning", type: "Course" },
          { name: "Streamlit Documentation", url: "https://docs.streamlit.io", type: "Docs" },
        ],
        projects: [
          "Build an image classification model",
          "Create a sentiment analysis tool",
          "Deploy an ML model with Streamlit",
        ],
        tips: "Start with Fast.ai — it teaches top-down. You build models first, then understand the theory behind them.",
      },
    ],
  },
];

const statusConfig = {
  completed: { label: "Completed", color: "#22c55e", bg: "rgba(34,197,94,0.08)", icon: CheckCircle },
  "in-progress": { label: "In Progress", color: "#6366f1", bg: "rgba(99,102,241,0.08)", icon: Play },
  locked: { label: "Locked", color: "#94a3b8", bg: "rgba(148,163,184,0.08)", icon: Lock },
};

const sidebarLinks = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Career Explorer", href: "/careers" },
  { icon: MapPin, label: "Skill Roadmaps", href: "/roadmaps", active: true },
  { icon: Bot, label: "Recommendations", href: "/recommendations" },
  { icon: Bookmark, label: "Saved Careers", href: "/bookmarks" },
  { icon: User, label: "My Profile", href: "/profile" },
];

export default function RoadmapPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState([1, 2]);

  const roadmap = roadmapsData.find(r => r.careerId === parseInt(id));

  if (!roadmap) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", background: "#f8f9ff" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>🗺️</div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>Roadmap not found</h2>
          <p style={{ color: "#64748b", marginBottom: 24 }}>We don't have a roadmap for this career yet.</p>
          <a href="/careers" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", padding: "10px 24px", borderRadius: 10, fontWeight: 600, textDecoration: "none" }}>
            Back to Explorer
          </a>
        </div>
      </div>
    );
  }

  const togglePhase = (phaseNum) => {
    setExpandedPhases(prev =>
      prev.includes(phaseNum) ? prev.filter(p => p !== phaseNum) : [...prev, phaseNum]
    );
  };

  const completedPhases = roadmap.phases.filter(p => p.status === "completed").length;
  const progressPercent = Math.round((completedPhases / roadmap.phases.length) * 100);

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

        .roadmap-card { background: #ffffff; border: 1px solid rgba(99,102,241,0.1); border-radius: 16px; overflow: hidden; transition: box-shadow 0.2s; }
        .roadmap-card:hover { box-shadow: 0 8px 32px rgba(99,102,241,0.1); }

        .phase-header { display: flex; align-items: center; gap: 16px; padding: 20px 24px; cursor: pointer; transition: background 0.2s; }
        .phase-header:hover { background: rgba(99,102,241,0.03); }

        .phase-content { padding: 0 24px 24px; }

        .skill-chip { background: rgba(99,102,241,0.06); color: #6366f1; padding: 5px 12px; border-radius: 8px; font-size: 0.78rem; font-weight: 500; border: 1px solid rgba(99,102,241,0.12); }

        .resource-link { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-radius: 10px; background: #f8f9ff; border: 1px solid rgba(99,102,241,0.06); text-decoration: none; transition: all 0.2s; }
        .resource-link:hover { border-color: rgba(99,102,241,0.2); background: rgba(99,102,241,0.04); }

        .project-item { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; }

        .progress-bar-bg { height: 8px; border-radius: 8px; background: rgba(99,102,241,0.1); overflow: hidden; }
        .progress-bar-fill { height: 100%; border-radius: 8px; background: linear-gradient(90deg, #6366f1, #818cf8); transition: width 0.6s ease; }

        /* Phase connector line */
        .phase-connector { width: 2px; height: 20px; background: rgba(99,102,241,0.15); margin-left: 35px; }

        .mobile-menu-btn { display: none; background: none; border: 1px solid rgba(99,102,241,0.2); border-radius: 8px; padding: 6px 10px; cursor: pointer; color: #1e293b; align-items: center; justify-content: center; }
        .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 45; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }

        .roadmap-layout { display: grid; grid-template-columns: 1fr 320px; gap: 20px; }

        @media (max-width: 1100px) { .roadmap-layout { grid-template-columns: 1fr !important; } }
        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); box-shadow: 8px 0 30px rgba(0,0,0,0.1); }
          .topbar { left: 0 !important; }
          .main-content { margin-left: 0 !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 600px) {
          .main-inner { padding: 20px 14px !important; }
          .phase-header { padding: 16px 16px !important; gap: 12px !important; }
          .phase-content { padding: 0 16px 20px !important; }
          .hero-stats-row { flex-direction: column !important; gap: 8px !important; }
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

          {/* ── Roadmap Hero ── */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(99,102,241,0.1)", borderRadius: 16, padding: "28px 32px", marginBottom: 24, boxShadow: "0 2px 12px rgba(99,102,241,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ background: "rgba(99,102,241,0.08)", color: "#6366f1", padding: "4px 12px", borderRadius: 50, fontSize: "0.78rem", fontWeight: 600, border: "1px solid rgba(99,102,241,0.2)" }}>
                    {roadmap.domain}
                  </span>
                  <span style={{ color: "#64748b", fontSize: "0.85rem" }}>→</span>
                  <a href={`/careers/${roadmap.careerId}`} style={{ color: "#6366f1", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.textDecoration = "underline"}
                    onMouseLeave={e => e.target.style.textDecoration = "none"}>
                    {roadmap.careerTitle}
                  </a>
                </div>

                <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#1e293b", marginBottom: 10, lineHeight: 1.2 }}>
                  {roadmap.title}
                </h1>
                <p style={{ color: "#475569", fontSize: "0.93rem", lineHeight: 1.7, maxWidth: 640 }}>
                  {roadmap.description}
                </p>

                {/* Stats row */}
                <div className="hero-stats-row" style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: "0.88rem" }}>
                    <Clock size={16} color="#6366f1" />
                    <span><strong style={{ color: "#1e293b" }}>{roadmap.estimatedTime}</strong> estimated</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: "0.88rem" }}>
                    <Layers size={16} color="#6366f1" />
                    <span><strong style={{ color: "#1e293b" }}>{roadmap.phases.length} phases</strong> total</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: "0.88rem" }}>
                    <Award size={16} color="#22c55e" />
                    <span><strong style={{ color: "#22c55e" }}>{completedPhases}/{roadmap.phases.length}</strong> completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall progress bar */}
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1e293b" }}>Overall Progress</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#6366f1" }}>{progressPercent}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* ── Roadmap Content ── */}
          <div className="roadmap-layout">

            {/* Left — Phases */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {roadmap.phases.map((phase, i) => {
                const isExpanded = expandedPhases.includes(phase.phaseNumber);
                const PhaseIcon = phase.icon;
                const statusInfo = statusConfig[phase.status];
                const StatusIcon = statusInfo.icon;

                return (
                  <div key={phase.phaseNumber}>
                    <div className="roadmap-card" style={{
                      borderColor: phase.status === "in-progress" ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.1)",
                      opacity: phase.status === "locked" ? 0.7 : 1,
                    }}>

                      {/* Phase header */}
                      <div className="phase-header" onClick={() => togglePhase(phase.phaseNumber)}>
                        {/* Phase icon */}
                        <div style={{
                          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                          background: `${phase.color}12`,
                          border: `1.5px solid ${phase.color}30`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <PhaseIcon size={22} color={phase.color} />
                        </div>

                        {/* Phase info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.72rem", fontWeight: 700, color: phase.color }}>
                              Phase {phase.phaseNumber}
                            </span>
                            <span style={{
                              display: "flex", alignItems: "center", gap: 4,
                              padding: "2px 10px", borderRadius: 50,
                              background: statusInfo.bg, color: statusInfo.color,
                              fontSize: "0.7rem", fontWeight: 600,
                            }}>
                              <StatusIcon size={11} /> {statusInfo.label}
                            </span>
                            <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                              {phase.durationWeeks} weeks
                            </span>
                          </div>
                          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b" }}>
                            {phase.title}
                          </h3>
                        </div>

                        {/* Expand icon */}
                        <ChevronDown size={20} color="#94a3b8" style={{
                          transition: "transform 0.25s",
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          flexShrink: 0,
                        }} />
                      </div>

                      {/* Phase expanded content */}
                      {isExpanded && (
                        <div className="phase-content">
                          <p style={{ color: "#475569", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: 20 }}>
                            {phase.description}
                          </p>

                          {/* Skills */}
                          <div style={{ marginBottom: 20 }}>
                            <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>
                              Skills You'll Learn
                            </h4>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {phase.skills.map(skill => (
                                <span key={skill} className="skill-chip">{skill}</span>
                              ))}
                            </div>
                          </div>

                          {/* Resources */}
                          <div style={{ marginBottom: 20 }}>
                            <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>
                              Learning Resources
                            </h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              {phase.resources.map((res, j) => (
                                <a key={j} href={res.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                                  <div>
                                    <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1e293b", marginBottom: 2 }}>{res.name}</div>
                                    <span style={{ fontSize: "0.75rem", color: "#6366f1", fontWeight: 500 }}>{res.type}</span>
                                  </div>
                                  <ExternalLink size={15} color="#94a3b8" />
                                </a>
                              ))}
                            </div>
                          </div>

                          {/* Projects */}
                          <div style={{ marginBottom: 16 }}>
                            <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.88rem", fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>
                              Practice Projects
                            </h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              {phase.projects.map((project, j) => (
                                <div key={j} className="project-item">
                                  <Circle size={8} color="#6366f1" style={{ marginTop: 7, flexShrink: 0 }} fill="#6366f1" />
                                  <span style={{ color: "#475569", fontSize: "0.85rem", lineHeight: 1.6 }}>{project}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Tips */}
                          <div style={{
                            background: "rgba(99,102,241,0.04)",
                            border: "1px solid rgba(99,102,241,0.12)",
                            borderRadius: 12, padding: "14px 18px",
                            display: "flex", gap: 10, alignItems: "flex-start",
                          }}>
                            <Target size={16} color="#6366f1" style={{ marginTop: 3, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#6366f1", marginBottom: 4 }}>Pro Tip</div>
                              <p style={{ color: "#475569", fontSize: "0.85rem", lineHeight: 1.6 }}>{phase.tips}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Connector line between phases */}
                    {i < roadmap.phases.length - 1 && <div className="phase-connector" />}
                  </div>
                );
              })}
            </div>

            {/* Right — Sidebar info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Phase Overview */}
              <div style={{ background: "#ffffff", border: "1px solid rgba(99,102,241,0.1)", borderRadius: 16, padding: "22px 24px", boxShadow: "0 2px 12px rgba(99,102,241,0.05)" }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>
                  Phase Overview
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {roadmap.phases.map(phase => {
                    const statusInfo = statusConfig[phase.status];
                    return (
                      <div key={phase.phaseNumber}
                        onClick={() => { setExpandedPhases([phase.phaseNumber]); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: "#f8f9ff", border: "1px solid rgba(99,102,241,0.06)", cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.06)"; e.currentTarget.style.background = "#f8f9ff"; }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: `${statusInfo.color}15`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.72rem", fontWeight: 700, color: statusInfo.color,
                          flexShrink: 0,
                        }}>
                          {phase.phaseNumber}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1e293b" }}>{phase.title}</div>
                          <span style={{ fontSize: "0.72rem", color: statusInfo.color }}>{statusInfo.label}</span>
                        </div>
                        <ChevronRight size={14} color="#94a3b8" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Info */}
              <div style={{ background: "#ffffff", border: "1px solid rgba(99,102,241,0.1)", borderRadius: 16, padding: "22px 24px", boxShadow: "0 2px 12px rgba(99,102,241,0.05)" }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>
                  Quick Info
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "#64748b" }}>Total Phases</span>
                    <strong style={{ color: "#1e293b" }}>{roadmap.phases.length}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "#64748b" }}>Estimated Time</span>
                    <strong style={{ color: "#1e293b" }}>{roadmap.estimatedTime}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "#64748b" }}>Total Skills</span>
                    <strong style={{ color: "#1e293b" }}>{roadmap.phases.reduce((acc, p) => acc + p.skills.length, 0)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "#64748b" }}>Total Projects</span>
                    <strong style={{ color: "#1e293b" }}>{roadmap.phases.reduce((acc, p) => acc + p.projects.length, 0)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "#64748b" }}>Resources</span>
                    <strong style={{ color: "#1e293b" }}>{roadmap.phases.reduce((acc, p) => acc + p.resources.length, 0)}</strong>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(56,189,248,0.06))",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: 16, padding: "22px 24px", textAlign: "center",
              }}>
                <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                  Need career guidance?
                </h4>
                <p style={{ color: "#64748b", fontSize: "0.82rem", marginBottom: 14, lineHeight: 1.5 }}>
                  Get AI-powered recommendations based on your profile.
                </p>
                <a href="/recommendations" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  color: "#fff", padding: "10px 22px", borderRadius: 10,
                  fontWeight: 600, fontSize: "0.85rem", textDecoration: "none",
                  transition: "transform 0.2s",
                }}
                  onMouseEnter={e => e.target.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
                  <Bot size={16} /> Get Recommendations
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}