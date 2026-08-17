import api from "./api";

export const getBookmarks = () => api.get("/bookmarks");
export const addBookmark = (careerId) => api.post(`/bookmarks/${careerId}`);
export const removeBookmark = (careerId) => api.delete(`/bookmarks/${careerId}`);
