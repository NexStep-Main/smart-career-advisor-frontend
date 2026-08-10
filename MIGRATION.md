# Migration Punch-List — Guide Alignment

Tracks what's left to bring the remaining 10 pages in line with `Frontend Guide.md`.
Scope of this pass: infra + 4 reference pages (Landing, Login, Register, Dashboard).
See those for the target pattern before touching anything below.

## What changed in this pass

- Tailwind v4 wired via `@tailwindcss/vite` (see [vite.config.js](vite.config.js)); design tokens
  (colors/fonts) live in [src/styles/index.css](src/styles/index.css) `@theme` block, matching Guide § Design System.
- `@` path alias → `src/` (vite.config.js + jsconfig.json).
- Installed: zustand, axios, react-hook-form, zod, @hookform/resolvers, react-hot-toast,
  react-helmet-async, @tanstack/react-query, framer-motion, clsx, tailwind-merge.
- New folders: `components/ui`, `components/layout`, `components/career`, `components/common`,
  `layouts/`, `store/`, `services/`, `utils/`, `lib/`.
- `App.jsx` now wraps the router in `QueryClientProvider` / `HelmetProvider` / `Toaster` /
  `ErrorBoundary`, and nests `/login` `/register` under `AuthLayout`, `/dashboard` under
  `DashboardLayout` + `ProtectedRoute`.
- Rebuilt with Tailwind + shared components: `LandingPage`, `LoginPage`, `RegisterPage`,
  `student/DashboardPage`.

## Route naming — Guide vs. actual (unresolved)

The Guide's route map uses different names than the app's existing routes. Renaming would
touch every untouched page's internal `<Link>`s, so paths were **left as they are**:

| Guide | Actual (kept) |
|---|---|
| `/explore` | `/careers` |
| `/career/:id` | `/careers/:id` |
| `/career/:id/roadmap` | `/roadmap/:id` |
| `/saved` | `/bookmarks` |
| `/admin` | `/admin/dashboard` (+ separate `/admin/login`, not in Guide) |

Decide once, then rename in one pass across routes + all internal links.

## Pages still on the old pattern (inline `style={{}}`, self-contained nav, no shared components)

Each is fully functional today — do not wrap them in `DashboardLayout`/`AuthLayout` until
migrated, since they already render their own sidebar/nav internally (would double up):

- [ ] `pages/student/CareerExplorerPage.jsx` — also has unused vars flagged by lint (filters state)
- [ ] `pages/student/CareerDetailsPage.jsx`
- [ ] `pages/student/RoadmapPage.jsx` — target: React Flow per Guide (not yet installed)
- [ ] `pages/student/RecommendationPage.jsx`
- [ ] `pages/student/CareerComparisonPage.jsx`
- [ ] `pages/student/BookmarksPage.jsx`
- [ ] `pages/student/ProfilePage.jsx`
- [ ] `pages/student/OnboardingQuizPage.jsx`
- [ ] `pages/admin/AdminLoginPage.jsx`
- [ ] `pages/admin/AdminDashboardPage.jsx` — target: Recharts per Guide (not yet installed)
- [ ] `pages/admin/AdminCareersPage.jsx`

Migration per page: strip inline styles → Tailwind classes using the tokens in
`src/styles/index.css`; swap hand-rolled nav for `<DashboardLayout>`/`<AdminRoute>`; pull
lists into `CareerCard`/`Badge`/`Card`; replace local `useState` forms with
`react-hook-form` + a `zod` schema in `utils/schemas.js`; wire real data through
`services/careers.js` + TanStack Query, replacing any local mock arrays.

## Not yet installed (only add when the page that needs them is migrated)

- `recharts` — AdminDashboardPage charts, DemandChart/GrowthChart
- `reactflow` — RoadmapPage phase graph
- `date-fns` — anywhere dates get formatted

## Also worth doing

- Pre-existing lint errors (unused imports) in several untouched pages — see `npm run lint`.
- Bundle is a single ~860 kB chunk (`npm run build` warns). Consider `React.lazy` per-route
  once more pages exist, especially before admin/recharts/reactflow land.
- `ui/Dialog`, `ui/Drawer`, `ui/Progress`, `ui/Tooltip` from the Guide's component list weren't
  built — none of the 4 reference pages needed them yet.
