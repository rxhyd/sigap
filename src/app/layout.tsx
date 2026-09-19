import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { MobileShell } from "@/components/layout/MobileShell";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopBar } from "@/components/layout/TopBar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { REGISTERED_COOKIE } from "@/lib/auth/registration";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIGAP — Sistem Informasi Gempa, Asap & Peringatan",
  description: "Deteksi dini kebakaran hutan, gempa bumi, dan kualitas udara di sekitar Anda.",
};

// Tells browsers this page manages its own light/dark appearance, so mobile
// browsers with an "auto dark mode for web content" feature don't try to
// re-invert colors on top of our own theme and break text contrast.
export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const isRegistered = cookieStore.get(REGISTERED_COOKIE)?.value === "1";

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-muted/40" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <MobileShell hasBottomNav={isRegistered}>
            {isRegistered && <TopBar />}
            {children}
            {isRegistered && <BottomNav />}
          </MobileShell>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
