"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getWishlist,
  markWishlistItemBought,
  removeWishlistItem,
  type WishlistItem,
} from "@/lib/wishlist/storage";
import { computeWishlistStats } from "@/lib/wishlist/stats";
import { formatPrice } from "@/lib/utils/format";
import { WishlistFilters, type WishlistFilter } from "./WishlistFilters";
import { WishlistItemCard } from "./WishlistItemCard";
import { WishlistSummary } from "./WishlistSummary";

function filterItems(items: WishlistItem[], filter: WishlistFilter) {
  switch (filter) {
    case "saved":
      return items.filter((item) => !item.bought);
    case "bought":
      return items.filter((item) => item.bought);
    default:
      return items;
  }
}

export function WishlistView() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [filter, setFilter] = useState<WishlistFilter>("all");
  const [hydrated, setHydrated] = useState(false);

  const load = useCallback(() => {
    setItems(getWishlist());
  }, []);

  useEffect(() => {
    load();
    setHydrated(true);
  }, [load]);

  const stats = useMemo(() => computeWishlistStats(items), [items]);
  const visibleItems = useMemo(
    () => filterItems(items, filter),
    [items, filter],
  );

  const handleMarkBought = (id: string) => {
    markWishlistItemBought(id);
    load();
  };

  const handleRemove = (id: string) => {
    removeWishlistItem(id);
    load();
  };

  return (
    <main className="flex min-h-dvh flex-col bg-white">
      <header className="px-6 pt-8">
        <h1 className="text-center text-3xl font-medium italic text-black">
          Wishlist
        </h1>
        {hydrated && (
          <WishlistSummary
            savedCount={stats.savedCount}
            boughtCount={stats.boughtCount}
            totalValue={stats.totalValue}
          />
        )}
      </header>

      <WishlistFilters value={filter} onChange={setFilter} />

      <div className="flex-1 px-6 py-6">
        {!hydrated ? (
          <p className="text-center text-black/40">Loading…</p>
        ) : visibleItems.length === 0 ? (
          <p className="text-center text-lg text-black/45">
            {filter === "all"
              ? "Nothing saved yet. Swipe right on today's deck."
              : filter === "saved"
                ? "No saved pieces."
                : "No bought pieces yet."}
          </p>
        ) : (
          <ul className="flex flex-col gap-5">
            {visibleItems.map((item) => (
              <li key={item.id}>
                <WishlistItemCard
                  item={item}
                  onMarkBought={handleMarkBought}
                  onRemove={handleRemove}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {hydrated && items.length > 0 && (
        <footer className="border-t border-black/10 px-6 py-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm tracking-wide text-black/50 uppercase">
              Remaining saved
            </span>
            <span className="text-xl font-medium text-black">
              {formatPrice(stats.remainingValue)}
            </span>
          </div>
        </footer>
      )}
    </main>
  );
}
