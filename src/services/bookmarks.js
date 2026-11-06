import api from "./api";

export const getBookmarks = () => api.get("/bookmarks");
export const addBookmark = (careerId) => api.post(`/bookmarks/${careerId}`);
export const removeBookmark = (careerId) => api.delete(`/bookmarks/${careerId}`);

// Career Board: save the whole layout after a drag, and personal notes.
// items: [{ careerId, tier: "dream" | "maybe" | "backup" | null, order }]
export const saveBoard = (items) => api.put("/bookmarks/board", { items });
export const saveNote = (careerId, note) => api.patch(`/bookmarks/${careerId}`, { note });
