export type DailyForecast = {
  date: string; // ISO date (yyyy-mm-dd)
  weatherCode: number;
  tempMaxC: number;
  tempMinC: number;
  rainChancePct: number; // share of models that expect meaningful rain that day
};

export type HourlyForecast = {
  time: string; // ISO datetime
  tempC: number;
  weatherCode: number;
  rainChancePct: number; // share of models that expect rain that hour
};

export type WeatherForecastData = {
  currentTempC: number;
  currentWeatherCode: number;
  humidity: number | null;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
};
