import { lookupOfficialUrl } from "./official-urls";
import type { SearchResponse, SearchResultType } from "./types";

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
): string | null {
  if (raw === null || raw === undefined) {
    return lookupOfficialUrl(name, type);
  }

  const value = String(raw).trim();
  if (
    !value ||
    value.toLowerCase() === "null" ||
    PLACEHOLDER_URL_PATTERN.test(value)
  ) {
    return lookupOfficialUrl(name, type);
  }

  try {
    const parsed = new URL(
      value.startsWith("http") ? value : `https://${value}`,
    );
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return lookupOfficialUrl(name, type);
    }
    return parsed.href;
  } catch {
    return lookupOfficialUrl(name, type);
  }
}

export function parseClaudeSearchResponse(text: string): SearchResponse {
  const candidate = extractJsonPayload(text);
  const parsed = JSON.parse(candidate) as SearchResponse;

  if (!Array.isArray(parsed.results)) {
    throw new Error("Invalid response shape: missing results array");
  }

  return {
    results: parsed.results.slice(0, 4).map((result) => {
      const type: SearchResultType =
        result.type === "store" || result.type === "piece"
          ? result.type
          : "brand";
      const name = String(result.name ?? "");

      return {
        name,
        type,
        description: String(result.description ?? ""),
        aestheticTags: Array.isArray(result.aestheticTags)
          ? result.aestheticTags.map(String)
          : [],
        priceRange: String(result.priceRange ?? "$$"),
        url: normalizeUrlFromClaude(result.url, name, type),
      };
    }),
  };
}
