"use client";

import { useEffect, useMemo, useState } from "react";
import { StorePinsMap } from "@/components/maps/StorePinsMap";
import { getBookmarkedStoreIds } from "@/lib/nearby/bookmarks";
import { getStoresForSocialMapTab } from "@/lib/social/store-map-filters";
import type { SocialMapTab } from "@/lib/social/types";

const TABS: { id: SocialMapTab; label: string }[] = [
  { id: "rated", label: "Rated" },
  { id: "been", label: "Been" },
  { id: "want-to-try", label: "Want to Try" },
  { id: "friends-recs", label: "Friends' Recs" },
  { id: "trending", label: "Trending" },
];

type SocialMapOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function SocialMapOverlay({ open, onClose }: SocialMapOverlayProps) {
  const [tab, setTab] = useState<SocialMapTab>("trending");
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setBookmarks(getBookmarkedStoreIds());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const stores = useMemo(
    () => getStoresForSocialMapTab(tab, bookmarks),
    [tab, bookmarks],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Social map"
    >
      <header className="shrink-0 border-b border-black/10 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm tracking-wide text-black/50">Store map</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close map"
            className="flex h-9 w-9 items-center justify-center border border-black/15 text-lg text-black/55 transition-colors hover:border-black hover:text-black"
          >
            ×
          </button>
        </div>

        <div
          className="flex gap-0 overflow-x-auto border-t border-black/8"
          role="tablist"
          aria-label="Map filters"
        >
          {TABS.map((item) => {
            const isActive = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(item.id)}
                className={[
                  "shrink-0 px-4 py-2.5 text-xs tracking-wide whitespace-nowrap transition-colors",
                  isActive
                    ? "border-b border-black text-black"
                    : "text-black/45 hover:text-black/70",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        {stores.length === 0 ? (
          <p className="flex h-full items-center justify-center px-6 text-center text-black/45">
            No stores in this list yet.
          </p>
        ) : (
          <StorePinsMap
            stores={stores}
            bookmarkedIds={bookmarks}
            className="h-full w-full"
          />
        )}
      </div>
    </div>
  );
}
