/** Google Shopping search for a brand + item (opens in new tab from UI). */
export function getGoogleShoppingUrl(brand: string, itemName: string): string {
  const q = [brand.trim(), itemName.trim()].filter(Boolean).join(" ");
  const params = new URLSearchParams({ q, tbm: "shop" });
  return `https://www.google.com/search?${params.toString()}`;
}
