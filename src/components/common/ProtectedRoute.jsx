import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";

/**
 * Redirects to /login (preserving the intended path) if not authenticated.
 * Requires role === "student" specifically, not just any authenticated
 * session — useAuthStore is student-only now (admin sessions live in their
 * own useAdminAuthStore), so this should never see a non-student user in
 * practice, but the explicit check means a stale/corrupted persisted
 * session fails safe instead of rendering student pages for the wrong role.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || user?.role !== "student") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
