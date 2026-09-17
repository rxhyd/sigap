import { fetchForestFireHotspots } from "@/lib/data-sources/firms";

export async function GET() {
  const result = await fetchForestFireHotspots();
  return Response.json(result);
}
