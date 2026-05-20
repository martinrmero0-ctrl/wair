import type { Metadata } from "next";
import { NearbyView } from "@/components/nearby/NearbyView";

export const metadata: Metadata = {
  title: "Explore — Wair",
};

export default function NearbyPage() {
  return <NearbyView />;
}
