type TasteMatchBadgeProps = {
  percent: number;
};

export function TasteMatchBadge({ percent }: TasteMatchBadgeProps) {
  if (percent <= 0) return null;

  return (
    <span className="mt-3 inline-block border border-black/15 bg-white px-3 py-1 text-xs tracking-wide text-black">
      {percent}% taste match
    </span>
  );
}
