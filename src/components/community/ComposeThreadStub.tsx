import { PenLine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function ComposeThreadStub() {
  return (
    <Card>
      <CardContent className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <PenLine className="size-4" />
        </span>
        <Input disabled placeholder="Tulis pertanyaan atau info terkini di daerahmu..." className="flex-1" />
        <Badge variant="secondary" className="shrink-0 text-[10px]">
          Segera hadir
        </Badge>
      </CardContent>
    </Card>
  );
}
