import { buildStorePinElement } from "./pin";
import type { NearbyStore } from "@/lib/nearby/types";

export function createStoreMarkerOverlay(
  store: NearbyStore,
  bookmarked: boolean,
  selected: boolean,
  onSelect: (store: NearbyStore) => void,
): google.maps.OverlayView {
  class StoreMarkerOverlay extends google.maps.OverlayView {
    private position: google.maps.LatLng;
    private container: HTMLDivElement | null = null;
    private clickHandler: ((e: MouseEvent) => void) | null = null;

    constructor() {
      super();
      this.position = new google.maps.LatLng(store.latitude, store.longitude);
    }

    onAdd() {
      this.container = buildStorePinElement(
        store.rating,
        Boolean(store.friendRated),
        bookmarked,
        selected,
      );
      this.clickHandler = (e: MouseEvent) => {
        e.stopPropagation();
        onSelect(store);
      };
      this.container.addEventListener("click", this.clickHandler);

      const pane = this.getPanes()?.overlayMouseTarget;
      pane?.appendChild(this.container);
    }

    draw() {
      if (!this.container) return;
      const projection = this.getProjection();
      const point = projection.fromLatLngToDivPixel(this.position);
      if (!point) return;
      this.container.style.left = `${point.x}px`;
      this.container.style.top = `${point.y}px`;
    }

    onRemove() {
      if (this.container && this.clickHandler) {
        this.container.removeEventListener("click", this.clickHandler);
        this.container.remove();
      }
      this.container = null;
      this.clickHandler = null;
    }
  }

  return new StoreMarkerOverlay();
}
