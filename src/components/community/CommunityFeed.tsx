"use client";

import { ComposeThreadForm } from "@/components/community/ComposeThreadForm";
import { ThreadCard } from "@/components/community/ThreadCard";
import { useCommunityThreads } from "@/lib/community/store";

export function CommunityFeed() {
  const threads = useCommunityThreads();

  return (
    <div className="flex flex-col gap-3">
      <ComposeThreadForm />
      <p className="text-xs text-muted-foreground">
        4 utas contoh berisi data dummy. Utas yang kamu buat sendiri hanya tersimpan di perangkat ini — fitur
        posting &amp; komentar lintas pengguna sungguhan akan menyusul setelah ada akun &amp; server terpusat.
      </p>
      {threads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} />
      ))}
    </div>
  );
}
