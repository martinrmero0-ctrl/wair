export type NYCNeighborhood =
  | "Lower East Side"
  | "Soho"
  | "Williamsburg"
  | "East Village"
  | "Nolita"
  | "Tribeca"
  | "Bushwick";

export const NYC_NEIGHBORHOODS: NYCNeighborhood[] = [
  "Lower East Side",
  "Soho",
  "Williamsburg",
  "East Village",
  "Nolita",
  "Tribeca",
  "Bushwick",
];

const ALIASES: Record<string, NYCNeighborhood> = {
  "lower east side": "Lower East Side",
  les: "Lower East Side",
  soho: "Soho",
  williamsburg: "Williamsburg",
  "east village": "East Village",
  nolita: "Nolita",
  tribeca: "Tribeca",
  bushwick: "Bushwick",
};

/** Resolve a search query to a neighborhood when the user is searching by area. */
export function resolveNeighborhoodFromQuery(
  query: string,
): NYCNeighborhood | null {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  if (ALIASES[normalized]) return ALIASES[normalized];

  for (const neighborhood of NYC_NEIGHBORHOODS) {
    const key = neighborhood.toLowerCase();
    if (key === normalized || key.includes(normalized) || normalized.includes(key)) {
      return neighborhood;
    }
  }

  return null;
}
