import { useState } from "react";
import { GraduationCap, Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register:", formData);
  };

  /* Password strength checker */
  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: "", color: "#e2e8f0" };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { level: 1, text: "Weak", color: "#ef4444" };
    if (score <= 3) return { level: 2, text: "Medium", color: "#f59e0b" };
    return { level: 3, text: "Strong", color: "#22c55e" };
  };

  const strength = getPasswordStrength(formData.password);

  const features = [
    "Explore 100+ career paths for free",
    "Get personalised AI recommendations",
    "Track your progress with skill roadmaps",
    "Compare careers side-by-side",
  ];

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

        .register-input {
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
        .register-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
        }
        .register-input::placeholder {
          color: #94a3b8;
        }

        .register-btn {
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
          transition: transform 0.2s, box-shadow 0.2s;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #ffffff;
          border: 1px solid rgba(99,102,241,0.4);
        }
        .register-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(99,102,241,0.35);
        }
        .register-btn:active {
          transform: translateY(0);
        }

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

        .strength-bar {
          height: 4px;
          border-radius: 4px;
          transition: width 0.3s ease, background 0.3s ease;
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
          .register-left { display: none !important; }
          .register-right { width: 100% !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════
          LEFT PANEL — Branding
      ══════════════════════════════════════ */}
      <div className="register-left" style={{
        width: "45%", background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "60px 48px", position: "relative", overflow: "hidden",
      }}>
        <div className="orb" style={{ width: 300, height: 300, background: "rgba(255,255,255,0.08)", top: -60, left: -60 }} />
        <div className="orb" style={{ width: 200, height: 200, background: "rgba(56,189,248,0.1)", bottom: 80, right: -40 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <GraduationCap size={28} color="#ffffff" />
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#ffffff" }}>
              Smart Career Advisor
            </span>
          </div>

          {/* Headline */}
          <h1 className="fade-up delay-1" style={{
            fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
            fontWeight: 800, color: "#ffffff", lineHeight: 1.2, marginBottom: 20,
          }}>
            Your career journey<br />starts here.
          </h1>

          <p className="fade-up delay-2" style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: 36, maxWidth: 380 }}>
            Join thousands of students who found their perfect career path with personalised guidance.
          </p>

          {/* Feature checklist */}
          <div className="fade-up delay-3" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle size={18} color="#86efac" strokeWidth={2} />
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem" }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Student count */}
          <div className="fade-up delay-3" style={{
            marginTop: 48, padding: "16px 20px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 14, display: "flex", alignItems: "center", gap: 14,
            maxWidth: 320,
          }}>
            <div style={{ display: "flex" }}>
              {["S", "A", "P"].map((l, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: i === 0 ? "#818cf8" : i === 1 ? "#6366f1" : "#4f46e5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 700, color: "#fff",
                  marginLeft: i > 0 ? -8 : 0,
                  border: "2px solid rgba(255,255,255,0.3)",
                }}>
                  {l}
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.9rem" }}>5,000+ students</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem" }}>already finding their path</div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — Register Form
      ══════════════════════════════════════ */}
      <div className="register-right" style={{
        width: "55%", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px", position: "relative",
      }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          {/* Mobile logo — only shows when left panel is hidden */}
          <div className="fade-up" style={{ display: "none", alignItems: "center", gap: 8, marginBottom: 32, justifyContent: "center" }}
            ref={el => { if (el && window.innerWidth <= 900) el.style.display = "flex"; }}>
            <GraduationCap size={24} color="#6366f1" />
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.15rem" }}>
              <span className="grad-text">Smart Career</span>
              <span style={{ color: "#6366f1" }}> Advisor</span>
            </span>
          </div>

          {/* Header */}
          <div className="fade-up" style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "1.8rem", fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>
              Create your account
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
              Already have an account?{" "}
              <a href="/login" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.textDecoration = "underline"}
                onMouseLeave={e => e.target.style.textDecoration = "none"}>
                Sign in
              </a>
            </p>
          </div>

          {/* Google signup button */}
          <div className="fade-up delay-1">
            <button className="google-btn" type="button">
              <FaGoogle size={16} color="#4285f4" />
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="fade-up delay-1" style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.12)" }} />
            <span style={{ color: "#94a3b8", fontSize: "0.82rem", fontWeight: 500 }}>or register with email</span>
            <div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.12)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="fade-up delay-2">

            {/* Full Name */}
            <div style={{ marginBottom: 18, position: "relative" }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600, color: "#1e293b" }}>Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={18} color={focused === "fullName" ? "#6366f1" : "#94a3b8"} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", transition: "color 0.2s" }} />
                <input
                  type="text" name="fullName" placeholder="Enter your full name"
                  value={formData.fullName} onChange={handleChange}
                  onFocus={() => setFocused("fullName")} onBlur={() => setFocused("")}
                  className="register-input" required
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 18, position: "relative" }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600, color: "#1e293b" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail size={18} color={focused === "email" ? "#6366f1" : "#94a3b8"} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", transition: "color 0.2s" }} />
                <input
                  type="email" name="email" placeholder="you@example.com"
                  value={formData.email} onChange={handleChange}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                  className="register-input" required
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8, position: "relative" }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600, color: "#1e293b" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} color={focused === "password" ? "#6366f1" : "#94a3b8"} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", transition: "color 0.2s" }} />
                <input
                  type={showPassword ? "text" : "password"} name="password" placeholder="Create a strong password"
                  value={formData.password} onChange={handleChange}
                  onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
                  className="register-input" style={{ paddingRight: 46 }} required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                  {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                </button>
              </div>
            </div>

            {/* Password strength bar */}
            {formData.password && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="strength-bar" style={{
                      flex: 1,
                      background: strength.level >= i ? strength.color : "#e2e8f0",
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: "0.78rem", fontWeight: 500, color: strength.color }}>{strength.text}</span>
              </div>
            )}

            {/* Confirm Password */}
            <div style={{ marginBottom: 24, position: "relative" }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 600, color: "#1e293b" }}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} color={focused === "confirmPassword" ? "#6366f1" : "#94a3b8"} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", transition: "color 0.2s" }} />
                <input
                  type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="Re-enter your password"
                  value={formData.confirmPassword} onChange={handleChange}
                  onFocus={() => setFocused("confirmPassword")} onBlur={() => setFocused("")}
                  className="register-input" style={{ paddingRight: 46 }} required
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                  {showConfirm ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
                </button>
              </div>
              {/* Password mismatch warning */}
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <span style={{ fontSize: "0.78rem", color: "#ef4444", marginTop: 4, display: "block" }}>Passwords do not match</span>
              )}
            </div>

            {/* Terms checkbox */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 24 }}>
              <input type="checkbox" required style={{ marginTop: 3, accentColor: "#6366f1", width: 16, height: 16, cursor: "pointer" }} />
              <span style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5 }}>
                I agree to the{" "}
                <a href="#" style={{ color: "#6366f1", fontWeight: 500, textDecoration: "none" }}>Terms of Service</a>
                {" "}and{" "}
                <a href="#" style={{ color: "#6366f1", fontWeight: 500, textDecoration: "none" }}>Privacy Policy</a>
              </span>
            </div>

            {/* Submit button */}
            <button type="submit" className="register-btn">
              Create Account <ArrowRight size={18} />
            </button>
          </form>

          {/* Bottom text */}
          <p className="fade-up delay-3" style={{ textAlign: "center", marginTop: 24, color: "#94a3b8", fontSize: "0.82rem" }}>
            🔒 Your data is secure and will never be shared with third parties
          </p>

        </div>
      </div>

    </div>
  );
}