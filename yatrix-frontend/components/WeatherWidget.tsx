"use client";
// frontend/components/WeatherWidget.tsx
// Shows current weather for a city — uses Open-Meteo free API (no key needed)

import { useWeather } from "@/lib/useWeather";
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Eye,
} from "lucide-react";

export default function WeatherWidget({ city }: { city: string }) {
  const { weather, loading, error } = useWeather(city);

  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-32 mb-3"></div>
        <div className="h-12 bg-slate-100 rounded w-24 mb-4"></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 bg-slate-50 rounded"></div>
          <div className="h-10 bg-slate-50 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm text-center">
        <p className="text-xs text-slate-400 font-medium">Weather unavailable</p>
      </div>
    );
  }

  // Dynamic accent color based on weather
  const getAccent = () => {
    const code = weather.weatherCode;
    if (code === 0) return "from-amber-400 to-orange-500"; // Clear
    if (code <= 2) return "from-sky-400 to-blue-500"; // Partly cloudy
    if (code <= 49) return "from-slate-400 to-gray-500"; // Cloudy
    if (code <= 69) return "from-indigo-400 to-blue-600"; // Rain
    return "from-purple-400 to-indigo-600"; // Snow/Storm
  };

  const accent = getAccent();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Top accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Current Weather
            </p>
            <h3 className="text-sm font-bold text-slate-900">
              {city}, India
            </h3>
          </div>
          <span className="text-5xl leading-none">{weather.emoji}</span>
        </div>

        {/* Condition label */}
        <p className="text-xs text-slate-500 font-medium mb-4 italic">{weather.label}</p>

        {/* Main temperature */}
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-5xl font-black text-slate-900">{weather.temperature}</span>
          <span className="text-xl font-bold text-slate-600">°C</span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-t border-slate-100 pt-4">
          {/* Feels like */}
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Feels Like
            </p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-slate-900">{weather.feelsLike}</span>
              <span className="text-xs text-slate-500">°C</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Droplets className="w-3 h-3" />
              Humidity
            </p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-slate-900">{weather.humidity}</span>
              <span className="text-xs text-slate-500">%</span>
            </div>
          </div>

          {/* Wind speed */}
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Wind className="w-3 h-3" />
              Wind
            </p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-slate-900">{weather.windSpeed}</span>
              <span className="text-xs text-slate-500">km/h</span>
            </div>
          </div>

          {/* Visibility (if available) */}
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Visibility
            </p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-slate-900">{weather.visibility || "—"}</span>
              <span className="text-xs text-slate-500">{weather.visibility ? "km" : ""}</span>
            </div>
          </div>
        </div>

        {/* Footer attribution */}
        <p className="text-[10px] text-slate-300 text-right">via Open-Meteo</p>
      </div>
    </div>
  );
}