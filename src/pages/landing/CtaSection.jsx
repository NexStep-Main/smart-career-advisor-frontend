import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";
import Button from "@/components/ui/Button";

export default function CtaSection() {
  return (
    <section className="px-6 py-20">
      <FadeIn className="mx-auto max-w-3xl rounded-2xl border border-primary-light bg-primary-light/40 px-8 py-14 text-center">
        <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">
          Ready to find your perfect career path?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 dark:text-slate-300">
          Join thousands of students who found their direction using NexStep. It’s completely free.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/register">
              Start free today
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/careers">Browse careers</Link>
          </Button>
        </div>
      </FadeIn>
    </section>
  );
}
