"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, MessageCircle, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDateTimeId } from "@/lib/geo/markerStyle";
import { formatCompactViews } from "@/lib/format/compactNumber";
import { deleteOwnThread } from "@/lib/community/store";
import { useAutoIncrementViews } from "@/lib/community/useAutoIncrementViews";
import { ThreadEditDialog } from "@/components/community/ThreadEditDialog";
import { toast } from "sonner";
import type { CommunityThread } from "@/lib/types/community";

function initialsOf(name: string): string {
  return name.trim().slice(0, 2).toUpperCase();
}

export function ThreadCard({ thread }: { thread: CommunityThread }) {
  const [editOpen, setEditOpen] = useState(false);
  useAutoIncrementViews(thread.id, Boolean(thread.isOwn));

  function handleDelete() {
    deleteOwnThread(thread.id);
    toast.info("Utas dihapus");
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-2.5">
        <div className="flex items-start gap-2.5">
          <Avatar className="size-9 shrink-0">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initialsOf(thread.author)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="flex flex-wrap items-center gap-1.5 text-sm font-semibold">
              {thread.author} <span className="font-normal text-muted-foreground">· {thread.region}</span>
              {thread.isOwn && (
                <Badge variant="secondary" className="text-[10px]">
                  Anda · Lokal
                </Badge>
              )}
            </span>
            <span className="text-[11px] text-muted-foreground">{formatDateTimeId(thread.postedAt)}</span>
          </div>

          {thread.isOwn && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-sm" className="shrink-0 rounded-full" />}
              >
                <MoreVertical className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="size-3.5" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                  <Trash2 className="size-3.5" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <Link href={`/komunitas/${thread.id}`} className="flex flex-col gap-2.5">
          <p className="line-clamp-4 text-sm leading-relaxed">{thread.message}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {formatCompactViews(thread.viewCount)}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3.5" />
              {thread.comments.length}
            </span>
          </div>
        </Link>
      </CardContent>

      {thread.isOwn && <ThreadEditDialog thread={thread} open={editOpen} onOpenChange={setEditOpen} />}
    </Card>
  );
}
