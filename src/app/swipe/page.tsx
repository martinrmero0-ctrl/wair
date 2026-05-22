import type { Metadata } from "next";
import { SwipeDeck } from "@/components/swipe/SwipeDeck";

export const metadata: Metadata = {
  title: "Today's deck — Yevo",
};

export default function SwipePage() {
  return <SwipeDeck />;
}
