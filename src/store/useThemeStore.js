import { create } from "zustand";

const THEME_KEY = "nexstep-theme";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === "light" || stored === "dark" ? stored : getSystemTheme();
}

// index.html has a blocking inline script that applies this same initial
// theme before first paint (avoids a flash of the wrong theme); this just
// has to agree with it, not redo the work.
const initialTheme = getInitialTheme();

const useThemeStore = create((set, get) => ({
  theme: initialTheme,

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    set({ theme: next });
  },
}));

export default useThemeStore;
