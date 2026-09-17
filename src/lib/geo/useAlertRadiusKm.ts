"use client";

import { useMemo } from "react";
import { useLocalStorageRaw } from "@/lib/storage/useLocalStorage";
import { PROFILE_STORAGE_KEY, type StoredProfile } from "@/components/profil/ProfileFormStatic";

export function useAlertRadiusKm(defaultKm = 20): number {
  const raw = useLocalStorageRaw(PROFILE_STORAGE_KEY);

  return useMemo(() => {
    if (!raw) return defaultKm;
    try {
      const profile = JSON.parse(raw) as StoredProfile;
      return profile.alertRadiusKm > 0 ? profile.alertRadiusKm : defaultKm;
    } catch {
      return defaultKm;
    }
  }, [raw, defaultKm]);
}
