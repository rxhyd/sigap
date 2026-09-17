"use client";

import { useSyncExternalStore } from "react";

const LOCAL_EVENT = "sigap:local-storage";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LOCAL_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCAL_EVENT, callback);
  };
}

function getServerSnapshot() {
  return null;
}

/**
 * Reads a localStorage key as a raw string, kept in sync via useSyncExternalStore
 * (SSR-safe: returns null on the server, then syncs to the real value right after hydration).
 * Also re-renders on same-tab writes made via `setLocalStorageItem`/`removeLocalStorageItem`
 * below, since the native `storage` event only fires in *other* tabs.
 */
export function useLocalStorageRaw(key: string): string | null {
  return useSyncExternalStore(subscribe, () => localStorage.getItem(key), getServerSnapshot);
}

export function setLocalStorageItem(key: string, value: string) {
  localStorage.setItem(key, value);
  window.dispatchEvent(new Event(LOCAL_EVENT));
}

export function removeLocalStorageItem(key: string) {
  localStorage.removeItem(key);
  window.dispatchEvent(new Event(LOCAL_EVENT));
}
