import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE = 3;

/** Saved careers + comparison tray, shared across Explorer/Details/Compare pages. */
const useCareerStore = create(
  persist(
    (set, get) => ({
      savedCareers: [],
      compareList: [],

      toggleSave: (career) =>
        set((state) => {
          const exists = state.savedCareers.some((c) => c.id === career.id);
          return {
            savedCareers: exists
              ? state.savedCareers.filter((c) => c.id !== career.id)
              : [...state.savedCareers, career],
          };
        }),

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
    { name: "sca-careers" }
  )
);

export default useCareerStore;
