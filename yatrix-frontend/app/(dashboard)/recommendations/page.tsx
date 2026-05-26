"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { destinationAPI, tripAPI } from "@/lib/api";

/* ─── types ─── */
interface TrainClass {
  className: string;
  price: number;
}

interface Train {
  _id: string;
  name: string;
  trainNumber: string;
  fromCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: TrainClass[];
  rating: number;
}

interface Hotel {
  _id: string;
  name: string;
  pricePerNight: number;
  rating: number;
  category: string;
  suitability: string[];
  amenities: string[];
  address: string;
}

interface Transport {
  _id: string;
  type: string;
  pricePerDay: number;
  comfort: string;
  suitability: string[];
  description: string;
}

export default function RecommendationsPage() {
  const router = useRouter();

  const [form, setForm] = useState<any>(null);

  const [trains, setTrains] = useState<Train[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [selectedTrain, setSelectedTrain] = useState<any>(null);
  const [selectedTrainClass, setSelectedTrainClass] = useState("");

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedTransport, setSelectedTransport] =
    useState<Transport | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("tripForm");

    if (!stored) {
      router.replace("/plan");
      return;
    }

    const parsed = JSON.parse(stored);
    setForm(parsed);

    const fetchData = async () => {
      try {
        const [trainRes, hotelRes, transportRes] = await Promise.all([
          destinationAPI.getTrains(parsed.city, parsed.fromCity),
          destinationAPI.getHotels(parsed.city, undefined, parsed.tripType),
          destinationAPI.getTransport(parsed.city),
        ]);

        setTrains(trainRes.data);
        setHotels(hotelRes.data);
        setTransports(transportRes.data);
      } catch {
        setError("Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const numberOfDays = form
    ? Math.ceil(
        (new Date(form.endDate).getTime() -
          new Date(form.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ) || 1
    : 1;

  const trainCost =
    selectedTrain && selectedTrainClass
      ? (selectedTrain.classes.find(
          (c: TrainClass) => c.className === selectedTrainClass
        )?.price || 0) *
        (form?.travelers || 1) *
        2
      : 0;

  const hotelCost = selectedHotel
    ? selectedHotel.pricePerNight * numberOfDays * (form?.travelers || 1)
    : 0;

  const transportCost = selectedTransport
    ? selectedTransport.pricePerDay * numberOfDays
    : 0;

  const totalCost = trainCost + hotelCost + transportCost;

  const budget = form ? Number(form.budget) : 0;

  const budgetPercent = Math.min((totalCost / budget) * 100, 100);

  const overBudget = totalCost > budget;

  const handleCreateTrip = async () => {
    if (!selectedTrain || !selectedTrainClass) {
      return setError("Please select a train and class.");
    }

    if (!selectedHotel) {
      return setError("Please select a hotel.");
    }

    if (!selectedTransport) {
      return setError("Please select a transport option.");
    }

    setCreating(true);
    setError("");

    try {
      const tripData = {
        city: form.city,
        fromCity: form.fromCity,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: Number(form.budget),
        travelers: Number(form.travelers),
        tripType: form.tripType,
        interests: form.interests,
        selectedTrain: {
          ...selectedTrain,
          selectedClass: selectedTrainClass,
        },
        selectedHotel,
        selectedTransport,
      };

      const res = await tripAPI.create(tripData);

      sessionStorage.removeItem("tripForm");

      router.push(`/itinerary/${res.data._id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create trip.");
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-black" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        ← Back
      </button>

      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 m-2">
          Curate your perfect journey
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>
            🚆 {form?.fromCity} → {form?.city}
          </span>
          <span>•</span>
          <span>
            {numberOfDays} day{numberOfDays > 1 ? "s" : ""}
          </span>
          <span>•</span>
          <span>
            {form?.travelers} traveller{form?.travelers > 1 ? "s" : ""}
          </span>
          <span>•</span>
          <span>Budget ₹{Number(form?.budget).toLocaleString()}</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* LEFT */}
        <div className="min-w-0 space-y-10">

          {/* ── TRAINS ── */}
          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-amber-500 mt-8 mb-2">
                Choose your train
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {form?.fromCity} → {form?.city}
              </p>
            </div>

            <div className="space-y-4">
              {trains.map((train) => {
                const isSelected = selectedTrain?._id === train._id;
                return (
                  <div
                    key={train._id}
                    onClick={() => {
                      setSelectedTrain(train);
                      setSelectedTrainClass("");
                    }}
                    className={`cursor-pointer rounded-2xl border-2 bg-white p-5 transition-all duration-200 ${
                      isSelected
                        ? "border-slate-900 shadow-md ring-1 ring-slate-900/10"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                      <div className="min-w-0">
                        {/* Selected badge */}
                        {isSelected && (
                          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-medium text-white">
                            ✓ Selected
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-slate-900">
                          {train.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          #{train.trainNumber}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                          <span>{train.departureTime}</span>
                          <span>•</span>
                          <span>{train.duration}</span>
                          <span>•</span>
                          <span>{train.arrivalTime}</span>
                        </div>
                      </div>

                      <div className="text-sm font-medium text-slate-700">
                        ⭐ {train.rating}
                      </div>
                    </div>

                    {/* Class selector — only shown when this train is selected */}
                    {isSelected && (
                      <div className="mt-5 border-t border-slate-200 pt-5">
                        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                          Select class
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {train.classes.map((cls) => {
                            const isClassSelected =
                              selectedTrainClass === cls.className;
                            return (
                              <button
                                key={cls.className}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTrainClass(cls.className);
                                }}
                                className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all duration-150 ${
                                  isClassSelected
                                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                                }`}
                              >
                                {cls.className}
                                <span
                                  className={`ml-1.5 ${
                                    isClassSelected
                                      ? "text-slate-300"
                                      : "text-slate-500"
                                  }`}
                                >
                                  — ₹{cls.price.toLocaleString()}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── HOTELS ── */}
          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-amber-500 mt-5">
                Choose your stay
              </h2>
            </div>

            <div className="space-y-4">
              {hotels.map((hotel) => {
                const isSelected = selectedHotel?._id === hotel._id;
                return (
                  <div
                    key={hotel._id}
                    onClick={() => setSelectedHotel(hotel)}
                    className={`cursor-pointer rounded-2xl border-2 bg-white p-5 transition-all duration-200 ${
                      isSelected
                        ? "border-slate-900 shadow-md ring-1 ring-slate-900/10"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        {/* Selected badge */}
                        {isSelected && (
                          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-medium text-white">
                            ✓ Selected
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-slate-900">
                          {hotel.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {hotel.address}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {hotel.amenities.slice(0, 5).map((item) => (
                            <span
                              key={item}
                              className={`rounded-full px-3 py-1 text-xs transition-colors ${
                                isSelected
                                  ? "bg-slate-100 text-slate-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-lg font-semibold text-slate-900">
                          ₹{hotel.pricePerNight.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-500">per night</p>
                        <p className="mt-2 text-xs text-slate-500">
                          ⭐ {hotel.rating} · {hotel.category}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── TRANSPORT ── */}
          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-amber-500 mt-5">
                Local transport
              </h2>
            </div>

            <div className="space-y-4">
              {transports.map((t) => {
                const isSelected = selectedTransport?._id === t._id;
                return (
                  <div
                    key={t._id}
                    onClick={() => setSelectedTransport(t)}
                    className={`cursor-pointer rounded-2xl border-2 bg-white p-5 transition-all duration-200 ${
                      isSelected
                        ? "border-slate-900 shadow-md ring-1 ring-slate-900/10"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        {isSelected && (
                          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-medium text-white">
                            ✓ Selected
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-slate-900">
                          {t.type}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          {t.description}
                        </p>
                        <p className="mt-3 text-xs text-slate-500">
                          Comfort: {t.comfort}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-lg font-semibold text-slate-900">
                          ₹{t.pricePerDay.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-500">per day</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-3xl bg-slate-900 p-6 text-white">
            <h2 className="text-2xl font-semibold">Your selection</h2>

            <div className="mt-6 space-y-4">
              <SummaryRow
                label="Train"
                value={
                  selectedTrain
                    ? `${selectedTrain.name}${
                        selectedTrainClass ? ` · ${selectedTrainClass}` : ""
                      }`
                    : "Not selected"
                }
                empty={!selectedTrain}
              />
              <SummaryRow
                label="Hotel"
                value={selectedHotel?.name || "Not selected"}
                empty={!selectedHotel}
              />
              <SummaryRow
                label="Transport"
                value={selectedTransport?.type || "Not selected"}
                empty={!selectedTransport}
              />
            </div>

            <div className="my-6 border-t border-white/10" />

            <CostRow label="Train" value={trainCost} />
            <CostRow label="Hotel" value={hotelCost} />
            <CostRow label="Transport" value={transportCost} />

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5 text-lg font-semibold">
              <span>Total</span>
              <span>₹{totalCost.toLocaleString()}</span>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>Budget usage</span>
                <span>₹{budget.toLocaleString()}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    overBudget
                      ? "bg-red-500"
                      : budgetPercent > 80
                      ? "bg-yellow-400"
                      : "bg-emerald-400"
                  }`}
                  style={{ width: `${budgetPercent}%` }}
                />
              </div>

              {overBudget && (
                <p className="mt-2 text-xs text-red-300">
                  Over budget by ₹{(totalCost - budget).toLocaleString()}
                </p>
              )}
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              onClick={handleCreateTrip}
              disabled={creating}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-green-500 font-medium text-slate-900 transition hover:bg-green-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-slate-900" />
                  Generating...
                </span>
              ) : (
                "Generate AI Itinerary"
              )}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  empty,
}: {
  label: string;
  value: string;
  empty?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-slate-400">{label}</span>
      <span
        className={`max-w-[60%] text-right text-sm ${
          empty ? "italic text-slate-500" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function CostRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
      <span>{label}</span>
      <span className={value === 0 ? "text-slate-500" : ""}>
        ₹{value.toLocaleString()}
      </span>
    </div>
  );
}