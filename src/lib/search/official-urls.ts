/** Known official websites — used as Claude context and fallback when url is null */
export const OFFICIAL_BRAND_URLS: Record<string, string> = {
  kapital: "https://www.kapital.jp",
  visvim: "https://www.visvim.tv",
  needles: "https://needles.jp",
  "human made": "https://humanmade.jp",
  neighborhood: "https://www.neighborhood.jp",
  "engineered garments": "https://engineeredgarments.com",
  orslow: "https://www.orslow.jp",
  monitaly: "https://www.monitaly.com",
  "evan kinori": "https://evankinori.com",
  "tender co": "https://www.tenderco.uk",
  "camiel fortgens": "https://camielfortgens.com",
  auralee: "https://auralee.jp",
  "margaret howell": "https://www.margarethowell.co.uk",
  "comme des garcons": "https://comme-des-garcons.com",
};

export const OFFICIAL_STORE_URLS: Record<string, string> = {
  "blue in green": "https://blueingreensoho.com",
  "tokio 7": "https://www.tokio7.com",
  "front general store": "https://www.frontstreetgeneralstore.com",
  "what goes around comes around": "https://www.whatgoesaroundnyc.com",
  "screaming mimi's": "https://www.screamingmimis.com",
  "artifact nyc": "https://artifactnyc.com",
  procell: "https://www.procellnyc.com",
  "l train vintage": "https://www.ltrainvintage.com",
};

function normalizeKey(name: string) {
  return name.toLowerCase().trim();
}

export function lookupOfficialUrl(
  name: string,
  type: "brand" | "store" | "piece",
  brand?: string,
): string | null {
  if (type === "piece") {
    const brandKey = normalizeKey(brand ?? name);
    return OFFICIAL_BRAND_URLS[brandKey] ?? null;
  }

  const key = normalizeKey(name);
  if (type === "store") {
    return OFFICIAL_STORE_URLS[key] ?? null;
  }
  return OFFICIAL_BRAND_URLS[key] ?? null;
}
