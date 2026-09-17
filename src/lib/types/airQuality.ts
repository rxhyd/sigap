export type AirQualityLevel = "baik" | "sedang" | "tidak-sehat" | "sangat-tidak-sehat" | "berbahaya";

export type AirQualityReading = {
  stationName: string;
  aqi: number; // AQICN air quality index (US EPA scale)
  dominantPollutant: string;
  level: AirQualityLevel;
  measuredAt: string; // ISO string
  distanceKm: number | null;
};
