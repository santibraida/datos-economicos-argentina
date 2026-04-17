import { NextResponse } from "next/server";
import { fetchDolarSi } from "@/lib/dolarSiService";
import {
  getCached,
  save,
  toSimpleResponse,
  toIndicatorResponse,
} from "@/lib/repository";
import { formatNumber } from "@/lib/utils";
import type { QuoteConfig, IndicatorConfig } from "@/lib/quotes";

export async function handleQuote(type: string, config: QuoteConfig) {
  try {
    const cached = await getCached(type);
    if (cached) return NextResponse.json(toSimpleResponse(cached));

    const data = await fetchDolarSi();
    const buy = formatNumber(config.getBuy(data));
    const sell = formatNumber(config.getSell(data));
    const row = await save({ type, buy, sell, currency: config.currency });
    return NextResponse.json(toSimpleResponse(row));
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 },
    );
  }
}

export async function handleIndicator(type: string, config: IndicatorConfig) {
  try {
    const cached = await getCached(type);
    if (cached) return NextResponse.json(toIndicatorResponse(cached));

    const data = await fetchDolarSi();
    const value = formatNumber(config.getValue(data), config.decimals ?? 2);
    const row = await save({ type, value, currency: config.currency });
    return NextResponse.json(toIndicatorResponse(row));
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch indicator" },
      { status: 500 },
    );
  }
}

export async function handleAllQuotes(
  map: Record<string, QuoteConfig>,
  prefix: string,
) {
  try {
    const data = await fetchDolarSi();
    const results: Record<
      string,
      { buy: string; sell: string; currency: string }
    > = {};
    for (const [key, config] of Object.entries(map)) {
      try {
        results[key] = {
          buy: formatNumber(config.getBuy(data)),
          sell: formatNumber(config.getSell(data)),
          currency: config.currency,
        };
        // fire-and-forget cache save
        save({ type: `${prefix}/${key}`, ...results[key] }).catch(() => {});
      } catch {
        results[key] = { buy: "N/A", sell: "N/A", currency: config.currency };
      }
    }
    return NextResponse.json(results);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 },
    );
  }
}
