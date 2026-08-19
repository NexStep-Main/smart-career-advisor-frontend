# 🎯 NexStep — Frontend Developer Guide

> **Project:** NexStep — Final Year Project (B.Tech CSE)  
> **Goal:** A career guidance web platform for students after Class 10, 12, or Graduation  
> **Frontend Lead:** Anirban  
> **Stack:** React (Vite) + Tailwind CSS  
> **Last Updated:** March 2026

---

## 📁 Project Structure

```
D:/Final Year Project/smart-career-advisor/
├── frontend/          ← React app (this guide)
│   ├── src/
│   │   ├── components/     ← Reusable UI components
│   │   ├── pages/          ← One file per page (14 pages total)
│   │   ├── layouts/        ← Shared layout wrappers (DashboardLayout, AuthLayout)
│   │   ├── hooks/          ← Custom React hooks
│   │   ├── store/          ← Zustand global state
│   │   ├── services/       ← API call functions (axios)
│   │   ├── utils/          ← Helper functions
│   │   ├── assets/         ← Images, SVGs, fonts
│   │   └── styles/         ← Global CSS, Tailwind config
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/           ← Node.js + Express API (separate repo)
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start (New Teammate Setup)

```bash
# 1. Clone the frontend repo
git clone <frontend-repo-url>
cd frontend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env.local
# Fill in VITE_API_URL=http://localhost:5000/api

# 4. Start dev server
npm run dev
# Opens at http://localhost:5173
```

---

## 🛠️ Tech Stack — Complete List

### Core

| Library | Version | Purpose | Docs |
|---|---|---|---|
| React | 18.x | UI framework | [react.dev](https://react.dev) |
| Vite | 5.x | Build tool + dev server | [vitejs.dev](https://vitejs.dev) |
| React Router DOM | 6.x | Client-side routing | [reactrouter.com](https://reactrouter.com) |

### Styling

| Library | Version | Purpose | Docs |
|---|---|---|---|
| Tailwind CSS | 3.x | Utility-first CSS | [tailwindcss.com](https://tailwindcss.com) |
| tailwind-merge | latest | Merge Tailwind classes safely | [npm](https://www.npmjs.com/package/tailwind-merge) |
| clsx | latest | Conditional class names | [npm](https://www.npmjs.com/package/clsx) |
| Framer Motion | 11.x | Animations and transitions | [framer.com/motion](https://www.framer.com/motion/) |

### UI Components

| Library | Version | Purpose | Docs |
|---|---|---|---|
| shadcn/ui | latest | Accessible base components | [ui.shadcn.com](https://ui.shadcn.com) |
| Radix UI | (via shadcn) | Headless accessible primitives | [radix-ui.com](https://www.radix-ui.com) |
| Lucide React | 0.383.0 | Icon set (outlined style) | [lucide.dev](https://lucide.dev) |

### Data & State

| Library | Version | Purpose | Docs |
|---|---|---|---|
| Zustand | 4.x | Lightweight global state | [zustand docs](https://docs.pmnd.rs/zustand) |
| TanStack Query | 5.x | Server state, caching, loading | [tanstack.com/query](https://tanstack.com/query) |
| Axios | 1.x | HTTP API requests | [axios-http.com](https://axios-http.com) |

### Charts & Visualization

| Library | Version | Purpose | Docs |
|---|---|---|---|
| Recharts | 2.x | Career demand charts, analytics | [recharts.org](https://recharts.org) |
| React Flow | 11.x | Career roadmap flowchart/graph | [reactflow.dev](https://reactflow.dev) |

### Forms

| Library | Version | Purpose | Docs |
|---|---|---|---|
| React Hook Form | 7.x | Form state and validation | [react-hook-form.com](https://react-hook-form.com) |
| Zod | 3.x | Schema validation | [zod.dev](https://zod.dev) |
| @hookform/resolvers | latest | Connect Zod to React Hook Form | [npm](https://www.npmjs.com/package/@hookform/resolvers) |

### Utilities

| Library | Version | Purpose | Docs |
|---|---|---|---|
| date-fns | 3.x | Date formatting | [date-fns.org](https://date-fns.org) |
| react-hot-toast | 2.x | Toast notifications | [react-hot-toast.com](https://react-hot-toast.com) |
| react-helmet-async | 1.x | Page `<title>` and meta tags | [npm](https://www.npmjs.com/package/react-helmet-async) |

---

## 🎨 Design System

### Typography Fonts (Google Fonts)

```html
<!-- Add to index.html <head> -->
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
```

| Role | Font | Weight | Size |
|---|---|---|---|
| Headlines / H1 | Sora | 700–800 | 48–64px |
| Subheadings H2–H3 | Sora | 600 | 28–36px |
| Body text | Inter | 400 | 14–16px |
| Labels / Badges | Inter | 500–600 | 11–13px |
| Code / Tech tags | JetBrains Mono | 400 | 13px |

### Color Palette

```js
// tailwind.config.js — extend colors
colors: {
  primary: {
    DEFAULT: '#1A56DB',
    dark:    '#1E429F',
    light:   '#DBEAFE',
  },
  secondary: {
    DEFAULT: '#0694A2',
    dark:    '#0E7490',
    light:   '#CFFAFE',
  },
  surface: '#FFFFFF',
  background: '#F9FAFB',
  border: '#E5E7EB',
  accent: {
    green:  '#057A55',
    orange: '#D03801',
  },
  domain: {
    tech:       '#1A56DB',
    healthcare: '#057A55',
    arts:       '#7E3AF2',
    commerce:   '#D97706',
    science:    '#0694A2',
    law:        '#C27803',
    design:     '#E02424',
  }
}
```

### Spacing (8pt Grid)

```
4px   → xs
8px   → sm
16px  → md (base)
24px  → lg
32px  → xl
48px  → 2xl
64px  → 3xl
```

### Border Radius

```
Tags / chips:    rounded-lg   (8px)
Cards:           rounded-xl   (12px)
Large modals:    rounded-2xl  (16px)
Buttons / pills: rounded-full
```

### Shadows

```css
/* Use these Tailwind classes */
shadow-sm   /* cards default */
shadow-md   /* hover state */
shadow-lg   /* modals, dropdowns */
```

---

## 📄 All 14 Pages — Route Map

```
/                          → Landing Page          (Public)
/login                     → Login Page            (Public)
/register                  → Register Page         (Public)
/explore                   → Career Explorer       (Public)

