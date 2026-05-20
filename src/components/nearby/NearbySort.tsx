import type { StoreSort } from "@/lib/nearby/types";

const SORTS: { id: StoreSort; label: string }[] = [
  { id: "nearest", label: "Nearest" },
  { id: "top-rated", label: "Top Rated" },
  { id: "open-now", label: "Open Now" },
];

type NearbySortProps = {
  value: StoreSort;
  onChange: (sort: StoreSort) => void;
};

export function NearbySort({ value, onChange }: NearbySortProps) {
  return (
    <div className="flex gap-2" role="group" aria-label="Sort stores">
      {SORTS.map((sort) => {
        const isActive = value === sort.id;

        return (
          <button
            key={sort.id}
            type="button"
            onClick={() => onChange(sort.id)}
            className={[
              "flex-1 py-2 text-sm tracking-wide transition-colors",
              isActive
                ? "border-b border-black text-black"
                : "text-black/45 hover:text-black/70",
            ].join(" ")}
          >
            {sort.label}
          </button>
        );
      })}
    </div>
  );
}
