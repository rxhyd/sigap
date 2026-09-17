"use client";

import { useEffect, useState } from "react";
import { Cloud, Droplets } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGeolocation } from "@/lib/geo/useGeolocation";
import { weatherCodeMeta, formatShortDayId, formatHourId } from "@/lib/weather/weatherCode";
import type { WeatherForecastData } from "@/lib/types/weather";
import type { DataResult } from "@/lib/types/result";

export function WeatherForecast() {
  const { state: geoState, coords } = useGeolocation();
  const [result, setResult] = useState<DataResult<WeatherForecastData> | null>(null);

  useEffect(() => {
    if (geoState.status === "loading") return;

    let cancelled = false;
    fetch(`/api/weather?lat=${coords.latitude}&lon=${coords.longitude}`)
      .then((res) => res.json())
      .then((data: DataResult<WeatherForecastData>) => {
        if (!cancelled) setResult(data);
      })
      .catch(() => {
        if (!cancelled) setResult({ status: "error", message: "Gagal memuat data cuaca" });
      });

    return () => {
      cancelled = true;
    };
  }, [geoState.status, coords.latitude, coords.longitude]);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Cloud className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Prakiraan Cuaca</h2>
        </div>

        {result === null && <Skeleton className="h-24 w-full" />}
        {result?.status === "error" && <p className="text-xs text-muted-foreground">{result.message}</p>}

        {result?.status === "ok" && <WeatherContent data={result.data} />}
      </CardContent>
    </Card>
  );
}

function WeatherContent({ data }: { data: WeatherForecastData }) {
  const current = weatherCodeMeta(data.currentWeatherCode);
  const CurrentIcon = current.icon;

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <CurrentIcon className="size-10 text-primary" strokeWidth={1.5} />
        <div className="flex flex-col">
          <span className="text-3xl font-bold leading-none">{Math.round(data.currentTempC)}°C</span>
          <span className="text-xs text-muted-foreground">{current.label}</span>
        </div>
        {data.humidity !== null && (
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Droplets className="size-3.5" />
            {data.humidity}%
          </span>
        )}
      </div>

      {data.hourly.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Per Jam</span>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {data.hourly.map((hour, idx) => {
              const meta = weatherCodeMeta(hour.weatherCode);
              const HourIcon = meta.icon;
              return (
                <div
                  key={hour.time}
                  className="flex shrink-0 flex-col items-center gap-1 rounded-lg bg-muted/50 px-2.5 py-2"
                >
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {idx === 0 ? "Now" : formatHourId(hour.time)}
                  </span>
                  <HourIcon className="size-4 text-primary" />
                  <span className="text-[11px] font-semibold">{Math.round(hour.tempC)}°</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Harian</span>
        <div className="grid grid-cols-7 gap-1">
          {data.daily.map((day, idx) => {
            const meta = weatherCodeMeta(day.weatherCode);
            const DayIcon = meta.icon;
            return (
              <div key={day.date} className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 px-0.5 py-2">
                <span className="text-[10px] font-medium text-muted-foreground">
                  {idx === 0 ? "Ini" : formatShortDayId(day.date)}
                </span>
                <DayIcon className="size-4 text-primary" />
                <span className="text-[11px] font-semibold">{Math.round(day.tempMaxC)}°</span>
                <span className="text-[10px] text-muted-foreground">{Math.round(day.tempMinC)}°</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
