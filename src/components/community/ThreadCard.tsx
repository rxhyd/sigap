import { Eye, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateTimeId } from "@/lib/geo/markerStyle";
import { formatCompactViews } from "@/lib/format/compactNumber";
import type { CommunityThread } from "@/lib/types/community";

function initialsOf(name: string): string {
  return name.trim().slice(0, 2).toUpperCase();
}

export function ThreadCard({ thread }: { thread: CommunityThread }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start gap-2.5">
          <Avatar className="size-9 shrink-0">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initialsOf(thread.author)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-semibold">
              {thread.author} <span className="font-normal text-muted-foreground">· {thread.region}</span>
            </span>
            <span className="text-[11px] text-muted-foreground">{formatDateTimeId(thread.postedAt)}</span>
          </div>
        </div>

        <p className="text-sm leading-relaxed">{thread.message}</p>

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

        {thread.comments.length > 0 && (
          <div className="flex flex-col gap-2.5 border-t border-border pt-3">
            {thread.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2.5">
                <Avatar className="size-7 shrink-0">
                  <AvatarFallback className="bg-muted text-[10px] font-medium">
                    {initialsOf(comment.author)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <span className="text-xs font-semibold">
                    {comment.author} <span className="font-normal text-muted-foreground">· {comment.region}</span>
                  </span>
                  <p className="text-xs text-muted-foreground">{comment.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
