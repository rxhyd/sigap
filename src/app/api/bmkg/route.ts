import { fetchLatestEarthquake, fetchRecentEarthquakes } from "@/lib/data-sources/bmkg";

export async function GET() {
  const [latest, recent] = await Promise.all([fetchLatestEarthquake(), fetchRecentEarthquakes()]);
  return Response.json({ latest, recent });
}
