"use client";

import { useMemo } from "react";
import { useLocalStorageRaw } from "@/lib/storage/useLocalStorage";
import { PROFILE_STORAGE_KEY, type StoredProfile } from "@/components/profil/ProfileFormStatic";

function greetingForHour(hour: number): string {
  if (hour < 10) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
}

export function WelcomeHeader() {
  const raw = useLocalStorageRaw(PROFILE_STORAGE_KEY);

  const name = useMemo(() => {
    if (!raw) return null;
    try {
      const profile = JSON.parse(raw) as StoredProfile;
      return profile.name || null;
    } catch {
      return null;
    }
  }, [raw]);

  const greeting = useMemo(() => greetingForHour(new Date().getHours()), []);

  return (
    <header className="flex flex-col gap-1 bg-gradient-to-br from-primary to-orange-700 px-4 pt-5 pb-6">
      <p className="text-sm text-white/80">{greeting}</p>
      <p className="text-xl font-bold text-white">{name ?? "Pengguna"}</p>
    </header>
  );
}
