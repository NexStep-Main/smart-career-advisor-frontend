import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, X } from "lucide-react";
import DomainBadge from "@/components/career/DomainBadge";
import { cn } from "@/lib/utils";

const COLUMNS = [
  { key: "inbox", label: "Inbox", hint: "Not sorted yet", head: "bg-surface" },
  { key: "dream", label: "Dream", hint: "Your top picks", head: "bg-grape text-white" },
  { key: "maybe", label: "Maybe", hint: "Worth a closer look", head: "bg-sunny text-night" },
  { key: "backup", label: "Backup", hint: "A safe plan B", head: "bg-mint text-night" },
];

// Prefer whatever is directly under the pointer (so dropping on a column always
// targets that column, even next to a tall, full neighbour); only if the pointer
// is over nothing (a gap), fall back to the nearest corners.
const collision = (args) => {
  const hits = pointerWithin(args);
  return hits.length > 0 ? hits : closestCorners(args);
};

/** Groups the flat bookmark list into columns, ordered by saved position. */
function toColumns(careers) {
  const cols = { inbox: [], dream: [], maybe: [], backup: [] };
  [...careers]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .forEach((c) => cols[c.tier && cols[c.tier] ? c.tier : "inbox"].push(c));
  return cols;
}

const toItems = (cols) =>
  Object.entries(cols).flatMap(([key, list]) =>
    list.map((career, order) => ({ careerId: career.id, tier: key === "inbox" ? null : key, order })),
  );

/** Inline personal note: click to edit, saves on blur or Enter. */
function NoteEditor({ career, onNote }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(career.note ?? "");

  const commit = () => {
    setEditing(false);
    const clean = text.trim();
    if (clean !== (career.note ?? "")) onNote(career.id, clean);
  };

  if (editing) {
    return (
      <textarea
        autoFocus
        value={text}
        maxLength={140}
        rows={2}
        aria-label={`Note for ${career.title}`}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            commit();
          }
          if (e.key === "Escape") {
            setText(career.note ?? "");
            setEditing(false);
          }
        }}
        placeholder="Why does this one matter to you?"
        className="mt-2 w-full resize-none rounded-xl border-2 border-ink bg-paper px-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:ring-4 focus:ring-grape/25"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setText(career.note ?? "");
        setEditing(true);
      }}
      className="mt-2 flex w-full items-start gap-1.5 rounded-xl border-2 border-dashed border-ink/25 px-2.5 py-1.5 text-left text-xs transition-colors hover:border-ink/60 hover:bg-sunny/20"
    >
      <Pencil size={12} className="mt-0.5 shrink-0 text-ink-faint" />
      {career.note ? (
        <span className="font-hand text-base leading-tight text-ink">{career.note}</span>
      ) : (
        <span className="font-semibold text-ink-faint">Add a note</span>
      )}
    </button>
  );
}

