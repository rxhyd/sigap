import type { ReactNode } from "react";
import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { StatsRow } from "@/components/home/StatsRow";
import { ProximityAlertBanner } from "@/components/home/ProximityAlertBanner";
import { TsunamiWatch } from "@/components/home/TsunamiWatch";
import { DangerPopup } from "@/components/home/DangerPopup";
import { DisasterMap } from "@/components/home/DisasterMap";
import { AirQualityGauge } from "@/components/home/AirQualityGauge";
import { WeatherForecast } from "@/components/home/WeatherForecast";
import { EmergencyCallButton } from "@/components/home/EmergencyCallButton";

const DELAYS = ["delay-0", "delay-75", "delay-150", "delay-200", "delay-300", "delay-500", "delay-700"] as const;

function Reveal({ index, children }: { index: number; children: ReactNode }) {
  return (
    <div
      className={`animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards duration-500 ${DELAYS[index] ?? "delay-700"}`}
    >
      {children}
    </div>
  );
}

export function HomeDashboard() {
  return (
    <div className="flex flex-col gap-4 pb-4">
      <DangerPopup />
      <Reveal index={0}>
        <WelcomeHeader />
      </Reveal>
      <Reveal index={1}>
        <StatsRow />
      </Reveal>
      <Reveal index={2}>
        <ProximityAlertBanner />
      </Reveal>
      <Reveal index={3}>
        <TsunamiWatch />
      </Reveal>
      <div className="flex flex-col gap-4 px-4">
        <Reveal index={4}>
          <DisasterMap />
        </Reveal>
        <Reveal index={5}>
          <AirQualityGauge />
        </Reveal>
        <Reveal index={6}>
          <WeatherForecast />
        </Reveal>
      </div>
      <EmergencyCallButton />
    </div>
  );
}