/dashboard                 → Student Dashboard     (Auth required)
/career/:id                → Career Details        (Auth required)
/career/:id/roadmap        → Skill Roadmap         (Auth required)
/recommendations           → Recommendations       (Auth required)
/compare                   → Career Comparison     (Auth required)
/saved                     → Saved / Bookmarks     (Auth required)
/profile                   → Profile Page          (Auth required)
/onboarding                → Onboarding Quiz       (Auth, once only)

/admin                     → Admin Dashboard       (Admin only)
/admin/careers             → Career Management     (Admin only)
```

### Router Setup (`src/main.jsx`)

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

const router = createBrowserRouter([
  { path: '/',               element: <LandingPage /> },
  { path: '/login',          element: <LoginPage /> },
  { path: '/register',       element: <RegisterPage /> },
  { path: '/explore',        element: <CareerExplorer /> },

  // Protected student routes
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard',         element: <Dashboard /> },
      { path: '/career/:id',        element: <CareerDetails /> },
      { path: '/career/:id/roadmap',element: <SkillRoadmap /> },
      { path: '/recommendations',   element: <Recommendations /> },
      { path: '/compare',           element: <CareerComparison /> },
      { path: '/saved',             element: <SavedCareers /> },
      { path: '/profile',           element: <Profile /> },
      { path: '/onboarding',        element: <OnboardingQuiz /> },
    ]
  },

  // Admin routes
  {
    element: <AdminRoute />,
    children: [
      { path: '/admin',          element: <AdminDashboard /> },
      { path: '/admin/careers',  element: <CareerManagement /> },
    ]
  }
])
```

---

## 🧩 Reusable Components — Complete List

