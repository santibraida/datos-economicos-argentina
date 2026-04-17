import { DOLLAR_MAP } from "@/lib/quotes";
import { handleAllQuotes } from "@/lib/routeHelpers";

export async function GET() {
  return handleAllQuotes(DOLLAR_MAP, "dollar");
}
