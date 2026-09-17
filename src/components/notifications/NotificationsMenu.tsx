"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Bell, Flame, Activity, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDisasterData } from "@/hooks/useDisasterData";
import { deriveNotifications } from "@/lib/notifications/deriveNotifications";
import { formatRelativeId } from "@/lib/format/relativeTime";
import { useLocalStorageRaw, setLocalStorageItem } from "@/lib/storage/useLocalStorage";
import { cn } from "@/lib/utils";

const READ_STORAGE_KEY = "sigap:notifications:read";

function readIdsFrom(raw: string | null): Set<string> {
  if (!raw) return new Set();
  try {
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export function NotificationsMenu() {
  const { earthquakes, hotspots } = useDisasterData();
  const rawReadIds = useLocalStorageRaw(READ_STORAGE_KEY);
  const readIds = useMemo(() => readIdsFrom(rawReadIds), [rawReadIds]);

  const items = useMemo(
    () => deriveNotifications(earthquakes, hotspots.status === "ok" ? hotspots.data : []),
    [earthquakes, hotspots]
  );

  const unreadCount = items.filter((item) => !readIds.has(item.id)).length;

  function markAllRead() {
    const merged = new Set([...readIds, ...items.map((i) => i.id)]);
    setLocalStorageItem(READ_STORAGE_KEY, JSON.stringify(Array.from(merged).slice(-100)));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifikasi" />
        }
      >
        <Bell className="size-4.5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-destructive ring-2 ring-background" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-1.5 py-1">
          <span className="text-xs font-medium text-muted-foreground">Notifikasi</span>
          {unreadCount > 0 ? (
            <Badge variant="secondary">{unreadCount} baru</Badge>
          ) : (
            <span className="text-xs text-muted-foreground">Semua terbaca</span>
          )}
        </div>
        <DropdownMenuSeparator />

        {items.length === 0 && (
          <p className="px-2 py-4 text-center text-sm text-muted-foreground">Belum ada kejadian terkini.</p>
        )}

        <div className="flex max-h-80 flex-col overflow-y-auto">
          {items.map((item) => {
            const isRead = readIds.has(item.id);
            const Icon = item.kind === "earthquake" ? Activity : Flame;
            const tint =
              item.kind === "earthquake"
                ? "bg-amber-500/10 text-amber-600"
                : "bg-orange-500/10 text-orange-600";

            return (
              <DropdownMenuItem key={item.id} className="items-start gap-3 py-2.5">
                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", tint)}>
                  <Icon className="size-4" />
                </span>
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <p className="flex items-center gap-1.5 text-sm leading-snug">
                    <span className={cn("font-medium", !isRead && "font-semibold")}>{item.title}</span>
                    {!isRead && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                  </p>
                  <span className="truncate text-xs text-muted-foreground">{item.description}</span>
                  <span className="text-[11px] text-muted-foreground">{formatRelativeId(item.timestamp)}</span>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator />
        <div className="flex items-center gap-2 px-1 py-1">
          <DropdownMenuItem
            className="flex-1 justify-center gap-1.5 text-sm font-medium"
            disabled={unreadCount === 0}
            onClick={markAllRead}
          >
            <CheckCheck className="size-4" />
            Tandai semua dibaca
          </DropdownMenuItem>
        </div>
        <DropdownMenuItem className="justify-center text-sm font-medium" render={<Link href="/disaster" />}>
          Lihat semua riwayat bencana
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
