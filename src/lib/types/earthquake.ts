export type EarthquakeEvent = {
  id: string;
  magnitude: number;
  depthKm: number | null;
  latitude: number;
  longitude: number;
  region: string;
  occurredAt: string; // ISO string
  potensi: string | null;
};
