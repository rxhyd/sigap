export function magnitudeColor(magnitude: number): string {
  if (magnitude < 4) return "#22c55e";
  if (magnitude < 5) return "#eab308";
  if (magnitude < 6) return "#f97316";
  return "#ef4444";
}

export function magnitudeRadius(magnitude: number): number {
  return Math.max(5, Math.min(16, 4 + magnitude * 1.5));
}

export function formatDateTimeId(iso: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
