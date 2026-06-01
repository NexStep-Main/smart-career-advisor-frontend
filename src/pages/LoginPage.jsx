import { useState } from "react";
import { GraduationCap, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", formData);
  };

  const stats = [
    { value: "100+", label: "Career Paths" },
    { value: "10+", label: "Domains" },
    { value: "5K+", label: "Students" },
  ];

  const testimonial = {
    quote: "Smart Career Advisor helped me choose the right stream after Class 10. I went from completely confused to having a clear 5-year plan in one afternoon.",
    name: "Riya Sharma",
    role: "Class 12, Science Stream — Mumbai",
    avatar: "RS",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9ff", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>

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

        .orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none; z-index: 0;
        }

        .login-input {
          width: 100%;
          padding: 14px 16px 14px 46px;
          border: 1.5px solid rgba(99,102,241,0.15);
          border-radius: 12px;
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          color: #1e293b;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .login-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
        }
        .login-input::placeholder { color: #94a3b8; }

        .login-btn {
          width: 100%;
          padding: 14px 0;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #ffffff;
          border: 1px solid rgba(99,102,241,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .login-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(99,102,241,0.35);
        }
        .login-btn:active { transform: translateY(0); }

        .google-btn {
          width: 100%;
          padding: 13px 0;
          border: 1.5px solid rgba(99,102,241,0.15);
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #ffffff;
          color: #1e293b;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .google-btn:hover {
          border-color: rgba(99,102,241,0.3);
          box-shadow: 0 4px 16px rgba(99,102,241,0.1);
          background: #fafafe;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.3s; opacity: 0; }

        /* ── Left panel hidden on mobile ── */
        @media (max-width: 900px) {
          .login-left { display: none !important; }
          .login-right { width: 100% !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════
          LEFT PANEL — Branding
      ══════════════════════════════════════ */}
      <div className="login-left" style={{
        width: "45%",
        background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 48px", position: "relative", overflow: "hidden",
      }}>
        <div className="orb" style={{ width: 300, height: 300, background: "rgba(255,255,255,0.08)", top: -60, left: -60 }} />
        <div className="orb" style={{ width: 200, height: 200, background: "rgba(56,189,248,0.1)", bottom: 80, right: -40 }} />

        <div style={{ position: "relative", zIndex: 1 }}>

          {/* Logo */}
          <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 56 }}>
            <GraduationCap size={28} color="#ffffff" />
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#ffffff" }}>
              Smart Career Advisor
            </span>
          </div>

          {/* Headline */}
          <h1 className="fade-up delay-1" style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
            fontWeight: 800, color: "#ffffff", lineHeight: 1.2, marginBottom: 16,
          }}>
            Welcome back.<br />Your path awaits.
          </h1>

          <p className="fade-up delay-2" style={{
            color: "rgba(255,255,255,0.75)", fontSize: "1rem",
            lineHeight: 1.7, marginBottom: 48, maxWidth: 360,
          }}>
            Continue where you left off — your saved careers, roadmaps, and recommendations are waiting for you.
          </p>

          {/* Stats row */}
          <div className="fade-up delay-2" style={{ display: "flex", gap: 24, marginBottom: 48 }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12, padding: "14px 20px", textAlign: "center", flex: 1,
              }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#ffffff" }}>
                  {s.value}
                </div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.78rem", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial card */}
          <div className="fade-up delay-3" style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 16, padding: "20px 24px",
          }}>
            <div style={{ color: "#fbbf24", fontSize: "0.85rem", marginBottom: 10, letterSpacing: 2 }}>★★★★★</div>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.9rem", lineHeight: 1.7, fontStyle: "italic", marginBottom: 16 }}>
              "{testimonial.quote}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "0.75rem", color: "#fff",
                border: "2px solid rgba(255,255,255,0.3)",
              }}>
                {testimonial.avatar}
              </div>
              <div>
                <div style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.85rem" }}>{testimonial.name}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}>{testimonial.role}</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — Login Form
      ══════════════════════════════════════ */}
      <div className="login-right" style={{
        width: "55%", display: "flex", alignItems: "center",
        justifyContent: "center", padding: "40px 24px",
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Mobile logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, justifyContent: "center" }}
            className="mobile-logo">
            <GraduationCap size={24} color="#6366f1" />
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.15rem" }}>
              <span className="grad-text">Smart Career</span>
              <span style={{ color: "#6366f1" }}> Advisor</span>
            </span>
          </div>

          {/* Header */}
          <div className="fade-up" style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>
              Sign in to your account
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
              Don't have an account?{" "}
              <a href="/register" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.textDecoration = "underline"}
                onMouseLeave={e => e.target.style.textDecoration = "none"}>
                Create one free
              </a>
            </p>
          </div>

          {/* Google login */}
          <div className="fade-up delay-1">
            <button className="google-btn" type="button">
              <FaGoogle size={16} color="#4285f4" />
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="fade-up delay-1" style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.12)" }} />
            <span style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: 500 }}>or sign in with email</span>
            <div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.12)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="fade-up delay-2">

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600, color: "#1e293b" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={18} color={focused === "email" ? "#6366f1" : "#94a3b8"}
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", transition: "color 0.2s" }} />
                <input
                  type="email" name="email" placeholder="you@example.com"
                  value={formData.email} onChange={handleChange}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                  className="login-input" required
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600, color: "#1e293b" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={18} color={focused === "password" ? "#6366f1" : "#94a3b8"}
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", transition: "color 0.2s" }} />
                <input
                  type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password"
                  value={formData.password} onChange={handleChange}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
                  className="login-input" style={{ paddingRight: 46 }} required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                  {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox" checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ accentColor: "#6366f1", width: 15, height: 15, cursor: "pointer" }}
                />
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Remember me</span>
              </label>
              <a href="/forgot-password" style={{ fontSize: "0.85rem", color: "#6366f1", fontWeight: 500, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.textDecoration = "underline"}
                onMouseLeave={e => e.target.style.textDecoration = "none"}>
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button type="submit" className="login-btn">
              Sign In <ArrowRight size={18} />
            </button>

          </form>

          {/* Security note */}
          <p className="fade-up delay-3" style={{ textAlign: "center", marginTop: 24, color: "#94a3b8", fontSize: "0.82rem" }}>
            🔒 Your data is secure and encrypted
          </p>

          {/* Back to home */}
          <div className="fade-up delay-3" style={{ textAlign: "center", marginTop: 16 }}>
            <a href="/" style={{ fontSize: "0.85rem", color: "#94a3b8", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
              onMouseEnter={e => e.target.style.color = "#6366f1"}
              onMouseLeave={e => e.target.style.color = "#94a3b8"}>
              ← Back to home
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}