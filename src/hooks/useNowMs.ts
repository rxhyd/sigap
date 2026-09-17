"use client";

import { useSyncExternalStore } from "react";

let cachedNow = Date.now();

function subscribe(callback: () => void) {
  const id = setInterval(() => {
    cachedNow = Date.now();
    callback();
  }, 60_000);
  return () => clearInterval(id);
}

function getSnapshot() {
  return cachedNow;
}

function getServerSnapshot() {
  return 0;
}

/** Current time in ms, refreshed every minute. Snapshot only changes when the interval
 * ticks (and notifies), so it stays stable between renders as useSyncExternalStore requires —
 * calling Date.now() directly as the snapshot would change on every check and loop forever. */
export function useNowMs(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
