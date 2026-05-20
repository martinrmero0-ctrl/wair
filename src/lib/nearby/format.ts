export function formatDistance(miles: number) {
  return `${miles.toFixed(1)} mi`;
}

export function formatPriceRange(level: 1 | 2 | 3 | 4) {
  return "$".repeat(level);
}

export function formatReviewCount(count: number) {
  return new Intl.NumberFormat("en-US").format(count);
}
