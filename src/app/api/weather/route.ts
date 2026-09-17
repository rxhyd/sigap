import { fetchWeatherForecast } from "@/lib/data-sources/weather";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number.parseFloat(searchParams.get("lat") ?? "");
  const lon = Number.parseFloat(searchParams.get("lon") ?? "");

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return Response.json({ status: "error", message: "Parameter lat/lon tidak valid" }, { status: 400 });
  }

  const result = await fetchWeatherForecast(lat, lon);
  return Response.json(result);
}
