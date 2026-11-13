import { LayoutDashboard, Compass, Sparkles, Scale, Bookmark, User } from "lucide-react";

// Routes match the app's existing registered paths (App.jsx).
export const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Explore", to: "/careers", icon: Compass },
  { label: "Matches", to: "/recommendations", icon: Sparkles },
  { label: "Compare", to: "/compare", icon: Scale },
  { label: "Saved", to: "/bookmarks", icon: Bookmark },
  { label: "Profile", to: "/profile", icon: User },
];
