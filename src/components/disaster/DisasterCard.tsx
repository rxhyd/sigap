import { MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MapThumbnail } from "@/components/disaster/MapThumbnail";
import { formatRelativeId } from "@/lib/format/relativeTime";
import type { DisasterItem } from "@/lib/disaster/disasterItem";

export function DisasterCard({ item }: { item: DisasterItem }) {
  return (
    <Card>
      <CardContent className="flex gap-3">
        <MapThumbnail latitude={item.latitude} longitude={item.longitude} dotColor={item.severityColor} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-semibold">{item.title}</span>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: `${item.severityColor}1a`, color: item.severityColor }}
            >
              {item.severityLabel}
            </span>
          </div>
          <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {item.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatRelativeId(item.timestamp)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
