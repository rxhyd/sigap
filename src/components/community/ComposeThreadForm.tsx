"use client";

import { useState } from "react";
import { PenLine, Send } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createThread } from "@/lib/community/store";
import { useLocalStorageRaw } from "@/lib/storage/useLocalStorage";
import { PROFILE_STORAGE_KEY, type StoredProfile } from "@/components/profil/ProfileFormStatic";

function currentAuthorName(): string {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return "Anda";
    const profile = JSON.parse(raw) as StoredProfile;
    return profile.name.trim() || "Anda";
  } catch {
    return "Anda";
  }
}

export function ComposeThreadForm() {
  useLocalStorageRaw(PROFILE_STORAGE_KEY); // keep component reactive if profile name changes elsewhere
  const [message, setMessage] = useState("");
  const [region, setRegion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit() {
    if (!message.trim()) {
      toast.error("Tulis dulu isi utasnya");
      return;
    }
    setSubmitting(true);
    createThread({
      author: currentAuthorName(),
      region: region.trim() || "Lokasi tidak dicantumkan",
      message: message.trim(),
    });
    toast.success("Utas berhasil diposting", {
      description: "Hanya tersimpan di perangkat ini — orang lain tidak akan melihatnya.",
    });
    setMessage("");
    setRegion("");
    setSubmitting(false);
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-2.5">
        <div className="flex items-start gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PenLine className="size-4" />
          </span>
          <Textarea
            placeholder="Tulis pertanyaan atau info terkini di daerahmu..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-2 pl-[calc(2rem+0.625rem)]">
          <Input
            placeholder="Asal daerah (opsional)"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="flex-1"
          />
          <Button size="sm" onClick={handleSubmit} disabled={submitting || !message.trim()}>
            <Send className="size-3.5" />
            Posting
          </Button>
        </div>
        <p className="pl-[calc(2rem+0.625rem)] text-[11px] text-muted-foreground">
          Demo lokal: utas cuma tersimpan di browser perangkat ini, belum ada server terpusat.
        </p>
      </CardContent>
    </Card>
  );
}
