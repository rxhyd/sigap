import { z } from "zod";
import { distanceKm } from "@/lib/geo/proximity";
import type { AirQualityLevel, AirQualityReading } from "@/lib/types/airQuality";
import type { DataResult } from "@/lib/types/result";

const waqiOkSchema = z.object({
  status: z.literal("ok"),
  data: z.object({
    aqi: z.union([z.number(), z.literal("-")]),
    dominentpol: z.string().optional(),
    city: z.object({
      name: z.string(),
      geo: z.tuple([z.number(), z.number()]),
    }),
    time: z.object({ iso: z.string() }),
  }),
});

const waqiErrorSchema = z.object({
  status: z.literal("error"),
  data: z.string(),
});

function levelFromAqi(aqi: number): AirQualityLevel {
  if (aqi <= 50) return "baik";
  if (aqi <= 100) return "sedang";
  if (aqi <= 150) return "tidak-sehat";
  if (aqi <= 200) return "sangat-tidak-sehat";
  return "berbahaya";
}

export async function fetchNearestAirQuality(
  latitude: number,
  longitude: number
): Promise<DataResult<AirQualityReading>> {
  const apiKey = process.env.WAQI_API_KEY;
  if (!apiKey) {
    return { status: "missing-key" };
  }

  try {
    const res = await fetch(
      `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${apiKey}`,
      { next: { revalidate: 600 } }
    );
    if (!res.ok) {
      return { status: "error", message: `WAQI API mengembalikan status ${res.status}` };
    }
    const json = await res.json();

    const errorParsed = waqiErrorSchema.safeParse(json);
    if (errorParsed.success) {
      return { status: "error", message: errorParsed.data.data };
    }

    const parsed = waqiOkSchema.safeParse(json);
    if (!parsed.success) {
      return { status: "error", message: "Format respons WAQI tidak dikenali" };
    }

    const { aqi, dominentpol, city, time } = parsed.data.data;
    if (aqi === "-") {
      return { status: "error", message: "Data kualitas udara belum tersedia di stasiun terdekat" };
    }

    return {
      status: "ok",
      data: {
        stationName: city.name,
        aqi,
        dominantPollutant: dominentpol ?? "-",
        level: levelFromAqi(aqi),
        measuredAt: time.iso,
        distanceKm: distanceKm(latitude, longitude, city.geo[0], city.geo[1]),
      },
    };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Gagal mengambil data kualitas udara",
    };
  }
}
