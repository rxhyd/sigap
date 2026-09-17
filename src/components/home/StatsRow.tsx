"use client";

import { Activity, Flame } from "lucide-react";
import { useDisasterData } from "@/hooks/useDisasterData";

export function StatsRow() {
  const { earthquakes, earthquakesLoading, hotspots, hotspotsLoading } = useDisasterData();

  const hotspotCount = hotspots.status === "ok" ? hotspots.data.length : null;

  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      <StatCard
        icon={Activity}
        label="Gempa terkini"
        value={earthquakesLoading ? "…" : earthquakes.length}
        accent="text-amber-600 bg-amber-500/10"
      />
      <StatCard
        icon={Flame}
        label="Titik api terpantau"
        value={hotspotsLoading ? "…" : (hotspotCount ?? "-")}
        accent="text-orange-600 bg-orange-500/10"
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Activity;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 shadow-sm">
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${accent}`}>
        <Icon className="size-4.5" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold leading-tight">{value}</span>
        <span className="text-[11px] text-muted-foreground leading-tight">{label}</span>
      </div>
    </div>
  );
}
