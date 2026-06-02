import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Student */}
        <Route path="/onboarding" element={<OnboardingQuizPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/careers" element={<CareerExplorerPage />} />
        <Route path="/careers/:id" element={<CareerDetailsPage />} />
        <Route path="/roadmap/:id" element={<RoadmapPage />} />
        <Route path="/recommendations" element={<RecommendationPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/compare" element={<CareerComparisonPage />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/careers" element={<AdminCareersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;