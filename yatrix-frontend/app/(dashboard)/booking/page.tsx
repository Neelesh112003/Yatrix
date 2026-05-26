"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Home,
  Loader2,
  Mail,
  MapPin,
  ReceiptText,
  RefreshCw,
  Ticket,
  Train,
  Car,
  BedDouble,
  Users,
  Wallet,
} from "lucide-react";
import { bookingAPI } from "@/lib/api";

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tripId) {
      router.replace("/my-trips");
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await bookingAPI.getByTrip(tripId);
        setBooking(res.data);
      } catch (err: any) {
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [tripId, router]);

  const handleResendEmail = async () => {
    setResending(true);
    setError("");

    try {
      await bookingAPI.resendEmail(tripId as string);
      setResent(true);
    } catch (err: any) {
      setError("Failed to resend email.");
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-8 text-center">
            <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-slate-200" />
            <div className="mx-auto mt-4 h-8 w-64 animate-pulse rounded bg-slate-200" />
            <div className="mx-auto mt-3 h-4 w-80 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 h-4 w-32 animate-pulse rounded bg-slate-200" />
                <div className="h-10 w-48 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-4 w-40 animate-pulse rounded bg-slate-100" />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 h-4 w-32 animate-pulse rounded bg-slate-200" />
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between gap-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                      <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between gap-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                  </div>
                ))}
                <div className="h-px bg-slate-200" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <CircleAlert className="mx-auto h-10 w-10 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Booking not found</h2>
          <p className="mt-2 text-sm text-slate-600">
            {error || "We couldn’t find your booking details."}
          </p>
          <button
            onClick={() => router.push("/my-trips")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            View My Trips
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const snap = booking.tripSnapshot;

  const startDate = new Date(snap.startDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const endDate = new Date(snap.endDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-3xl border border-green-200 bg-white shadow-sm">
            <div className="border-b border-green-100 bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 py-8 text-center sm:px-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700 ring-8 ring-green-50">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">
                Booking Confirmed
              </h1>

              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
                Your trip to <span className="font-semibold text-slate-900">{snap.city}</span> is all
                set. Your booking has been recorded and the details are ready below.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-200">
                <ReceiptText className="h-3.5 w-3.5" />
                Confirmation completed successfully
              </div>
            </div>

            <div className="grid gap-3 px-6 py-5 sm:grid-cols-2 xl:grid-cols-4">
              <TopStat
                icon={MapPin}
                label="Destination"
                value={snap.city}
                accent="text-blue-600"
              />
              <TopStat
                icon={CalendarDays}
                label="Dates"
                value={`${startDate} → ${endDate}`}
                accent="text-violet-600"
              />
              <TopStat
                icon={Users}
                label="Travelers"
                value={`${snap.travelers} person(s)`}
                accent="text-emerald-600"
              />
              <TopStat
                icon={Wallet}
                label="Total paid"
                value={`₹${booking.totalCost.toLocaleString()}`}
                accent="text-slate-900"
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <Ticket className="h-5 w-5 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">Booking Reference</h2>
            </div>

            <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
                Reference Number
              </p>
              <p className="mt-2 break-all text-2xl font-bold tracking-[0.25em] text-green-800 sm:text-3xl">
                {booking.bookingReference}
              </p>
              <p className="mt-2 text-xs text-green-700/80">
                Save this reference for support, updates, and verification.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <ReceiptText className="h-5 w-5 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">Trip Snapshot</h2>
            </div>

            <div className="space-y-3">
              <Row icon={MapPin} label="Destination" value={snap.city} />
              <Row
  icon={MapPin}
  label="From"
  value={snap.fromCity || snap.selectedTrain?.fromCity || "—"}
/>
              <Row icon={CalendarDays} label="Dates" value={`${startDate} → ${endDate}`} />
              <Row icon={Clock3} label="Duration" value={`${snap.numberOfDays} day(s)`} />
              <Row icon={Users} label="Travelers" value={`${snap.travelers} person(s)`} />
              {snap.selectedTrain && (
                <Row
                  icon={Train}
                  label="Train"
                  value={`${snap.selectedTrain.name} (${snap.selectedTrain.selectedClass})`}
                />
              )}
              {snap.selectedHotel && (
                <Row icon={BedDouble} label="Hotel" value={snap.selectedHotel.name} />
              )}
              {snap.selectedTransport && (
                <Row icon={Car} label="Transport" value={snap.selectedTransport.type} />
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="text-sm font-medium text-slate-500">Total Cost</span>
              <span className="text-xl font-bold text-slate-900">
                ₹{booking.totalCost.toLocaleString()}
              </span>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">Confirmation Email</h2>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {booking.emailSent ? "Email delivered" : "Email pending"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {booking.emailSent
                      ? "A confirmation email has been sent to your registered address."
                      : "We could not send your confirmation email automatically."}
                  </p>
                </div>

                <div
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    booking.emailSent
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {booking.emailSent ? "Sent" : "Pending"}
                </div>
              </div>

              <button
                onClick={handleResendEmail}
                disabled={resending || resent}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resent ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Sent successfully
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Resend Email
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Next Actions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Continue managing your trip or return to the dashboard.
            </p>

            <div className="mt-5 space-y-3">
              <button
                onClick={() => router.push("/my-trips")}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                View My Trips
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
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
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon?: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-2 text-sm text-slate-500">
        {Icon ? <Icon className="h-4 w-4 shrink-0" /> : null}
        <span>{label}</span>
      </div>
      <div className="max-w-[60%] text-right text-sm text-slate-800">
        {value}
      </div>
    </div>
  );
}