"use client";

import dynamic from "next/dynamic";
import { MapPinned } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useDisasterData } from "@/hooks/useDisasterData";

const DisasterMapView = dynamic(
  () => import("@/components/home/DisasterMapView").then((mod) => mod.DisasterMapView),
  { ssr: false, loading: () => <Skeleton className="h-64 w-full rounded-lg" /> }
);

export function DisasterMap() {
  const { hotspots } = useDisasterData();

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <MapPinned className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Peta Bencana</h2>
        </div>

        <div className="isolate overflow-hidden rounded-lg">
          <DisasterMapView />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <LegendDot color="#22c55e" label="Gempa < M4" />
          <LegendDot color="#eab308" label="M4–5" />
          <LegendDot color="#f97316" label="M5–6" />
          <LegendDot color="#ef4444" label="> M6" />
          <LegendDot color="#f97316" outline label="Titik panas" />
        </div>

        {hotspots.status === "missing-key" && (
          <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            Titik hotspot kebakaran belum ditampilkan — API key NASA FIRMS belum diisi di server.
          </p>
        )}
        {hotspots.status === "error" && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{hotspots.message}</p>
        )}
      </CardContent>
    </Card>
  );
}

function LegendDot({ color, label, outline }: { color: string; label: string; outline?: boolean }) {
  return (
    <span className="flex items-center gap-1">
      <span
        className="inline-block size-2.5 rounded-full"
        style={outline ? { border: `2px solid ${color}` } : { backgroundColor: color }}
      />
      {label}
    </span>
  );
}
