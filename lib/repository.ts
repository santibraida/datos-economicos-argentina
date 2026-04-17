import { prisma } from "./db";
import { getDateTime, formatNumber } from "./utils";
import type { SimpleQuote, IndicatorResponse } from "./types";

const DEFAULT_TTL_MS = Number(process.env.CACHE_TTL_MS ?? 300_000);

type SaveQuoteInput = {
  type: string;
  buy?: string;
  sell?: string;
  value?: string;
  currency: string;
};

export async function getCached(type: string, ttlMs = DEFAULT_TTL_MS) {
  const since = new Date(Date.now() - ttlMs);
  return prisma.quote.findFirst({
    where: { type, createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
  });
}

export async function save(data: SaveQuoteInput) {
  return prisma.quote.create({ data });
}

export function toSimpleResponse(row: {
  buy: string | null;
  sell: string | null;
  currency: string;
}): SimpleQuote {
  return {
    date: getDateTime(),
    buy: formatNumber(row.buy),
    sell: formatNumber(row.sell),
    currency: row.currency,
  };
}

export function toIndicatorResponse(row: {
  value: string | null;
  currency: string;
}): IndicatorResponse {
  return {
    date: getDateTime(),
    value: formatNumber(row.value),
    currency: row.currency,
  };
}

export async function getHistory(type: string, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.quote.findMany({
      where: { type },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.quote.count({ where: { type } }),
  ]);
  return { items, total };
}
