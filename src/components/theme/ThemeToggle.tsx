"use client";

import { flushSync } from "react-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/hooks/useHasMounted";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useHasMounted();

  function toggleTheme(event: React.MouseEvent<HTMLButtonElement>) {
    const next = resolvedTheme === "dark" ? "light" : "dark";

    const canAnimate =
      typeof document.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canAnimate) {
      setTheme(next);
      return;
    }

    const { clientX: x, clientY: y } = event;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const root = document.documentElement;
    root.style.setProperty("--theme-toggle-x", `${x}px`);
    root.style.setProperty("--theme-toggle-y", `${y}px`);
    root.style.setProperty("--theme-toggle-radius", `${endRadius}px`);

    document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
  }

  return (
    <Button variant="ghost" size="icon" className="rounded-full" aria-label="Ganti tema" onClick={toggleTheme}>
      {mounted && resolvedTheme === "dark" ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
    </Button>
  );
}
