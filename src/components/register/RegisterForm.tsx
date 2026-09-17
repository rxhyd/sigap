"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PROFILE_STORAGE_KEY, type StoredProfile } from "@/components/profil/ProfileFormStatic";
import { markRegisteredCookie } from "@/lib/auth/registration";
import { setLocalStorageItem } from "@/lib/storage/useLocalStorage";

const RADIUS_PRESETS = [10, 20, 50, 100];

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertRadiusKm, setAlertRadiusKm] = useState(20);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama wajib diisi");
      return;
    }
    if (!email.trim()) {
      toast.error("Email wajib diisi", { description: "Dipakai untuk masuk kembali nanti." });
      return;
    }
    if (password.length < 4) {
      toast.error("Password minimal 4 karakter");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    setSubmitting(true);
    const profile: StoredProfile = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      alertRadiusKm,
      savedLatitude: null,
      savedLongitude: null,
    };

    try {
      setLocalStorageItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      markRegisteredCookie();
      toast.success(`Selamat datang, ${profile.name}!`);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Gagal menyimpan data", { description: "Coba lagi atau periksa pengaturan browser." });
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 px-5 pt-6 pb-10">
      <Link href="/" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Kembali
      </Link>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Buat Profil</h1>
        <p className="text-sm text-muted-foreground">
          Belum ada server terpusat — data disimpan aman di perangkat ini. Akun cloud &amp; sinkronisasi menyusul.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reg-name">Nama</Label>
              <Input
                id="reg-name"
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Dipakai sebagai identitas untuk masuk kembali nanti.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="Minimal 4 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reg-confirm-password">Konfirmasi Password</Label>
              <Input
                id="reg-confirm-password"
                type="password"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Radius peringatan</Label>
              <div className="flex flex-wrap gap-2">
                {RADIUS_PRESETS.map((km) => (
                  <Button
                    key={km}
                    type="button"
                    size="sm"
                    variant={alertRadiusKm === km ? "default" : "outline"}
                    onClick={() => setAlertRadiusKm(km)}
                  >
                    {km} km
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Jarak maksimum kejadian dari lokasi Anda untuk memicu peringatan. Bisa diubah lagi nanti di Profil.
              </p>
            </div>

            <Button type="submit" size="lg" className="mt-2 w-full" disabled={submitting}>
              <UserPlus className="size-4" />
              Daftar &amp; Mulai
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Sudah punya profil di perangkat ini?{" "}
              <Link href="/login" className="font-medium text-foreground hover:underline">
                Masuk
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
