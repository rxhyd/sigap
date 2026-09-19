import { z } from "zod";
import type { WeatherForecastData } from "@/lib/types/weather";
import type { DataResult } from "@/lib/types/result";

// A single global model is often several degrees off (and disagrees with the others on rain)
// in the tropics, so we average several. JMA is left out: it ran consistently too cold here.
const MODELS = ["ecmwf_ifs025", "gfs_seamless", "icon_seamless", "gem_seamless", "meteofrance_seamless"] as const;

const numberSeries = z.array(z.number().nullable());

const forecastSchema = z.object({
  current: z.object({ time: z.string() }),
  hourly: z.object({ time: z.array(z.string()) }).catchall(numberSeries),
  daily: z.object({ time: z.array(z.string()) }).catchall(numberSeries),
});

type Series = Record<string, (number | null)[] | string[]>;

const HOURLY_ITEMS = 24;
// WMO codes reused so the existing icon/label mapping keeps working.
const CODE_CLEAR = 0;
const CODE_PARTLY_CLOUDY = 2;
const CODE_OVERCAST = 3;
const CODE_DRIZZLE = 51;
const CODE_RAIN = 61;

function valuesAt(series: Series, base: string, index: number): number[] {
  return MODELS.map((model) => (series[`${base}_${model}`] as (number | null)[] | undefined)?.[index]).filter(
    (v): v is number => typeof v === "number"
  );
}

function mean(values: number[]): number | null {
  return values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : null;
}

function shareAtLeast(values: number[], threshold: number): number {
  return values.length ? values.filter((v) => v >= threshold).length / values.length : 0;
}

function cloudCode(cloudPct: number | null): number {
  if (cloudPct === null) return CODE_PARTLY_CLOUDY;
  if (cloudPct < 20) return CODE_CLEAR;
  if (cloudPct < 65) return CODE_PARTLY_CLOUDY;
  return CODE_OVERCAST;
}

function hourlyCondition(precip: number[], cloudPct: number | null) {
  const rainShare = shareAtLeast(precip, 0.1);
  const meanPrecip = mean(precip) ?? 0;
  let code = cloudCode(cloudPct);
  if (rainShare >= 0.6 && meanPrecip >= 0.5) code = CODE_RAIN;
  else if (rainShare >= 0.4) code = CODE_DRIZZLE;
  return { code, rainChancePct: Math.round(rainShare * 100) };
}

function dailyCondition(precipSum: number[], cloudPct: number | null) {
  const rainShare = shareAtLeast(precipSum, 1);
  const meanSum = mean(precipSum) ?? 0;
  let code = cloudCode(cloudPct);
  if (rainShare >= 0.6 && meanSum >= 5) code = CODE_RAIN;
  else if (rainShare >= 0.4) code = CODE_DRIZZLE;
  return { code, rainChancePct: Math.round(rainShare * 100) };
}

export async function fetchWeatherForecast(
  latitude: number,
  longitude: number
): Promise<DataResult<WeatherForecastData>> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m` +
    `&hourly=temperature_2m,relative_humidity_2m,precipitation,cloud_cover` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,cloud_cover_mean` +
    `&timezone=auto&forecast_days=7&models=${MODELS.join(",")}`;

  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) {
      return { status: "error", message: `Open-Meteo API returned ${res.status}` };
    }
    const json = await res.json();
    const parsed = forecastSchema.safeParse(json);
    if (!parsed.success) {
      return { status: "error", message: "Format respons cuaca tidak dikenali" };
    }

    const { current, hourly, daily } = parsed.data;
    const hourlySeries = hourly as unknown as Series;
    const dailySeries = daily as unknown as Series;

    // Multi-model requests only return one model for `current`, so "now" comes from the
    // model-averaged hourly slot that contains the current time.
    const currentHour = current.time.slice(0, 13);
    const nowIndex = Math.max(
      0,
      hourly.time.findIndex((t) => t.startsWith(currentHour))
    );

    const nowTemp = mean(valuesAt(hourlySeries, "temperature_2m", nowIndex));
    if (nowTemp === null) {
      return { status: "error", message: "Data suhu belum tersedia dari model cuaca" };
    }
    const nowHumidity = mean(valuesAt(hourlySeries, "relative_humidity_2m", nowIndex));
    const nowCondition = hourlyCondition(
      valuesAt(hourlySeries, "precipitation", nowIndex),
      mean(valuesAt(hourlySeries, "cloud_cover", nowIndex))
    );

    const upcomingHourly = hourly.time
      .map((time, i) => {
        const temp = mean(valuesAt(hourlySeries, "temperature_2m", i));
        const condition = hourlyCondition(
          valuesAt(hourlySeries, "precipitation", i),
          mean(valuesAt(hourlySeries, "cloud_cover", i))
        );
        return { time, tempC: temp, weatherCode: condition.code, rainChancePct: condition.rainChancePct };
      })
      .slice(nowIndex)
      .filter((h): h is typeof h & { tempC: number } => h.tempC !== null)
      .slice(0, HOURLY_ITEMS);

    const dailyItems = daily.time.flatMap((date, i) => {
      const tempMax = mean(valuesAt(dailySeries, "temperature_2m_max", i));
      const tempMin = mean(valuesAt(dailySeries, "temperature_2m_min", i));
      if (tempMax === null || tempMin === null) return [];
      const condition = dailyCondition(
        valuesAt(dailySeries, "precipitation_sum", i),
        mean(valuesAt(dailySeries, "cloud_cover_mean", i))
      );
      return [
        {
          date,
          weatherCode: condition.code,
          tempMaxC: tempMax,
          tempMinC: tempMin,
          rainChancePct: condition.rainChancePct,
        },
      ];
    });

    return {
      status: "ok",
      data: {
        currentTempC: nowTemp,
        currentWeatherCode: nowCondition.code,
        humidity: nowHumidity === null ? null : Math.round(nowHumidity),
        hourly: upcomingHourly,
        daily: dailyItems,
      },
    };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Gagal mengambil data cuaca",
    };
  }
}
