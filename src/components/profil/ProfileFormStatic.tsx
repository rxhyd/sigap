"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Save, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGeolocation } from "@/lib/geo/useGeolocation";
import { useLocalStorageRaw, setLocalStorageItem, removeLocalStorageItem } from "@/lib/storage/useLocalStorage";
import { markRegisteredCookie, clearRegisteredCookie } from "@/lib/auth/registration";

export const PROFILE_STORAGE_KEY = "sigap:profile";

export type StoredProfile = {
  name: string;
  email: string;
  password: string;
  alertRadiusKm: number;
  savedLatitude: number | null;
  savedLongitude: number | null;
};

const DEFAULT_PROFILE: StoredProfile = {
  name: "",
  email: "",
  password: "",
  alertRadiusKm: 20,
  savedLatitude: null,
  savedLongitude: null,
};

const RADIUS_PRESETS = [10, 20, 50, 100];

function parseProfile(raw: string | null): StoredProfile {
  if (!raw) return DEFAULT_PROFILE;
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

function initialsOf(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function ProfileFormStatic() {
  const raw = useLocalStorageRaw(PROFILE_STORAGE_KEY);
  const initialProfile = useMemo(() => parseProfile(raw), [raw]);

  // Remount the form whenever the persisted value changes (e.g. right after hydration
  // picks up the real localStorage content), so its initial state is always in sync
  // without needing an effect + setState.
  return <ProfileForm key={raw ?? "empty"} initialProfile={initialProfile} />;
}

function ProfileForm({ initialProfile }: { initialProfile: StoredProfile }) {
  const [profile, setProfile] = useState<StoredProfile>(initialProfile);
  const { state: geoState, coords } = useGeolocation();
  const router = useRouter();

  function handleSave() {
    if (!profile.name.trim()) {
      toast.error("Nama tidak boleh kosong");
      return;
    }
    try {
      setLocalStorageItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      markRegisteredCookie();
      toast.success("Tersimpan di perangkat ini", {
        description: "Belum ada akun cloud — data hanya tersimpan lokal di browser ini.",
      });
    } catch {
      toast.error("Gagal menyimpan", { description: "Browser tidak mengizinkan penyimpanan lokal." });
    }
  }

  function handleUseCurrentLocation() {
    if (geoState.status === "granted") {
      setProfile((p) => ({ ...p, savedLatitude: coords.latitude, savedLongitude: coords.longitude }));
      toast.info("Lokasi saat ini digunakan", { description: "Jangan lupa klik Simpan." });
    } else {
      toast.error("Lokasi belum tersedia", {
        description: "Izinkan akses lokasi di browser terlebih dahulu.",
      });
    }
  }

  function handleLogout() {
    try {
      removeLocalStorageItem(PROFILE_STORAGE_KEY);
    } catch {
      // ignore
    }
    clearRegisteredCookie();
    toast.info("Data lokal dihapus");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden border-none bg-gradient-to-br from-primary to-orange-700 text-white shadow-lg">
        <CardContent className="flex items-center gap-4 py-6">
          <Avatar className="size-16 border-2 border-white/40">
            <AvatarFallback className="bg-white/15 text-xl font-semibold text-white">
              {initialsOf(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-lg font-bold">{profile.name || "Pengguna SIGAP"}</span>
            <span className="text-sm text-white/80">{profile.email || "Belum ada email"}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Data Diri</h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              placeholder="Nama Anda"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email (opsional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password untuk masuk di perangkat ini"
              value={profile.password}
              onChange={(e) => setProfile((p) => ({ ...p, password: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Hanya dipakai untuk masuk kembali di perangkat ini, bukan sistem otentikasi cloud yang aman.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">Pengaturan Siaga</h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Radius peringatan</Label>
            <div className="flex flex-wrap gap-2">
              {RADIUS_PRESETS.map((km) => (
                <Button
                  key={km}
                  type="button"
                  size="sm"
                  variant={profile.alertRadiusKm === km ? "default" : "outline"}
                  onClick={() => setProfile((p) => ({ ...p, alertRadiusKm: km }))}
                >
                  {km} km
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Jarak maksimum titik gempa/kebakaran dari lokasi Anda untuk memicu peringatan di halaman Home.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Lokasi tersimpan</Label>
            {profile.savedLatitude !== null && profile.savedLongitude !== null ? (
              <p className="text-sm text-foreground">
                {profile.savedLatitude.toFixed(4)}, {profile.savedLongitude.toFixed(4)}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Belum diatur</p>
            )}
            <Button type="button" variant="outline" size="sm" className="w-fit" onClick={handleUseCurrentLocation}>
              <MapPin className="size-4" />
              Gunakan lokasi saya saat ini
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button type="button" onClick={handleSave} className="w-full" size="lg">
        <Save className="size-4" />
        Simpan Perubahan
      </Button>

      <Button type="button" variant="ghost" className="w-full text-muted-foreground" onClick={handleLogout}>
        <LogOut className="size-4" />
        Hapus data &amp; keluar
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Belum ada akun cloud/login — data hanya tersimpan lokal di perangkat ini. Sinkronisasi &amp; notifikasi
        push akan menyusul di pembaruan berikutnya.
      </p>
    </div>
  );
}
