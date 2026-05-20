export type PriceRange = 1 | 2 | 3 | 4;

export type DailyPiece = {
  id: string;
  brand: string;
  name: string;
  price: number;
  size: string;
  category: string;
  aestheticTags: string[];
  priceRange: PriceRange;
  /** Placeholder image background */
  color: string;
};

export type SwipeDirection = "liked" | "passed";

export type SwipeRecord = {
  pieceId: string;
  brand: string;
  category: string;
  aestheticTags: string[];
  priceRange: PriceRange;
  direction: SwipeDirection;
  swipedAt: string;
};
