"use client";

import { useEffect, useState } from "react";
import { Wind } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useGeolocation } from "@/lib/geo/useGeolocation";
import { formatDateTimeId } from "@/lib/geo/markerStyle";
import type { AirQualityLevel, AirQualityReading } from "@/lib/types/airQuality";
import type { DataResult } from "@/lib/types/result";

const LEVEL_META: Record<AirQualityLevel, { label: string; color: string }> = {
  baik: { label: "Baik", color: "#22c55e" },
  sedang: { label: "Sedang", color: "#eab308" },
  "tidak-sehat": { label: "Tidak Sehat", color: "#f97316" },
  "sangat-tidak-sehat": { label: "Sangat Tidak Sehat", color: "#ef4444" },
  berbahaya: { label: "Berbahaya", color: "#7c2d12" },
};

const LEVEL_ORDER: AirQualityLevel[] = ["baik", "sedang", "tidak-sehat", "sangat-tidak-sehat", "berbahaya"];

export function AirQualityGauge() {
  const { state: geoState, coords } = useGeolocation();
  const [result, setResult] = useState<DataResult<AirQualityReading> | null>(null);

  useEffect(() => {
    if (geoState.status === "loading") return;

    let cancelled = false;
    fetch(`/api/air-quality?lat=${coords.latitude}&lon=${coords.longitude}`)
      .then((res) => res.json())
      .then((data: DataResult<AirQualityReading>) => {
        if (!cancelled) setResult(data);
      })
      .catch(() => {
        if (!cancelled) setResult({ status: "error", message: "Gagal memuat data kualitas udara" });
      });

    return () => {
      cancelled = true;
    };
  }, [geoState.status, coords.latitude, coords.longitude]);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Wind className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Kualitas Udara</h2>
        </div>

        {result === null && <Skeleton className="h-14 w-full" />}

        {result?.status === "missing-key" && (
          <p className="text-xs text-muted-foreground">API key WAQI belum diisi di server.</p>
        )}

        {result?.status === "error" && <p className="text-xs text-muted-foreground">{result.message}</p>}

        {result?.status === "ok" && <AirQualityBar reading={result.data} />}
      </CardContent>
    </Card>
  );
}

function AirQualityBar({ reading }: { reading: AirQualityReading }) {
  const meta = LEVEL_META[reading.level];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        {LEVEL_ORDER.map((level) => (
          <div
            key={level}
            className="flex-1"
            style={{
              backgroundColor: LEVEL_META[level].color,
              opacity: level === reading.level ? 1 : 0.25,
            }}
          />
        ))}
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold" style={{ color: meta.color }}>
          {meta.label}
        </span>
        <span className="text-xs text-muted-foreground">
          AQI {reading.aqi} &middot; Dominan: {reading.dominantPollutant.toUpperCase()}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Stasiun terdekat: {reading.stationName}
        {reading.distanceKm !== null && ` (${reading.distanceKm.toFixed(1)} km)`}
      </p>
      <p className="text-xs text-muted-foreground">Data per: {formatDateTimeId(reading.measuredAt)}</p>
    </div>
  );
}
