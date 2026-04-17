import { NextResponse } from "next/server";
import { fetchCotizacionHistory } from "@/lib/providers";
import { buildMonthlyEvolution, getDateTime } from "@/lib/utils";

export async function GET() {
  try {
    const data = await fetchCotizacionHistory();
    const realEntries = data
      .filter((e) => e.moneda === "BRL")
      .map((e) => ({ venta: e.venta, fecha: e.fecha }));
    const months = buildMonthlyEvolution(realEntries);
    return NextResponse.json({ date: getDateTime(), type: "real", months });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch evolution" },
      { status: 500 },
    );
  }
}
