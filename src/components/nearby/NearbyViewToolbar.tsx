import type { StoreSort } from "@/lib/nearby/types";
import { NearbySort } from "./NearbySort";

export type ExploreViewMode = "list" | "map";

type NearbyViewToolbarProps = {
  sort: StoreSort;
  onSortChange: (sort: StoreSort) => void;
  view: ExploreViewMode;
  onViewChange: (view: ExploreViewMode) => void;
};

export function NearbyViewToolbar({
  sort,
  onSortChange,
  view,
  onViewChange,
}: NearbyViewToolbarProps) {
  return (
    <div className="flex border-b border-black/10">
      <div className="min-w-0 flex-1">
        <NearbySort value={sort} onChange={onSortChange} />
      </div>
      <button
        type="button"
        onClick={() => onViewChange(view === "map" ? "list" : "map")}
        className={[
          "shrink-0 border-l border-black/10 px-5 py-2 text-sm tracking-wide transition-colors",
          view === "map"
            ? "bg-black text-white"
            : "text-black/45 hover:bg-black/5 hover:text-black",
        ].join(" ")}
        aria-pressed={view === "map"}
      >
        {view === "map" ? "List" : "Map"}
      </button>
    </div>
  );
}
