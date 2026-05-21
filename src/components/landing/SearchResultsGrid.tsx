import { enrichSearchResults } from "@/lib/search/enrich";
import type { SearchResult } from "@/lib/search/types";
import { SearchResultCard } from "./SearchResultCard";

type SearchResultsGridProps = {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  query: string;
};

export function SearchResultsGrid({
  results,
  loading,
  error,
  query,
}: SearchResultsGridProps) {
  const enriched = enrichSearchResults(results);

  if (loading) {
    return (
      <p className="py-16 text-center text-lg text-black/45">
        searching your style...
      </p>
    );
  }

  if (error) {
    return (
      <p className="py-16 text-center text-lg text-black/55">{error}</p>
    );
  }

  if (enriched.length === 0) {
    return (
      <p className="py-16 text-center text-lg text-black/45">
        No results for &ldquo;{query}&rdquo;.
      </p>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {enriched.map((result) => (
        <SearchResultCard
          key={`${result.type}-${result.name}`}
          result={result}
        />
      ))}
    </div>
  );
}
