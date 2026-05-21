import type { StoreTagFilter } from "@/lib/nearby/types";

const TAGS: { id: StoreTagFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "vintage", label: "Vintage" },
  { id: "denim", label: "Denim" },
  { id: "japanese", label: "Japanese" },
  { id: "workwear", label: "Workwear" },
  { id: "streetwear", label: "Streetwear" },
  { id: "consignment", label: "Consignment" },
];

type NearbyTagFiltersProps = {
  value: StoreTagFilter;
  onChange: (tag: StoreTagFilter) => void;
};

export function NearbyTagFilters({ value, onChange }: NearbyTagFiltersProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1"
      role="group"
      aria-label="Store filters"
    >
      {TAGS.map((tag) => {
        const isActive = value === tag.id;

        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => onChange(tag.id)}
            className={[
              "shrink-0 px-4 py-1.5 text-sm tracking-wide whitespace-nowrap transition-colors",
              isActive
                ? "bg-black text-white"
                : "border border-black/20 text-black hover:border-black/50",
            ].join(" ")}
          >
            {tag.label}
          </button>
        );
      })}
    </div>
  );
}
