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
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

function logSearchError(error: unknown, context: { query: string }) {
  const hasKey = Boolean(process.env.ANTHROPIC_API_KEY?.trim());

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
    tags: store.tags,
    priceRange: "$".repeat(store.priceRange),
    officialUrl:
      OFFICIAL_STORE_URLS[store.name.toLowerCase()] ?? null,
  }));

  const pieceContext = PIECE_CATALOG.slice(0, 12).map((piece) => ({
    name: piece.name,
    brand: piece.brand,
    category: piece.category,
    tags: piece.aestheticTags,
    priceRange: "$".repeat(piece.priceRange),
  }));

  try {
    const message = await anthropic.messages.create({
      model: SEARCH_MODEL,
      max_tokens: 1200,
      system: SEARCH_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Available brands (use these official URLs when returning a listed brand):
${SEARCH_BRANDS.map((b) => {
  const url = OFFICIAL_BRAND_URLS[b.toLowerCase()];
  return url ? `- ${b}: ${url}` : `- ${b}`;
}).join("\n")}

Available NYC stores (use these official URLs when returning a listed store):
${storeContext
  .map((s) =>
    s.officialUrl
      ? `- ${s.name} (${s.type}): ${s.officialUrl}`
      : `- ${s.name} (${s.type})`,
  )
  .join("\n")}

Sample pieces in catalog:
${pieceContext.map((p) => `- ${p.brand} — ${p.name}`).join("\n")}

User search query: "${query}"

Return exactly 4 results as JSON with this shape (no markdown, no extra text):
{
  "results": [
    {
      "name": "string",
      "type": "brand" | "store" | "piece",
      "description": "string",
      "aestheticTags": ["string"],
      "priceRange": "$" | "$$" | "$$$" | "$$$$",
      "url": "https://official-site.com" | null
    }
  ]
}

Use null for url when you are not certain of the official website. Never use placeholder or guessed URLs.`,
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
