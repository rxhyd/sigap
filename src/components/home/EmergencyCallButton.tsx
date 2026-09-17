"use client";

import { useEffect, useState } from "react";
import { Phone, PhoneOff, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const CALL_CENTER_NUMBER = "112";
const CALL_CENTER_NAME = "Call Center 112";

type CallPhase = "confirm" | "calling" | "connected";

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function EmergencyCallButton() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<CallPhase>("confirm");
  const [durationSec, setDurationSec] = useState(0);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setPhase("confirm");
      setDurationSec(0);
    }
  }

  function startCall() {
    setPhase("calling");
  }

  useEffect(() => {
    if (phase !== "calling") return;
    const timeout = setTimeout(() => setPhase("connected"), 2200);
    return () => clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== "connected") return;
    const interval = setInterval(() => setDurationSec((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center">
        <div className="flex w-full max-w-md justify-end px-4">
          <Button
            onClick={() => setOpen(true)}
            size="icon"
            className="pointer-events-auto size-14 rounded-full bg-destructive text-destructive-foreground shadow-lg shadow-destructive/40 transition-transform duration-200 hover:scale-105 hover:bg-destructive/90 active:scale-95"
            aria-label="Panggilan darurat"
          >
            <Phone className="size-6" />
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent showCloseButton={phase !== "connected"}>
          {phase === "confirm" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldAlert className="size-4.5 text-destructive" />
                  Panggilan Darurat
                </DialogTitle>
                <DialogDescription>
                  Ini hanya simulasi demo, belum tersambung ke panggilan sungguhan. Jika ini keadaan darurat
                  nyata, segera hubungi <strong>112</strong> langsung dari aplikasi telepon perangkat Anda.
                </DialogDescription>
              </DialogHeader>
              <button
                onClick={startCall}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 text-left shadow-sm transition-colors hover:bg-accent"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <Phone className="size-4.5" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold">{CALL_CENTER_NAME}</span>
                  <span className="text-xs text-muted-foreground">Nomor Tunggal Panggilan Darurat (demo)</span>
                </span>
              </button>
            </>
          )}

          {(phase === "calling" || phase === "connected") && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <span
                className={cn(
                  "flex size-20 items-center justify-center rounded-full bg-destructive/10 text-destructive",
                  phase === "calling" && "animate-pulse"
                )}
              >
                <Phone className="size-9" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-base font-semibold">{CALL_CENTER_NAME}</span>
                <span className="text-xs text-muted-foreground">
                  {phase === "calling" ? "Memanggil…" : `Tersambung · ${formatDuration(durationSec)}`}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Simulasi demo &mdash; nomor {CALL_CENTER_NUMBER} tidak benar-benar dihubungi
                </span>
              </div>
              <Button
                onClick={() => handleOpenChange(false)}
                variant="destructive"
                size="lg"
                className="w-full gap-2"
              >
                <PhoneOff className="size-4.5" />
                Akhiri Panggilan
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
