import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { X, Sparkles, Users, Wrench, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
import TagInput from "@/components/ui/TagInput";
import { getCareerTagValues } from "@/services/admin";
import { careerFormSchema } from "@/utils/schemas";
import { DOMAINS } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
  streams: [],
  averageSalary: { min: 0, max: 0, currency: "INR" },
  demandLevel: "high",
  skills: [],
  topColleges: [],
  futureScope: "",
  tags: [],
  isActive: true,
};

function toFormValues(career) {
  if (!career) return BLANK_DEFAULTS;
  return {
    title: career.title,
    domain: career.domain,
    description: career.description,
    educationLevel: career.educationLevel ?? [],
    streams: career.streams ?? [],
    averageSalary: {
      min: career.averageSalary?.min ?? 0,
      max: career.averageSalary?.max ?? 0,
      currency: career.averageSalary?.currency ?? "INR",
    },
    demandLevel: career.demandLevel ?? "high",
    skills: career.skills ?? [],
    topColleges: career.topColleges ?? [],
    futureScope: career.futureScope ?? "",
    tags: career.tags ?? [],
    isActive: career.isActive ?? true,
  };
}

// Fetches distinct existing values for one tag field so TagInput can
// autocomplete against what's already in the DB — kept cached across
// open/close since the suggestion pool doesn't change mid-session.
function useTagSuggestions(field) {
  const { data } = useQuery({
    queryKey: ["admin", "careers", "tag-values", field],
    queryFn: () => getCareerTagValues(field).then((res) => res.data.data.values),
    staleTime: 5 * 60 * 1000,
  });
  return data ?? [];
}

// Three light screens instead of one long scroll — each one small enough to
// take in at a glance. Purely a display grouping: the whole form still
// validates as one schema on submit, step dots are freely clickable in any
// order, and a small red dot marks a step with an error (only once the
// first submit attempt has actually happened) so nothing gets lost
// off-screen.
const STEPS = [
  { key: "basics", label: "The basics", icon: Sparkles, fields: ["title", "domain", "demandLevel", "description"] },
  {
    key: "audience",
    label: "Audience & pay",
    icon: Users,
    fields: ["educationLevel", "streams", "averageSalary"],
  },
  {
    key: "extras",
    label: "Skills & extras",
    icon: Wrench,
    fields: ["skills", "topColleges", "futureScope", "tags", "isActive"],
  },
];

export default function CareerFormModal({ open, career, onClose, onSubmit, isSubmitting }) {
  const [step, setStep] = useState(0);
  const streamSuggestions = useTagSuggestions("streams");
  const skillSuggestions = useTagSuggestions("skills");
  const collegeSuggestions = useTagSuggestions("topColleges");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(careerFormSchema),
    defaultValues: BLANK_DEFAULTS,
    // Default mode ("onSubmit", reValidateMode "onChange") on purpose — no
    // red errors anywhere on a form nobody has touched yet. The first
    // Create/Save click validates everything at once (surfacing the tab
    // dots below); every edit after that first attempt re-validates live.
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(career));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting to step 1 is part of the same "this modal just (re)opened" sync as the reset() above it, not a derived-state loop
      setStep(0);
    }
  }, [open, career, reset]);

  if (!open) return null;

  // Only surface once a submit has actually been attempted — a form nobody
  // has touched yet shouldn't look broken before they've typed anything.
  const stepHasError = (fields) => isSubmitted && fields.some((f) => f in errors);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 py-8 sm:items-center">
      <div className="w-full max-w-xl rounded-xl border border-border bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-display text-lg text-slate-900 dark:text-slate-50">
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

        {/* Step tabs — clickable in any order, not a gated wizard. */}
        <div className="flex border-b border-border px-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  "relative flex items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium transition-colors -mb-px",
                  active
                    ? "border-admin-accent text-admin-accent"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
                )}
              >
                <Icon size={14} strokeWidth={1.8} />
                {s.label}
                {stepHasError(s.fields) && (
                  <span className="size-1.5 rounded-full bg-red-500" aria-label="This step has an error" />
                )}
              </button>
            );
          })}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex max-h-[60vh] min-h-96 flex-col gap-4 overflow-y-auto px-6 py-5"
        >
          {step === 0 && (
            <>
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
                  <select
                    id="domain"
                    defaultValue=""
                    className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm text-slate-900 dark:text-slate-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    {...register("domain")}
                  >
                    <option value="" disabled>
                      Select a domain
                    </option>
                    {DOMAINS.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
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
                  rows={4}
                  placeholder="Overview of this career path"
                  className="max-h-40 min-h-24 w-full resize-y rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  {...register("description")}
                />
                <FormError message={errors.description?.message} />
              </div>
            </>
          )}

          {step === 1 && (
            <>
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
                        className="size-4 rounded border-border accent-admin-accent"
                        {...register("educationLevel")}
                      />
                      {level.label}
                    </label>
                  ))}
                </div>
                <FormError message={errors.educationLevel?.message} />
              </div>

              <div>
                <Label htmlFor="streams">Streams</Label>
                <Controller
                  name="streams"
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      id="streams"
                      value={field.value}
                      onChange={field.onChange}
                      suggestions={streamSuggestions}
                      placeholder="Type and press Enter — e.g. science, engineering"
                      error={!!errors.streams}
                    />
                  )}
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
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <Label htmlFor="skills">Skills</Label>
                <Controller
                  name="skills"
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      id="skills"
                      value={field.value}
                      onChange={field.onChange}
                      suggestions={skillSuggestions}
                      placeholder="Type and press Enter — e.g. JavaScript, Problem Solving"
                      error={!!errors.skills}
                    />
                  )}
                />
                <FormError message={errors.skills?.message} />
              </div>

              <div>
                <Label htmlFor="topColleges">
                  Top colleges <span className="font-normal text-slate-400">(optional)</span>
                </Label>
                <Controller
                  name="topColleges"
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      id="topColleges"
                      value={field.value}
                      onChange={field.onChange}
                      suggestions={collegeSuggestions}
                      placeholder="Type and press Enter — e.g. IIT Delhi"
                    />
                  )}
                />
              </div>

              <div>
                <Label htmlFor="futureScope">Future scope (optional)</Label>
                <textarea
                  id="futureScope"
                  rows={2}
                  placeholder="5-year outlook"
                  className="max-h-32 min-h-16 w-full resize-y rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  {...register("futureScope")}
                />
              </div>

              <div>
                <Label htmlFor="tags">
                  Tags <span className="font-normal text-slate-400">(optional)</span>
                </Label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <TagInput
                      id="tags"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Type and press Enter — e.g. trending, remote-friendly"
                    />
                  )}
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  className="size-4 rounded border-border accent-admin-accent"
                  {...register("isActive")}
                />
                Published (visible to students)
              </label>
            </>
          )}
        </form>

        <div className="flex items-center gap-3 border-t border-border px-6 py-4">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={isSubmitting}>
              <ChevronLeft size={16} />
              Back
            </Button>
          ) : (
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
          )}

          <span className="ml-1 text-xs text-slate-400 dark:text-slate-500">
            Step {step + 1} of {STEPS.length}
          </span>

          <div className="ml-auto flex gap-3">
            {step < STEPS.length - 1 ? (
              <Button variant="admin" onClick={() => setStep((s) => s + 1)}>
                Next
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button variant="admin" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : career ? "Save changes" : "Create career"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
