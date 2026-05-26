"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Wallet,
  Calendar,
  Building2,
  Sparkles,
  Clock,
  IndianRupee,
  Utensils,
  Camera,
} from "lucide-react";

export function PlannerPreviewSection() {
  return (
    <section id="planner" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9921e]/10 text-[#c9921e] text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            AI Trip Planner
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#2f2417] mb-4 text-balance">
            Your AI Travel Dashboard
          </h2>

          <p className="text-lg text-[#7a6a55] max-w-2xl mx-auto text-pretty">
            Preview what your personalized AI-generated travel plan looks like —
            smart, detailed, and budget-friendly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-white border border-[#eadfcb] shadow-2xl overflow-hidden"
        >
          {/* Dashboard Header */}
          <div className="p-6 border-b border-[#eadfcb] bg-[#fcfaf6]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#c9921e]/15 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-[#c9921e]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2f2417]">Your Jaipur Trip</h3>
                  <p className="text-sm text-[#7a6a55]">AI-generated • 3 Days</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="rounded-xl bg-gradient-to-br from-[#fffaf0] to-[#f8f3e8] border border-[#eadfcb] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-[#c9921e]" />
                    <h4 className="font-semibold text-[#2f2417]">Destination</h4>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="text-[#7a6a55]">City</span>
                      <span className="font-medium text-[#2f2417]">
                        Jaipur, Rajasthan
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="text-[#7a6a55]">Duration</span>
                      <span className="font-medium text-[#2f2417]">
                        3 Days, 2 Nights
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="text-[#7a6a55]">Travel Style</span>
                      <span className="font-medium text-[#2f2417]">
                        Cultural & Heritage
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#fcfaf6] border border-[#eadfcb] p-3 text-center">
                    <Camera className="h-5 w-5 text-[#c9921e] mx-auto mb-1" />
                    <div className="text-lg font-bold text-[#2f2417]">12</div>
                    <div className="text-xs text-[#7a6a55]">Attractions</div>
                  </div>

                  <div className="rounded-xl bg-[#fcfaf6] border border-[#eadfcb] p-3 text-center">
                    <Utensils className="h-5 w-5 text-[#c9921e] mx-auto mb-1" />
                    <div className="text-lg font-bold text-[#2f2417]">8</div>
                    <div className="text-xs text-[#7a6a55]">Restaurants</div>
                  </div>
                </div>
              </div>

              {/* Middle Column */}
              <div className="rounded-xl bg-white border border-[#eadfcb] p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="h-5 w-5 text-[#c9921e]" />
                  <h4 className="font-semibold text-[#2f2417]">Budget Breakdown</h4>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Accommodation", amount: "₹6,000", percent: 40 },
                    { label: "Food & Dining", amount: "₹3,000", percent: 20 },
                    { label: "Transport", amount: "₹2,500", percent: 17 },
                    { label: "Activities", amount: "₹2,500", percent: 17 },
                    { label: "Miscellaneous", amount: "₹1,000", percent: 6 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#7a6a55]">{item.label}</span>
                        <span className="font-medium text-[#2f2417]">
                          {item.amount}
                        </span>
                      </div>
                      <div className="h-2 bg-[#f3eadb] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#c9921e] rounded-full"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-[#eadfcb] flex justify-between">
                  <span className="font-semibold text-[#2f2417]">Total Budget</span>
                  <span className="font-bold text-[#c9921e] flex items-center">
                    <IndianRupee className="h-4 w-4" />
                    15,000
                  </span>
                </div>
              </div>

              {/* Right Column */}
              <div className="rounded-xl bg-white border border-[#eadfcb] p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-[#c9921e]" />
                  <h4 className="font-semibold text-[#2f2417]">Day-wise Plan</h4>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      day: "Day 1",
                      activities: ["Amber Fort", "Jal Mahal", "Nahargarh Fort"],
                    },
                    {
                      day: "Day 2",
                      activities: ["Hawa Mahal", "City Palace", "Jantar Mantar"],
                    },
                    {
                      day: "Day 3",
                      activities: ["Albert Hall", "Local Markets", "Departure"],
                    },
                  ].map((plan) => (
                    <div
                      key={plan.day}
                      className="rounded-lg bg-[#fcfaf6] border border-[#f0e6d6] p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-[#c9921e]" />
                        <span className="text-sm font-semibold text-[#2f2417]">
                          {plan.day}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {plan.activities.map((activity) => (
                          <span
                            key={activity}
                            className="text-xs bg-[#c9921e]/10 text-[#c9921e] px-2 py-0.5 rounded-full"
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hotel Recommendations */}
            <div className="mt-6 rounded-xl bg-[#fcfaf6] border border-[#eadfcb] p-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-[#c9921e]" />
                <h4 className="font-semibold text-[#2f2417]">
                  Hotel Recommendations
                </h4>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Hotel Pink City",
                    rating: "4.5",
                    price: "₹2,500/night",
                    type: "Budget",
                  },
                  {
                    name: "Rajputana Heritage",
                    rating: "4.7",
                    price: "₹4,000/night",
                    type: "Mid-Range",
                  },
                  {
                    name: "Rambagh Palace",
                    rating: "4.9",
                    price: "₹12,000/night",
                    type: "Luxury",
                  },
                ].map((hotel) => (
                  <div
                    key={hotel.name}
                    className="rounded-lg bg-white border border-[#eadfcb] p-3"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-sm font-medium text-[#2f2417]">
                        {hotel.name}
                      </span>
                      <span className="text-xs bg-[#c9921e]/10 text-[#c9921e] px-2 py-0.5 rounded-full">
                        {hotel.type}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-[#7a6a55]">
                      <span>⭐ {hotel.rating}</span>
                      <span className="font-medium text-[#2f2417]">
                        {hotel.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}