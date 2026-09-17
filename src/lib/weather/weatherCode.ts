import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  type LucideIcon,
} from "lucide-react";

type WeatherMeta = { icon: LucideIcon; label: string };

export function weatherCodeMeta(code: number): WeatherMeta {
  if (code === 0) return { icon: Sun, label: "Cerah" };
  if (code === 1 || code === 2) return { icon: CloudSun, label: "Cerah Berawan" };
  if (code === 3) return { icon: Cloud, label: "Berawan" };
  if (code === 45 || code === 48) return { icon: CloudFog, label: "Berkabut" };
  if (code >= 51 && code <= 57) return { icon: CloudDrizzle, label: "Gerimis" };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { icon: CloudRain, label: "Hujan" };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { icon: CloudSnow, label: "Salju" };
  if (code >= 95) return { icon: CloudLightning, label: "Badai Petir" };
  return { icon: Cloud, label: "Berawan" };
}

export function formatShortDayId(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(new Date(iso));
}

export function formatHourId(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}
