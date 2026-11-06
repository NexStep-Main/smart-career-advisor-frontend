import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

// Node width scales with its duration — an 8-week phase visibly wider than
// a 2-week one, so the strip doubles as a rough pacing/Gantt read at a
// glance instead of every phase looking equally weighted regardless of
// how long it actually runs.
function nodeWidth(durationWeeks) {
  const weeks = Number(durationWeeks) || 0;
  return Math.min(224, Math.max(96, 72 + weeks * 8));
}

function TimelineNode({ id, index, title, durationWeeks, hasError, active, canRemove, onSelect, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: nodeWidth(durationWeeks),
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("flex items-center", isDragging && "z-10")}>
      <div
        className={cn(
          "group relative flex w-full shrink-0 flex-col items-center gap-1.5 rounded-lg border p-2.5 transition-[width,colors] duration-200",
          active
            ? "border-admin-accent bg-admin-accent-light"
            : "border-border bg-surface hover:border-admin-accent/40",
        )}
      >
        {canRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border border-border bg-surface text-slate-400 opacity-0 shadow-sm transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-slate-500"
            aria-label={`Remove phase ${index + 1}`}
          >
            <X size={11} />
          </button>
        )}

        <button
          type="button"
          onClick={() => onSelect(index)}
          className="flex w-full flex-col items-center gap-1.5"
        >
          <span className="relative flex size-8 items-center justify-center rounded-full bg-admin-accent text-sm font-semibold text-white">
            {index + 1}
            {hasError && (
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-surface bg-red-500" />
            )}
          </span>
          <span
            className={cn(
              "w-full truncate text-center text-xs font-medium",
              active ? "text-admin-accent-dark" : "text-slate-700 dark:text-slate-200",
            )}
          >
            {title || `Phase ${index + 1}`}
          </span>
          {durationWeeks && (
            <span className="rounded-full bg-background px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:text-slate-400">
              {durationWeeks}w
            </span>
          )}
        </button>

        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex w-full cursor-grab items-center justify-center text-slate-300 active:cursor-grabbing dark:text-slate-600"
          aria-label={`Drag to reorder phase ${index + 1}`}
        >
          <GripVertical size={12} />
        </button>
      </div>
    </div>
  );
}

/**
 * Roadmap phases as a connected path of nodes instead of stacked form
 * cards — drag a node to reorder (react-hook-form's `move` keeps the
 * underlying array in sync, so phaseNumber on submit stays correct with no
 * extra bookkeeping), click one to edit it in the panel below. Purely an
 * editing surface: the actual field inputs still live in PhaseFieldGroup,
 * rendered once for whichever phase is selected.
 */
export default function RoadmapPhaseTimeline({
  phases,
  ids,
  selectedIndex,
  onSelect,
  onReorder,
  onAdd,
  onRemove,
  phaseErrors,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    onReorder(oldIndex, newIndex);
  };

  const totalWeeks = phases.reduce((sum, p) => sum + (Number(p?.durationWeeks) || 0), 0);

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
            <div className="flex items-center gap-3">
              {phases.map((phase, index) => (
                <div key={ids[index]} className="flex items-center gap-3">
                  <TimelineNode
                    id={ids[index]}
                    index={index}
                    title={phase?.title}
                    durationWeeks={phase?.durationWeeks}
                    hasError={!!phaseErrors?.[index]}
                    active={index === selectedIndex}
                    canRemove={phases.length > 1}
                    onSelect={onSelect}
                    onRemove={() => onRemove(index)}
                  />
                  <div className="h-0.5 w-6 shrink-0 rounded-full bg-border sm:w-10" />
                </div>
              ))}

              <button
                type="button"
                onClick={onAdd}
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-dashed border-admin-accent/50 text-admin-accent hover:border-admin-accent hover:bg-admin-accent-light"
                aria-label="Add phase"
              >
                <Plus size={16} />
              </button>
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {totalWeeks > 0 && (
        <p className="mt-1 font-mono text-[10.5px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {phases.length} phase{phases.length === 1 ? "" : "s"} · {totalWeeks} week
          {totalWeeks === 1 ? "" : "s"} total
        </p>
      )}
    </div>
  );
}
