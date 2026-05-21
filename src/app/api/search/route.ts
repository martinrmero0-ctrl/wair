import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { SEARCH_BRANDS, SEARCH_SYSTEM_PROMPT } from "@/lib/search/brands";
import {
  OFFICIAL_BRAND_URLS,
  OFFICIAL_STORE_URLS,
} from "@/lib/search/official-urls";
import { SEARCH_MODEL } from "@/lib/search/config";
import { parseClaudeSearchResponse } from "@/lib/search/parse-response";
import { PIECE_CATALOG } from "@/lib/swipe/catalog";
import { NYC_STORES } from "@/lib/nearby/stores";

function getAnthropicClient() {
  const cleanKey = process.env.ANTHROPIC_API_KEY?.replace(/\s/g, "").trim();
  if (!cleanKey) return null;
  return new Anthropic({ apiKey: cleanKey });
}

function logSearchError(error: unknown, context: { query: string }) {
  const hasKey = Boolean(
    process.env.ANTHROPIC_API_KEY?.replace(/\s/g, "").trim(),
  );

  if (error instanceof Anthropic.APIError) {
    console.error("Search API error (Anthropic):", {
      query: context.query,
      hasApiKey: hasKey,
      status: error.status,
      message: error.message,
      errorType: error.error?.type,
      model: SEARCH_MODEL,
    });
    return;
  }

  console.error("Search API error:", {
    query: context.query,
    hasApiKey: hasKey,
    error:
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error,
    model: SEARCH_MODEL,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const anthropic = getAnthropicClient();
  if (!anthropic) {
    console.error("Search API: ANTHROPIC_API_KEY is missing or empty", {
      query,
      cwd: process.cwd(),
    });
    return NextResponse.json(
      { error: "Search is not configured. Missing ANTHROPIC_API_KEY." },
      { status: 503 },
    );
  }

  const storeContext = NYC_STORES.map((store) => ({
    name: store.name,
    type: store.type,
    neighborhood: store.neighborhood,
    tags: store.tags,
    priceRange: "$".repeat(store.priceRange),
    officialUrl:
      OFFICIAL_STORE_URLS[store.name.toLowerCase()] ?? null,
  }));

  const pieceContext = PIECE_CATALOG.map((piece) => {
    const brandUrl = OFFICIAL_BRAND_URLS[piece.brand.toLowerCase()] ?? null;
    return {
      name: piece.name,
      brand: piece.brand,
      category: piece.category,
      size: piece.size,
      tags: piece.aestheticTags,
      priceRange: "$".repeat(piece.priceRange),
      shopUrl: brandUrl,
    };
  });

  try {
    const message = await anthropic.messages.create({
      model: SEARCH_MODEL,
      max_tokens: 1400,
      system: SEARCH_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Available brands (official URLs for brand and piece results):
${SEARCH_BRANDS.map((b) => {
  const url = OFFICIAL_BRAND_URLS[b.toLowerCase()];
  return url ? `- ${b}: ${url}` : `- ${b}`;
}).join("\n")}

Available NYC stores (official URLs for store results):
${storeContext
  .map((s) =>
    s.officialUrl
      ? `- ${s.name} (${s.type}, ${s.neighborhood}): ${s.officialUrl}`
      : `- ${s.name} (${s.type}, ${s.neighborhood})`,
  )
  .join("\n")}

Piece catalog (use for piece-intent searches — match query to similar items/brands):
${pieceContext
  .map(
    (p) =>
      `- ${p.brand} — ${p.name} (${p.category}, size ${p.size}, ${p.priceRange})${
        p.shopUrl ? ` → ${p.shopUrl}` : ""
      }`,
  )
  .join("\n")}

User search query: "${query}"

First classify intent (piece | brand | store), then return exactly 4 results of that type only.

Return JSON only (no markdown):
{
  "results": [
    {
      "name": "string",
      "type": "piece" | "brand" | "store",
      "brand": "string (required when type is piece)",
      "description": "string",
      "aestheticTags": ["string"],
      "priceRange": "$" | "$$" | "$$$" | "$$$$",
      "sizeAvailability": "string (piece only)",
      "url": "https://official-site.com" | null
    }
  ]
}`,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }

    const data = parseClaudeSearchResponse(textBlock.text);
    return NextResponse.json(data);
  } catch (error) {
    logSearchError(error, { query });

    const isDev = process.env.NODE_ENV === "development";
    const detail =
      isDev && error instanceof Error
        ? error.message
        : "Could not complete your search. Please try again.";

    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
