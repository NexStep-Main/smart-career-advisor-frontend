import { useState } from "react";
import { GraduationCap, Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin Login:", formData);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f172a; }

        .orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }

        .admin-input {
          width: 100%; padding: 14px 16px 14px 46px;
          border: 1.5px solid rgba(99,102,241,0.25);
          border-radius: 12px; font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          background: rgba(15,23,42,0.6); color: #e2e8f0;
          outline: none; transition: border-color 0.25s, box-shadow 0.25s;
        }
        .admin-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.15);
        }
        .admin-input::placeholder { color: #475569; }

        .admin-btn {
          width: 100%; padding: 14px 0; border: none;
          border-radius: 12px; font-size: 1rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #ffffff; transition: transform 0.2s, box-shadow 0.2s;
        }
        .admin-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(99,102,241,0.4); }
        .admin-btn:active { transform: translateY(0); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.3s; opacity: 0; }

        @media (max-width: 500px) {
          .admin-card { padding: 28px 20px !important; }
        }
      `}</style>

      {/* Background orbs */}
      <div className="orb" style={{ width: 400, height: 400, background: "rgba(99,102,241,0.12)", top: -100, right: -100 }} />
      <div className="orb" style={{ width: 300, height: 300, background: "rgba(56,189,248,0.08)", bottom: -50, left: -50 }} />

      {/* Login card */}
      <div className="admin-card" style={{
        width: "100%", maxWidth: 440,
        background: "rgba(30,41,59,0.7)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 20, padding: "40px 36px",
        backdropFilter: "blur(20px)",
        position: "relative", zIndex: 1,
      }}>

        {/* Logo */}
        <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 32 }}>
          <GraduationCap size={24} color="#6366f1" />
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#e2e8f0" }}>
            Smart Career <span style={{ color: "#6366f1" }}>Advisor</span>
          </span>
        </div>

        {/* Admin badge */}
        <div className="fade-up" style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <span style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: 50, padding: "6px 16px",
            fontSize: "0.78rem", color: "#818cf8", fontWeight: 600,
          }}>
            <Shield size={13} /> Admin Panel Access
          </span>
        </div>

        {/* Header */}
        <div className="fade-up delay-1" style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.6rem", fontWeight: 800, color: "#e2e8f0", marginBottom: 8 }}>
            Admin Sign In
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            Authorized personnel only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="fade-up delay-2">

          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={18} color={focused === "email" ? "#6366f1" : "#475569"}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", transition: "color 0.2s" }} />
              <input type="email" name="email" placeholder="admin@smartcareer.com"
                value={formData.email} onChange={handleChange}
                onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                className="admin-input" required />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8" }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} color={focused === "password" ? "#6366f1" : "#475569"}
                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", transition: "color 0.2s" }} />
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter admin password"
                value={formData.password} onChange={handleChange}
                onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
                className="admin-input" style={{ paddingRight: 46 }} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                {showPassword ? <EyeOff size={18} color="#475569" /> : <Eye size={18} color="#475569" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="admin-btn">
            Sign In to Admin Panel <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer */}
        <div className="fade-up delay-3" style={{ textAlign: "center", marginTop: 24 }}>
          <a href="/" style={{ fontSize: "0.82rem", color: "#475569", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
            onMouseEnter={e => e.target.style.color = "#818cf8"}
            onMouseLeave={e => e.target.style.color = "#475569"}>
            ← Back to main website
          </a>
        </div>

        <p style={{ textAlign: "center", marginTop: 16, color: "#334155", fontSize: "0.75rem" }}>
          🔒 This area is restricted to authorized admins only
        </p>
      </div>
    </div>
  );
}