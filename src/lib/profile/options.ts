export const TOP_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const WAIST_SIZES = Array.from({ length: 19 }, (_, i) =>
  String(26 + i),
);

export const SHOE_SIZES = [
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
  "11.5",
  "12",
  "12.5",
  "13",
] as const;

export const DEFAULT_AESTHETIC_TAGS = [
  "Japanese Americana",
  "Ametora",
  "Workwear",
  "Streetwear",
  "Vintage Denim",
  "Militaria",
  "Ivy League",
  "Technical",
  "Minimalist",
  "Latin Street",
] as const;

export const BUDGET_MIN = 50;
export const BUDGET_MAX = 2000;
