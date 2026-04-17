import { REAL_MAP } from "@/lib/quotes";
import { handleAllQuotes } from "@/lib/routeHelpers";

export async function GET() {
  return handleAllQuotes(REAL_MAP, "real");
}
