import { NextResponse } from "next/server";
import { fetchInflacion } from "@/lib/argentinadatosService";
import { buildMonthlyHistory, getDateTime } from "@/lib/utils";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "60"), 120);

  try {
    const raw = await fetchInflacion();
    const points = buildMonthlyHistory(raw, limit);
    return NextResponse.json({ date: getDateTime(), points });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch IPC history" },
      { status: 500 },
    );
  }
}
