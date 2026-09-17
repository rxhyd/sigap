import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MobileShell({
  children,
  hasBottomNav = true,
}: {
  children: ReactNode;
  hasBottomNav?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-screen w-full max-w-md flex-col bg-background sm:border-x sm:border-border sm:shadow-sm",
        hasBottomNav && "pb-20"
      )}
    >
      {children}
    </div>
  );
}
