"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tripAPI } from "@/lib/api";
import {
  Plus,
  MapPin,
  Calendar,
  Users,
  Train,
  Hotel,
  IndianRupee,
  Eye,
  BookCheck,
  Receipt,
  Trash2,
  Loader2,
  AlertCircle,
  Map,
  ArrowRight,
  CheckCircle2,
  Clock3,
  XCircle,
  CircleDot,
} from "lucide-react";

/* ── Status config ── */
const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; classes: string }> = {
  planned: {
    label: "Planned",
    icon: <Clock3 className="w-3 h-3" />,
    classes: "bg-sky-50 text-sky-700 border-sky-200",
  },
  confirmed: {
    label: "Confirmed",
    icon: <CheckCircle2 className="w-3 h-3" />,
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  completed: {
    label: "Completed",
    icon: <CircleDot className="w-3 h-3" />,
    classes: "bg-slate-100 text-slate-500 border-slate-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: <XCircle className="w-3 h-3" />,
    classes: "bg-rose-50 text-rose-600 border-rose-200",
  },
};

/* ── City accent colors (cycling) ── */
const CITY_ACCENTS = [
  { bar: "from-amber-400 to-orange-500", icon: "bg-amber-50 text-amber-600" },
  { bar: "from-sky-400 to-blue-500",     icon: "bg-sky-50 text-sky-600" },
  { bar: "from-violet-400 to-purple-600",icon: "bg-violet-50 text-violet-600" },
  { bar: "from-emerald-400 to-teal-500", icon: "bg-emerald-50 text-emerald-600" },
  { bar: "from-rose-400 to-pink-600",    icon: "bg-rose-50 text-rose-600" },
];

export default function MyTripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res: any = await tripAPI.getAll();
        setTrips(res.data);
      } catch {
        setError("Failed to load trips.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleDelete = async (tripId: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    setDeletingId(tripId);
    try {
      await tripAPI.delete(tripId);
      setTrips((prev) => prev.filter((t) => t._id !== tripId));
    } catch {
      setError("Failed to delete trip.");
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-sm text-slate-400 font-medium tracking-wide">
          Fetching your adventures…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] px-4 py-8 md:px-8 max-w-3xl mx-auto">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-black text-3xl tracking-tight text-slate-900 leading-none mb-1">
            My Trips
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            {trips.length} trip{trips.length !== 1 ? "s" : ""} planned
          </p>
        </div>
        <button
          onClick={() => router.push("/plan")}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300 transition-all duration-200 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Trip
        </button>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm mb-5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Empty State ── */}
      {trips.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-5">
            <Map className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="font-black text-xl text-slate-900 mb-2">No trips yet</h2>
          <p className="text-slate-400 text-sm mb-7 max-w-xs leading-relaxed">
            Start planning your first adventure with AI-powered trip suggestions.
          </p>
          <button
            onClick={() => router.push("/plan")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-md shadow-amber-200 hover:from-amber-600 hover:to-orange-600 transition-all duration-200 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Plan a Trip
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Trip Cards ── */}
      <div className="space-y-4">
        {trips.map((trip, i) => {
          const accent = CITY_ACCENTS[i % CITY_ACCENTS.length];
          const status = STATUS_CONFIG[trip.status] ?? STATUS_CONFIG.planned;
          const startDate = new Date(trip.startDate).toLocaleDateString("en-IN", {
            day: "numeric", month: "short",
          });
          const endDate = new Date(trip.endDate).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          });

          return (
            <div
              key={trip._id}
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Accent bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${accent.bar}`} />

              <div className="p-5">
                <div className="flex items-start gap-4">

                  {/* City icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent.icon}`}>
                    <MapPin className="w-5 h-5" />
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">

                    {/* Top row: city + from + status */}
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h2 className="font-black text-base text-slate-900 tracking-tight">
                        {trip.city}
                      </h2>
                      {trip.fromCity && (
                        <span className="text-xs text-slate-400 font-medium">
                          from {trip.fromCity}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${status.classes}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                    </div>

                    {/* Date + duration + travelers */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 flex-wrap">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{startDate} → {endDate}</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-semibold">{trip.numberOfDays} day{trip.numberOfDays !== 1 ? "s" : ""}</span>
                      <span className="text-slate-300">·</span>
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{trip.travelers} traveler{trip.travelers !== 1 ? "s" : ""}</span>
                    </div>

                    {/* Train / Hotel */}
                    {(trip.selectedTrain || trip.selectedHotel) && (
                      <div className="flex flex-wrap gap-3 mb-2">
                        {trip.selectedTrain && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                            <Train className="w-3.5 h-3.5 text-slate-400" />
                            {trip.selectedTrain.name}
                          </span>
                        )}
                        {trip.selectedHotel && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                            <Hotel className="w-3.5 h-3.5 text-slate-400" />
                            {trip.selectedHotel.name}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Estimated cost */}
                    {trip.estimatedCost > 0 && (
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {trip.estimatedCost.toLocaleString()} estimated
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => router.push(`/itinerary/${trip._id}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 px-3 py-1.5 border border-sky-200 rounded-lg bg-sky-50 hover:bg-sky-100 transition-colors duration-150"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>

                    {trip.status !== "confirmed" && (
                      <button
                        onClick={() => router.push(`/summary/${trip._id}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 px-3 py-1.5 border border-emerald-200 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors duration-150"
                      >
                        <BookCheck className="w-3.5 h-3.5" />
                        Book
                      </button>
                    )}

                    {trip.status === "confirmed" && (
                      <button
                        onClick={() => router.push(`/booking?tripId=${trip._id}`)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-150"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        Receipt
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(trip._id)}
                      disabled={deletingId === trip._id}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 px-3 py-1.5 border border-rose-100 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors duration-150 disabled:opacity-40"
                    >
                      {deletingId === trip._id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />
                      }
                      {deletingId === trip._id ? "…" : "Delete"}
                    </button>
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