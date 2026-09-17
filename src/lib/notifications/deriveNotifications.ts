import type { EarthquakeEvent } from "@/lib/types/earthquake";
import type { FireHotspot } from "@/lib/types/hotspot";

export type NotificationItem = {
  id: string;
  kind: "earthquake" | "hotspot";
  title: string;
  description: string;
  timestamp: string; // ISO
};

const MAX_ITEMS = 15;

export function deriveNotifications(
  earthquakes: EarthquakeEvent[],
  hotspots: FireHotspot[]
): NotificationItem[] {
  const earthquakeItems: NotificationItem[] = earthquakes.map((eq) => ({
    id: `eq-${eq.id}`,
    kind: "earthquake",
    title: `Gempa M${eq.magnitude.toFixed(1)}`,
    description: eq.region,
    timestamp: eq.occurredAt,
  }));

  const hotspotItems: NotificationItem[] = hotspots.map((h) => ({
    id: `hs-${h.id}`,
    kind: "hotspot",
    title: "Titik Panas Terdeteksi",
    description: `${h.latitude.toFixed(2)}, ${h.longitude.toFixed(2)}`,
    timestamp: h.acquiredAt,
  }));

  return [...earthquakeItems, ...hotspotItems]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, MAX_ITEMS);
}
