import { Outlet } from "react-router-dom";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";

/**
 * Centered shell shared by /login, /register and the password-reset pages.
 * Same playful register as the landing page: cream dotted paper, soft colour
 * blobs behind, and the form sitting on a chunky "sticker" card.
 */
export default function AuthLayout() {
  return (
    <div className="portal-student relative flex min-h-screen items-center justify-center overflow-hidden bg-paper bg-dots px-4 py-12 sm:px-6">
      {/* Decorative blobs and shapes — purely visual, hidden from assistive tech. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 size-80 rounded-full bg-grape/25 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 size-96 rounded-full bg-bubblegum/25 blur-3xl" />
        <div className="absolute right-1/4 top-10 size-48 rounded-full bg-sunny/30 blur-3xl" />
        <div
          className="animate-float absolute left-[8%] top-[62%] hidden size-10 rounded-xl border-2 border-ink bg-mint sm:block"
          style={{ "--r": "12deg" }}
        />
        <div className="animate-float-slow absolute right-[9%] top-[22%] hidden size-8 rounded-full border-2 border-ink bg-sky sm:block" />
        <div className="animate-wiggle absolute bottom-[12%] left-[14%] hidden size-7 rounded-md border-2 border-ink bg-sunny sm:block" />
      </div>

      <ThemeToggle className="absolute right-4 top-4 size-10 rounded-full border-2 border-ink bg-surface text-ink hover:bg-sunny/40 hover:text-ink sm:right-6 sm:top-6" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" mono />
        </div>

        <div className="rounded-3xl border-2 border-ink bg-surface p-6 shadow-pop-lg sm:p-9">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
