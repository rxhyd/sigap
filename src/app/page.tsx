import { cookies } from "next/headers";
import { LandingPage } from "@/components/landing/LandingPage";
import { HomeDashboard } from "@/components/home/HomeDashboard";
import { REGISTERED_COOKIE } from "@/lib/auth/registration";

export default async function Home() {
  const cookieStore = await cookies();
  const isRegistered = cookieStore.get(REGISTERED_COOKIE)?.value === "1";

  return isRegistered ? <HomeDashboard /> : <LandingPage />;
}
