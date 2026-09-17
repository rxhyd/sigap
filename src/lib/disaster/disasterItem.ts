import type { EarthquakeEvent } from "@/lib/types/earthquake";
import type { FireHotspot } from "@/lib/types/hotspot";

export type DisasterCategory = "earthquake" | "fire";

export type DisasterItem = {
  id: string;
  category: DisasterCategory;
  latitude: number;
  longitude: number;
  timestamp: string; // ISO
  title: string;
  description: string;
  location: string;
  severityLabel: string;
  severityScore: number; // normalized, roughly 0-10, for cross-category sorting
  severityColor: string;
};

function confidenceToScore(confidence: number | string | null): number {
  if (typeof confidence === "number") return Math.min(10, confidence / 10);
  switch (confidence) {
    case "h":
      return 8;
    case "n":
      return 5;
    case "l":
      return 2;
    default:
      return 4;
  }
}

function confidenceLabel(confidence: number | string | null): string {
  if (typeof confidence === "number") return `${confidence}%`;
  switch (confidence) {
    case "h":
      return "Keyakinan Tinggi";
    case "n":
      return "Keyakinan Sedang";
    case "l":
      return "Keyakinan Rendah";
    default:
      return "Belum diketahui";
  }
}

function magnitudeColor(magnitude: number): string {
  if (magnitude < 4) return "#22c55e";
  if (magnitude < 5) return "#eab308";
  if (magnitude < 6) return "#f97316";
  return "#ef4444";
}

export function earthquakeToDisasterItem(eq: EarthquakeEvent): DisasterItem {
  return {
    id: `eq-${eq.id}`,
    category: "earthquake",
    latitude: eq.latitude,
    longitude: eq.longitude,
    timestamp: eq.occurredAt,
    title: `Gempa Magnitudo ${eq.magnitude.toFixed(1)}`,
    description: eq.potensi ?? "Informasi potensi belum tersedia.",
    location: eq.region,
    severityLabel: `M${eq.magnitude.toFixed(1)}${eq.depthKm !== null ? ` · ${eq.depthKm} km` : ""}`,
    severityScore: eq.magnitude,
    severityColor: magnitudeColor(eq.magnitude),
  };
}

export function hotspotToDisasterItem(hotspot: FireHotspot): DisasterItem {
  const clusterNote = hotspot.count > 1 ? ` (gabungan ${hotspot.count} deteksi satelit)` : "";
  return {
    id: `hs-${hotspot.id}`,
    category: "fire",
    latitude: hotspot.latitude,
    longitude: hotspot.longitude,
    timestamp: hotspot.acquiredAt,
    title: "Titik Panas Kebakaran",
    description:
      (hotspot.brightness !== null
        ? `Suhu kecerahan terdeteksi ${hotspot.brightness.toFixed(1)} K oleh satelit.`
        : "Titik panas terdeteksi oleh satelit.") + clusterNote,
    location: `${hotspot.latitude.toFixed(3)}, ${hotspot.longitude.toFixed(3)}`,
    severityLabel: confidenceLabel(hotspot.confidence),
    severityScore: confidenceToScore(hotspot.confidence),
    severityColor: "#f97316",
  };
}
