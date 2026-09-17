import { WelcomeHeader } from "@/components/home/WelcomeHeader";
import { StatsRow } from "@/components/home/StatsRow";
import { ProximityAlertBanner } from "@/components/home/ProximityAlertBanner";
import { TsunamiWatch } from "@/components/home/TsunamiWatch";
import { DangerPopup } from "@/components/home/DangerPopup";
import { DisasterMap } from "@/components/home/DisasterMap";
import { AirQualityGauge } from "@/components/home/AirQualityGauge";
import { WeatherForecast } from "@/components/home/WeatherForecast";
import { EmergencyCallButton } from "@/components/home/EmergencyCallButton";

export function HomeDashboard() {
  return (
    <div className="flex flex-col gap-4 pb-4">
      <DangerPopup />
      <WelcomeHeader />
      <StatsRow />
      <ProximityAlertBanner />
      <TsunamiWatch />
      <div className="flex flex-col gap-4 px-4">
        <DisasterMap />
        <AirQualityGauge />
        <WeatherForecast />
      </div>
      <EmergencyCallButton />
    </div>
  );
}
