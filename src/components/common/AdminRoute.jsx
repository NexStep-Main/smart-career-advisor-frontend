import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";

const ADMIN_ROLES = ["admin", "superadmin"];

/** Redirects to /admin/login unless the session belongs to an admin/superadmin user. */
export default function AdminRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !ADMIN_ROLES.includes(user?.role)) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
