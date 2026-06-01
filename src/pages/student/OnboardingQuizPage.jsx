import { useState } from "react";
import { GraduationCap, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

/* ── Quiz Data ── */
const quizSteps = [
  {
    step: 1,
    title: "What is your current education level?",
    subtitle: "We will personalise your career options based on this.",
    field: "educationLevel",
    options: [
      { value: "class10", label: "Class 10", desc: "Just finished or appearing for boards", icon: "🏫" },
      { value: "class12", label: "Class 12", desc: "Completed or appearing for 12th boards", icon: "📚" },
      { value: "graduation", label: "Graduation", desc: "Currently in college or just graduated", icon: "🎓" },
    ],
  },
  {
    step: 2,
    title: "Which stream or field are you in?",
    subtitle: "Select the one that best matches your current studies.",
    field: "stream",
    options: [
      { value: "science", label: "Science (PCM)", desc: "Physics, Chemistry, Maths", icon: "🔬" },
      { value: "science_bio", label: "Science (PCB)", desc: "Physics, Chemistry, Biology", icon: "🧬" },
      { value: "commerce", label: "Commerce", desc: "Accounts, Business, Economics", icon: "📊" },
      { value: "arts", label: "Arts / Humanities", desc: "History, Political Science, Literature", icon: "🎨" },
      { value: "engineering", label: "Engineering", desc: "B.Tech / B.E. student", icon: "⚙️" },
      { value: "other", label: "Other", desc: "Diploma, Vocational or other streams", icon: "📋" },
    ],
  },
  {
    step: 3,
    title: "What are your areas of interest?",
    subtitle: "Select all that excite you. You can pick more than one.",
    field: "interests",
    multiple: true,
    options: [
      { value: "technology", label: "Technology", desc: "Coding, AI, Software, Cybersecurity", icon: "💻" },
      { value: "healthcare", label: "Healthcare", desc: "Medicine, Nursing, Pharmacy", icon: "🏥" },
      { value: "business", label: "Business", desc: "Management, Finance, Entrepreneurship", icon: "💼" },
      { value: "creative", label: "Creative Arts", desc: "Design, Film, Music, Writing", icon: "🎭" },
      { value: "science", label: "Pure Science", desc: "Research, Physics, Chemistry, Biology", icon: "🔭" },
      { value: "law", label: "Law", desc: "Legal studies, Criminal justice", icon: "⚖️" },
      { value: "education", label: "Education", desc: "Teaching, Training, Academic research", icon: "📖" },
      { value: "government", label: "Government", desc: "Civil services, Defence, Public sector", icon: "🏛️" },
    ],
  },
  {
    step: 4,
    title: "How do you prefer to work?",
    subtitle: "This helps us match careers that suit your personality.",
    field: "workStyle",
    options: [
      { value: "analytical", label: "Analytical", desc: "I love solving problems with logic and data", icon: "🧠" },
      { value: "creative", label: "Creative", desc: "I enjoy designing, writing, and building new things", icon: "✨" },
      { value: "social", label: "Social", desc: "I thrive working with people and teams", icon: "🤝" },
      { value: "technical", label: "Technical", desc: "I enjoy working with machines, tools, or code", icon: "🔧" },
    ],
  },
  {
    step: 5,
    title: "What matters most to you in a career?",
    subtitle: "Pick your top priority. This shapes your recommendations.",
    field: "priority",
    options: [
      { value: "salary", label: "High Salary", desc: "I want financial security and high earnings", icon: "💰" },
      { value: "passion", label: "Passion & Purpose", desc: "I want to love what I do every day", icon: "❤️" },
      { value: "stability", label: "Job Stability", desc: "I value a secure and steady career", icon: "🛡️" },
      { value: "growth", label: "Growth & Learning", desc: "I want to constantly grow and upskill", icon: "📈" },
    ],
  },
];

export default function OnboardingQuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    educationLevel: "",
    stream: "",
    interests: [],
    workStyle: "",
    priority: "",
  });
  const [completed, setCompleted] = useState(false);

  const step = quizSteps[currentStep];
  const progress = ((currentStep + 1) / quizSteps.length) * 100;

  /* Handle single select */
  const handleSingleSelect = (field, value) => {
    setAnswers({ ...answers, [field]: value });
  };

  /* Handle multi select */
  const handleMultiSelect = (field, value) => {
    const current = answers[field];
    if (current.includes(value)) {
      setAnswers({ ...answers, [field]: current.filter(v => v !== value) });
    } else {
      setAnswers({ ...answers, [field]: [...current, value] });
    }
  };

  /* Check if current step has a valid answer */
  const isStepValid = () => {
    const val = answers[step.field];
    if (step.multiple) return val.length > 0;
    return val !== "";
  };

  /* Go to next step */
  const handleNext = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
      console.log("Quiz Answers:", answers);
    }
  };

  /* Go back */
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  /* Check if option is selected */
  const isSelected = (field, value) => {
    if (step.multiple) return answers[field].includes(value);
    return answers[field] === value;
  };

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

        /* Option card */
        .option-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border: 2px solid rgba(99,102,241,0.12);
          border-radius: 14px;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(99,102,241,0.05);
        }
        .option-card:hover {
          border-color: rgba(99,102,241,0.35);
          box-shadow: 0 4px 20px rgba(99,102,241,0.12);
          transform: translateY(-1px);
        }
        .option-card.selected {
          border-color: #6366f1;
          background: rgba(99,102,241,0.04);
          box-shadow: 0 4px 20px rgba(99,102,241,0.15);
        }

        /* Next button */
        .next-btn {
          padding: 14px 32px;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #ffffff;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }
        .next-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
        }
        .next-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        /* Back button */
        .back-btn {
          padding: 14px 24px;
          border: 1.5px solid rgba(99,102,241,0.2);
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #64748b;
          transition: border-color 0.2s, color 0.2s;
        }
        .back-btn:hover {
          border-color: rgba(99,102,241,0.4);
          color: #6366f1;
        }

        /* Progress bar */
        .progress-fill {
          height: 100%;
          border-radius: 4px;
          background: linear-gradient(90deg, #6366f1, #818cf8);
          transition: width 0.4s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .scale-in { animation: scaleIn 0.5s ease forwards; }

        /* Options grid */
        .options-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .options-grid-1 { display: grid; grid-template-columns: 1fr; gap: 12px; }

        @media (max-width: 600px) {
          .options-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)",
        borderBottom: "1px solid rgba(99,102,241,0.12)",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <GraduationCap size={24} color="#6366f1" />
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "1.1rem" }}>
              <span className="grad-text">Smart Career</span>
              <span style={{ color: "#6366f1" }}> Advisor</span>
            </span>
          </a>
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
            Step <strong style={{ color: "#6366f1" }}>{currentStep + 1}</strong> of {quizSteps.length}
          </span>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Progress bar */}
        <div style={{ height: 4, background: "rgba(99,102,241,0.1)", position: "sticky", top: 64, zIndex: 99 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* ── COMPLETED STATE ── */}
        {completed ? (
          <div className="scale-in" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
            <div style={{ textAlign: "center", maxWidth: 480 }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px",
                boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
              }}>
                <CheckCircle size={40} color="#ffffff" />
              </div>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "2rem", fontWeight: 800, color: "#1e293b", marginBottom: 12 }}>
                Your profile is ready!
              </h2>
              <p style={{ color: "#64748b", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: 32 }}>
                We have analysed your answers and found the best career paths for you. Let's explore your personalised dashboard.
              </p>
              <a href="/dashboard" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "#ffffff", padding: "14px 36px", borderRadius: 12,
                fontWeight: 600, fontSize: "1rem", textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
                transition: "transform 0.2s",
              }}
                onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
                Go to My Dashboard <ArrowRight size={18} />
              </a>
            </div>
          </div>

        ) : (

          /* ── QUIZ STEPS ── */
          <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "48px 24px 80px" }}>
            <div style={{ width: "100%", maxWidth: 720 }} key={currentStep} className="fade-up">

              {/* Step indicator dots */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 40 }}>
                {quizSteps.map((_, i) => (
                  <div key={i} style={{
                    height: 8, borderRadius: 4,
                    width: i === currentStep ? 24 : 8,
                    background: i <= currentStep ? "#6366f1" : "rgba(99,102,241,0.15)",
                    transition: "all 0.3s ease",
                  }} />
                ))}
              </div>

              {/* Question */}
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <span style={{ color: "#6366f1", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Question {step.step} of {quizSteps.length}
                </span>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#1e293b", marginTop: 10, marginBottom: 10, lineHeight: 1.3 }}>
                  {step.title}
                </h2>
                <p style={{ color: "#64748b", fontSize: "0.95rem" }}>{step.subtitle}</p>
                {step.multiple && (
                  <span style={{ display: "inline-block", marginTop: 8, background: "rgba(99,102,241,0.08)", color: "#6366f1", padding: "4px 14px", borderRadius: 50, fontSize: "0.78rem", fontWeight: 600, border: "1px solid rgba(99,102,241,0.2)" }}>
                    Select all that apply
                  </span>
                )}
              </div>

              {/* Options */}
              <div className={step.options.length > 4 ? "options-grid-2" : "options-grid-1"}>
                {step.options.map((opt) => (
                  <div key={opt.value}
                    className={`option-card ${isSelected(step.field, opt.value) ? "selected" : ""}`}
                    onClick={() => step.multiple
                      ? handleMultiSelect(step.field, opt.value)
                      : handleSingleSelect(step.field, opt.value)
                    }>

                    {/* Icon box */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                      background: isSelected(step.field, opt.value) ? "rgba(99,102,241,0.12)" : "#f8f9ff",
                      border: isSelected(step.field, opt.value) ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(99,102,241,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.4rem", transition: "all 0.2s",
                    }}>
                      {opt.icon}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: isSelected(step.field, opt.value) ? "#6366f1" : "#1e293b", marginBottom: 3, transition: "color 0.2s" }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.4 }}>
                        {opt.desc}
                      </div>
                    </div>

                    {/* Selected checkmark */}
                    {isSelected(step.field, opt.value) && (
                      <CheckCircle size={20} color="#6366f1" style={{ flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40 }}>
                <div>
                  {currentStep > 0 && (
                    <button className="back-btn" onClick={handleBack}>
                      <ArrowLeft size={18} /> Back
                    </button>
                  )}
                </div>
                <button className="next-btn" onClick={handleNext} disabled={!isStepValid()}>
                  {currentStep === quizSteps.length - 1 ? "Get My Results" : "Next"}
                  <ArrowRight size={18} />
                </button>
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  );
}