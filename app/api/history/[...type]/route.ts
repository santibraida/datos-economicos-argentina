import { NextResponse } from "next/server";
import { getHistory } from "@/lib/repository";
import { getDateTime } from "@/lib/utils";

const MAX_LIMIT = 100;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ type: string[] }> },
) {
  const { type: segments } = await params;
  const type = segments.join("/");

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(searchParams.get("limit") ?? 20)),
  );

  try {
    const { items, total } = await getHistory(type, page, limit);
    return NextResponse.json({
      type,
      date: getDateTime(),
      page,
      limit,
      total,
      items: items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 },
    );
  }
}
