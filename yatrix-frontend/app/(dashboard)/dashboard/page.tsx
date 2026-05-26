"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { destinationAPI } from "@/lib/api";
import CityCard from "@/components/CityCard";

interface City {
  _id: string;
  city: string;
  state: string;
  description: string;
  avgCostPerDay: number;
  bestTimeToVisit: string;
  tags: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    const fetchCities = async () => {
      try {
        const data = await destinationAPI.getAll();
        setCities(data.data);
      } catch (err: any) {
        setError("Failed to load destinations.");
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const avgCost =
    cities.length > 0
      ? Math.round(
          cities.reduce((s, c) => s + c.avgCostPerDay, 0) / cities.length
        ).toLocaleString("en-IN")
      : "—";

  const uniqueTags = [...new Set(cities.flatMap((c) => c.tags))].length;

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#0f1b2d] font-sans">

      {/* ── MAIN ── */}
      <main className="max-w-[1100px] mx-auto px-5 sm:px-8 py-10 sm:py-14">

        {/* ── HERO GREETING ── */}
        <section className="mb-12 animate-[fadeUp_0.6s_ease_forwards] opacity-0">
          <p className="flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.18em] uppercase text-[#c8922a] mb-2">
            <span className="inline-block w-6 h-px bg-[#c8922a]" />
            Travel Dashboard
          </p>
          <h1 className="text-4xl sm:text-5xl font-light text-[#0f1b2d] leading-tight mb-3 tracking-tight">
            {getGreeting()},{" "}
            <span className="italic text-[#c8922a] font-normal">
              {user?.name?.split(" ")[0] || "Traveller"}
            </span>
          </h1>
          <p className="text-sm text-[#5a6e83] font-light max-w-sm leading-relaxed">
            Discover your next journey. Each destination curated for extraordinary experiences.
          </p>
        </section>

        {/* ── STATS STRIP ── */}
        {!loading && !error && (
          <div
            className="flex flex-col sm:flex-row mb-12 rounded-2xl overflow-hidden border border-[#e8e2d8] bg-white shadow-sm"
            style={{ animation: "fadeUp 0.6s ease 0.15s forwards", opacity: 0 }}
          >
            {[
              { label: "Destinations", value: String(cities.length), unit: "cities" },
              { label: "Avg. Daily Cost", value: `₹${avgCost}`, unit: "/ day" },
              { label: "Unique Tags", value: String(uniqueTags), unit: "experiences" },
            ].map((stat, i, arr) => (
              <div
                key={stat.label}
                className={`flex-1 px-7 py-5 ${
                  i < arr.length - 1
                    ? "border-b sm:border-b-0 sm:border-r border-[#e8e2d8]"
                    : ""
                }`}
              >
                <p className="text-[0.65rem] font-medium tracking-[0.12em] uppercase text-[#8fa3bc] mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-light text-[#0f1b2d] leading-none">
                  {stat.value}
                  <span className="text-sm font-normal text-[#8fa3bc] ml-1.5 align-middle">
                    {stat.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── ERROR ── */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-3.5 rounded-xl text-sm mb-8">
            <svg className="w-4 h-4 shrink-0 opacity-80" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* ── SECTION HEADER ── */}
        <div
          className="flex items-end justify-between mb-6"
          style={{ animation: "fadeUp 0.6s ease 0.25s forwards", opacity: 0 }}
        >
          <div>
            <p className="text-[0.65rem] font-medium tracking-[0.16em] uppercase text-[#c8922a] mb-1.5">
              Explore
            </p>
            <div className="w-10 h-px bg-gradient-to-r from-[#c8922a] to-transparent mb-2" />
            <h2 className="text-2xl font-light text-[#0f1b2d]">Featured Destinations</h2>
          </div>
          {!loading && (
            <span className="text-xs text-[#8fa3bc] border border-[#e8e2d8] bg-white rounded-full px-3 py-1">
              {cities.length} cities
            </span>
          )}
        </div>

        {/* ── LOADING SKELETON ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-52 rounded-2xl animate-pulse bg-gradient-to-r from-[#ede8e0] via-[#e4ddd3] to-[#ede8e0] bg-[length:200%_100%]"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}

        {/* ── CITY CARDS ── */}
        {!loading && cities.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            style={{ animation: "fadeUp 0.6s ease 0.35s forwards", opacity: 0 }}
          >
            {cities.map((city, idx) => (
              <div
                key={city._id}
                style={{
                  opacity: 0,
                  animation: `fadeUp 0.5s ease ${0.4 + idx * 0.08}s forwards`,
                }}
              >
                <CityCard
                  city={city}
                  onClick={() => router.push(`/destinations/${city.city}`)}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && !error && cities.length === 0 && (
          <div className="text-center py-24 text-[#8fa3bc]">
            <div className="text-5xl mb-4 opacity-40">🗺️</div>
            <p className="text-sm font-light">No destinations available yet. Check back soon.</p>
          </div>
        )}
      </main>

      {/* ── KEYFRAMES (only animations not in default Tailwind) ── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}