import { Flame, Activity, Waves, Mountain } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { TopicAccordion } from "@/components/edukasi/TopicAccordion";
import { edukasiCategories } from "@/lib/content/edukasi-content";
import type { EdukasiCategorySlug } from "@/lib/types/edukasi";

const ICONS = { flame: Flame, activity: Activity, waves: Waves, mountain: Mountain } as const;

const ACCENTS: Record<EdukasiCategorySlug, { badge: string; ring: string }> = {
  "kebakaran-hutan": { badge: "bg-orange-500/10 text-orange-600", ring: "hover:border-orange-300/60" },
  "gempa-bumi": { badge: "bg-blue-500/10 text-blue-600", ring: "hover:border-blue-300/60" },
  tsunami: { badge: "bg-cyan-500/10 text-cyan-600", ring: "hover:border-cyan-300/60" },
  longsor: { badge: "bg-amber-500/10 text-amber-700", ring: "hover:border-amber-300/60" },
};

export function EdukasiAccordion() {
  return (
    <Accordion multiple className="flex flex-col gap-3">
      {edukasiCategories.map((category) => {
        const Icon = ICONS[category.icon];
        const accent = ACCENTS[category.slug];
        return (
          <AccordionItem
            key={category.slug}
            value={category.slug}
            className={`rounded-2xl border border-border bg-card px-4 shadow-sm transition-colors not-last:border-b ${accent.ring}`}
          >
            <AccordionTrigger className="py-3.5 text-base font-semibold hover:no-underline">
              <span className="flex items-center gap-3">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${accent.badge}`}>
                  <Icon className="size-4.5" />
                </span>
                {category.title}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <TopicAccordion subtopics={category.subtopics} />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
