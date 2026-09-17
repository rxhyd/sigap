"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Siren, Users, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/disaster", label: "Bencana", icon: Siren },
  { href: "/komunitas", label: "Komunitas", icon: Users },
  { href: "/edukasi", label: "Edukasi", icon: BookOpen },
  { href: "/profil", label: "Profil", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center border-t border-border bg-background/80 backdrop-blur-lg">
      <div className="grid w-full max-w-md grid-cols-5 px-1 py-1.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 py-1.5 text-xs font-medium transition-colors"
            >
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4.5" strokeWidth={isActive ? 2.5 : 2} />
              </span>
              <span className={isActive ? "text-primary" : "text-muted-foreground"}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
