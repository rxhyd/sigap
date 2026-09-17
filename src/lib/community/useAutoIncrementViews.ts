"use client";

import { useEffect } from "react";
import { bumpOwnThreadViews } from "@/lib/community/store";

/** Simulates organic view growth for the user's own local thread while it's on screen. */
export function useAutoIncrementViews(threadId: string, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      const delay = 3000 + Math.random() * 5000;
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        const amount = 1 + Math.floor(Math.random() * 4);
        bumpOwnThreadViews(threadId, amount);
        scheduleNext();
      }, delay);
    }

    scheduleNext();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [threadId, enabled]);
}
