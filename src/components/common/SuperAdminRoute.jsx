import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";

/**
 * Gates /admin/admins to superadmin only. Nested inside AdminRoute (which
 * already confirms admin/superadmin + authentication), so this only needs
 * to narrow the one extra step: a regular admin gets sent to the dashboard
 * instead of the login screen, since they *are* authenticated — just not
 * allowed here.
 */
export default function SuperAdminRoute() {
  const user = useAuthStore((state) => state.user);

  if (user?.role !== "superadmin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Outlet />;
}
