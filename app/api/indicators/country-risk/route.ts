import { NextResponse } from "next/server";
import { fetchCountryRisk } from "@/lib/argentinadatosService";
import { getDateTime } from "@/lib/utils";

export async function GET() {
  try {
    const data = await fetchCountryRisk();
    if (!data.length) {
      return NextResponse.json({ error: "No data available" }, { status: 503 });
    }
    const latest = data[data.length - 1];
    return NextResponse.json({
      date: getDateTime(),
      value: latest.valor.toString(),
      currency: "USD",
      lastUpdate: latest.fecha,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch country risk" },
      { status: 500 },
    );
  }
}
