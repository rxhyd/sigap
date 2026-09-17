"use client";

import { useEffect, useState } from "react";

export type GeolocationState =
  | { status: "loading" }
  | { status: "granted"; latitude: number; longitude: number }
  | { status: "denied" | "unsupported" | "error"; message: string };

const DEFAULT_LOCATION = { latitude: -6.2088, longitude: 106.8456 }; // Jakarta fallback

function isGeolocationSupported(): boolean {
  return typeof navigator !== "undefined" && "geolocation" in navigator;
}

function initialState(): GeolocationState {
  return isGeolocationSupported()
    ? { status: "loading" }
    : { status: "unsupported", message: "Geolocation tidak didukung browser ini" };
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(initialState);

  useEffect(() => {
    if (!isGeolocationSupported()) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: "granted",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        setState({ status: "denied", message: error.message });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }, []);

  const coords =
    state.status === "granted"
      ? { latitude: state.latitude, longitude: state.longitude }
      : DEFAULT_LOCATION;

  return { state, coords, isFallback: state.status !== "granted" };
}
