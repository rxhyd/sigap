"use client";

import { AlertTriangle, ShieldCheck } from "lucide-react";
import { useDisasterData } from "@/hooks/useDisasterData";
import { useGeolocation } from "@/lib/geo/useGeolocation";
import { useAlertRadiusKm } from "@/lib/geo/useAlertRadiusKm";
import { findWithinRadius } from "@/lib/geo/proximity";
import { removeLocalStorageItem } from "@/lib/storage/useLocalStorage";
import { DANGER_POPUP_DISMISSED_KEY } from "@/components/home/DangerPopup";

export function ProximityAlertBanner() {
  const { earthquakes, hotspots, earthquakesLoading, hotspotsLoading } = useDisasterData();
  const { state: geoState, coords, isFallback } = useGeolocation();
  const radiusKm = useAlertRadiusKm();

  if (geoState.status === "loading" || earthquakesLoading || hotspotsLoading) return null;
  if (geoState.status !== "granted") return null;

  const hotspotList = hotspots.status === "ok" ? hotspots.data : [];

  const nearbyEarthquakes = findWithinRadius(earthquakes, (e) => e, coords, radiusKm);
  const nearbyHotspots = findWithinRadius(hotspotList, (h) => h, coords, radiusKm);

  const totalNearby = nearbyEarthquakes.length + nearbyHotspots.length;

  if (totalNearby === 0) {
    return (
      <div className="mx-4 flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-secondary-foreground">
        <ShieldCheck className="size-4 shrink-0 text-primary" />
        Tidak ada gempa atau titik kebakaran dalam radius {radiusKm} km dari lokasi Anda{isFallback ? " (perkiraan)" : ""}.
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => removeLocalStorageItem(DANGER_POPUP_DISMISSED_KEY)}
      className="mx-4 flex flex-col gap-1 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-left text-xs text-destructive"
    >
      <div className="flex items-center gap-2 font-semibold">
        <AlertTriangle className="size-4 shrink-0" />
        Peringatan: {totalNearby} kejadian dalam radius {radiusKm} km
      </div>
      {nearbyEarthquakes.length > 0 && (
        <span>
          {nearbyEarthquakes.length} gempa terdekat: {nearbyEarthquakes[0].distanceKm.toFixed(1)} km (M
          {nearbyEarthquakes[0].item.magnitude.toFixed(1)})
        </span>
      )}
      {nearbyHotspots.length > 0 && (
        <span>
          {nearbyHotspots.length} titik kebakaran terdekat: {nearbyHotspots[0].distanceKm.toFixed(1)} km
        </span>
      )}
      <span className="mt-0.5 text-[11px] font-medium underline underline-offset-2">Tampilkan detail peringatan</span>
    </button>
  );
}
