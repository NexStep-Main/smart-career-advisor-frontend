import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * Shell for pages a visitor can use without an account (career explorer,
 * career details, roadmaps, compare): the marketing navbar and footer
 * around the same page content the dashboard shows.
 */
export default function PublicLayout() {
  return (
    <div className="portal-student min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto min-h-[70vh] max-w-6xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
