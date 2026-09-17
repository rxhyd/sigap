import { BookOpen } from "lucide-react";
import { GradientPageHeader } from "@/components/layout/GradientPageHeader";
import { EdukasiAccordion } from "@/components/edukasi/EdukasiAccordion";

export default function EdukasiPage() {
  return (
    <div className="flex flex-col gap-4 pb-4">
      <GradientPageHeader
        icon={BookOpen}
        title="Edukasi Bencana"
        subtitle="Kenali prevalensi, penyebab, faktor risiko, dampak, dan upaya penanggulangan."
      />
      <div className="px-4">
        <EdukasiAccordion />
      </div>
    </div>
  );
}
