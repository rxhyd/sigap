export type FireHotspot = {
  id: string;
  latitude: number;
  longitude: number;
  brightness: number | null;
  confidence: number | string | null;
  acquiredAt: string; // ISO string
  count: number; // number of raw satellite detections merged into this point
};
