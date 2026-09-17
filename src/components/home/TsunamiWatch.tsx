"use client";

import { Waves, ShieldCheck } from "lucide-react";
import { useDisasterData } from "@/hooks/useDisasterData";
import { hasTsunamiPotential } from "@/lib/geo/tsunami";
import { formatDateTimeId } from "@/lib/geo/markerStyle";

export function TsunamiWatch() {
  const { earthquakes, earthquakesLoading } = useDisasterData();

  if (earthquakesLoading) return null;

  const tsunamiWatch = earthquakes.filter((eq) => hasTsunamiPotential(eq.potensi));

  if (tsunamiWatch.length === 0) {
    return (
      <div className="mx-4 flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-secondary-foreground">
        <ShieldCheck className="size-4 shrink-0 text-primary" />
        Tidak ada potensi tsunami dari gempa terkini (berdasarkan status resmi BMKG).
      </div>
    );
  }

  return (
    <div className="mx-4 flex flex-col gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
      <div className="flex items-center gap-2 font-semibold">
        <Waves className="size-4 shrink-0" />
        Peringatan: {tsunamiWatch.length} gempa berpotensi tsunami
      </div>
      <div className="flex flex-col gap-1">
        {tsunamiWatch.slice(0, 3).map((eq) => (
          <span key={eq.id}>
            M{eq.magnitude.toFixed(1)} — {eq.region} &middot; {formatDateTimeId(eq.occurredAt)}
          </span>
        ))}
      </div>
      <span className="font-medium">
        Jika Anda berada di pesisir, segera menuju dataran tinggi dan ikuti arahan BMKG/BNPB.
      </span>
    </div>
  );
}
