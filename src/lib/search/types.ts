export type SearchResultType = "brand" | "store" | "piece";

export type SearchResult = {
  /** Item name (piece), brand name (brand), or store name (store) */
  name: string;
  type: SearchResultType;
  /** Brand label — required for piece results */
  brand?: string;
  description: string;
  aestheticTags: string[];
  priceRange: string;
  /** Piece only — e.g. "S, M, L, XL" or "28–34 waist" */
  sizeAvailability?: string;
  /** Official site (brand/store) or brand shop link (piece) */
  url: string | null;
};

export type SearchResponse = {
  results: SearchResult[];
};
