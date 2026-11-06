import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronUp, Lightbulb, Send } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { DOMAIN_META } from "@/lib/landingDomains";
import { getVoterId } from "@/lib/voterId";
import {
  createCareerRequest,
  getCareerRequests,
  unvoteCareerRequest,
  voteCareerRequest,
} from "@/services/careerRequests";
import { cn } from "@/lib/utils";

const DOMAIN_NAMES = Object.keys(DOMAIN_META).filter((d) => d !== "Engineering");

/**
 * "Request a Career" — students tell us what's missing and upvote what others
 * asked for. Works for guests (anonymous per-browser id). Gives the admins
 * real demand data for what to add next.
 */
export default function Wishlist({ initialDomain = "" }) {
  const queryClient = useQueryClient();
  const voterId = getVoterId();
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState(DOMAIN_NAMES.includes(initialDomain) ? initialDomain : "");
  const [existingCareerId, setExistingCareerId] = useState(null);

  const queryKey = ["careerRequests", voterId];
  const { data: requests, isLoading } = useQuery({
    queryKey,
    queryFn: () => getCareerRequests(voterId).then((res) => res.data.data.requests),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["careerRequests"] });

  const createMutation = useMutation({
    mutationFn: () => createCareerRequest({ title, domain: domain || undefined, voterId }),
    onSuccess: (res) => {
      toast.success(res.data.message ?? "Thanks!");
      setTitle("");
      setExistingCareerId(null);
      refresh();
    },
    onError: (error) => {
      const body = error.response?.data;
      // 409 = it's already in the catalogue; send them there instead.
      setExistingCareerId(error.response?.status === 409 ? (body?.error?.careerId ?? null) : null);
      toast.error(
        body?.error?.fieldErrors?.title?.[0] ?? body?.message ?? "Couldn't add that. Please try again.",
      );
    },
  });

  // Optimistic toggle — the count and button flip instantly, then re-sync.
  const voteMutation = useMutation({
    mutationFn: ({ id, voted }) =>
      voted ? unvoteCareerRequest(id, voterId) : voteCareerRequest(id, voterId),
    onMutate: async ({ id, voted }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old) =>
        old?.map((r) => (r.id === id ? { ...r, voted: !voted, votes: r.votes + (voted ? -1 : 1) } : r)),
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      queryClient.setQueryData(queryKey, ctx.previous);
      toast.error("Couldn't register that vote.");
    },
    onSettled: refresh,
  });

  const submit = (e) => {
    e.preventDefault();
    if (title.trim().length < 3 || createMutation.isPending) return;
    createMutation.mutate();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      {/* ── Ask ── */}
      <form
        onSubmit={submit}
        className="h-fit rounded-3xl border-2 border-ink bg-surface p-6 shadow-pop"
      >
        <div className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
          <Lightbulb size={22} className="text-sunny" fill="currentColor" />
          Missing a career?
        </div>
        <p className="mt-1 text-sm text-ink-muted">
          Tell us what you want to see. The most-wanted ones get added first.
        </p>

        <label htmlFor="career-request-title" className="mt-5 block text-sm font-bold text-ink">
          Career name
        </label>
        <input
          id="career-request-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={60}
          placeholder="e.g. Marine Biologist"
          className="mt-1.5 h-12 w-full rounded-2xl border-2 border-ink bg-paper px-4 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-4 focus:ring-grape/25"
        />

        <div className="mt-4 text-sm font-bold text-ink">
          Which field? <span className="font-normal text-ink-faint">(optional)</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {DOMAIN_NAMES.map((d) => {
            const { bg } = DOMAIN_META[d];
            const active = domain === d;
            return (
              <button
                key={d}
                type="button"
                aria-pressed={active}
                onClick={() => setDomain(active ? "" : d)}
                className={cn(
                  "rounded-full border-2 border-ink px-3 py-1 text-xs font-bold transition-all",
                  active ? `${bg} shadow-pop-sm` : "bg-surface text-ink hover:bg-sunny/30",
                )}
              >
                {d}
              </button>
            );
          })}
        </div>

        {existingCareerId && (
          <p className="mt-4 rounded-2xl bg-mint/30 px-4 py-3 text-sm font-semibold text-ink">
            Good news, we already have it!{" "}
            <Link to={`/careers/${existingCareerId}`} className="font-bold text-grape underline dark:text-primary">
              Open it
            </Link>
          </p>
        )}

        <Button
          type="submit"
          variant="ink"
          size="lg"
          className="mt-6 w-full"
          disabled={title.trim().length < 3 || createMutation.isPending}
        >
          <Send size={16} />
          {createMutation.isPending ? "Sending…" : "Add to the wishlist"}
        </Button>
      </form>

      {/* ── Most wanted ── */}
      <div>
        <h3 className="mb-3 font-display text-lg font-semibold text-ink">Most wanted</h3>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : requests?.length ? (
          <ul className="flex flex-col gap-3">
            {requests.map((r, i) => {
              const meta = r.domain ? DOMAIN_META[r.domain] : null;
              return (
                <li
                  key={r.id}
                  className="flex items-center gap-4 rounded-2xl border-2 border-ink bg-surface p-3.5 shadow-pop-sm"
                >
                  <button
                    type="button"
                    onClick={() => voteMutation.mutate({ id: r.id, voted: r.voted })}
                    aria-pressed={r.voted}
                    aria-label={`${r.voted ? "Remove your vote for" : "Upvote"} ${r.title}`}
                    className={cn(
                      "flex w-14 shrink-0 flex-col items-center rounded-xl border-2 border-ink py-1.5 transition-all",
                      r.voted ? "bg-grape text-white shadow-pop-sm" : "bg-paper text-ink hover:bg-sunny/40",
                    )}
                  >
                    <ChevronUp size={18} strokeWidth={3} />
                    <span className="font-display text-lg font-bold leading-none">{r.votes}</span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold text-ink">
                      {i === 0 && <span className="mr-1.5">🔥</span>}
                      {r.title}
                    </div>
                    {meta && (
                      <span className={`mt-1 inline-block rounded-full border-2 border-ink px-2 py-0.5 text-xs font-bold ${meta.bg}`}>
                        {r.domain}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-ink/40 p-8 text-center">
            <p className="font-display text-lg font-semibold text-ink">Nothing here yet</p>
            <p className="mt-1 text-sm text-ink-muted">Be the first to suggest a career!</p>
          </div>
        )}
      </div>
    </div>
  );
}
