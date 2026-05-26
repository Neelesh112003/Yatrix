

import { useState, useEffect } from "react";

// City coordinates for our 4 cities
const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  Delhi:      { lat: 28.6139, lon: 77.2090 },
  Jaipur:     { lat: 26.9124, lon: 75.7873 },
  Chandigarh: { lat: 30.7333, lon: 76.7794 },
  Jabalpur:   { lat: 23.1815, lon: 79.9864 },
};

// WMO weather code to description + emoji
const getWeatherInfo = (code: number): { label: string; emoji: string } => {
  if (code === 0)                    return { label: "Clear Sky", emoji: "☀️" };
  if (code <= 2)                     return { label: "Partly Cloudy", emoji: "⛅" };
  if (code === 3)                    return { label: "Overcast", emoji: "☁️" };
  if (code <= 49)                    return { label: "Foggy", emoji: "🌫️" };
  if (code <= 59)                    return { label: "Drizzle", emoji: "🌦️" };
  if (code <= 69)                    return { label: "Rainy", emoji: "🌧️" };
  if (code <= 79)                    return { label: "Snowy", emoji: "❄️" };
  if (code <= 82)                    return { label: "Rain Showers", emoji: "🌧️" };
  if (code <= 99)                    return { label: "Thunderstorm", emoji: "⛈️" };
  return { label: "Unknown", emoji: "🌡️" };
};

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  label: string;
  emoji: string;
}

export const useWeather = (city: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!city || !CITY_COORDS[city]) {
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        const { lat, lon } = CITY_COORDS[city];
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`;

        const res = await fetch(url);
        const data = await res.json();

        const current = data.current;
        const { label, emoji } = getWeatherInfo(current.weather_code);

        setWeather({
          temperature: Math.round(current.temperature_2m),
          feelsLike: Math.round(current.apparent_temperature),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          weatherCode: current.weather_code,
          label,
          emoji,
        });
      } catch (err) {
        setError("Weather unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  return { weather, loading, error };
};