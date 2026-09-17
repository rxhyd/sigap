import { Users } from "lucide-react";
import { GradientPageHeader } from "@/components/layout/GradientPageHeader";
import { CommunityFeed } from "@/components/community/CommunityFeed";

export default function KomunitasPage() {
  return (
    <div className="flex flex-col gap-4 pb-4">
      <GradientPageHeader
        icon={Users}
        title="Komunitas"
        subtitle="Saling bertukar kabar kejadian di sekitarmu."
      />
      <div className="px-4">
        <CommunityFeed />
      </div>
    </div>
  );
}
