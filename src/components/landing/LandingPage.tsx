import Link from "next/link";
import { ShieldAlert, Flame, Activity, Wind, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const FEATURES = [
  {
    icon: Flame,
    title: "Peta Titik Kebakaran",
    description: "Pantau titik panas kebakaran hutan real-time dari satelit NASA FIRMS.",
  },
  {
    icon: Activity,
    title: "Riwayat Gempa Bumi",
    description: "Data gempa terkini langsung dari BMKG, lengkap dengan magnitudo & lokasi.",
  },
  {
    icon: Wind,
    title: "Kualitas Udara",
    description: "Cek indeks PM2.5 di sekitar Anda untuk mengantisipasi kabut asap.",
  },
];

export function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-gradient-to-b from-orange-50 via-background to-background px-6 pt-14 pb-8 dark:from-orange-950/20">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-orange-700 shadow-lg shadow-primary/30">
          <ShieldAlert className="size-10 text-white" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight">SIGAP</h1>
          <p className="text-sm text-muted-foreground">Sistem Informasi Gempa, Asap &amp; Pemadaman</p>
          <p className="mx-auto max-w-xs text-base font-medium text-foreground/80">
            Deteksi dini kebakaran hutan &amp; gempa bumi di sekitar Anda, sebelum semuanya terlambat.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 py-8">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-3.5 shadow-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <feature.icon className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{feature.title}</span>
              <span className="text-xs text-muted-foreground">{feature.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <Button
          render={<Link href="/register" />}
          nativeButton={false}
          size="lg"
          className="w-full text-base shadow-md shadow-primary/25"
        >
          Daftar Sekarang
          <ArrowRight className="size-4" />
        </Button>
        <Button
          render={<Link href="/login" />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="w-full text-base"
        >
          Sudah Punya Akun? Masuk
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Gratis &amp; tanpa iklan. Data disimpan aman di perangkat Anda.
        </p>
      </div>
    </div>
  );
}
