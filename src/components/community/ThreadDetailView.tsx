"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, MessageCircle, Send, Users } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GradientPageHeader } from "@/components/layout/GradientPageHeader";
import { formatDateTimeId } from "@/lib/geo/markerStyle";
import { formatCompactViews } from "@/lib/format/compactNumber";
import { useCommunityThread, addComment } from "@/lib/community/store";
import { useAutoIncrementViews } from "@/lib/community/useAutoIncrementViews";
import { PROFILE_STORAGE_KEY, type StoredProfile } from "@/components/profil/ProfileFormStatic";
import type { CommunityComment } from "@/lib/types/community";

const PAGE_SIZE = 5;

function initialsOf(name: string): string {
  return name.trim().slice(0, 2).toUpperCase();
}

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

export function ThreadDetailView({ id }: { id: string }) {
  const thread = useCommunityThread(id);
  useAutoIncrementViews(id, Boolean(thread?.isOwn));

  if (!thread) {
    return (
      <div className="flex flex-col gap-4 pb-4">
        <GradientPageHeader icon={Users} title="Utas tidak ditemukan" subtitle="Mungkin sudah dihapus." />
        <div className="px-4">
          <Link href="/komunitas" className="flex items-center gap-1.5 text-sm text-primary">
            <ArrowLeft className="size-4" />
            Kembali ke Komunitas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <GradientPageHeader icon={Users} title="Utas Komunitas" subtitle={thread.region} />
      <div className="flex flex-col gap-4 px-4">
        <Link href="/komunitas" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Kembali
        </Link>

        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <Avatar className="size-9 shrink-0">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {initialsOf(thread.author)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  {thread.author} <span className="font-normal text-muted-foreground">· {thread.region}</span>
                  {thread.isOwn && (
                    <Badge variant="secondary" className="text-[10px]">
                      Anda · Lokal
                    </Badge>
                  )}
                </span>
                <span className="text-[11px] text-muted-foreground">{formatDateTimeId(thread.postedAt)}</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed">{thread.message}</p>

            <div className="flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="size-3.5" />
                {formatCompactViews(thread.viewCount)} dilihat
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="size-3.5" />
                {thread.comments.length} komentar
              </span>
            </div>
          </CardContent>
        </Card>

        <CommentComposer threadId={thread.id} isOwnThread={Boolean(thread.isOwn)} />

        <CommentList comments={thread.comments} />
      </div>
    </div>
  );
}

function CommentComposer({ threadId, isOwnThread }: { threadId: string; isOwnThread: boolean }) {
  const [message, setMessage] = useState("");
  const [region, setRegion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit() {
    if (!message.trim()) {
      toast.error("Tulis dulu komentarnya");
      return;
    }
    setSubmitting(true);
    const comment: CommunityComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      author: currentAuthorName(),
      region: region.trim() || "Lokasi tidak dicantumkan",
      message: message.trim(),
      postedAt: new Date().toISOString(),
    };
    addComment(threadId, isOwnThread, comment);
    toast.success("Komentar ditambahkan");
    setMessage("");
    setRegion("");
    setSubmitting(false);
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <Textarea
          placeholder="Tulis komentar..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-12"
        />
        <div className="flex items-center gap-2">
          <Input
            placeholder="Asal daerah (opsional)"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="flex-1"
          />
          <Button size="sm" onClick={handleSubmit} disabled={submitting || !message.trim()}>
            <Send className="size-3.5" />
            Kirim
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CommentList({ comments }: { comments: CommunityComment[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const ordered = [...comments].reverse(); // newest first
  const hasMore = visibleCount < ordered.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((count) => Math.min(count + PAGE_SIZE, ordered.length));
        }
      },
      { rootMargin: "150px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, ordered.length]);

  if (ordered.length === 0) {
    return <p className="py-4 text-center text-xs text-muted-foreground">Belum ada komentar. Jadilah yang pertama!</p>;
  }

  const visible = ordered.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs font-medium text-muted-foreground">Komentar ({ordered.length})</span>
      {visible.map((comment) => (
        <div key={comment.id} className="flex items-start gap-2.5 rounded-lg bg-muted/40 p-2.5">
          <Avatar className="size-7 shrink-0">
            <AvatarFallback className="bg-muted text-[10px] font-medium">{initialsOf(comment.author)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="text-xs font-semibold">
              {comment.author} <span className="font-normal text-muted-foreground">· {comment.region}</span>
            </span>
            <p className="text-xs text-muted-foreground">{comment.message}</p>
            <span className="text-[10px] text-muted-foreground">{formatDateTimeId(comment.postedAt)}</span>
          </div>
        </div>
      ))}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-1">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
