import { ShieldAlert } from "lucide-react";
import { NotificationsMenu } from "@/components/notifications/NotificationsMenu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/80 px-4 py-2.5 backdrop-blur-lg">
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ShieldAlert className="size-4" />
        </span>
        <span className="text-sm font-bold tracking-tight">SIGAP</span>
      </div>
      <div className="flex items-center gap-1">
        <NotificationsMenu />
        <ThemeToggle />
      </div>
    </header>
  );
}
