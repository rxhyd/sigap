"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True only after the client has hydrated — avoids SSR/client mismatch without an effect+setState. */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
