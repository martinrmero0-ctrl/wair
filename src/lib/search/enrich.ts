import { NYC_STORES } from "@/lib/nearby/stores";
import type { SearchResult } from "./types";

const CARD_COLORS = [
  "#e8e4dc",
  "#c9d4ce",
  "#ddd5cc",
  "#d4c4bc",
  "#c5c9d0",
  "#e2d6d0",
  "#bcc8c4",
  "#ebe6e1",
  "#d8d4c8",
  "#c4b8a8",
];

export type EnrichedSearchResult = SearchResult & {
  color: string;
  distanceMiles?: number;
  isOpen?: boolean;
};

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CARD_COLORS[Math.abs(hash) % CARD_COLORS.length];
}

function findStoreByName(name: string) {
  const normalized = name.toLowerCase().trim();
  return NYC_STORES.find(
    (store) =>
      store.name.toLowerCase() === normalized ||
      normalized.includes(store.name.toLowerCase()) ||
      store.name.toLowerCase().includes(normalized),
  );
}

export function enrichSearchResult(result: SearchResult): EnrichedSearchResult {
  if (result.type === "store") {
    const store = findStoreByName(result.name);
    return {
      ...result,
      color: store?.color ?? hashColor(result.name),
      distanceMiles: store?.distanceMiles ?? 1.2,
      isOpen: store?.isOpen ?? true,
    };
  }

  return {
    ...result,
    color: hashColor(result.name),
  };
}

export function enrichSearchResults(
  results: SearchResult[],
): EnrichedSearchResult[] {
  return results.map(enrichSearchResult);
}

export function formatResultUrl(url: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed.replace(/^\/+/, "")}`;
}
