import type { DailyPiece, SwipeDirection, SwipeRecord } from "./types";

const HISTORY_KEY = "wair-swipe-history";

function persist(records: SwipeRecord[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
}

export function getSwipeHistory(): SwipeRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as SwipeRecord[]) : [];
  } catch {
    return [];
  }
}

export function getSwipeHistoryCount(): number {
  return getSwipeHistory().length;
}

export function recordSwipe(
  piece: DailyPiece,
  direction: SwipeDirection,
): void {
  const record: SwipeRecord = {
    pieceId: piece.id,
    brand: piece.brand,
    category: piece.category,
    aestheticTags: piece.aestheticTags,
    priceRange: piece.priceRange,
    direction,
    swipedAt: new Date().toISOString(),
  };

  persist([...getSwipeHistory(), record]);
}
