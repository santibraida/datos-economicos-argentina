import { NextResponse } from "next/server";
import { fetchCotizacionHistory } from "@/lib/argentinadatosService";
import { buildMonthlyEvolution, getDateTime } from "@/lib/utils";

export async function GET() {
  try {
    const data = await fetchCotizacionHistory();
    const euroEntries = data
      .filter((e) => e.moneda === "EUR")
      .map((e) => ({ venta: e.venta, fecha: e.fecha }));
    const months = buildMonthlyEvolution(euroEntries);
    return NextResponse.json({ date: getDateTime(), currency: "EUR", months });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch evolution" },
      { status: 500 },
    );
  }
}
