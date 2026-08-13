import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="px-6 pb-20 pt-36 text-center sm:pt-44">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-3xl flex-col items-center"
      >
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-slate-600">
          <GraduationCap size={14} className="text-primary" />
          Free career guidance for every Indian student
        </span>

        <h1 className="font-heading text-4xl font-bold leading-tight text-slate-900 sm:text-5xl md:text-6xl">
          Discover your perfect career path after{" "}
          <span className="text-primary">Class 10, 12 & Graduation</span>
        </h1>

        <p className="mt-6 max-w-xl text-base text-slate-500 sm:text-lg">
          Personalised roadmaps, skill plans, and AI-powered recommendations — so you
          always know exactly what to do next.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/register">
              Start for free
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/careers">Browse careers</Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          No credit card · No sign-up to browse · 100% free forever
        </p>
      </motion.div>
    </section>
  );
}
