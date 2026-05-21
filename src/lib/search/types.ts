export type SearchResultType = "brand" | "store" | "piece";

export type SearchResult = {
  name: string;
  type: SearchResultType;
  description: string;
  aestheticTags: string[];
  priceRange: string;
  /** Official website URL, or null if unknown */
  url: string | null;
};

export type SearchResponse = {
  results: SearchResult[];
};
