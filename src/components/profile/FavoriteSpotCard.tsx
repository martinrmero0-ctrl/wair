import Link from "next/link";
import type { NearbyStore } from "@/lib/nearby/types";

type FavoriteSpotCardProps = {
  store: NearbyStore;
};

export function FavoriteSpotCard({ store }: FavoriteSpotCardProps) {
  return (
    <Link
      href="/nearby"
      className="block border border-black/10 bg-white p-3 transition-colors hover:border-black/25"
    >
      <p className="text-sm font-medium leading-tight text-black">
        {store.name}
      </p>
      <p className="mt-1 text-xs text-black/50">{store.neighborhood}</p>
      <p className="mt-2 text-xs text-black/55">
        <span className="text-black">{store.rating.toFixed(1)}</span>
        <span className="text-black/40"> ★</span>
      </p>
    </Link>
  );
}
