import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";

/** Redirects to /admin/login unless the session belongs to an admin user. */
export default function AdminRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
