import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Per-bank rates are not available from the current data source." },
    { status: 503 },
  );
}
