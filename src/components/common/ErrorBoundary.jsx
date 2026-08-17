import { Component } from "react";
import Button from "@/components/ui/Button";

/** Catches render errors below it so one broken page can't blank the whole app. */
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-50">
            Something went wrong
          </h1>
          <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Please refresh the page. If the problem continues, contact support.
          </p>
          <Button onClick={() => window.location.assign("/")}>Back to home</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
