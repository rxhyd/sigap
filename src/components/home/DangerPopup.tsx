"use client";

import { AlertTriangle, Flame, Activity, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDisasterData } from "@/hooks/useDisasterData";
import { useGeolocation } from "@/lib/geo/useGeolocation";
import { useAlertRadiusKm } from "@/lib/geo/useAlertRadiusKm";
import { findWithinRadius } from "@/lib/geo/proximity";
import { useLocalStorageRaw, setLocalStorageItem } from "@/lib/storage/useLocalStorage";

export const DANGER_POPUP_DISMISSED_KEY = "sigap:danger-popup:dismissed-location";

function locationKey(lat: number, lon: number): string {
  // ~1.1km grid — small GPS jitter at the same spot won't retrigger the popup,
  // but a real move to a different area will.
  return `${lat.toFixed(2)},${lon.toFixed(2)}`;
}

export function DangerPopup() {
  const { earthquakes, hotspots, earthquakesLoading, hotspotsLoading } = useDisasterData();
  const { state: geoState, coords, isFallback } = useGeolocation();
  const radiusKm = useAlertRadiusKm();
  const dismissedKey = useLocalStorageRaw(DANGER_POPUP_DISMISSED_KEY);

  const dataReady = geoState.status === "granted" && !isFallback && !earthquakesLoading && !hotspotsLoading;
  const hotspotList = hotspots.status === "ok" ? hotspots.data : [];

  const nearbyEarthquakes = dataReady ? findWithinRadius(earthquakes, (e) => e, coords, radiusKm) : [];
  const nearbyHotspots = dataReady ? findWithinRadius(hotspotList, (h) => h, coords, radiusKm) : [];
  const hasDanger = nearbyEarthquakes.length > 0 || nearbyHotspots.length > 0;

  const currentKey = dataReady ? locationKey(coords.latitude, coords.longitude) : null;
  const alreadyDismissedHere = currentKey !== null && dismissedKey === currentKey;

  const open = dataReady && hasDanger && !alreadyDismissedHere;

  function handleClose() {
    if (currentKey) setLocalStorageItem(DANGER_POPUP_DISMISSED_KEY, currentKey);
  }

  const nearestEarthquake = nearbyEarthquakes[0];
  const nearestHotspot = nearbyHotspots[0];

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent showCloseButton={false} className="overflow-hidden border-destructive/30 p-0">
        <div className="flex flex-col items-center gap-2 bg-gradient-to-b from-destructive/15 via-destructive/5 to-transparent px-4 pt-6 pb-4 text-center">
          <span className="relative flex size-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive/20" />
            <ShieldAlert className="relative size-7" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-destructive">PERINGATAN BAHAYA</span>
          <span className="text-xs text-muted-foreground">
            Terdeteksi kejadian dalam radius waspada {radiusKm} km dari lokasi Anda saat ini.
          </span>
        </div>

        <div className="flex flex-col gap-3 px-4 pb-4">
          {nearestEarthquake && (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5">
              <Activity className="mt-0.5 size-4 shrink-0 text-destructive" />
              <div className="flex flex-col gap-0.5 text-xs">
                <span className="font-semibold text-destructive">
                  Gempa M{nearestEarthquake.item.magnitude.toFixed(1)} &middot; {nearestEarthquake.distanceKm.toFixed(1)} km dari Anda
                </span>
                <span className="text-muted-foreground">{nearestEarthquake.item.region}</span>
              </div>
            </div>
          )}

          {nearestHotspot && (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5">
              <Flame className="mt-0.5 size-4 shrink-0 text-destructive" />
              <div className="flex flex-col gap-0.5 text-xs">
                <span className="font-semibold text-destructive">
                  {nearbyHotspots.length} titik kebakaran &middot; terdekat {nearestHotspot.distanceKm.toFixed(1)} km dari Anda
                </span>
                <span className="text-muted-foreground">Waspada kabut asap di sekitar lokasi Anda.</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5 rounded-lg bg-muted/60 px-3 py-2.5 text-xs">
            <span className="flex items-center gap-1.5 font-semibold">
              <AlertTriangle className="size-3.5 text-primary" />
              Upaya yang disarankan
            </span>
            <ul className="list-disc pl-4 text-muted-foreground [&>li]:mt-0.5">
              {nearestEarthquake && (
                <>
                  <li>Jauhi bangunan, kaca, dan benda yang berpotensi roboh.</li>
                  <li>Cari tempat terbuka dan waspada gempa susulan.</li>
                </>
              )}
              {nearestHotspot && (
                <>
                  <li>Gunakan masker saat beraktivitas di luar ruangan.</li>
                  <li>Siapkan jalur evakuasi jika kabut asap makin pekat.</li>
                </>
              )}
              <li>Pantau menu Bencana &amp; ikuti arahan resmi BMKG/BNPB setempat.</li>
            </ul>
          </div>

          <Button onClick={handleClose} variant="destructive" size="lg" className="w-full">
            Saya Mengerti
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
