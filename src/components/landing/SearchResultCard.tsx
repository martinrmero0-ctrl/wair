import {
  formatResultUrl,
  type EnrichedSearchResult,
} from "@/lib/search/enrich";

type SearchResultCardProps = {
  result: EnrichedSearchResult;
};

function typeTag(type: EnrichedSearchResult["type"]) {
  if (type === "store") return "STORE";
  if (type === "piece") return "PIECE";
  return "BRAND";
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  const visitUrl = formatResultUrl(result.url);
  const isStore = result.type === "store";

  return (
    <article className="flex flex-col border border-black/10 bg-white">
      <div
        className="h-36 w-full"
        style={{ backgroundColor: result.color }}
        aria-hidden
      />

      <div className="flex flex-1 flex-col p-4 text-left">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg leading-tight font-medium text-black">
            {result.name}
          </h2>
          <span className="shrink-0 text-[10px] tracking-[0.2em] text-black/40 uppercase">
            {typeTag(result.type)}
          </span>
        </div>

        {isStore && result.distanceMiles !== undefined && (
          <p className="mt-2 text-xs text-black/50">
            {result.distanceMiles.toFixed(1)} mi away
            <span className="mx-2 text-black/25">·</span>
            <span
              className={
                result.isOpen ? "text-black" : "text-black/40 uppercase"
              }
            >
              {result.isOpen ? "Open" : "Closed"}
            </span>
          </p>
        )}

        <p className="mt-2 line-clamp-3 text-sm leading-snug text-black/55">
          {result.description}
        </p>

        {result.aestheticTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {result.aestheticTags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="border border-black/12 px-2 py-0.5 text-xs text-black/55"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-black/8 pt-3 text-sm">
          <span className="tracking-widest text-black/70">
            {result.priceRange}
          </span>
          {visitUrl ? (
            <a
              href={visitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-black/20 px-3 py-1 text-xs tracking-wide text-black transition-colors hover:border-black hover:bg-black hover:text-white"
            >
              Visit website
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
