import { NextResponse } from "next/server";
import { fetchDolarSi } from "@/lib/providers";
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
    const buy = config.getBuy(data) ?? null;
    const sell = config.getSell(data) ?? null;
    const row = await save({ type, buy: buy ?? undefined, sell: sell ?? undefined, currency: config.currency });
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
    const value = config.getValue(data) ?? undefined;
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
        const rawBuy = config.getBuy(data) ?? undefined;
        const rawSell = config.getSell(data) ?? undefined;
        results[key] = {
          buy: formatNumber(rawBuy),
          sell: formatNumber(rawSell),
          currency: config.currency,
        };
        save({ type: `${prefix}/${key}`, buy: rawBuy, sell: rawSell, currency: config.currency }).catch(() => {});
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
