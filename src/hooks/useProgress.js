import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";
import { dailyCheckIn, getProgress } from "@/services/progress";

/** Streak, best streak, earned badges and the badge catalogue (null for guests). */
export function useProgress() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ["progress"],
    queryFn: () => getProgress().then((res) => res.data.data),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

/**
 * Registers today's visit once per browser session (the server is idempotent
 * per day anyway, this just avoids a pointless request on every page change).
 * Any badge it earns is announced by the response interceptor's event, see
 * components/common/BadgeListener.jsx.
 */
export function useDailyCheckIn() {
  const userId = useAuthStore((state) => state.user?.id ?? state.user?._id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;
    const key = `nexstep-checkin-${userId}`;
    const today = new Date().toDateString();
    try {
      if (sessionStorage.getItem(key) === today) return;
      sessionStorage.setItem(key, today);
    } catch {
      // sessionStorage blocked: fall through and just check in.
    }
    dailyCheckIn()
      .then((res) => queryClient.setQueryData(["progress"], res.data.data))
      .catch(() => {
        // Streaks are a nice-to-have: never surface an error for them.
      });
  }, [userId, queryClient]);
}
