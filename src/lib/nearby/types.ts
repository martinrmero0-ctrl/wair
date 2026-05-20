export type StoreTag =
  | "vintage"
  | "denim"
  | "japanese"
  | "workwear"
  | "consignment";

export type NearbyStore = {
  id: string;
  name: string;
  type: string;
  distanceMiles: number;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  priceRange: 1 | 2 | 3 | 4;
  color: string;
  tags: StoreTag[];
};

export type StoreTagFilter = "all" | StoreTag;

export type StoreSort = "nearest" | "top-rated" | "open-now";
