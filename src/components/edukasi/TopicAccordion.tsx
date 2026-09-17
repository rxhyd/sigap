import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ArticleContent } from "@/components/edukasi/ArticleContent";
import type { EdukasiSubtopic } from "@/lib/types/edukasi";

export function TopicAccordion({ subtopics }: { subtopics: EdukasiSubtopic[] }) {
  return (
    <Accordion multiple className="flex flex-col gap-1 border-t border-border pt-1">
      {subtopics.map((subtopic) => (
        <AccordionItem key={subtopic.slug} value={subtopic.slug} className="rounded-lg px-2 not-last:border-b-0">
          <AccordionTrigger className="py-2.5 text-sm font-medium hover:no-underline">
            <span className="flex items-center gap-2">
              <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
              {subtopic.title}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="rounded-lg bg-muted/50 p-3">
              <ArticleContent paragraphs={subtopic.content} />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
