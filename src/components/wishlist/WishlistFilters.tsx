export type WishlistFilter = "all" | "saved" | "bought";

const FILTERS: { id: WishlistFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "saved", label: "Saved" },
  { id: "bought", label: "Bought" },
];

type WishlistFiltersProps = {
  value: WishlistFilter;
  onChange: (filter: WishlistFilter) => void;
};

export function WishlistFilters({ value, onChange }: WishlistFiltersProps) {
  return (
    <div
      className="flex border-b border-black/10"
      role="tablist"
      aria-label="Wishlist filters"
    >
      {FILTERS.map((filter) => {
        const isActive = value === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.id)}
            className={[
              "flex-1 py-3 text-sm tracking-wide transition-colors",
              isActive
                ? "border-b border-black text-black"
                : "text-black/45 hover:text-black/70",
            ].join(" ")}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
