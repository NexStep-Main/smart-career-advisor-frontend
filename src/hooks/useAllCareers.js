import { useQuery } from "@tanstack/react-query";
import { getCareers } from "@/services/careers";

/**
 * The whole catalogue in one request (API caps a page at 100). Swipe, Skill
 * Lab and the Spin wheel all need every career at once, and a career is only
 * ~0.7 KB, so one cached fetch beats paging. Cached for 5 minutes and shared
 * by all three features.
 */
export default function useAllCareers() {
  return useQuery({
    queryKey: ["careers", "all"],
    queryFn: () => getCareers({ limit: 100 }).then((res) => res.data.data.careers),
    staleTime: 5 * 60 * 1000,
  });
}