```
src/components/
│
├── ui/                        ← shadcn/ui generated components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   ├── Badge.jsx
│   ├── Dialog.jsx
│   ├── Drawer.jsx
│   ├── Progress.jsx
│   ├── Tooltip.jsx
│   └── Skeleton.jsx
│
├── layout/
│   ├── Navbar.jsx             ← Top navbar (sticky, auth-aware)
│   ├── Sidebar.jsx            ← Left nav for dashboard
│   ├── Footer.jsx             ← Landing page footer
│   ├── DashboardLayout.jsx    ← Sidebar + topbar wrapper
│   └── AuthLayout.jsx         ← Centered card layout for login/register
│
├── career/
│   ├── CareerCard.jsx         ← Career card with match %, domain badge
│   ├── DomainBadge.jsx        ← Color-coded domain pill tag
│   ├── SkillTag.jsx           ← Individual skill badge
│   ├── SalaryRange.jsx        ← Salary display widget
│   └── CareerGrid.jsx         ← Responsive grid of CareerCards
│
├── roadmap/
│   ├── RoadmapTimeline.jsx    ← Vertical phase stepper
│   ├── PhaseCard.jsx          ← Expandable phase card
│   └── SkillCheckItem.jsx     ← Skill with checkbox + resource link
│
├── recommendations/
│   ├── RecommendationWidget.jsx  ← Match % ring + career card
│   └── MatchScore.jsx            ← Circular progress match indicator
│
├── quiz/
│   ├── QuizStep.jsx           ← Single step with option cards
│   ├── QuizProgress.jsx       ← Step progress bar
│   └── OptionCard.jsx         ← Selectable option card
│
├── filters/
│   ├── SearchBar.jsx          ← Search input with icon
│   ├── DomainFilter.jsx       ← Domain chip filter row
│   ├── SalarySlider.jsx       ← Salary range slider
│   └── FilterPanel.jsx        ← Combined filter component
│
├── charts/
│   ├── DemandChart.jsx        ← Career demand bar chart (Recharts)
│   ├── GrowthChart.jsx        ← Salary growth line chart (Recharts)
│   └── UserTrendChart.jsx     ← Admin user registrations chart
│
└── common/
    ├── ProtectedRoute.jsx     ← Redirect to /login if not authed
    ├── AdminRoute.jsx         ← Redirect if not admin
    ├── LoadingSpinner.jsx     ← Full-page loader
    ├── EmptyState.jsx         ← No results placeholder
    ├── ErrorBoundary.jsx      ← Catch render errors
    └── SEOHead.jsx            ← react-helmet-async page titles
```

---

## 🗂️ Global State (Zustand)

```js
// src/store/useAuthStore.js
{
  user: null,           // { id, name, email, role, educationLevel }
  token: null,
  isAuthenticated: false,
  login(user, token),
  logout(),
  updateProfile(data),
}

// src/store/useCareerStore.js
{
  savedCareers: [],
  compareList: [],      // max 3 careers
  addToCompare(career),
  removeFromCompare(id),
  toggleSave(career),
}
```

---

## 🌐 API Services

```js
// src/services/api.js — base axios instance
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Auto-attach JWT token
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
```

```js
// src/services/careers.js
export const getCareers = (filters) => api.get('/careers', { params: filters })
export const getCareerById = (id)   => api.get(`/careers/${id}`)
export const getRecommendations = () => api.get('/recommendations')
export const saveCareer = (id)      => api.post(`/careers/${id}/save`)
```

---

## 🏗️ Landing Page — Component Breakdown

> **Status: 🔄 In Progress — Anirban is selecting a design reference**

The Landing Page (`/`) is the first page to be built. It has 7 sections:

```
LandingPage/
├── Navbar.jsx              ← Logo + nav links + Login/Get Started CTA
├── HeroSection.jsx         ← H1 + subtitle + 2 CTAs + illustration
├── StatsBar.jsx            ← 3 animated counter cards
├── FeaturesSection.jsx     ← 3-column feature cards grid
├── DomainSection.jsx       ← Clickable domain chips
├── TestimonialsSection.jsx ← 3-card carousel
└── Footer.jsx              ← Links + social icons
```

**Key libraries used on Landing Page:**
- `framer-motion` → Hero entrance animations, counter animations
- `lucide-react` → All icons
- `react-router-dom` → CTA buttons link to `/register` and `/explore`

---

## 🤖 How to Prompt-Engineer with Claude (AI Vibe Coding Guide)

Use these prompt templates when asking Claude to build any component:

### 🔧 Template 1 — Build a New Component
```
I'm building "NexStep" — a React (Vite) + Tailwind CSS + shadcn/ui 
career guidance platform for Indian students.

Build me the [COMPONENT NAME] component.

Design system:
- Fonts: Sora (headings), Inter (body), JetBrains Mono (code/tags)
- Primary color: #1A56DB, Secondary: #0694A2
- Border radius: rounded-xl for cards, rounded-full for badges
- Style: Modern SaaS, card-based, minimal, clean

Requirements:
- [LIST YOUR REQUIREMENTS]
- Fully responsive (mobile-first with Tailwind)
- Use Lucide React for icons
- Use Framer Motion for animations if needed
- Props: [LIST PROPS]

Current page context: [WHICH PAGE THIS IS FOR]
```

### 🔧 Template 2 — Fix / Modify a Component
```
This is my [COMPONENT NAME] from NexStep (React + Tailwind):

[PASTE YOUR CODE]

Problem: [DESCRIBE THE ISSUE]
Fix: [DESCRIBE WHAT YOU WANT]
Keep the existing design system (Sora/Inter fonts, #1A56DB primary color).
```

