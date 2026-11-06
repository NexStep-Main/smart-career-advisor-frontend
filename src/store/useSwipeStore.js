import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addBookmark, removeBookmark } from "@/services/bookmarks";
import useAuthStore from "@/store/useAuthStore";

/**
 * Swipe history. Lives in localStorage so guests can swipe without an
 * account and keep their picks; when they sign up / log in, `mergeSwipes`
 * saves every right-swipe as a real bookmark. For signed-in students a
 * right-swipe is also a bookmark immediately.
 *
 * `history` is the ordered list of decisions (for undo); `liked` / `passed`
 * are derived-on-write sets stored as arrays so persist can serialise them.
 */
const useSwipeStore = create(
  persist(
    (set, get) => ({
      liked: [],
      passed: [],
      history: [], // [{ id, dir: "like" | "pass" }]

      swipe: (id, dir) => {
        set((s) => ({
          liked: dir === "like" ? [...new Set([...s.liked, id])] : s.liked.filter((x) => x !== id),
          passed: dir === "pass" ? [...new Set([...s.passed, id])] : s.passed.filter((x) => x !== id),
          history: [...s.history, { id, dir }],
        }));
        if (dir === "like" && useAuthStore.getState().isAuthenticated) {
          addBookmark(id).catch(() => {});
        }
      },

      undo: () => {
        const { history } = get();
        const last = history[history.length - 1];
        if (!last) return null;
        set((s) => ({
          liked: s.liked.filter((x) => x !== last.id),
          passed: s.passed.filter((x) => x !== last.id),
          history: s.history.slice(0, -1),
        }));
        if (last.dir === "like" && useAuthStore.getState().isAuthenticated) {
          removeBookmark(last.id).catch(() => {});
        }
        return last;
      },

      reset: () => set({ liked: [], passed: [], history: [] }),
    }),
    { name: "nexstep-swipes" },
  ),
);

/**
 * Saves a guest's right-swipes as bookmarks. Call right after `login(...)`
 * (the auth token must already be attached). Failures are ignored per-item —
 * a career deleted since it was swiped shouldn't block anything.
 *
 * Sign-up/login waits for this so the bookmarks are usually there when the
 * next page loads, but never longer than `maxWaitMs`: on a slow connection
 * the remaining saves just finish in the background instead of leaving the
 * student staring at a stuck form.
 */
export async function mergeSwipes({ maxWaitMs = 3000 } = {}) {
  const { liked } = useSwipeStore.getState();
  if (liked.length === 0) return 0;
  const saving = Promise.allSettled(liked.map((id) => addBookmark(id))).then(
    (results) => results.filter((r) => r.status === "fulfilled").length,
  );
  return Promise.race([saving, new Promise((resolve) => setTimeout(() => resolve(0), maxWaitMs))]);
}

export default useSwipeStore;
