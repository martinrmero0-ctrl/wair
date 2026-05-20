import type { DailyPiece } from "@/lib/swipe/types";

type SwipeCardProps = {
  piece: DailyPiece;
  style?: React.CSSProperties;
  className?: string;
  dragLabel?: "save" | "pass" | null;
};

import { formatPrice } from "@/lib/utils/format";

export function SwipeCard({
  piece,
  style,
  className = "",
  dragLabel = null,
}: SwipeCardProps) {
  return (
    <article
      className={[
        "absolute inset-0 flex flex-col overflow-hidden border border-black/10 bg-white shadow-sm select-none touch-none",
        className,
      ].join(" ")}
      style={style}
    >
      <div
        className="relative flex-1"
        style={{ backgroundColor: piece.color }}
      >
        {dragLabel === "save" && (
          <span className="absolute top-6 right-6 border border-black px-3 py-1 text-sm tracking-widest uppercase">
            Save
          </span>
        )}
        {dragLabel === "pass" && (
          <span className="absolute top-6 left-6 border border-black/40 px-3 py-1 text-sm tracking-widest text-black/50 uppercase">
            Pass
          </span>
        )}
      </div>

      <div className="border-t border-black/10 bg-white px-5 py-4 text-left">
        <p className="text-xs tracking-[0.15em] text-black/50 uppercase">
          {piece.brand}
        </p>
        <h2 className="mt-1 text-2xl leading-tight font-medium text-black">
          {piece.name}
        </h2>
        <div className="mt-2 flex items-baseline justify-between text-lg">
          <span>{formatPrice(piece.price)}</span>
          <span className="text-black/50">Size {piece.size}</span>
        </div>
      </div>
    </article>
  );
}
