"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PROFILE_STORAGE_KEY, type StoredProfile } from "@/components/profil/ProfileFormStatic";
import { markRegisteredCookie } from "@/lib/auth/registration";
import { useLocalStorageRaw } from "@/lib/storage/useLocalStorage";

function parseProfile(raw: string | null): StoredProfile | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredProfile;
  } catch {
    return null;
  }
}

export function LoginForm() {
  const router = useRouter();
  const raw = useLocalStorageRaw(PROFILE_STORAGE_KEY);
  const storedProfile = useMemo(() => parseProfile(raw), [raw]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!storedProfile) {
      toast.error("Belum ada profil di perangkat ini", { description: "Silakan daftar terlebih dahulu." });
      return;
    }

    setSubmitting(true);

    const emailMatches = email.trim().toLowerCase() === storedProfile.email.toLowerCase();
    const passwordMatches = password === storedProfile.password;

    if (!emailMatches || !passwordMatches) {
      toast.error("Email atau password salah");
      setSubmitting(false);
      return;
    }

    markRegisteredCookie();
    toast.success(`Selamat datang kembali, ${storedProfile.name}!`);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 px-5 pt-6 pb-10">
      <Link href="/" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Kembali
      </Link>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Masuk</h1>
        <p className="text-sm text-muted-foreground">
          Masuk dengan profil yang tersimpan di perangkat ini. Belum ada sinkronisasi lintas perangkat.
        </p>
      </div>

      {raw !== null && !storedProfile && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Belum ditemukan profil tersimpan di perangkat ini.{" "}
          <Link href="/register" className="font-medium underline">
            Daftar dulu, yuk.
          </Link>
        </p>
      )}

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" size="lg" className="mt-2 w-full" disabled={submitting}>
              <LogIn className="size-4" />
              Masuk
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Belum punya profil?{" "}
              <Link href="/register" className="font-medium text-foreground hover:underline">
                Daftar
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
