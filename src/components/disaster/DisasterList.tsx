"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Inbox } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DisasterCard } from "@/components/disaster/DisasterCard";
import { useDisasterData } from "@/hooks/useDisasterData";
import { useNowMs } from "@/hooks/useNowMs";
import { earthquakeToDisasterItem, hotspotToDisasterItem, type DisasterItem } from "@/lib/disaster/disasterItem";

type CategoryFilter = "all" | "fire" | "earthquake";
type SortMode = "severity" | "newest" | "oldest";

const RANGE_OPTIONS = [
  { value: "3", label: "3 hari terakhir" },
  { value: "7", label: "7 hari terakhir" },
  { value: "30", label: "1 bulan terakhir" },
  { value: "90", label: "3 bulan terakhir" },
  { value: "365", label: "12 bulan terakhir" },
] as const;

const PAGE_SIZE = 8;

export function DisasterList() {
  const { earthquakes, earthquakesLoading, hotspots, hotspotsLoading } = useDisasterData();
  const nowMs = useNowMs();
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortMode>("newest");
  const [rangeDays, setRangeDays] = useState("7");

  const allItems = useMemo<DisasterItem[]>(() => {
    const hotspotList = hotspots.status === "ok" ? hotspots.data : [];
    return [...earthquakes.map(earthquakeToDisasterItem), ...hotspotList.map(hotspotToDisasterItem)];
  }, [earthquakes, hotspots]);

  const filtered = useMemo(() => {
    const rangeMs = Number(rangeDays) * 24 * 60 * 60 * 1000;
    const cutoff = nowMs - rangeMs;

    let items = allItems.filter((item) => new Date(item.timestamp).getTime() >= cutoff);

    if (category !== "all") {
      items = items.filter((item) => item.category === category);
    }

    items = [...items].sort((a, b) => {
      if (sort === "severity") return b.severityScore - a.severityScore;
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sort === "newest" ? timeB - timeA : timeA - timeB;
    });

    return items;
  }, [allItems, category, sort, rangeDays, nowMs]);

  const isLoading = earthquakesLoading || hotspotsLoading;

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={category} onValueChange={(v) => setCategory(v as CategoryFilter)}>
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            Semua
          </TabsTrigger>
          <TabsTrigger value="fire" className="flex-1">
            Kebakaran
          </TabsTrigger>
          <TabsTrigger value="earthquake" className="flex-1">
            Gempa
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-2">
        <Select value={sort} onValueChange={(v) => v && setSort(v as SortMode)}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="severity">Terparah</SelectItem>
            <SelectItem value="newest">Terbaru</SelectItem>
            <SelectItem value="oldest">Terlama</SelectItem>
          </SelectContent>
        </Select>

        <Select value={rangeDays} onValueChange={(v) => v && setRangeDays(v)}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Rentang waktu" />
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground">
        Data ditampilkan langsung dari sumber live (BMKG &amp; NASA FIRMS), belum ada arsip riwayat jangka
        panjang — rentang waktu di atas hanya akan terisi selama data itu masih tersedia dari sumbernya.
      </p>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-10 text-center">
          <Inbox className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium">Tidak ada kejadian</p>
          <p className="max-w-52 text-xs text-muted-foreground">
            Tidak ada data pada kategori &amp; rentang waktu ini dari sumber live saat ini.
          </p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <PaginatedResults key={`${category}-${sort}-${rangeDays}`} items={filtered} />
      )}
    </div>
  );
}

function PaginatedResults({ items }: { items: DisasterItem[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMore = visibleCount < items.length;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((count) => Math.min(count + PAGE_SIZE, items.length));
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, items.length]);

  const visibleItems = items.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-3">
      {visibleItems.map((item) => (
        <DisasterCard key={item.id} item={item} />
      ))}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-2">
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      )}
    </div>
  );
}
