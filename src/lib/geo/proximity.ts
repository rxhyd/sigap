import { point, distance } from "@turf/turf";

export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  return distance(point([lon1, lat1]), point([lon2, lat2]), { units: "kilometers" });
}

export type ProximityMatch<T> = {
  item: T;
  distanceKm: number;
};

export function findWithinRadius<T>(
  items: T[],
  getLatLng: (item: T) => { latitude: number; longitude: number },
  origin: { latitude: number; longitude: number },
  radiusKm: number
): ProximityMatch<T>[] {
  return items
    .map((item) => {
      const { latitude, longitude } = getLatLng(item);
      return { item, distanceKm: distanceKm(origin.latitude, origin.longitude, latitude, longitude) };
    })
    .filter((match) => match.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
