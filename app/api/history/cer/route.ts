import { NextResponse } from "next/server";
import { fetchBCRAVariable, BCRA_VARIABLE_IDS } from "@/lib/providers";
import {
  buildDailyHistory,
  buildMonthlyHistory,
  getDateTime,
} from "@/lib/utils";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const granularity = url.searchParams.get("granularity") ?? "monthly";

  try {
    // BCRA returns newest-first; buildDailyHistory / buildMonthlyHistory sort ascending
    const raw = await fetchBCRAVariable(BCRA_VARIABLE_IDS.cer);
    const points =
      granularity === "daily"
        ? buildDailyHistory(raw, 365)
        : buildMonthlyHistory(raw, 60);

    return NextResponse.json({ date: getDateTime(), granularity, points });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch CER history" },
      { status: 500 },
    );
  }
}
