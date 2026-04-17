import { NextResponse } from "next/server";
import { fetchUVA } from "@/lib/providers";
import {
  buildDailyHistory,
  buildMonthlyHistory,
  getDateTime,
} from "@/lib/utils";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const granularity = url.searchParams.get("granularity") ?? "monthly";

  try {
    const raw = await fetchUVA();
    const points =
      granularity === "daily"
        ? buildDailyHistory(raw, 365)
        : buildMonthlyHistory(raw, 60);

    return NextResponse.json({ date: getDateTime(), granularity, points });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch UVA history" },
      { status: 500 },
    );
  }
}
