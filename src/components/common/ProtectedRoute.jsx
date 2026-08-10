import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";

/** Redirects to /login (preserving the intended path) if not authenticated. */
export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
