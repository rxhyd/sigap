import { latLonToTile, tileImageUrl, positionWithinTile } from "@/lib/geo/staticTile";

const ZOOM = 9;

export function MapThumbnail({
  latitude,
  longitude,
  dotColor = "#ef4444",
}: {
  latitude: number;
  longitude: number;
  dotColor?: string;
}) {
  const tile = latLonToTile(latitude, longitude, ZOOM);
  const { leftPct, topPct } = positionWithinTile(latitude, longitude, ZOOM);

  return (
    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tileImageUrl(tile)}
        alt=""
        aria-hidden
        className="size-full object-cover"
        loading="lazy"
      />
      <span
        className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
        style={{ left: `${leftPct}%`, top: `${topPct}%`, backgroundColor: dotColor }}
      />
    </div>
  );
}
