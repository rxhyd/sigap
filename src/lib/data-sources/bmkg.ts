import { z } from "zod";
import type { EarthquakeEvent } from "@/lib/types/earthquake";

const gempaSchema = z.object({
  Tanggal: z.string(),
  Jam: z.string(),
  DateTime: z.string(),
  Coordinates: z.string(),
  Lintang: z.string(),
  Bujur: z.string(),
  Magnitude: z.string(),
  Kedalaman: z.string(),
  Wilayah: z.string(),
  Potensi: z.string().optional(),
});

const autogempaSchema = z.object({
  Infogempa: z.object({
    gempa: gempaSchema,
  }),
});

const gempaterkiniSchema = z.object({
  Infogempa: z.object({
    gempa: z.array(gempaSchema),
  }),
});

function parseCoordinate(raw: string): number {
  // BMKG format e.g. "1.11 LS" or "122.79 BT"
  const value = Number.parseFloat(raw);
  if (raw.toUpperCase().includes("LS") || raw.toUpperCase().includes("LU")) {
    return raw.toUpperCase().includes("LS") ? -Math.abs(value) : Math.abs(value);
  }
  if (raw.toUpperCase().includes("BB")) {
    return -Math.abs(value);
  }
  return value;
}

function toEarthquakeEvent(raw: z.infer<typeof gempaSchema>): EarthquakeEvent {
  const [latRaw, lonRaw] = raw.Coordinates.split(",");
  const latitude = parseCoordinate(raw.Lintang) || Number.parseFloat(latRaw);
  const longitude = parseCoordinate(raw.Bujur) || Number.parseFloat(lonRaw);
  const depthMatch = raw.Kedalaman.match(/[\d.]+/);

  return {
    id: `${raw.DateTime}-${raw.Lintang}-${raw.Bujur}`,
    magnitude: Number.parseFloat(raw.Magnitude),
    depthKm: depthMatch ? Number.parseFloat(depthMatch[0]) : null,
    latitude,
    longitude,
    region: raw.Wilayah,
    occurredAt: raw.DateTime,
    potensi: raw.Potensi ?? null,
  };
}

const AUTOGEMPA_URL = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json";
const GEMPATERKINI_URL = "https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json";

export async function fetchLatestEarthquake(): Promise<EarthquakeEvent | null> {
  const res = await fetch(AUTOGEMPA_URL, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const json = await res.json();
  const parsed = autogempaSchema.safeParse(json);
  if (!parsed.success) return null;
  return toEarthquakeEvent(parsed.data.Infogempa.gempa);
}

export async function fetchRecentEarthquakes(): Promise<EarthquakeEvent[]> {
  const res = await fetch(GEMPATERKINI_URL, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  const json = await res.json();
  const parsed = gempaterkiniSchema.safeParse(json);
  if (!parsed.success) return [];
  return parsed.data.Infogempa.gempa.map(toEarthquakeEvent);
}
