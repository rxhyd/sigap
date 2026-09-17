import type { FireHotspot } from "@/lib/types/hotspot";
import type { DataResult } from "@/lib/types/result";

// Bounding box roughly covering Indonesia: west,south,east,north
const INDONESIA_BBOX = "95,-11,141,6";
const DAY_RANGE = 2;
// Multiple satellites are queried because a single source can legitimately have
// zero detections for Indonesia within the window while others still do.
const SOURCES = ["VIIRS_SNPP_NRT", "VIIRS_NOAA20_NRT", "MODIS_NRT"] as const;
// During active fire season, raw detections can number in the tens of thousands
// (overlapping satellite passes over the same fire). Grid-cluster them down to a
// count the map/list can render smoothly, biggest clusters first.
const CLUSTER_GRID_DEG = 0.5;
const MAX_CLUSTERS = 400;

function parseCsv(csv: string): FireHotspot[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  const header = lines[0].split(",").map((h) => h.trim());
  const latIdx = header.indexOf("latitude");
  const lonIdx = header.indexOf("longitude");
  // VIIRS uses "bright_ti4", MODIS uses "brightness" for the same kind of value.
  const brightIdx = header.indexOf("bright_ti4") !== -1 ? header.indexOf("bright_ti4") : header.indexOf("brightness");
  const confIdx = header.indexOf("confidence");
  const dateIdx = header.indexOf("acq_date");
  const timeIdx = header.indexOf("acq_time");

  const hotspots: FireHotspot[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < header.length) continue;

    const latitude = Number.parseFloat(cols[latIdx]);
    const longitude = Number.parseFloat(cols[lonIdx]);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) continue;

    const acqDate = cols[dateIdx];
    const acqTime = cols[timeIdx]?.padStart(4, "0") ?? "0000";
    const acquiredAt = `${acqDate}T${acqTime.slice(0, 2)}:${acqTime.slice(2)}:00Z`;

    hotspots.push({
      id: `${latitude}-${longitude}-${acqDate}-${acqTime}`,
      latitude,
      longitude,
      brightness: brightIdx >= 0 ? Number.parseFloat(cols[brightIdx]) : null,
      confidence: confIdx >= 0 ? cols[confIdx] : null,
      acquiredAt,
      count: 1,
    });
  }
  return hotspots;
}

function clusterHotspots(hotspots: FireHotspot[]): FireHotspot[] {
  const buckets = new Map<string, FireHotspot[]>();
  for (const h of hotspots) {
    const key = `${Math.round(h.latitude / CLUSTER_GRID_DEG)},${Math.round(h.longitude / CLUSTER_GRID_DEG)}`;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(h);
    else buckets.set(key, [h]);
  }

  const clusters = Array.from(buckets.values()).map((group) => {
    const latest = group.reduce((a, b) => (a.acquiredAt > b.acquiredAt ? a : b));
    const brightnessValues = group.map((h) => h.brightness).filter((b): b is number => b !== null);

    return {
      id: `cluster-${latest.id}`,
      latitude: group.reduce((sum, h) => sum + h.latitude, 0) / group.length,
      longitude: group.reduce((sum, h) => sum + h.longitude, 0) / group.length,
      brightness: brightnessValues.length > 0 ? Math.max(...brightnessValues) : null,
      confidence: latest.confidence,
      acquiredAt: latest.acquiredAt,
      count: group.reduce((sum, h) => sum + h.count, 0),
    };
  });

  return clusters.sort((a, b) => b.count - a.count).slice(0, MAX_CLUSTERS);
}

async function fetchSource(mapKey: string, source: string): Promise<FireHotspot[] | null> {
  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/${source}/${INDONESIA_BBOX}/${DAY_RANGE}`;
  try {
    const res = await fetch(url, { next: { revalidate: 900 } });
    if (!res.ok) return null;
    const csv = await res.text();
    if (csv.toLowerCase().includes("invalid") || csv.toLowerCase().includes("error")) return null;
    return parseCsv(csv);
  } catch {
    return null;
  }
}

export async function fetchForestFireHotspots(): Promise<DataResult<FireHotspot[]>> {
  const mapKey = process.env.NASA_FIRMS_MAP_KEY;
  if (!mapKey) {
    return { status: "missing-key" };
  }

  const results = await Promise.all(SOURCES.map((source) => fetchSource(mapKey, source)));

  if (results.every((r) => r === null)) {
    return { status: "error", message: "FIRMS API key tidak valid, kuota habis, atau gagal dihubungi" };
  }

  const merged = new Map<string, FireHotspot>();
  for (const list of results) {
    if (!list) continue;
    for (const hotspot of list) merged.set(hotspot.id, hotspot);
  }

  return { status: "ok", data: clusterHotspots(Array.from(merged.values())) };
}
