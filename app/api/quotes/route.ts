import { NextResponse } from "next/server";
import { fetchDolarSi } from "@/lib/providers";

export async function GET() {
  try {
    const data = await fetchDolarSi();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 },
    );
  }
}
