export type DailyForecast = {
  date: string; // ISO date (yyyy-mm-dd)
  weatherCode: number;
  tempMaxC: number;
  tempMinC: number;
};

export type HourlyForecast = {
  time: string; // ISO datetime
  tempC: number;
  weatherCode: number;
};

export type WeatherForecastData = {
  currentTempC: number;
  currentWeatherCode: number;
  humidity: number | null;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
};
