const KEY = "nexstep-voter-id";

/**
 * Anonymous, random, per-browser id used only to stop double votes on the
 * career wishlist. Not tied to any account or personal data.
 */
export function getVoterId() {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // Storage blocked — fall back to a per-page-load id (votes just can't be remembered).
    return `tmp-${Math.random().toString(36).slice(2, 12)}`;
  }
}
