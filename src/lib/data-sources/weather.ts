import { z } from "zod";
import type { WeatherForecastData } from "@/lib/types/weather";
import type { DataResult } from "@/lib/types/result";

const forecastSchema = z.object({
  current: z.object({
    time: z.string(),
    temperature_2m: z.number(),
    weather_code: z.number(),
    relative_humidity_2m: z.number().optional(),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    weather_code: z.array(z.number()),
    temperature_2m: z.array(z.number()),
  }),
  daily: z.object({
    time: z.array(z.string()),
    weather_code: z.array(z.number()),
    temperature_2m_max: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
  }),
});

const HOURLY_ITEMS = 24;

export async function fetchWeatherForecast(
  latitude: number,
  longitude: number
): Promise<DataResult<WeatherForecastData>> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,weather_code,relative_humidity_2m` +
    `&hourly=temperature_2m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&forecast_days=7`;

  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) {
      return { status: "error", message: `Open-Meteo API returned ${res.status}` };
    }
    const json = await res.json();
    const parsed = forecastSchema.safeParse(json);
    if (!parsed.success) {
      return { status: "error", message: "Format respons cuaca tidak dikenali" };
    }

    const { current, hourly, daily } = parsed.data;
    const nowMs = new Date(current.time).getTime();

    const upcomingHourly = hourly.time
      .map((time, i) => ({ time, weatherCode: hourly.weather_code[i], tempC: hourly.temperature_2m[i] }))
      .filter((h) => new Date(h.time).getTime() >= nowMs)
      .slice(0, HOURLY_ITEMS);

    return {
      status: "ok",
      data: {
        currentTempC: current.temperature_2m,
        currentWeatherCode: current.weather_code,
        humidity: current.relative_humidity_2m ?? null,
        hourly: upcomingHourly,
        daily: daily.time.map((date, i) => ({
          date,
          weatherCode: daily.weather_code[i],
          tempMaxC: daily.temperature_2m_max[i],
          tempMinC: daily.temperature_2m_min[i],
        })),
      },
    };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Gagal mengambil data cuaca",
    };
  }
}
