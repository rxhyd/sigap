"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import { useDisasterData } from "@/hooks/useDisasterData";
import { useGeolocation } from "@/lib/geo/useGeolocation";
import { useAlertRadiusKm } from "@/lib/geo/useAlertRadiusKm";
import { magnitudeColor, magnitudeRadius, formatDateTimeId } from "@/lib/geo/markerStyle";

const INDONESIA_CENTER: [number, number] = [-2.5, 118];

function hotspotRadius(count: number): number {
  return Math.max(4, Math.min(14, 4 + Math.log2(count) * 2));
}

function RecenterOnLocation({ latitude, longitude, enabled }: { latitude: number; longitude: number; enabled: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (enabled) map.setView([latitude, longitude], 9);
  }, [enabled, latitude, longitude, map]);
  return null;
}

export function DisasterMapView() {
  const { earthquakes, hotspots } = useDisasterData();
  const { state: geoState, coords, isFallback } = useGeolocation();
  const alertRadiusKm = useAlertRadiusKm();

  const hotspotList = hotspots.status === "ok" ? hotspots.data : [];

  return (
    <MapContainer
      center={INDONESIA_CENTER}
      zoom={5}
      scrollWheelZoom={false}
      preferCanvas
      className="h-64 w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterOnLocation latitude={coords.latitude} longitude={coords.longitude} enabled={geoState.status === "granted"} />

      {!isFallback && (
        <>
          <CircleMarker center={[coords.latitude, coords.longitude]} radius={7} pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.9 }}>
            <Popup>Posisi Anda</Popup>
          </CircleMarker>
          <Circle
            center={[coords.latitude, coords.longitude]}
            radius={alertRadiusKm * 1000}
            pathOptions={{ color: "#3b82f6", fillOpacity: 0.05, dashArray: "4 4" }}
          />
        </>
      )}

      {earthquakes.map((eq) => (
        <CircleMarker
          key={eq.id}
          center={[eq.latitude, eq.longitude]}
          radius={magnitudeRadius(eq.magnitude)}
          pathOptions={{ color: magnitudeColor(eq.magnitude), fillColor: magnitudeColor(eq.magnitude), fillOpacity: 0.6 }}
        >
          <Popup>
            <div className="flex flex-col gap-0.5 text-sm">
              <span className="font-semibold">Magnitudo {eq.magnitude.toFixed(1)}</span>
              <span>{eq.region}</span>
              <span className="text-xs text-muted-foreground">{formatDateTimeId(eq.occurredAt)}</span>
              {eq.depthKm !== null && <span className="text-xs">Kedalaman: {eq.depthKm} km</span>}
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {hotspotList.map((hotspot) => (
        <CircleMarker
          key={hotspot.id}
          center={[hotspot.latitude, hotspot.longitude]}
          radius={hotspotRadius(hotspot.count)}
          pathOptions={{ color: "#c2410c", fillColor: "#f97316", fillOpacity: 0.7 }}
        >
          <Popup>
            <div className="flex flex-col gap-0.5 text-sm">
              <span className="font-semibold">Titik Panas (Kebakaran)</span>
              {hotspot.count > 1 && (
                <span className="text-xs">{hotspot.count} deteksi satelit tergabung di area ini</span>
              )}
              <span className="text-xs text-muted-foreground">Terakhir: {formatDateTimeId(hotspot.acquiredAt)}</span>
              {hotspot.confidence !== null && <span className="text-xs">Confidence: {hotspot.confidence}</span>}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
