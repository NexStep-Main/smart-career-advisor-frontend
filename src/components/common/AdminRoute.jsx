import { Navigate, Outlet } from "react-router-dom";
import useAdminAuthStore from "@/store/useAdminAuthStore";

const ADMIN_ROLES = ["admin", "superadmin"];

/** Redirects to /admin/login unless the session belongs to an admin/superadmin user. */
export default function AdminRoute() {
  const { isAuthenticated, user } = useAdminAuthStore();

  if (!isAuthenticated || !ADMIN_ROLES.includes(user?.role)) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
