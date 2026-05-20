const BOOKMARKS_KEY = "wair-nearby-bookmarks";

export function getBookmarkedStoreIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function isStoreBookmarked(id: string): boolean {
  return getBookmarkedStoreIds().includes(id);
}

export function toggleStoreBookmark(id: string): boolean {
  const ids = getBookmarkedStoreIds();
  const isBookmarked = ids.includes(id);
  const next = isBookmarked ? ids.filter((x) => x !== id) : [...ids, id];
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  return !isBookmarked;
}
