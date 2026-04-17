import { EURO_MAP } from "@/lib/quotes";
import { handleAllQuotes } from "@/lib/routeHelpers";

export async function GET() {
  return handleAllQuotes(EURO_MAP, "euro");
}
