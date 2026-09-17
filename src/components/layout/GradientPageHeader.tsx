import type { LucideIcon } from "lucide-react";

export function GradientPageHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="flex items-center gap-3 bg-gradient-to-br from-primary to-orange-700 px-4 py-5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
        <Icon className="size-5" />
      </span>
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-white/80">{subtitle}</p>}
      </div>
    </header>
  );
}
