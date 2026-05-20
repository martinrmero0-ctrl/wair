import { DAILY_DECK_SIZE, PIECE_CATALOG } from "./catalog";
import { getSwipeHistory } from "./swipe-history";
import type { DailyPiece, SwipeRecord } from "./types";

const DAILY_DECK_KEY = "wair-daily-deck";

type CachedDailyDeck = {
  date: string;
  pieceIds: string[];
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getCachedDeck(date: string): DailyPiece[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DAILY_DECK_KEY);
    if (!raw) return null;

    const cached = JSON.parse(raw) as CachedDailyDeck;
    if (cached.date !== date) return null;

    const byId = new Map(PIECE_CATALOG.map((p) => [p.id, p]));
    const deck = cached.pieceIds
      .map((id) => byId.get(id))
      .filter((p): p is DailyPiece => Boolean(p));

    return deck.length === DAILY_DECK_SIZE ? deck : null;
  } catch {
    return null;
  }
}

function cacheDeck(date: string, deck: DailyPiece[]): void {
  const payload: CachedDailyDeck = {
    date,
    pieceIds: deck.map((p) => p.id),
  };
  localStorage.setItem(DAILY_DECK_KEY, JSON.stringify(payload));
}

function sharedTagCount(a: string[], b: string[]): number {
  const setB = new Set(b);
  return a.filter((tag) => setB.has(tag)).length;
}

function similarity(piece: DailyPiece, record: SwipeRecord): number {
  let score = 0;

  if (piece.brand === record.brand) score += 1.2;
  if (piece.category === record.category) score += 1;
  score += sharedTagCount(piece.aestheticTags, record.aestheticTags) * 0.6;
  if (piece.priceRange === record.priceRange) score += 0.5;

  return score;
}

function scorePiece(piece: DailyPiece, history: SwipeRecord[]): number {
  if (history.length === 0) return 0;

  let score = 0;

  for (const record of history) {
    const match = similarity(piece, record);
    if (record.direction === "liked") {
      score += match;
    } else {
      score -= match * 0.85;
    }
  }

  return score;
}

/**
 * Reads swipe history and returns the top 8 catalog pieces for today,
 * scored by similarity to liked swipes and dissimilarity to passed swipes.
 * Result is cached per calendar day.
 */
export function getPersonalizedDeck(): DailyPiece[] {
  const date = todayKey();
  const cached = getCachedDeck(date);
  if (cached) return cached;

  const history = getSwipeHistory();

  const ranked = PIECE_CATALOG.map((piece) => ({
    piece,
    score: scorePiece(piece, history),
  }));

  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.piece.id.localeCompare(b.piece.id);
  });

  const deck = ranked.slice(0, DAILY_DECK_SIZE).map((entry) => entry.piece);
  cacheDeck(date, deck);
  return deck;
}