### 🔧 Template 3 — Build a Full Page
```
Build the [PAGE NAME] page for NexStep.

Tech: React (Vite), Tailwind CSS, shadcn/ui, Lucide React, Framer Motion
Route: [ROUTE PATH]

Page sections:
1. [SECTION 1 DESCRIPTION]
2. [SECTION 2 DESCRIPTION]
...

Data (mock for now, will connect to API later):
[PASTE MOCK DATA OR DESCRIBE DATA SHAPE]

Make it fully responsive. Mobile-first. Use the design system in FRONTEND_GUIDE.md.
```

### 🔧 Template 4 — API Integration
```
Connect this React component to the backend API.

Component: [PASTE COMPONENT CODE]
API endpoint: GET /api/careers?domain=tech&level=graduation
Using: Axios + TanStack Query

Handle:
- Loading state → show Skeleton components
- Error state → show EmptyState component  
- Success state → render the data

Auth: JWT token is available via useAuthStore().token
```

---

## 📋 Git Workflow for Teammates

```bash
# Always pull before starting work
git pull origin main

# Create a branch for your feature
git checkout -b feature/landing-page-hero
git checkout -b feature/career-card-component
git checkout -b feature/dashboard-sidebar

# After your work is done
git add .
git commit -m "feat: add HeroSection with Framer Motion animations"
git push origin feature/landing-page-hero

# Open a Pull Request on GitHub → teammate reviews → merge to main
```

### Commit Message Format
```
feat:     new feature
fix:      bug fix
style:    styling/CSS changes only
refactor: code restructure, no behavior change
docs:     documentation update
chore:    config/dependency updates
```

---

## 📦 Install All Dependencies at Once

```bash
cd frontend

# Core
npm install react-router-dom

# Styling & Animation
npm install tailwind-merge clsx framer-motion

# shadcn/ui setup (run these one by one)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input badge dialog drawer progress tooltip skeleton

# Icons
npm install lucide-react

# State & Data
npm install zustand @tanstack/react-query axios

# Charts & Roadmap
npm install recharts reactflow

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# Utilities
npm install date-fns react-hot-toast react-helmet-async
```

---

## 🌍 Environment Variables

```bash
# frontend/.env.local  (never commit this file)
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=NexStep

# frontend/.env.example  (commit this as reference)
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=NexStep
```

---

## 📊 Page Development Status

| # | Page | Route | Status | Developer |
|---|---|---|---|---|
| 1 | Landing Page | `/` | 🔄 In Progress | Anirban |
| 2 | Login | `/login` | ⏳ Pending | — |
| 3 | Register | `/register` | ⏳ Pending | — |
| 4 | Career Explorer | `/explore` | ⏳ Pending | — |
| 5 | Student Dashboard | `/dashboard` | ⏳ Pending | — |
| 6 | Career Details | `/career/:id` | ⏳ Pending | — |
| 7 | Skill Roadmap | `/career/:id/roadmap` | ⏳ Pending | — |
| 8 | Recommendations | `/recommendations` | ⏳ Pending | — |
| 9 | Career Comparison | `/compare` | ⏳ Pending | — |
| 10 | Saved / Bookmarks | `/saved` | ⏳ Pending | — |
| 11 | Profile | `/profile` | ⏳ Pending | — |
| 12 | Onboarding Quiz | `/onboarding` | ⏳ Pending | — |
| 13 | Admin Dashboard | `/admin` | ⏳ Pending | — |
| 14 | Career Management | `/admin/careers` | ⏳ Pending | — |

**Status Key:** ✅ Done · 🔄 In Progress · 👀 In Review · ⏳ Pending

> Update this table and push to `main` whenever a page is complete.

---

## 🔗 Quick Reference Links

| Resource | URL |
|---|---|
| Frontend Repo | `<add your GitHub URL>` |
| Backend Repo | `<add your GitHub URL>` |
| Design Spec (Figma / Vercel) | `<add your Vercel URL>` |
| Backend API Docs | `http://localhost:5000/api-docs` (Swagger — coming soon) |
| Tailwind Docs | https://tailwindcss.com/docs |
| shadcn/ui Components | https://ui.shadcn.com/docs/components |
| Lucide Icons | https://lucide.dev/icons |
| Framer Motion | https://www.framer.com/motion |
| React Flow (Roadmaps) | https://reactflow.dev/docs |
| Recharts | https://recharts.org/en-US/api |

---

*This document is maintained by the frontend team. Update the status table and add notes whenever a component or page is completed.*