import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

import ErrorBoundary from "@/components/common/ErrorBoundary";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AdminRoute from "@/components/common/AdminRoute";
import SuperAdminRoute from "@/components/common/SuperAdminRoute";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import AppShell from "@/layouts/AppShell";
import ScrollManager from "@/components/common/ScrollManager";
import BadgeListener from "@/components/common/BadgeListener";
import AdminLayout from "@/layouts/AdminLayout";
import AdminAuthLayout from "@/layouts/AdminAuthLayout";
import useAuthStore from "@/store/useAuthStore";
import useAdminAuthStore from "@/store/useAdminAuthStore";
import { meRequest } from "@/services/auth";
import { adminMeRequest } from "@/services/adminAuth";

import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import OnboardingQuizPage from "./pages/student/OnboardingQuizPage";
import DashboardPage from "./pages/student/DashboardPage";
import CareerExplorerPage from "./pages/student/CareerExplorerPage";
import CareerDetailsPage from "./pages/student/CareerDetailsPage";
import RoadmapPage from "./pages/student/RoadmapPage";
import RecommendationPage from "./pages/student/RecommendationPage";
import BookmarksPage from "./pages/student/BookmarksPage";
import ProfilePage from "./pages/student/ProfilePage";
import CareerComparisonPage from "./pages/student/CareerComparisonPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminSetupPage from "./pages/admin/AdminSetupPage";
import AdminManageAdminsPage from "./pages/admin/AdminManageAdminsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCareersPage from "./pages/admin/AdminCareersPage";
import AdminRoadmapsPage from "./pages/admin/AdminRoadmapsPage";
import AdminRoadmapFormPage from "./pages/admin/AdminRoadmapFormPage";
import AdminStudentsPage from "./pages/admin/AdminStudentsPage";
import AdminStudentDetailPage from "./pages/admin/AdminStudentDetailPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function App() {
  // A persisted token only means the browser *remembers* one — it doesn't
  // mean the JWT is still valid server-side (expired, or the account was
  // deleted). The initial value is derived synchronously so there's nothing
  // to verify (and no render-triggering setState) when there's no token;
  // only a real token needs the async check. Student and admin are two
  // independent stores/tokens now, so each gets its own check — a stale
  // admin token shouldn't block rendering while a valid student session is
  // being verified, or vice versa.
  const [checkingSession, setCheckingSession] = useState(() => {
    const { token: studentToken } = useAuthStore.getState();
    const { token: adminToken } = useAdminAuthStore.getState();
    return !!studentToken || !!adminToken;
  });

  useEffect(() => {
    if (!checkingSession) return;

    const { token: studentToken, setUser, logout } = useAuthStore.getState();
    const { token: adminToken, setUser: setAdminUser, logout: adminLogout } =
      useAdminAuthStore.getState();

    const checks = [];
    // Only a real 401 (invalid/expired token) means a session is dead. A
    // network blip or the backend still starting up shouldn't nuke a
    // perfectly valid login — each api client's interceptor already handles
    // 401s from every other request for the rest of the session.
    if (studentToken) {
      checks.push(
        meRequest()
          .then(({ data }) => setUser(data.data.user))
          .catch((error) => {
            if (error.response?.status === 401) logout();
          }),
      );
    }
    if (adminToken) {
      checks.push(
        adminMeRequest()
          .then(({ data }) => setAdminUser(data.data.user))
          .catch((error) => {
            if (error.response?.status === 401) adminLogout();
          }),
      );
    }

    Promise.all(checks).finally(() => setCheckingSession(false));
  }, [checkingSession]);

  if (checkingSession) return <LoadingSpinner fullPage />;

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ScrollManager />
            <BadgeListener />
            <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />

              {/* Auth — centered AuthLayout card */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              </Route>

              {/* Admin login/setup — its own shell, not the student AuthLayout */}
              <Route element={<AdminAuthLayout />}>
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/setup" element={<AdminSetupPage />} />
              </Route>

              {/* Student — authenticated, every page shares the same DashboardLayout
 shell (Sidebar + topbar) so navigating between them never swaps
 the whole theme out from under the student. */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/recommendations" element={<RecommendationPage />} />
                  <Route path="/bookmarks" element={<BookmarksPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
              </Route>

              {/* Browsable without an account — the landing page promises
                  "explore without signing up", so careers, roadmaps and
                  compare are public. AppShell picks the dashboard sidebar for
                  signed-in students and the public navbar for guests; saving
                  or tracking inside them prompts a login. */}
              <Route element={<AppShell />}>
                <Route path="/careers" element={<CareerExplorerPage />} />
                <Route path="/careers/:id" element={<CareerDetailsPage />} />
                <Route path="/roadmap/:id" element={<RoadmapPage />} />
                <Route path="/compare" element={<CareerComparisonPage />} />
              </Route>

              {/* Standalone focused flow, no sidebar/topbar by design. Public:
                  guests see matches right away and are asked to sign up to
                  save them. */}
              <Route path="/onboarding" element={<OnboardingQuizPage />} />

              {/* Admin — authenticated, AdminLayout shell (mirrors student DashboardLayout) */}
              <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  <Route path="/admin/careers" element={<AdminCareersPage />} />
                  <Route path="/admin/roadmaps" element={<AdminRoadmapsPage />} />
                  <Route path="/admin/roadmaps/new" element={<AdminRoadmapFormPage />} />
                  <Route path="/admin/roadmaps/:id/edit" element={<AdminRoadmapFormPage />} />
                  <Route path="/admin/students" element={<AdminStudentsPage />} />
                  <Route path="/admin/students/:id" element={<AdminStudentDetailPage />} />

                  {/* Superadmin-only — managing admin-tier accounts. Every other
                      admin page/resource above is open to any admin, view AND
                      mutate; this is the one page a plain admin can't even
                      reach (enforced for real on the backend too). */}
                  <Route element={<SuperAdminRoute />}>
                    <Route path="/admin/admins" element={<AdminManageAdminsPage />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
