import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

import ErrorBoundary from "@/components/common/ErrorBoundary";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import AdminRoute from "@/components/common/AdminRoute";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
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

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/careers" element={<CareerExplorerPage />} />
              <Route path="/careers/:id" element={<CareerDetailsPage />} />

              {/* Auth — centered AuthLayout card (rebuilt to Guide's design system) */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Student — authenticated, DashboardLayout shell (Dashboard rebuilt;
                  remaining pages below are pending migration, see punch-list) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                </Route>

                <Route path="/onboarding" element={<OnboardingQuizPage />} />
                <Route path="/roadmap/:id" element={<RoadmapPage />} />
                <Route path="/recommendations" element={<RecommendationPage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/compare" element={<CareerComparisonPage />} />
              </Route>

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/careers" element={<AdminCareersPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
