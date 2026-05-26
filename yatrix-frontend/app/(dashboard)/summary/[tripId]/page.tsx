"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Loader2,
  MapPin,
  Route,
  Ticket,
  Train,
  TriangleAlert,
  Users,
  Wallet,
} from "lucide-react";
import { tripAPI, bookingAPI } from "@/lib/api";

export default function SummaryPage() {
  const { tripId } = useParams();
  const router = useRouter();

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const numberOfDays = trip?.numberOfDays || 1;
  const travelers = trip?.travelers || 1;

  const trainCost = useMemo(() => {
    if (!trip?.selectedTrain?.classes || !trip?.selectedTrain?.selectedClass) return 0;
    const cls = trip.selectedTrain.classes.find(
      (c: any) => c.className === trip.selectedTrain.selectedClass
    );
    return cls ? cls.price * travelers * 2 : 0;
  }, [trip, travelers]);

  const hotelCost = useMemo(() => {
    return trip?.selectedHotel?.pricePerNight
      ? trip.selectedHotel.pricePerNight * numberOfDays * travelers
      : 0;
  }, [trip, numberOfDays, travelers]);

  const transportCost = useMemo(() => {
    return trip?.selectedTransport?.pricePerDay
      ? trip.selectedTransport.pricePerDay * numberOfDays
      : 0;
  }, [trip, numberOfDays]);

  const totalCost = trainCost + hotelCost + transportCost;

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await tripAPI.getById(tripId as string);
        setTrip(res.data);
      } catch (err: any) {
        setError("Failed to load trip details.");
      } finally {
        setLoading(false);
      }
    };

    if (tripId) fetchTrip();
  }, [tripId]);

  const handleConfirmBooking = async () => {
    setConfirming(true);
    setError("");

    try {
      await bookingAPI.confirm(tripId as string);
      router.push(`/booking?tripId=${tripId}`);
    } catch (err: any) {
      setError(err.message || "Booking failed. Please try again.");
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-8 w-56 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-4 h-4 w-32 animate-pulse rounded bg-slate-200" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((row) => (
                      <div key={row} className="flex items-center justify-between gap-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                        <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((row) => (
                  <div key={row} className="flex items-center justify-between gap-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                  </div>
                ))}
                <div className="h-px bg-slate-200" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <TriangleAlert className="mx-auto h-10 w-10 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Trip not found</h2>
          <p className="mt-2 text-sm text-slate-600">
            {error || "We couldn’t load the trip summary."}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>
      </div>
    );
  }

  const startDate = new Date(trip.startDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const endDate = new Date(trip.endDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const tripStatus =
    trip.status === "confirmed" ? "Confirmed" : "Pending confirmation";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
              <button
                onClick={() => router.back()}
                className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Review before booking
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Trip Summary
                  </h1>
                  <p className="mt-1 text-sm text-slate-600">
                    Review your trip details, pricing, and selections before confirming.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Status
                  </p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      trip.status === "confirmed" ? "text-green-700" : "text-amber-700"
                    }`}
                  >
                    {tripStatus}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 px-6 py-5 sm:grid-cols-2 xl:grid-cols-4">
              <TopStat
                icon={MapPin}
                label="Destination"
                value={trip.city || "—"}
                accent="text-blue-600"
              />
              <TopStat
                icon={CalendarDays}
                label="Duration"
                value={`${numberOfDays} day(s)`}
                accent="text-violet-600"
              />
              <TopStat
                icon={Users}
                label="Travelers"
                value={`${travelers} person(s)`}
                accent="text-emerald-600"
              />
              <TopStat
                icon={Wallet}
                label="Estimated total"
                value={`₹${totalCost.toLocaleString()}`}
                accent="text-slate-900"
              />
            </div>
          </section>

          <InfoCard title="Trip Details" icon={Route}>
            <div className="space-y-3">
              <Row icon={MapPin} label="Destination" value={trip.city} />
              <Row
  icon={Route}
  label="Travelling from"
  value={trip.fromCity || trip.selectedTrain?.fromCity || "—"}
/>
              <Row icon={CalendarDays} label="Dates" value={`${startDate} → ${endDate}`} />
              <Row icon={Clock3} label="Duration" value={`${numberOfDays} day(s)`} />
              <Row icon={Users} label="Travelers" value={`${travelers} person(s)`} />
              <Row icon={Ticket} label="Trip type" value={trip.tripType || "—"} />
            </div>
          </InfoCard>

          {trip.selectedTrain && (
            <InfoCard title="Train" icon={Train}>
              <div className="space-y-3">
                <Row icon={Train} label="Train" value={trip.selectedTrain.name} />
                <Row
                  icon={Ticket}
                  label="Train No."
                  value={`#${trip.selectedTrain.trainNumber}`}
                />
                <Row
                  icon={Route}
                  label="Route"
                  value={`${trip.fromCity || trip.selectedTrain.fromCity} → ${trip.city}`}
                />
                <Row
                  icon={Clock3}
                  label="Departure"
                  value={trip.selectedTrain.departureTime}
                />
                <Row icon={Clock3} label="Arrival" value={trip.selectedTrain.arrivalTime} />
                <Row icon={CalendarDays} label="Duration" value={trip.selectedTrain.duration} />
                <Row
                  icon={Ticket}
                  label="Class"
                  value={trip.selectedTrain.selectedClass}
                />
                <Row
                  icon={IndianRupee}
                  label="Cost"
                  value={`₹${trainCost.toLocaleString()} (${travelers} × 2 way)`}
                  highlight
                />
              </div>
            </InfoCard>
          )}

          {trip.selectedHotel && (
            <InfoCard title="Hotel" icon={BedDouble}>
              <div className="space-y-3">
                <Row icon={BedDouble} label="Hotel" value={trip.selectedHotel.name} />
                <Row icon={MapPin} label="Address" value={trip.selectedHotel.address} />
                <Row icon={Ticket} label="Category" value={trip.selectedHotel.category} />
                <Row icon={CheckCircle2} label="Rating" value={`⭐ ${trip.selectedHotel.rating}`} />
                <Row
                  icon={IndianRupee}
                  label="Price/night"
                  value={`₹${trip.selectedHotel.pricePerNight.toLocaleString()}`}
                />
                <Row
                  icon={Wallet}
                  label="Cost"
                  value={`₹${hotelCost.toLocaleString()} (${numberOfDays} nights × ${travelers} person)`}
                  highlight
                />
              </div>
            </InfoCard>
          )}

          {trip.selectedTransport && (
            <InfoCard title="Local Transport" icon={Car}>
              <div className="space-y-3">
                <Row icon={Car} label="Type" value={trip.selectedTransport.type} />
                <Row icon={CheckCircle2} label="Comfort" value={trip.selectedTransport.comfort} />
                <Row
                  icon={IndianRupee}
                  label="Price/day"
                  value={`₹${trip.selectedTransport.pricePerDay}`}
                />
                <Row
                  icon={Wallet}
                  label="Cost"
                  value={`₹${transportCost.toLocaleString()} (${numberOfDays} days)`}
                  highlight
                />
              </div>
            </InfoCard>
          )}
        </div>

        <aside className="space-y-6">
          <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Cost Summary</h2>
            </div>

            <div className="mt-5 space-y-4">
              <PriceRow label="Train" value={trainCost} />
              <PriceRow label="Hotel" value={hotelCost} />
              <PriceRow label="Transport" value={transportCost} />

              <div className="h-px bg-slate-200" />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Estimated total</p>
                  <p className="text-xs text-slate-500">Train + Hotel + Transport</p>
                </div>
                <p className="text-3xl font-bold tracking-tight text-slate-900">
                  ₹{totalCost.toLocaleString()}
                </p>
              </div>

              {trip.budget && (
                <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Your budget</span>
                    <span className="font-semibold text-slate-900">
                      ₹{Number(trip.budget).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${
                        totalCost <= Number(trip.budget) ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min((totalCost / Number(trip.budget)) * 100, 100)}%`,
                      }}
                    />
                  </div>

                  <p
                    className={`mt-2 text-xs font-medium ${
                      totalCost <= Number(trip.budget) ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {totalCost <= Number(trip.budget)
                      ? "Within your budget"
                      : `Over budget by ₹${(totalCost - Number(trip.budget)).toLocaleString()}`}
                  </p>
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <div className="flex items-start gap-2">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleConfirmBooking}
                  disabled={confirming || trip.status === "confirmed"}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {confirming ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : trip.status === "confirmed" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Already Booked
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => router.push(`/itinerary/${tripId}`)}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Edit Itinerary
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <Icon className="h-5 w-5 text-slate-700" />
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function TopStat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        <Icon className={`h-4 w-4 ${accent || "text-slate-600"}`} />
        {label}
      </div>
      <p className="text-sm font-semibold text-slate-900 sm:text-base">{value}</p>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">₹{value.toLocaleString()}</span>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon?: any;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500">
        {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
        <span>{label}</span>
      </div>
      <div
        className={`max-w-[60%] text-right text-sm ${
          highlight ? "font-semibold text-slate-900" : "text-slate-700"
        }`}
      >
        {value}
      </div>
    </div>
  );
}