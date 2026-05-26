"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link"; 
import { Button } from "@/components/ui/button"; // Adjust path as needed for your project
import { tripAPI } from "@/lib/api";
import { generateItineraryPDF } from "@/lib/generatePDF";
import {
  Download,
  Zap,
  Save,
  ChevronRight,
  AlertCircle,
  Loader2,
  RefreshCw,
  FileText,
  Clock,
  Ticket,
  Lightbulb,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

interface SlotData {
  place: string;
  activity: string;
  duration: string;
  estimatedCost: number;
}

interface DayPlan {
  day: number;
  title: string;
  tip: string;
  morning: SlotData;
  afternoon: SlotData;
  evening: SlotData;
}

const SLOTS = ["morning", "afternoon", "evening"] as const;
const SLOT_EMOJI: Record<string, string> = {
  morning: "🌅",
  afternoon: "☀️",
  evening: "🌆",
};

export default function ItineraryPage() {
  const { tripId } = useParams();
  const router = useRouter();

  const [trip, setTrip] = useState<any>(null);
  const [itinerary, setItinerary] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res: any = await tripAPI.getById(tripId as string);
        setTrip(res.data);
        setItinerary(res.data.itinerary || []);
      } catch (err: any) {
        setError("Failed to load itinerary.");
      } finally {
        setLoading(false);
      }
    };
    if (tripId) fetch();
  }, [tripId]);

  const handleEdit = (
    dayIndex: number,
    slot: string,
    field: string,
    value: string
  ) => {
    const updated = [...itinerary];
    (updated[dayIndex] as any)[slot][field] = value;
    setItinerary(updated);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await tripAPI.updateItinerary(tripId as string, itinerary);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError("Failed to save itinerary.");
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (
      !confirm(
        "This will replace your current itinerary with a new AI-generated one. Continue?"
      )
    )
      return;
    setRegenerating(true);
    setError("");
    try {
      const res: any = await tripAPI.regenerate(tripId as string);
      setItinerary(res.data.itinerary);
      setSaved(false);
    } catch (err: any) {
      setError(err.message || "Failed to regenerate. Try again.");
    } finally {
      setRegenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!trip) return;
    setDownloading(true);
    try {
      const tripData = {
        ...trip,
        itinerary,
      };
      generateItineraryPDF(tripData, trip.bookingRef);
    } catch (err) {
      setError("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa]">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin" />
          <Loader2 className="w-6 h-6 text-amber-500 animate-pulse absolute" />
        </div>
        <p className="text-sm text-neutral-500 font-medium mt-4 tracking-wide uppercase">
          Curating your tailored itinerary...
        </p>
      </div>
    );
  }

  if (error && !itinerary.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa] px-4">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-neutral-900 font-semibold mb-1">An Error Occurred</h3>
          <p className="text-sm text-neutral-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] antialiased text-neutral-900 selection:bg-amber-100 selection:text-amber-900 px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto pb-24">
        
        {/* Navigation & Header */}
        <div className="mb-10">
          <button
            onClick={() => router.back()}
            className="text-xs font-bold text-neutral-400 hover:text-neutral-900 tracking-wider uppercase transition-colors mb-6 inline-flex items-center gap-2 group"
          >
            <ArrowLeft className="w-3 h-3 transform group-hover:-translate-x-0.5 transition-transform" />
            Back to Trips
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-6 border-b border-neutral-200/80">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900">
                Your Itinerary
              </h1>
              {trip && (
                <div className="flex items-center gap-2 mt-2 text-neutral-500 text-sm font-medium">
                  <span className="text-neutral-900 font-semibold">{trip.city}</span>
                  <span className="text-neutral-300">•</span>
                  <span>
                    {trip.numberOfDays} Day{trip.numberOfDays > 1 ? "s" : ""}
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span>
                    {trip.travelers} Traveler{trip.travelers > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Top Regenerate Button */}
            <div className="flex items-center shrink-0">
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 rounded-xl transition-all disabled:opacity-50 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`} />
                <span>{regenerating ? "Regenerating..." : "Regenerate with AI"}</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 px-4 py-3.5 rounded-xl text-sm mb-8 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Empty Fallback */}
        {itinerary.length === 0 && (
          <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl shadow-sm">
            <FileText className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 mb-5 font-medium text-sm">
              No itinerary sections generated yet.
            </p>
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              {regenerating ? "Generating..." : "Generate with AI"}
            </button>
          </div>
        )}

        {/* Itinerary Timeline */}
        <div className="space-y-8">
          {itinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="group relative">
              
              {/* Floating Day Indicator Line */}
              {dayIndex !== itinerary.length - 1 && (
                <div className="absolute left-9 top-20 bottom-0 w-0.5 bg-neutral-100 group-hover:bg-neutral-200 transition-colors hidden md:block" />
              )}

              {/* Day Block Wrapper */}
              <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md/50 transition-all duration-300">
                
                {/* Day Header */}
                <div className="px-6 py-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-neutral-50/50">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">
                      Timeline Sequence
                    </span>
                    <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                      <span className="bg-neutral-900 text-white text-xs px-2 py-0.5 rounded-md font-mono">
                        D{day.day}
                      </span>
                      {day.title}
                    </h2>
                  </div>
                  {day.tip && (
                    <div className="flex items-start gap-2 max-w-xs bg-amber-50/60 border border-amber-100/80 px-3 py-2 rounded-xl text-xs text-amber-800">
                      <Lightbulb className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                      <p className="leading-relaxed font-medium">{day.tip}</p>
                    </div>
                  )}
                </div>

                {/* Day Time Slots */}
                <div className="divide-y divide-neutral-100">
                  {SLOTS.map((slot, slotIdx) => {
                    const slotData = day[slot] as SlotData;
                    const cellKey = `${dayIndex}-${slot}`;
                    const isEditing = editingCell === cellKey;

                    return (
                      <div
                        key={slot}
                        className="p-6 hover:bg-neutral-50/40 transition-colors duration-200"
                      >
                        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                          
                          {/* Slot Info Badge */}
                          <div className="md:w-32 shrink-0 flex items-center md:flex-col md:items-start gap-2">
                            <span className="text-xl">{SLOT_EMOJI[slot]}</span>
                            <div>
                              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                                {slot}
                              </span>
                              <span className="text-xs font-semibold text-neutral-900 md:mt-0.5 block">
                                {slotData?.place}
                              </span>
                            </div>
                          </div>

                          {/* Editable Dynamic Description Frame */}
                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <div className="relative">
                                <textarea
                                  className="w-full text-sm text-neutral-800 bg-neutral-50 border border-neutral-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all shadow-inner resize-none"
                                  rows={2}
                                  value={slotData?.activity}
                                  onChange={(e) =>
                                    handleEdit(dayIndex, slot, "activity", e.target.value)
                                  }
                                  onBlur={() => setEditingCell(null)}
                                  autoFocus
                                />
                                <span className="absolute bottom-2 right-3 text-[10px] font-semibold text-neutral-400 bg-white px-1.5 py-0.5 rounded border border-neutral-200 shadow-sm pointer-events-none">
                                  Press outside to finish
                                </span>
                              </div>
                            ) : (
                              <div
                                onClick={() => setEditingCell(cellKey)}
                                className="group/field relative cursor-pointer border border-transparent hover:border-neutral-200/60 hover:bg-neutral-50/50 p-2 -m-2 rounded-xl transition-all duration-150"
                                title="Click to edit activity description"
                              >
                                <p className="text-sm text-neutral-600 leading-relaxed pr-6">
                                  {slotData?.activity || "No description provided. Click to add details."}
                                </p>
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-400 opacity-0 group-hover/field:opacity-100 transition-opacity bg-white px-1.5 py-0.5 rounded border shadow-sm">
                                  Edit
                                </span>
                              </div>
                            )}

                            {/* Metadata Pills */}
                            <div className="flex flex-wrap items-center gap-3 mt-4">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-600 text-xs font-medium">
                                <Clock className="w-3 h-3 text-neutral-400" />
                                <span>{slotData?.duration || "N/A"}</span>
                              </div>
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                                <Ticket className="w-3 h-3 text-emerald-500" />
                                <span>
                                  {slotData?.estimatedCost === 0
                                    ? "Free Entry"
                                    : `Est. ₹${slotData?.estimatedCost}`}
                                </span>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Consolidated Action Footer Deck */}
        {itinerary.length > 0 && (
          <div className="mt-12 p-4 bg-white border border-neutral-200 rounded-2xl shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Left Utility Tools */}
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className={`flex-1 sm:flex-initial px-4 py-3 rounded-xl text-xs font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 border ${
                  saved
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                } disabled:opacity-50`}
              >
                {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saving ? "Saving..." : saved ? "Saved" : "Save Plan"}</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={downloading || !trip}
                className="flex-1 sm:flex-initial bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-4 py-3 rounded-xl text-xs font-bold tracking-wide uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className={`w-3.5 h-3.5 ${downloading ? "animate-bounce" : ""}`} />
                <span>{downloading ? "Exporting..." : "PDF"}</span>
              </button>
            </div>

            {/* Right Main CTA: custom Button wrapper using Link pointing to the summary route */}
            <div className="sm:w-auto shrink-0 flex justify-end">
              <Link href={`/summary/${tripId}`} className="inline-block w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#c9921e] text-white hover:bg-[#b27f16] gap-2 rounded-xl text-xs font-bold tracking-wide uppercase px-6"
                >
                  <span>Proceed to Booking</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}