"use client";

import {
  formatDistance,
  formatPriceRange,
  formatReviewCount,
} from "@/lib/nearby/format";
import { getDirectionsUrl } from "@/lib/nearby/directions";
import type { NearbyStore } from "@/lib/nearby/types";

type StoreCardProps = {
  store: NearbyStore;
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
};

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M6 4.5h12v16.5l-6-4.5-6 4.5V4.5z" strokeLinejoin="round" />
    </svg>
  );
}

export function StoreCard({
  store,
  bookmarked,
  onToggleBookmark,
}: StoreCardProps) {
  const directionsUrl = getDirectionsUrl(store.address);

  return (
    <article className="border border-black/10">
      <div
        className="h-32 w-full"
        style={{ backgroundColor: store.color }}
        aria-hidden
      />

      <div className="bg-white px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-medium leading-tight text-black">
              {store.name}
            </h2>
            <p className="mt-1 text-sm text-black/55">{store.type}</p>
            <p className="mt-2 text-sm text-black/50">
              {formatDistance(store.distanceMiles)}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <button
              type="button"
              onClick={() => onToggleBookmark(store.id)}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark store"}
              aria-pressed={bookmarked}
              className={[
                "flex h-9 w-9 items-center justify-center border bg-white transition-colors",
                bookmarked
                  ? "border-black text-black"
                  : "border-black/20 text-black/45 hover:border-black hover:text-black",
              ].join(" ")}
            >
              <BookmarkIcon filled={bookmarked} />
            </button>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-black/20 px-3 py-1.5 text-xs tracking-wide text-black transition-colors hover:border-black hover:bg-black hover:text-white"
            >
              Directions
            </a>
          </div>
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
