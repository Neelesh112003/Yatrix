"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MapPin, Train, CalendarDays, CalendarCheck2, CurrencyIcon,
  Users, Briefcase, User, UsersRound, Building2, UtensilsCrossed,
  ShoppingBag, Leaf, Mountain, Camera, Heart, MoonStar,
  Sparkles, ArrowRight, AlertCircle, Route, Map
} from "lucide-react";

const INTERESTS = [
  { label: "History", icon: Building2 },
  { label: "Food", icon: UtensilsCrossed },
  { label: "Shopping", icon: ShoppingBag },
  { label: "Nature", icon: Leaf },
  { label: "Adventure", icon: Mountain },
  { label: "Photography", icon: Camera },
  { label: "Spiritual", icon: Heart },
  { label: "Nightlife", icon: MoonStar },
];

const CITIES = ["Delhi", "Jaipur", "Chandigarh", "Jabalpur"];

function PlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    city: searchParams.get("city") || "",
    fromCity: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: "1",
    tripType: "Solo",
    interests: [] as string[],
  });
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  useEffect(() => {
    setForm((prev) => ({ ...prev, fromCity: "" }));
  }, [form.city]);

  useEffect(() => {
    if (Number(form.travelers) > 1) setForm((p) => ({ ...p, tripType: "Family" }));
    else setForm((p) => ({ ...p, tripType: "Solo" }));
  }, [form.travelers]);

  const handleSubmit = () => {
    if (!form.city) return setError("Please select a destination city");
    if (!form.fromCity) return setError("Please select your source city");
    if (form.fromCity === form.city) return setError("Source and destination city cannot be the same");
    if (!form.startDate) return setError("Please select a start date");
    if (!form.endDate) return setError("Please select an end date");
    if (new Date(form.endDate) <= new Date(form.startDate))
      return setError("End date must be after start date");
    if (!form.budget || Number(form.budget) < 500)
      return setError("Minimum budget is ₹500");

    sessionStorage.setItem("tripForm", JSON.stringify(form));
    router.push("/recommendations");
  };

  const sourceCities = CITIES.filter((c) => c !== form.city);

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">

      {/* Hero banner */}
      <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-4 mb-5 flex items-center gap-4">
        <div className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center shrink-0">
          <Map className="w-5 h-5 text-green-50" />
        </div>
        <div>
          <p className="text-base font-semibold text-green-900">Plan your trip</p>
          <p className="text-sm text-green-700 mt-0.5">Get AI-powered recommendations tailored to you</p>
        </div>
      </div>

      {/* Route card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
        <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-3">Route</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
              <MapPin className="w-3.5 h-3.5" /> Destination
            </label>
            <div className="relative">
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Where to?</option>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▾</span>
            </div>
          </div>

          <div className={form.city ? "opacity-100" : "opacity-40 pointer-events-none"}>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
              <Train className="w-3.5 h-3.5" /> Travelling from
            </label>
            <div className="relative">
              <select
                name="fromCity"
                value={form.fromCity}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-gray-50 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Source city</option>
                {sourceCities.map((c) => <option key={c}>{c}</option>)}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▾</span>
            </div>
          </div>
        </div>

        {form.fromCity && form.city && (
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-100">
              <Route className="w-3 h-3" />
              {form.fromCity} → {form.city}
            </span>
          </div>
        )}
      </div>

      {/* Dates card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
        <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-3">Dates</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
              <CalendarDays className="w-3.5 h-3.5" /> Start date
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              min={today}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
              <CalendarCheck2 className="w-3.5 h-3.5" /> End date
            </label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              min={form.startDate || today}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Budget & Group card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
        <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-3">Budget & group</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
              <CurrencyIcon className="w-3.5 h-3.5" /> Total budget (₹)
            </label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g. 15000"
              min={500}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
              <Users className="w-3.5 h-3.5" /> Travellers
            </label>
            <input
              type="number"
              name="travelers"
              value={form.travelers}
              onChange={handleChange}
              min={1}
              max={20}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-2">
          <Briefcase className="w-3.5 h-3.5" /> Trip type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { type: "Solo", icon: User, label: "Solo" },
            { type: "Family", icon: UsersRound, label: "Family" },
          ].map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => setForm((p) => ({ ...p, tripType: type }))}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                form.tripType === type
                  ? "bg-green-50 border-green-500 text-green-800"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Interests card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
        <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-3">
          Interests{" "}
          <span className="normal-case text-[10px] font-normal bg-gray-100 text-gray-400 border border-gray-200 rounded-full px-2 py-0.5 ml-1">
            optional
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => toggleInterest(label)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                form.interests.includes(label)
                  ? "bg-green-50 border-green-500 text-green-800"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:border-green-300"
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        Find recommendations
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto py-6 px-4 space-y-4">
          <div className="h-16 animate-pulse rounded-2xl bg-green-50 border border-green-100" />
          <div className="h-40 animate-pulse rounded-2xl bg-white border border-gray-100" />
          <div className="h-32 animate-pulse rounded-2xl bg-white border border-gray-100" />
          <div className="h-48 animate-pulse rounded-2xl bg-white border border-gray-100" />
          <div className="h-32 animate-pulse rounded-2xl bg-white border border-gray-100" />
          <div className="h-14 animate-pulse rounded-2xl bg-green-600/20" />
        </div>
      }
    >
      <PlanContent />
    </Suspense>
  );
}