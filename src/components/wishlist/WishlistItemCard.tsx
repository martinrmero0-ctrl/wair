import type { WishlistItem } from "@/lib/wishlist/storage";
import { formatPrice, formatSavedDate } from "@/lib/utils/format";

type WishlistItemCardProps = {
  item: WishlistItem;
  onMarkBought: (id: string) => void;
  onRemove: (id: string) => void;
};

export function WishlistItemCard({
  item,
  onMarkBought,
  onRemove,
}: WishlistItemCardProps) {
  const isBought = Boolean(item.bought);

  return (
    <article
      className={[
        "border border-black/10 transition-opacity",
        isBought ? "opacity-45" : "opacity-100",
      ].join(" ")}
    >
      <div
        className="h-36 w-full"
        style={{ backgroundColor: item.color }}
        aria-hidden
      />

      <div className="bg-white px-4 py-4">
        <div>
          <p className="text-xs tracking-[0.15em] text-black/50 uppercase">
            {item.brand}
          </p>
          <h2 className="mt-1 text-xl leading-tight font-medium text-black">
            {item.name}
          </h2>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-base">
            <span>{formatPrice(item.price)}</span>
            <span className="text-black/50">Size {item.size}</span>
          </div>
          <p className="mt-2 text-sm text-black/45">
            Saved {formatSavedDate(item.savedAt)}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3">
          {!isBought && (
            <button
              type="button"
              onClick={() => onMarkBought(item.id)}
              className="flex-1 border border-black/20 py-2 text-sm tracking-wide text-black transition-colors hover:border-black hover:bg-black hover:text-white"
            >
              Mark bought
            </button>
          )}
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name}`}
            className={[
              "border border-black/20 py-2 text-sm tracking-wide text-black/55 transition-colors hover:border-black hover:text-black",
              isBought ? "flex-1" : "px-4",
            ].join(" ")}
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
