import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  School,
  BookOpen,
  GraduationCap,
  FlaskConical,
  Dna,
  BarChart3,
  Palette,
  Cog,
  ClipboardList,
  Laptop,
  HeartPulse,
  Briefcase,
  Drama,
  Telescope,
  Scale,
  Brain,
  Sparkles,
  Handshake,
  Wrench,
  IndianRupee,
  Heart,
  Shield,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import Logo from "@/components/common/Logo";
import SEOHead from "@/components/common/SEOHead";
import ThemeToggle from "@/components/common/ThemeToggle";
import Button from "@/components/ui/Button";
import useAuthStore from "@/store/useAuthStore";
import { submitQuiz } from "@/services/recommendations";
import { cn } from "@/lib/utils";

const QUIZ_STEPS = [
  {
    title: "What is your current education level?",
    subtitle: "We'll personalise your career options based on this.",
    field: "educationLevel",
    options: [
      {
        value: "class10",
        label: "Class 10",
        desc: "Just finished or appearing for boards",
        icon: School,
      },
      {
        value: "class12",
        label: "Class 12",
        desc: "Completed or appearing for 12th boards",
        icon: BookOpen,
      },
      {
        value: "graduation",
        label: "Graduation",
        desc: "Currently in college or just graduated",
        icon: GraduationCap,
      },
    ],
  },
  {
    title: "Which stream or field are you in?",
    subtitle: "Select the one that best matches your current studies.",
    field: "stream",
    options: [
      {
        value: "science",
        label: "Science (PCM)",
        desc: "Physics, Chemistry, Maths",
        icon: FlaskConical,
      },
      {
        value: "science_bio",
        label: "Science (PCB)",
        desc: "Physics, Chemistry, Biology",
        icon: Dna,
      },
      {
        value: "commerce",
        label: "Commerce",
        desc: "Accounts, Business, Economics",
        icon: BarChart3,
      },
      {
        value: "arts",
        label: "Arts / Humanities",
        desc: "History, Political Science, Literature",
        icon: Palette,
      },
      {
        value: "engineering",
        label: "Engineering",
        desc: "B.Tech / B.E. student",
        icon: Cog,
      },
      {
        value: "other",
        label: "Other",
        desc: "Diploma, Vocational or other streams",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "What are your areas of interest?",
    subtitle: "Select all that excite you. You can pick more than one.",
    field: "interests",
    multiple: true,
    options: [
      {
        value: "technology",
        label: "Technology",
        desc: "Coding, AI, Software, Cybersecurity",
        icon: Laptop,
      },
      {
        value: "healthcare",
        label: "Healthcare",
        desc: "Medicine, Nursing, Pharmacy",
        icon: HeartPulse,
      },
      {
        value: "business",
        label: "Business",
        desc: "Management, Finance, Entrepreneurship",
        icon: Briefcase,
      },
      {
        value: "creative",
        label: "Creative Arts",
        desc: "Design, Film, Music, Writing",
        icon: Drama,
      },
      {
        value: "science",
        label: "Pure Science",
        desc: "Research, Physics, Chemistry, Biology",
        icon: Telescope,
      },
      { value: "law", label: "Law", desc: "Legal studies, Criminal justice", icon: Scale },
    ],
  },
  {
    title: "How do you prefer to work?",
    subtitle: "This helps us match careers that suit your personality.",
    field: "workStyle",
    options: [
      {
        value: "analytical",
        label: "Analytical",
        desc: "I love solving problems with logic and data",
        icon: Brain,
      },
      {
        value: "creative",
        label: "Creative",
        desc: "I enjoy designing, writing, and building new things",
        icon: Sparkles,
      },
      {
        value: "social",
        label: "Social",
        desc: "I thrive working with people and teams",
        icon: Handshake,
      },
      {
        value: "technical",
        label: "Technical",
        desc: "I enjoy working with machines, tools, or code",
        icon: Wrench,
      },
    ],
  },
  {
    title: "What matters most to you in a career?",
    subtitle: "Pick your top priority. This shapes your recommendations.",
    field: "priority",
    options: [
      {
        value: "salary",
        label: "High Salary",
        desc: "I want financial security and high earnings",
        icon: IndianRupee,
      },
      {
        value: "passion",
        label: "Passion & Purpose",
        desc: "I want to love what I do every day",
        icon: Heart,
      },
      {
        value: "stability",
        label: "Job Stability",
        desc: "I value a secure and steady career",
        icon: Shield,
      },
      {
        value: "growth",
        label: "Growth & Learning",
        desc: "I want to constantly grow and upskill",
        icon: TrendingUp,
      },
    ],
  },
];

export default function OnboardingQuizPage() {
  const navigate = useNavigate();
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState({
    educationLevel: "",
    stream: "",
    interests: [],
    workStyle: "",
    priority: "",
  });

  const step = QUIZ_STEPS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_STEPS.length) * 100;

  const select = (value) => {
    setAnswers((prev) => {
      if (!step.multiple) return { ...prev, [step.field]: value };
      const current = prev[step.field];
      return {
        ...prev,
        [step.field]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const isSelected = (value) =>
    step.multiple ? answers[step.field].includes(value) : answers[step.field] === value;

  const isStepValid = step.multiple ? answers[step.field].length > 0 : answers[step.field] !== "";

  const handleNext = async () => {
    if (currentStep < QUIZ_STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await submitQuiz(answers);
      updateProfile(data.data.user);
      setCompleted(true);
    } catch {
      toast.error("Couldn't submit your quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (completed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
        <SEOHead title="Quiz Complete" />
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary-dark shadow-lg shadow-primary/25">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h1 className="font-display text-3xl text-slate-900 dark:text-slate-50">
            Your profile is ready!
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-500 dark:text-slate-400">
            We've analysed your answers and matched you to career paths that fit. Check out your
            personalised recommendations.
          </p>
          <Button
            onClick={() => navigate("/recommendations")}
            size="lg"
            className="mt-8"
          >
            View My Recommendations
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Career Quiz" />

      <nav className="fixed inset-x-0 top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Logo size="md" to="/" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Step <strong className="text-primary">{currentStep + 1}</strong> of{" "}
              {QUIZ_STEPS.length}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="sticky top-16 z-30 h-1 bg-primary-light">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 pb-20 pt-12">
        <div className="mb-10 flex gap-2">
          {QUIZ_STEPS.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2 rounded-full transition-all",
                i === currentStep
                  ? "w-6 bg-primary"
                  : i < currentStep
                    ? "w-2 bg-primary"
                    : "w-2 bg-primary-light",
              )}
            />
          ))}
        </div>

        <div className="mb-9 w-full text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Question {currentStep + 1} of {QUIZ_STEPS.length}
          </span>
          <h1 className="mt-2.5 font-display text-3xl leading-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            {step.title}
          </h1>
          <p className="mt-2.5 text-sm text-slate-500 dark:text-slate-400">{step.subtitle}</p>
          {step.multiple && (
            <span className="mt-2 inline-block rounded-full bg-primary-light px-3.5 py-1 text-xs font-semibold text-primary-dark">
              Select all that apply
            </span>
          )}
        </div>

        <div
          className={cn(
            "grid w-full gap-3",
            step.options.length > 4 ? "sm:grid-cols-2" : "grid-cols-1",
          )}
        >
          {step.options.map((opt) => {
            const selected = isSelected(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => select(opt.value)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border bg-surface p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                    selected ? "border-primary bg-primary-light/40 shadow-md" : "border-border",
                  )}
              >
                <span
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-xl",
                    selected ? "bg-primary-light" : "bg-background",
                  )}
                >
                  <opt.icon
                    size={22}
                    strokeWidth={1.8}
                    className={selected ? "text-primary-dark" : "text-slate-500 dark:text-slate-400"}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block font-medium",
                      selected ? "text-primary-dark" : "text-slate-900 dark:text-slate-50",
                    )}
                  >
                    {opt.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-slate-500 dark:text-slate-400">
                    {opt.desc}
                  </span>
                </span>
                {selected && <CheckCircle size={20} className="shrink-0 text-primary" />}
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex w-full items-center justify-between">
          <div>
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((s) => s - 1)}
                className="flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-primary/40 hover:text-primary"
              >
                <ArrowLeft size={18} />
                Back
              </button>
            )}
          </div>
          <Button
            onClick={handleNext}
            disabled={!isStepValid || submitting}
            size="lg"
          >
            {submitting
              ? "Submitting…"
              : currentStep === QUIZ_STEPS.length - 1
                ? "Get My Results"
                : "Next"}
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
