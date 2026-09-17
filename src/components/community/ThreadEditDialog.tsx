"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateOwnThread } from "@/lib/community/store";
import type { CommunityThread } from "@/lib/types/community";

export function ThreadEditDialog({
  thread,
  open,
  onOpenChange,
}: {
  thread: CommunityThread;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [message, setMessage] = useState(thread.message);
  const [region, setRegion] = useState(thread.region);

  function handleSave() {
    if (!message.trim()) {
      toast.error("Isi utas tidak boleh kosong");
      return;
    }
    updateOwnThread(thread.id, { message: message.trim(), region: region.trim() || "Lokasi tidak dicantumkan" });
    toast.success("Utas diperbarui");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Utas</DialogTitle>
          <DialogDescription>Perubahan hanya tersimpan di perangkat ini.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-thread-message">Isi utas</Label>
            <Textarea id="edit-thread-message" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-thread-region">Asal daerah</Label>
            <Input id="edit-thread-region" value={region} onChange={(e) => setRegion(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSave}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
