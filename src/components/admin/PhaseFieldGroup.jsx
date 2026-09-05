import { useFieldArray } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import FormError from "@/components/ui/FormError";

const RESOURCE_TYPES = ["video", "article", "course"];

/**
 * One phase card in the roadmap editor — owns its own nested `resources`
 * field array (useFieldArray can't be called conditionally/in a loop, so
 * each phase needs its own component instance).
 */
export default function PhaseFieldGroup({ index, control, register, errors, onRemove, canRemove }) {
  const {
    fields: resourceFields,
    append: appendResource,
    remove: removeResource,
  } = useFieldArray({
    control,
    name: `phases.${index}.resources`,
  });

  const phaseErrors = errors?.phases?.[index];

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-display text-base text-slate-900 dark:text-slate-50">
          Phase {index + 1}
        </h4>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1 text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-600"
          >
            <Trash2 size={13} />
            Remove
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <Label htmlFor={`phases.${index}.title`}>Phase title</Label>
          <Input
            id={`phases.${index}.title`}
            placeholder="e.g. Foundations"
            error={!!phaseErrors?.title}
            {...register(`phases.${index}.title`)}
          />
          <FormError message={phaseErrors?.title?.message} />
        </div>

        <div>
          <Label htmlFor={`phases.${index}.description`}>Description</Label>
          <textarea
            id={`phases.${index}.description`}
            rows={2}
            placeholder="What the student should focus on in this phase"
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            {...register(`phases.${index}.description`)}
          />
          <FormError message={phaseErrors?.description?.message} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor={`phases.${index}.skills`}>Skills (comma-separated)</Label>
            <Input
              id={`phases.${index}.skills`}
              placeholder="HTML, CSS"
              {...register(`phases.${index}.skills`)}
            />
          </div>
          <div>
            <Label htmlFor={`phases.${index}.durationWeeks`}>Duration (weeks)</Label>
            <Input
              id={`phases.${index}.durationWeeks`}
              type="number"
              min="1"
              placeholder="Optional"
              error={!!phaseErrors?.durationWeeks}
              {...register(`phases.${index}.durationWeeks`)}
            />
            <FormError message={phaseErrors?.durationWeeks?.message} />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label className="mb-0">Resources (optional)</Label>
            <button
              type="button"
              onClick={() => appendResource({ name: "", url: "", type: "article" })}
              className="flex items-center gap-1 text-xs font-medium text-admin-accent hover:underline"
            >
              <Plus size={13} />
              Add resource
            </button>
          </div>

          {resourceFields.length > 0 && (
            <div className="flex flex-col gap-2">
              {resourceFields.map((field, rIndex) => (
                <div
                  key={field.id}
                  className="flex flex-wrap items-start gap-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 p-2.5"
                >
                  <input
                    placeholder="Name"
                    className="h-9 min-w-30 flex-1 basis-full rounded-md border border-border bg-surface px-3 text-xs text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:border-primary focus:outline-none sm:basis-auto"
                    {...register(`phases.${index}.resources.${rIndex}.name`)}
                  />
                  <input
                    placeholder="URL"
                    className="h-9 min-w-35 flex-2 basis-full rounded-md border border-border bg-surface px-3 text-xs text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:border-primary focus:outline-none sm:basis-auto"
                    {...register(`phases.${index}.resources.${rIndex}.url`)}
                  />
                  <select
                    className="h-9 rounded-md border border-border bg-surface px-2 text-xs text-slate-900 dark:text-slate-50 focus:border-primary focus:outline-none"
                    {...register(`phases.${index}.resources.${rIndex}.type`)}
                  >
                    {RESOURCE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeResource(rIndex)}
                    className="flex size-9 shrink-0 items-center justify-center rounded-md text-slate-400 dark:text-slate-500 hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove resource"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
