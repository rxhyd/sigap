export type TileCoords = { x: number; y: number; z: number };

export function latLonToTile(lat: number, lon: number, zoom: number): TileCoords {
  const latRad = (lat * Math.PI) / 180;
  const n = 2 ** zoom;
  const x = Math.floor(((lon + 180) / 360) * n);
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  return { x, y, z: zoom };
}

export function tileImageUrl({ x, y, z }: TileCoords): string {
  return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
}

/** Position (in %) of a lat/lon point within its own tile, for overlaying a marker dot. */
export function positionWithinTile(lat: number, lon: number, zoom: number): { leftPct: number; topPct: number } {
  const latRad = (lat * Math.PI) / 180;
  const n = 2 ** zoom;
  const xFrac = ((lon + 180) / 360) * n;
  const yFrac = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  return {
    leftPct: (xFrac - Math.floor(xFrac)) * 100,
    topPct: (yFrac - Math.floor(yFrac)) * 100,
  };
}
