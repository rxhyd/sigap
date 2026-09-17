"use client";

import { useEffect, useState } from "react";
import type { EarthquakeEvent } from "@/lib/types/earthquake";
import type { FireHotspot } from "@/lib/types/hotspot";
import type { DataResult } from "@/lib/types/result";

type BmkgResponse = { latest: EarthquakeEvent | null; recent: EarthquakeEvent[] };

export function useDisasterData() {
  const [earthquakes, setEarthquakes] = useState<EarthquakeEvent[]>([]);
  const [earthquakesLoading, setEarthquakesLoading] = useState(true);
  const [hotspots, setHotspots] = useState<DataResult<FireHotspot[]>>({ status: "ok", data: [] });
  const [hotspotsLoading, setHotspotsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/bmkg")
      .then((res) => res.json())
      .then((data: BmkgResponse) => {
        if (!cancelled) setEarthquakes(data.recent ?? []);
      })
      .catch(() => {
        if (!cancelled) setEarthquakes([]);
      })
      .finally(() => {
        if (!cancelled) setEarthquakesLoading(false);
      });

    fetch("/api/firms")
      .then((res) => res.json())
      .then((data: DataResult<FireHotspot[]>) => {
        if (!cancelled) setHotspots(data);
      })
      .catch(() => {
        if (!cancelled) setHotspots({ status: "error", message: "Gagal memuat data hotspot" });
      })
      .finally(() => {
        if (!cancelled) setHotspotsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { earthquakes, earthquakesLoading, hotspots, hotspotsLoading };
}
