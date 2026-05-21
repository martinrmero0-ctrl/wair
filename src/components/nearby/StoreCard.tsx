"use client";

import {
  formatDistance,
  formatPriceRange,
  formatReviewCount,
} from "@/lib/nearby/format";
import { useDirectionsUrl } from "@/hooks/useDirectionsUrl";
import type { NearbyStore } from "@/lib/nearby/types";

type StoreCardProps = {
  store: NearbyStore;
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
};

function FriendRatedBadge() {
  return (
    <span
      className="group relative inline-flex items-center gap-0.5 text-black/50"
      aria-label="Rated by friends"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-3.5 w-3.5"
        aria-hidden
      >
        <circle cx="10" cy="8.5" r="2.75" />
        <path d="M4.5 19c1-2.6 2.9-4 5.5-4s4.5 1.4 5.5 4" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-2.5 w-2.5 text-black/45"
        aria-hidden
      >
        <path d="M12 3.5l1.2 2.9 3.1.2-2.4 1.8.9 3-2.8-1.7-2.8 1.7.9-3-2.4-1.8 3.1-.2L12 3.5z" />
      </svg>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap border border-black/10 bg-white px-2 py-1 text-xs tracking-wide text-black opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        rated by friends
      </span>
    </span>
  );
}

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
  const directionsUrl = useDirectionsUrl(store.address);

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
          <span className="inline-flex items-center gap-1.5">
            <span className="text-black">{store.rating.toFixed(1)}</span>
            <span className="text-black/40">★</span>
            {store.friendRated ? <FriendRatedBadge /> : null}
            <span className="text-black/45">
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
