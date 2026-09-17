export function ArticleContent({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
      {paragraphs.map((paragraph, idx) => (
        <p key={idx}>{paragraph}</p>
      ))}
    </div>
  );
}
