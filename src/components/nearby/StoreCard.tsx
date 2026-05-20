import {
  formatDistance,
  formatPriceRange,
  formatReviewCount,
} from "@/lib/nearby/format";
import type { NearbyStore } from "@/lib/nearby/types";

type StoreCardProps = {
  store: NearbyStore;
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
};

export function StoreCard({
  store,
  bookmarked,
  onToggleBookmark,
}: StoreCardProps) {
  return (
    <article className="border border-black/10">
      <div className="relative">
        <div
          className="h-32 w-full"
          style={{ backgroundColor: store.color }}
          aria-hidden
        />
        <button
          type="button"
          onClick={() => onToggleBookmark(store.id)}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark store"}
          aria-pressed={bookmarked}
          className={[
            "absolute top-3 right-3 flex h-9 w-9 items-center justify-center border bg-white text-lg transition-colors",
            bookmarked
              ? "border-black text-black"
              : "border-black/20 text-black/45 hover:border-black hover:text-black",
          ].join(" ")}
        >
          {bookmarked ? "♥" : "♡"}
        </button>
      </div>

      <div className="bg-white px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-medium leading-tight text-black">
              {store.name}
            </h2>
            <p className="mt-1 text-sm text-black/55">{store.type}</p>
          </div>
          <span className="shrink-0 text-sm text-black/50">
            {formatDistance(store.distanceMiles)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span>
            <span className="text-black">{store.rating.toFixed(1)}</span>
            <span className="text-black/40"> ★</span>
            <span className="text-black/45">
              {" "}
              ({formatReviewCount(store.reviewCount)})
            </span>
          </span>
          <span
            className={
              store.isOpen
                ? "text-black"
                : "text-black/40 uppercase tracking-wide"
            }
          >
            {store.isOpen ? "Open" : "Closed"}
          </span>
          <span className="tracking-widest text-black/70">
            {formatPriceRange(store.priceRange)}
          </span>
        </div>
      </div>
    </article>
  );
}
