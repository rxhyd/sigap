import { Siren } from "lucide-react";
import { GradientPageHeader } from "@/components/layout/GradientPageHeader";
import { DisasterList } from "@/components/disaster/DisasterList";

export default function DisasterPage() {
  return (
    <div className="flex flex-col gap-4 pb-4">
      <GradientPageHeader icon={Siren} title="Riwayat Bencana" subtitle="Kebakaran hutan & gempa bumi terkini." />
      <div className="px-4">
        <DisasterList />
      </div>
    </div>
  );
}
