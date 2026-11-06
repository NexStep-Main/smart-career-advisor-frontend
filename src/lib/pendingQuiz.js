import useAuthStore from "@/store/useAuthStore";
import { submitQuiz } from "@/services/recommendations";

// A guest can take the quiz without an account. Their answers wait here until
// they register or log in, then get submitted for real so they never have to
// answer the same questions twice.
const KEY = "nexstep-pending-quiz";

export function savePendingQuiz(answers) {
  try {
    localStorage.setItem(KEY, JSON.stringify(answers));
  } catch {
    // Storage unavailable (private mode) — they will just retake the quiz.
  }
}

export function hasPendingQuiz() {
  try {
    return localStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Submits any saved guest quiz for the now-logged-in user. Call right after
 * `login(...)` so the auth token is already attached. Resolves true when
 * answers were applied (caller should send the student to /recommendations).
 */
export async function applyPendingQuiz() {
  let answers;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    answers = JSON.parse(raw);
  } catch {
    return false;
  }

  try {
    const { data } = await submitQuiz(answers);
    useAuthStore.getState().updateProfile(data.data.user);
    localStorage.removeItem(KEY);
    return true;
  } catch {
    // Leave the answers saved; the quiz page is still reachable to retry.
    return false;
  }
}
