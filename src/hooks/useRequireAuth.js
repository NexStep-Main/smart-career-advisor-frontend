import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "@/store/useAuthStore";

/**
 * Guard for actions that need an account (save a career, track roadmap
 * progress) on pages guests are allowed to browse. Returns
 * `{ isAuthenticated, requireAuth(action, message?) }` — for a guest,
 * `requireAuth` shows a friendly nudge and sends them to log in, remembering
 * where they were so login drops them straight back here.
 */
export default function useRequireAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = useCallback(
    (action, message = "Log in to do that — it's free!") => {
      if (isAuthenticated) {
        action();
        return;
      }
      toast(message, { icon: "🔑" });
      navigate("/login", { state: { from: location } });
    },
    [isAuthenticated, navigate, location],
  );

  return { isAuthenticated, requireAuth };
}
