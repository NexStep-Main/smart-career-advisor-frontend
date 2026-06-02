import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import OnboardingQuizPage from "./pages/student/OnboardingQuizPage";
import DashboardPage from "./pages/student/DashboardPage";
import CareerExplorerPage from "./pages/student/CareerExplorerPage";
import CareerDetailsPage from "./pages/student/CareerDetailsPage";
import RoadmapPage from "./pages/student/RoadmapPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingQuizPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/careers" element={<CareerExplorerPage />} />
        <Route path="/careers/:id" element={<CareerDetailsPage />} />
        <Route path="/roadmap/:id" element={<RoadmapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;