function CardBody({ career, onMove, onNote, onRemove, tier, dragging, handleProps }) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-ink bg-surface p-3.5 shadow-pop-sm",
        dragging && "rotate-2 shadow-pop-lg",
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          aria-label={`Drag ${career.title}`}
          className="mt-0.5 shrink-0 cursor-grab touch-none rounded-lg p-1 text-ink-faint hover:bg-sunny/40 hover:text-ink active:cursor-grabbing"
          {...handleProps}
        >
          <GripVertical size={16} />
        </button>
        <div className="min-w-0 flex-1">
          <DomainBadge domain={career.domain} />
          <Link
            to={`/careers/${career.id}`}
            className="mt-1.5 block font-display text-base font-semibold leading-snug text-ink hover:text-grape dark:hover:text-primary"
          >
            {career.title}
          </Link>
          {career.salaryRange && <div className="text-xs font-semibold text-ink-muted">{career.salaryRange}</div>}
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(career.id)}
            aria-label={`Remove ${career.title} from saved`}
            className="shrink-0 rounded-full p-1 text-ink-faint hover:bg-bubblegum/30 hover:text-ink"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {onNote && <NoteEditor career={career} onNote={onNote} />}

      {/* Keyboard / screen-reader / phone friendly alternative to dragging. */}
      {onMove && (
        <label className="mt-2 flex items-center gap-2 text-xs font-semibold text-ink-muted">
          Move to
          <select
            value={tier}
            onChange={(e) => onMove(career.id, e.target.value)}
            className="min-w-0 flex-1 rounded-lg border-2 border-ink/40 bg-paper px-2 py-1 text-xs font-bold text-ink focus:border-ink focus:outline-none"
          >
            {COLUMNS.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}

function SortableCard({ career, tier, onMove, onNote, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: career.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(isDragging && "opacity-30")}
    >
      <CardBody
        career={career}
        tier={tier}
        onMove={onMove}
        onNote={onNote}
        onRemove={onRemove}
        handleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

function Column({ col, items, onMove, onNote, onRemove }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.key });

  return (
    <section
      aria-label={`${col.label} column`}
      className={cn(
        "flex min-h-48 flex-col rounded-3xl border-2 border-ink bg-paper transition-colors",
        isOver && "bg-sunny/25",
      )}
    >
      <header className={cn("flex items-center justify-between rounded-t-[1.35rem] border-b-2 border-ink px-4 py-3", col.head)}>
        <div>
          <h2 className="font-display text-lg font-bold leading-tight">{col.label}</h2>
          <p className="text-xs font-semibold opacity-80">{col.hint}</p>
        </div>
        <span className="flex size-7 items-center justify-center rounded-full border-2 border-ink bg-surface text-xs font-bold text-ink">
          {items.length}
        </span>
      </header>

      <div ref={setNodeRef} className="flex flex-1 flex-col gap-3 p-3">
        <SortableContext items={items.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {items.map((career) => (
            <SortableCard key={career.id} career={career} tier={col.key} onMove={onMove} onNote={onNote} onRemove={onRemove} />
          ))}
        </SortableContext>
        {items.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-ink/25 p-4 text-center text-xs font-semibold text-ink-faint">
            Drop careers here
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Drag saved careers between Inbox, Dream, Maybe and Backup. Works with mouse,
 * touch (long-press the grip) and keyboard (focus the grip, Space, arrow keys),
 * and every card also has a plain "Move to" menu. `onSave(items)` is called
 * with the full layout after every change. Re-key this component when the
 * saved list changes from elsewhere (see BookmarksPage).
 */
export default function CareerBoard({ careers, onSave, onNote, onRemove }) {
  const [cols, setCols] = useState(() => toColumns(careers));
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const findColumn = (id) => (id in cols ? id : Object.keys(cols).find((k) => cols[k].some((c) => c.id === id)));
  const activeCareer = activeId ? Object.values(cols).flat().find((c) => c.id === activeId) : null;

  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const from = findColumn(active.id);
    const to = findColumn(over.id);
    if (!from || !to || from === to) return;

    setCols((prev) => {
      const item = prev[from].find((c) => c.id === active.id);
      const overIndex = prev[to].findIndex((c) => c.id === over.id);
      const at = overIndex >= 0 ? overIndex : prev[to].length; // empty column: append
      return {
        ...prev,
        [from]: prev[from].filter((c) => c.id !== active.id),
        [to]: [...prev[to].slice(0, at), item, ...prev[to].slice(at)],
      };
    });
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) {
      onSave(toItems(cols));
      return;
    }
    const col = findColumn(active.id);
    let next = cols;
    if (col && col === findColumn(over.id) && active.id !== over.id) {
      const oldIndex = cols[col].findIndex((c) => c.id === active.id);
      const newIndex = cols[col].findIndex((c) => c.id === over.id);
      next = { ...cols, [col]: arrayMove(cols[col], oldIndex, newIndex) };
      setCols(next);
    }
    onSave(toItems(next));
  };

  const moveTo = (id, target) => {
    const from = findColumn(id);
    if (!from || from === target) return;
    const item = cols[from].find((c) => c.id === id);
    const next = { ...cols, [from]: cols[from].filter((c) => c.id !== id), [target]: [...cols[target], item] };
    setCols(next);
    onSave(toItems(next));
  };

  // Notes live in the cards' own state too, otherwise a saved note would not
  // show until the next reload (the board only re-mounts when the saved SET changes).
  const noteLocal = (id, note) => {
    setCols((prev) => Object.fromEntries(Object.entries(prev).map(([k, list]) => [k, list.map((c) => (c.id === id ? { ...c, note } : c))])));
    onNote(id, note);
  };

  const removeLocal = (id) => {
    setCols((prev) => Object.fromEntries(Object.entries(prev).map(([k, list]) => [k, list.filter((c) => c.id !== id)])));
    onRemove(id);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collision}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => (
          <Column key={col.key} col={col} items={cols[col.key]} onMove={moveTo} onNote={noteLocal} onRemove={removeLocal} />
        ))}
      </div>
      <DragOverlay>
        {activeCareer ? <CardBody career={activeCareer} tier={findColumn(activeCareer.id)} dragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
