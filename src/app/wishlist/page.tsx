import type { Metadata } from "next";
import { WishlistView } from "@/components/wishlist/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist — Yevo",
};

export default function WishlistPage() {
  return <WishlistView />;
}
