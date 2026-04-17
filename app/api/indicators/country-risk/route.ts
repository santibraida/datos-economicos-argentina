import { NextResponse } from "next/server";
import { fetchCountryRisk } from "@/lib/providers";
import { getDateTime } from "@/lib/utils";

export async function GET() {
  try {
    const data = await fetchCountryRisk();
    if (!data.length) {
      return NextResponse.json({ error: "No data available" }, { status: 503 });
    }
    const latest = data.at(-1)!
    return NextResponse.json({
      date: getDateTime(),
      type: "country-risk",
      value: latest.valor.toString(),
      unit: "bps",
      lastUpdate: latest.fecha,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch country risk" },
      { status: 500 },
    );
  }
}
