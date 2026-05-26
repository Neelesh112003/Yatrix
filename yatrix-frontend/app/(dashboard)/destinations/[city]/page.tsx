"use client";
// frontend/app/(dashboard)/destinations/[city]/page.tsx
// Shows city detail + weather + all sub-destinations + plan trip button

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { destinationAPI } from "@/lib/api";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Ticket,
  IndianRupee,
  CalendarDays,
  Tag,
  Compass,
  Loader2,
  AlertCircle,
  ArrowRight,
  Landmark,
  TreePine,
  Mountain,
  Waves,
  Building2,
} from "lucide-react";
import WeatherWidget from "@/components/WeatherWidget";

interface SubDestination {
  _id: string;
  name: string;
  description: string;
  distanceFromCity: string;
  type: string;
  entryFee: number;
  timingHours: string;
}

interface CityDetail {
  city: string;
  state: string;
  description: string;
  avgCostPerDay: number;
  bestTimeToVisit: string;
  tags: string[];
  subDestinations: SubDestination[];
}

// Map place types to lucide icons
const typeIconMap: Record<string, React.ReactNode> = {
  temple: <Landmark className="w-3.5 h-3.5" />,
  nature: <TreePine className="w-3.5 h-3.5" />,
  mountain: <Mountain className="w-3.5 h-3.5" />,
  beach: <Waves className="w-3.5 h-3.5" />,
  monument: <Building2 className="w-3.5 h-3.5" />,
};

function getTypeIcon(type: string) {
  const key = type.toLowerCase();
  return typeIconMap[key] ?? <Compass className="w-3.5 h-3.5" />;
}

// Gradient accent per card index
const cardAccents = [
  "from-amber-400 to-orange-500",
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-violet-400 to-purple-600",
  "from-rose-400 to-pink-600",
  "from-lime-400 to-green-600",
];

export default function CityDetailPage() {
  const { city } = useParams();
  const router = useRouter();
  const [data, setData] = useState<CityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const res: any = await destinationAPI.getByCity(city as string);
        setData(res.data.destination);
      } catch (err: any) {
        setError("Failed to load city details.");
      } finally {
        setLoading(false);
      }
    };
    if (city) fetchCity();
  }, [city]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-sm text-slate-400 tracking-wide font-medium">
          Discovering {city}…
        </p>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl px-8 py-6 flex items-center gap-3 text-rose-600">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{error || "City not found"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] px-4 py-8 md:px-8 max-w-6xl mx-auto">

      {/* ── Back Button ── */}
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors duration-200"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white group-hover:border-amber-400 group-hover:bg-amber-50 transition-all duration-200">
          <ArrowLeft className="w-4 h-4" />
        </span>
        Back to Destinations
      </button>

      {/* ── Hero Card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main hero section - spans 2 columns on lg */}
        <div className="lg:col-span-2 relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
          {/* Decorative top stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

          <div className="p-6 md:p-8">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              {/* Left: City info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-xs font-semibold tracking-widest text-amber-600 uppercase">
                    {data.state}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">
                  {data.city}
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
                  {data.description}
                </p>
              </div>

              {/* Right: Stats */}
              <div className="flex sm:flex-col gap-4 sm:gap-3 sm:items-end shrink-0">
                {/* Cost */}
                <div className="flex flex-col items-start sm:items-end">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                    Avg. cost / day
                  </span>
                  <div className="flex items-center gap-1 text-2xl font-black text-slate-900">
                    <IndianRupee className="w-5 h-5 text-emerald-500" />
                    {data.avgCostPerDay.toLocaleString()}
                  </div>
                </div>
                {/* Best time */}
                <div className="flex flex-col items-start sm:items-end">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                    Best time
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                    <CalendarDays className="w-4 h-4 text-amber-500" />
                    {data.bestTimeToVisit}
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-6">
              <button
                onClick={() => router.push(`/plan?city=${data.city}`)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300 transition-all duration-200 active:scale-95"
              >
                <Compass className="w-4 h-4" />
                Plan a Trip to {data.city}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Weather Widget - right sidebar on lg */}
        <div className="lg:col-span-1">
          <WeatherWidget city={data.city} />
        </div>
      </div>

      {/* ── Sub-Destinations ── */}
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          Places to Visit in {data.city}
        </h2>
        <span className="text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-full">
          {data.subDestinations.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.subDestinations.map((place, i) => {
          const accent = cardAccents[i % cardAccents.length];
          return (
            <div
              key={place._id}
              className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Top accent bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${accent}`} />

              <div className="p-4">
                {/* Name + type badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight flex-1">
                    {place.name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${accent} text-white shrink-0 mt-0.5`}
                  >
                    {getTypeIcon(place.type)}
                    {place.type}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                  {place.description}
                </p>

                {/* Meta info */}
                <div className="space-y-1.5 border-t border-slate-50 pt-3">
                  {place.distanceFromCity && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{place.distanceFromCity}</span>
                    </div>
                  )}
                  {place.timingHours && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{place.timingHours}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <Ticket className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {place.entryFee === 0 ? (
                      <span className="font-bold text-emerald-600">Free Entry</span>
                    ) : (
                      <span className="text-slate-600 font-semibold">
                        ₹{place.entryFee} entry
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}