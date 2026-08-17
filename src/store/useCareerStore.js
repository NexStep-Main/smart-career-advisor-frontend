import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE = 3;

// Comparison tray only — there's no backend model for "careers being
// compared right now" (nor should there be, it's ephemeral UI state), so
// this stays client-side. Saved/bookmarked careers are NOT here: those are
// backed by the real /api/bookmarks endpoints (see services/bookmarks.js),
// used directly by CareerCard/BookmarksPage/CareerDetailsPage.
const useCareerStore = create(
  persist(
    (set, get) => ({
      compareList: [],

      addToCompare: (career) => {
        const { compareList } = get();
        if (compareList.length >= MAX_COMPARE) return false;
        if (compareList.some((c) => c.id === career.id)) return true;
        set({ compareList: [...compareList, career] });
        return true;
      },

      removeFromCompare: (id) =>
        set((state) => ({ compareList: state.compareList.filter((c) => c.id !== id) })),
    }),
    { name: "nexstep-compare" },
  ),
);

export default useCareerStore;
