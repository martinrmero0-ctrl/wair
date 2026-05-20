import type { DailyPiece } from "@/lib/swipe/types";

const WISHLIST_KEY = "wair-wishlist";

export type WishlistItem = DailyPiece & {
  savedAt: string;
  bought?: boolean;
};

function persist(items: WishlistItem[]): void {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
}

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

export function saveToWishlist(piece: DailyPiece): void {
  const existing = getWishlist();
  if (existing.some((item) => item.id === piece.id)) return;

  const next: WishlistItem[] = [
    ...existing,
    { ...piece, savedAt: new Date().toISOString(), bought: false },
  ];
  persist(next);
}

export function markWishlistItemBought(id: string): void {
  const next = getWishlist().map((item) =>
    item.id === id ? { ...item, bought: true } : item,
  );
  persist(next);
}

export function removeWishlistItem(id: string): void {
  const next = getWishlist().filter((item) => item.id !== id);
  persist(next);
}
