import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
import { careerFormSchema } from "@/utils/schemas";

const EDUCATION_LEVELS = [
  { value: "class10", label: "Class 10" },
  { value: "class12", label: "Class 12" },
  { value: "graduation", label: "Graduation" },
];

const BLANK_DEFAULTS = {
  title: "",
  domain: "",
  description: "",
  educationLevel: [],
  streams: "",
  averageSalary: { min: 0, max: 0, currency: "INR" },
  demandLevel: "high",
  skills: "",
  topColleges: "",
  futureScope: "",
  tags: "",
  isActive: true,
};

/** Populates the form from an existing career for edit mode — arrays become comma text. */
function toFormValues(career) {
  if (!career) return BLANK_DEFAULTS;
  return {
    title: career.title,
    domain: career.domain,
    description: career.description,
    educationLevel: career.educationLevel ?? [],
    streams: (career.streams ?? []).join(", "),
    averageSalary: {
      min: career.averageSalary?.min ?? 0,
      max: career.averageSalary?.max ?? 0,
      currency: career.averageSalary?.currency ?? "INR",
    },
    demandLevel: career.demandLevel ?? "high",
    skills: (career.skills ?? []).join(", "),
    topColleges: (career.topColleges ?? []).join(", "),
    futureScope: career.futureScope ?? "",
    tags: (career.tags ?? []).join(", "),
    isActive: career.isActive ?? true,
  };
}

export default function CareerFormModal({ open, career, onClose, onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(careerFormSchema), defaultValues: BLANK_DEFAULTS });

  useEffect(() => {
    if (open) reset(toFormValues(career));
  }, [open, career, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 py-8 sm:items-center">
      <div className="w-full max-w-lg rounded-xl border border-border bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-heading text-base font-semibold text-slate-900 dark:text-slate-50">
            {career ? "Edit Career" : "Add New Career"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-6 py-5"
        >
          <div>
            <Label htmlFor="title">Career title</Label>
            <Input
              id="title"
              placeholder="e.g. Software Engineer"
              error={!!errors.title}
              {...register("title")}
            />
            <FormError message={errors.title?.message} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                placeholder="e.g. Technology"
                error={!!errors.domain}
                {...register("domain")}
              />
              <FormError message={errors.domain?.message} />
            </div>
            <div>
              <Label htmlFor="demandLevel">Demand level</Label>
              <select
                id="demandLevel"
                className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm text-slate-900 dark:text-slate-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                {...register("demandLevel")}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <FormError message={errors.demandLevel?.message} />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              placeholder="Overview of this career path"
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              {...register("description")}
            />
            <FormError message={errors.description?.message} />
          </div>

          <div>
            <Label>Education level</Label>
            <div className="flex flex-wrap gap-4">
              {EDUCATION_LEVELS.map((level) => (
                <label
                  key={level.value}
                  className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
                >
                  <input
                    type="checkbox"
                    value={level.value}
                    className="size-4 rounded border-border"
                    {...register("educationLevel")}
                  />
                  {level.label}
                </label>
              ))}
            </div>
            <FormError message={errors.educationLevel?.message} />
          </div>

          <div>
            <Label htmlFor="streams">Streams (comma-separated)</Label>
            <Input
              id="streams"
              placeholder="science, engineering"
              error={!!errors.streams}
              {...register("streams")}
            />
            <FormError message={errors.streams?.message} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="salaryMin">Min salary (₹/yr)</Label>
              <Input
                id="salaryMin"
                type="number"
                min="0"
                error={!!errors.averageSalary?.min}
                {...register("averageSalary.min")}
              />
              <FormError message={errors.averageSalary?.min?.message} />
            </div>
            <div>
              <Label htmlFor="salaryMax">Max salary (₹/yr)</Label>
              <Input
                id="salaryMax"
                type="number"
                min="0"
                error={!!errors.averageSalary?.max}
                {...register("averageSalary.max")}
              />
              <FormError message={errors.averageSalary?.max?.message} />
            </div>
          </div>

          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              placeholder="JavaScript, Problem Solving"
              error={!!errors.skills}
              {...register("skills")}
            />
            <FormError message={errors.skills?.message} />
          </div>

          <div>
            <Label htmlFor="topColleges">Top colleges (optional, comma-separated)</Label>
            <Input
              id="topColleges"
              placeholder="IIT Delhi, NIT Trichy"
              {...register("topColleges")}
            />
          </div>

          <div>
            <Label htmlFor="futureScope">Future scope (optional)</Label>
            <textarea
              id="futureScope"
              rows={2}
              placeholder="5-year outlook"
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              {...register("futureScope")}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (optional, comma-separated)</Label>
            <Input id="tags" placeholder="trending, remote-friendly" {...register("tags")} />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              className="size-4 rounded border-border"
              {...register("isActive")}
            />
            Published (visible to students)
          </label>
        </form>

        <div className="flex gap-3 border-t border-border px-6 py-4">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : career ? "Save changes" : "Create career"}
          </Button>
        </div>
      </div>
    </div>
  );
}
