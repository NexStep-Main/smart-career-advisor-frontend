import useAuthStore from "@/store/useAuthStore";
import DashboardLayout from "./DashboardLayout";
import PublicLayout from "./PublicLayout";

/**
 * One route, two shells: signed-in students get the dashboard sidebar around
 * the shared pages (careers, roadmaps, compare); guests get the public
 * navbar/footer around the exact same pages.
 */
export default function AppShell() {
  const isStudent = useAuthStore(
    (state) => state.isAuthenticated && state.user?.role === "student",
  );
  return isStudent ? <DashboardLayout /> : <PublicLayout />;
}
