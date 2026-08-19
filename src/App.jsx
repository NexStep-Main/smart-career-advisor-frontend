import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

import ErrorBoundary from "@/components/common/ErrorBoundary";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AdminRoute from "@/components/common/AdminRoute";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import AdminLayout from "@/layouts/AdminLayout";
import useAuthStore from "@/store/useAuthStore";
import { meRequest } from "@/services/auth";

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
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCareersPage from "./pages/admin/AdminCareersPage";
import AdminRoadmapsPage from "./pages/admin/AdminRoadmapsPage";
import AdminRoadmapFormPage from "./pages/admin/AdminRoadmapFormPage";
import AdminStudentsPage from "./pages/admin/AdminStudentsPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function App() {
  // A persisted token only means the browser *remembers* one — it doesn't
  // mean the JWT is still valid server-side (expired, or the account was
  // deleted). The initial value is derived synchronously so there's nothing
  // to verify (and no render-triggering setState) when there's no token or
  // the dev bypass is active; only a real token needs the async check.
  const [checkingSession, setCheckingSession] = useState(() => {
    const { token } = useAuthStore.getState();
    return !!token && !localStorage.getItem("sca-dev-bypass");
  });

  useEffect(() => {
    if (!checkingSession) return;
    const { setUser, logout } = useAuthStore.getState();

    meRequest()
      .then(({ data }) => setUser(data.data.user))
      // Only a real 401 (invalid/expired token) means the session is dead.
      // A network blip or the backend still starting up shouldn't nuke a
      // perfectly valid login — api.js's interceptor already handles 401s
      // from every other request for the rest of the session.
      .catch((error) => {
        if (error.response?.status === 401) logout();
      })
      .finally(() => setCheckingSession(false));
  }, [checkingSession]);

  if (checkingSession) return <LoadingSpinner fullPage />;

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
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
                <Route path="/admin/login" element={<AdminLoginPage />} />
              </Route>

              {/* Student — authenticated, every page shares the same DashboardLayout
 shell (Sidebar + topbar) so navigating between them never swaps
 the whole theme out from under the student. */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/careers" element={<CareerExplorerPage />} />
                  <Route path="/careers/:id" element={<CareerDetailsPage />} />
                  <Route path="/roadmap/:id" element={<RoadmapPage />} />
                  <Route path="/recommendations" element={<RecommendationPage />} />
                  <Route path="/bookmarks" element={<BookmarksPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/compare" element={<CareerComparisonPage />} />
                </Route>

                {/* Standalone focused flow — no sidebar/topbar by design. */}
                <Route path="/onboarding" element={<OnboardingQuizPage />} />
              </Route>

              {/* Admin — authenticated, AdminLayout shell (mirrors student DashboardLayout) */}
              <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  <Route path="/admin/careers" element={<AdminCareersPage />} />
                  <Route path="/admin/roadmaps" element={<AdminRoadmapsPage />} />
                  <Route path="/admin/roadmaps/new" element={<AdminRoadmapFormPage />} />
                  <Route path="/admin/roadmaps/:id/edit" element={<AdminRoadmapFormPage />} />
                  <Route path="/admin/students" element={<AdminStudentsPage />} />
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
