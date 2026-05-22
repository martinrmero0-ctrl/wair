/** Pin fill by store rating */
export function getStorePinColor(rating: number): string {
  if (rating >= 4.8) return "#3d6b4f";
  if (rating >= 4.5) return "#c4a035";
  return "#9ca3af";
}

export function buildStorePinElement(
  rating: number,
  friendRated: boolean,
  bookmarked: boolean,
  selected: boolean,
): HTMLDivElement {
  const root = document.createElement("div");
  root.className = "explore-map-pin";
  if (selected) root.classList.add("explore-map-pin--selected");

  const dot = document.createElement("div");
  dot.className = "explore-map-pin__dot";
  dot.style.backgroundColor = getStorePinColor(rating);
  root.appendChild(dot);

  if (friendRated || bookmarked) {
    const badges = document.createElement("div");
    badges.className = "explore-map-pin__badges";

    if (friendRated) {
      const star = document.createElement("span");
      star.className = "explore-map-pin__star";
      star.setAttribute("aria-hidden", "true");
      star.textContent = "★";
      badges.appendChild(star);
    }

    if (bookmarked) {
      const bookmark = document.createElement("span");
      bookmark.className = "explore-map-pin__bookmark";
      bookmark.setAttribute("aria-hidden", "true");
      bookmark.innerHTML =
        '<svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M6 4.5h12v16.5l-6-4.5-6 4.5V4.5z"/></svg>';
      badges.appendChild(bookmark);
    }

    root.appendChild(badges);
  }

  return root;
}
