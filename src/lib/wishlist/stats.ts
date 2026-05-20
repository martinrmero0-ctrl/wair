import type { WishlistItem } from "./storage";

export function computeWishlistStats(items: WishlistItem[]) {
  const saved = items.filter((item) => !item.bought);
  const bought = items.filter((item) => item.bought);

  return {
    savedCount: saved.length,
    boughtCount: bought.length,
    totalValue: items.reduce((sum, item) => sum + item.price, 0),
    remainingValue: saved.reduce((sum, item) => sum + item.price, 0),
  };
}
