import { ComposeThreadStub } from "@/components/community/ComposeThreadStub";
import { ThreadCard } from "@/components/community/ThreadCard";
import { communityThreads } from "@/lib/content/communityThreads";

export function CommunityFeed() {
  return (
    <div className="flex flex-col gap-3">
      <ComposeThreadStub />
      <p className="text-xs text-muted-foreground">
        Contoh tampilan dengan data dummy — fitur posting &amp; komentar sungguhan akan menyusul setelah ada
        akun &amp; server terpusat.
      </p>
      {communityThreads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} />
      ))}
    </div>
  );
}
