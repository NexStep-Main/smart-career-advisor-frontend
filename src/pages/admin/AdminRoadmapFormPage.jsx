import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";
import SEOHead from "@/components/common/SEOHead";
import PhaseFieldGroup from "@/components/admin/PhaseFieldGroup";
import RoadmapPhaseTimeline from "@/components/admin/RoadmapPhaseTimeline";
import RoadmapTemplatePicker from "@/components/admin/RoadmapTemplatePicker";
import { getAdminCareers } from "@/services/admin";
import { createRoadmap, updateRoadmap } from "@/services/roadmaps";
import { roadmapFormSchema } from "@/utils/schemas";

const BLANK_PHASE = { title: "", description: "", skills: [], durationWeeks: "", resources: [] };

function toFormValues(roadmap) {
  if (!roadmap) return { careerId: "", title: "", phases: [BLANK_PHASE] };
  return {
    careerId: roadmap.careerId?.id ?? "",
    title: roadmap.title,
    phases: (roadmap.phases ?? []).map((phase) => ({
      title: phase.title,
      description: phase.description,
      skills: phase.skills ?? [],
      durationWeeks: phase.durationWeeks ?? "",
      resources: phase.resources ?? [],
    })),
  };
}

export default function AdminRoadmapFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingRoadmap = location.state?.roadmap ?? null;
  const isEdit = !!editingRoadmap;

  const { data: careers } = useQuery({
    queryKey: ["admin", "careers", "all"],
    queryFn: () => getAdminCareers({ limit: 100 }).then((res) => res.data.data.careers),
    enabled: !isEdit,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(roadmapFormSchema),
    defaultValues: toFormValues(editingRoadmap),
  });

  const { fields, append, remove, move, replace } = useFieldArray({ control, name: "phases" });
  // Live phase titles/durations for the timeline node labels — separate
  // from `fields` (whose values are frozen at the last reset/append, not
  // reactive to keystrokes).
  const watchedPhases = useWatch({ control, name: "phases" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Only true for a brand-new, still-untouched roadmap — the one moment a
  // template can be applied without risk of silently wiping real work.
  const isPristine =
    !isEdit &&
    fields.length === 1 &&
    !watchedPhases?.[0]?.title &&
    !watchedPhases?.[0]?.description;

  const handleApplyTemplate = (templatePhases) => {
    replace(templatePhases);
    setSelectedIndex(0);
  };

  const handleAddPhase = () => {
    append(BLANK_PHASE);
    setSelectedIndex(fields.length);
  };

  const handleRemovePhase = (index) => {
    remove(index);
    setSelectedIndex((current) => {
      if (index < current) return current - 1;
      if (index === current) return Math.max(0, current - 1);
      return current;
    });
  };

  const handleReorderPhase = (fromIndex, toIndex) => {
    move(fromIndex, toIndex);
    setSelectedIndex((current) => {
      if (current === fromIndex) return toIndex;
      if (fromIndex < current && toIndex >= current) return current - 1;
      if (fromIndex > current && toIndex <= current) return current + 1;
      return current;
    });
  };

  // Editing a roadmap requires the row data passed via navigate() state (the
  // API has no get-roadmap-by-id endpoint) — bounce back if that's missing,
  // e.g. after a hard refresh on this route.
  useEffect(() => {
    if (location.pathname.endsWith("/edit") && !editingRoadmap) {
      toast.error("Open this page from the roadmaps list to edit.");
      navigate("/admin/roadmaps", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? updateRoadmap(editingRoadmap.id, payload) : createRoadmap(payload),
    onSuccess: () => {
      toast.success(isEdit ? "Roadmap updated" : "Roadmap created");
      navigate("/admin/roadmaps");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Couldn't save this roadmap.");
    },
  });

  const onSubmit = (values) => {
    mutation.mutate({
      careerId: values.careerId,
      title: values.title,
      totalPhases: values.phases.length,
      phases: values.phases.map((phase, i) => ({ ...phase, phaseNumber: i + 1 })),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <SEOHead title={isEdit ? "Edit Roadmap" : "New Roadmap"} />

      <div>
        <button
          onClick={() => navigate("/admin/roadmaps")}
          className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
        >
          <ArrowLeft size={15} />
          Back to roadmaps
        </button>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Console / Roadmaps
        </span>
        <h1 className="mt-1 font-display text-3xl text-slate-900 dark:text-slate-50">
          {isEdit ? "Edit Roadmap" : "New Roadmap"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label htmlFor="careerId">Career</Label>
              {isEdit ? (
                <p className="flex h-11 items-center rounded-lg border border-border bg-slate-50 dark:bg-slate-800/60 px-4 text-sm text-slate-600 dark:text-slate-300">
                  {editingRoadmap.careerId?.title} · {editingRoadmap.careerId?.domain}
                </p>
              ) : (
                <select
                  id="careerId"
                  defaultValue=""
                  className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm text-slate-900 dark:text-slate-50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  {...register("careerId")}
                >
                  <option value="" disabled>
                    Select a career
                  </option>
                  {careers?.map((career) => (
                    <option key={career.id} value={career.id}>
                      {career.title} · {career.domain}
                    </option>
                  ))}
                </select>
              )}
              <FormError message={errors.careerId?.message} />
            </div>

            <div>
              <Label htmlFor="title">Roadmap title</Label>
              <input
                id="title"
                placeholder="e.g. Path to Software Engineer"
                className="h-11 w-full rounded-lg border border-border bg-surface px-4 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                {...register("title")}
              />
              <FormError message={errors.title?.message} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label className="mb-3">Phases</Label>
              {isPristine && <RoadmapTemplatePicker onApply={handleApplyTemplate} />}
              <RoadmapPhaseTimeline
                phases={watchedPhases ?? []}
                ids={fields.map((f) => f.id)}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                onReorder={handleReorderPhase}
                onAdd={handleAddPhase}
                onRemove={handleRemovePhase}
                phaseErrors={isSubmitted ? errors.phases : undefined}
              />
              {typeof errors.phases?.message === "string" && (
                <FormError message={errors.phases.message} />
              )}
            </div>

            <div className="border-t border-border pt-4">
              <PhaseFieldGroup
                key={fields[selectedIndex]?.id}
                index={selectedIndex}
                control={control}
                register={register}
                errors={errors}
                canRemove={fields.length > 1}
                onRemove={() => handleRemovePhase(selectedIndex)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" variant="admin" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : isEdit ? "Save changes" : "Create roadmap"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/roadmaps")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
