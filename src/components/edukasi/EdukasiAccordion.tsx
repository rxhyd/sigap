import { Flame, Activity, Waves, Mountain } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { TopicAccordion } from "@/components/edukasi/TopicAccordion";
import { MnemonicCard, type MnemonicTone } from "@/components/edukasi/MnemonicCard";
import { edukasiCategories } from "@/lib/content/edukasi-content";
import { cn } from "@/lib/utils";
import type { EdukasiCategorySlug } from "@/lib/types/edukasi";

const ICONS = { flame: Flame, activity: Activity, waves: Waves, mountain: Mountain } as const;

type Accent = MnemonicTone & { badge: string; ring: string };

const ACCENTS: Record<EdukasiCategorySlug, Accent> = {
  "kebakaran-hutan": {
    badge: "bg-orange-500/10 text-orange-600",
    ring: "hover:border-orange-300/60",
    chip: "bg-orange-500 text-white",
    panel: "border-orange-500/25 bg-orange-500/5",
    reminder: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  },
  "gempa-bumi": {
    badge: "bg-blue-500/10 text-blue-600",
    ring: "hover:border-blue-300/60",
    chip: "bg-blue-500 text-white",
    panel: "border-blue-500/25 bg-blue-500/5",
    reminder: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  },
  tsunami: {
    badge: "bg-cyan-500/10 text-cyan-600",
    ring: "hover:border-cyan-300/60",
    chip: "bg-cyan-600 text-white",
    panel: "border-cyan-500/25 bg-cyan-500/5",
    reminder: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  },
  longsor: {
    badge: "bg-amber-500/10 text-amber-700",
    ring: "hover:border-amber-300/60",
    chip: "bg-amber-600 text-white",
    panel: "border-amber-500/25 bg-amber-500/5",
    reminder: "bg-amber-500/15 text-amber-800 dark:text-amber-300",
  },
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
                <span className="flex flex-col items-start gap-1">
                  {category.title}
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-widest",
                      accent.chip
                    )}
                  >
                    {category.mnemonic.acronym}
                  </span>
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3">
                <MnemonicCard mnemonic={category.mnemonic} tone={accent} />
                <TopicAccordion subtopics={category.subtopics} />
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
