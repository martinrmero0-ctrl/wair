import { formatPrice } from "@/lib/utils/format";

type WishlistSummaryProps = {
  savedCount: number;
  boughtCount: number;
  totalValue: number;
};

export function WishlistSummary({
  savedCount,
  boughtCount,
  totalValue,
}: WishlistSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-black/10 py-6">
      <div className="text-center">
        <p className="text-2xl font-medium text-black">{savedCount}</p>
        <p className="mt-1 text-xs tracking-wide text-black/50 uppercase">
          Saved
        </p>
      </div>
      <div className="border-x border-black/10 text-center">
        <p className="text-2xl font-medium text-black">{boughtCount}</p>
        <p className="mt-1 text-xs tracking-wide text-black/50 uppercase">
          Bought
        </p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-medium text-black">
          {formatPrice(totalValue)}
        </p>
        <p className="mt-1 text-xs tracking-wide text-black/50 uppercase">
          Total value
        </p>
      </div>
    </div>
  );
}
