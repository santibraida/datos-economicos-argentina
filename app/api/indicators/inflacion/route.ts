import { NextResponse } from "next/server";
import { fetchInflacion } from "@/lib/argentinadatosService";
import { buildMonthlyEvolution, getDateTime } from "@/lib/utils";

export async function GET() {
  try {
    const data = await fetchInflacion();
    const months = buildMonthlyEvolution(
      data.map((e) => ({ venta: e.valor, fecha: e.fecha })),
    );
    return NextResponse.json({ date: getDateTime(), months });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch inflation data" },
      { status: 500 },
    );
  }
}
