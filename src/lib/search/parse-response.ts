import { lookupOfficialUrl } from "./official-urls";
import type { SearchResponse, SearchResult, SearchResultType } from "./types";

function extractJsonPayload(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  return trimmed;
}

const PLACEHOLDER_URL_PATTERN =
  /placeholder|example\.com|wair\.app|localhost|yoursite/i;

function normalizeUrlFromClaude(
  raw: unknown,
  name: string,
  type: SearchResultType,
  brand?: string,
): string | null {
  if (raw === null || raw === undefined) {
    return lookupOfficialUrl(name, type, brand);
  }

  const value = String(raw).trim();
  if (
    !value ||
    value.toLowerCase() === "null" ||
    PLACEHOLDER_URL_PATTERN.test(value)
  ) {
    return lookupOfficialUrl(name, type, brand);
  }

  try {
    const parsed = new URL(
      value.startsWith("http") ? value : `https://${value}`,
    );
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return lookupOfficialUrl(name, type, brand);
    }
    return parsed.href;
  } catch {
    return lookupOfficialUrl(name, type, brand);
  }
}

function parseResult(raw: Record<string, unknown>): SearchResult {
  const type: SearchResultType =
    raw.type === "store" || raw.type === "piece" ? raw.type : "brand";
  const name = String(raw.name ?? "");
  const brand =
    type === "piece" ? String(raw.brand ?? "").trim() || undefined : undefined;

  return {
    name,
    type,
    brand,
    description: String(raw.description ?? ""),
    aestheticTags: Array.isArray(raw.aestheticTags)
      ? raw.aestheticTags.map(String)
      : [],
    priceRange: String(raw.priceRange ?? "$$"),
    sizeAvailability:
      type === "piece" && raw.sizeAvailability != null
        ? String(raw.sizeAvailability)
        : undefined,
    url: normalizeUrlFromClaude(raw.url, name, type, brand),
  };
}

export function parseClaudeSearchResponse(text: string): SearchResponse {
  const candidate = extractJsonPayload(text);
  const parsed = JSON.parse(candidate) as { results?: Record<string, unknown>[] };

  if (!Array.isArray(parsed.results)) {
    throw new Error("Invalid response shape: missing results array");
  }

  return {
    results: parsed.results.slice(0, 4).map((result) =>
      parseResult(result as Record<string, unknown>),
    ),
  };
}
