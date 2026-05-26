"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Wallet,
  Lightbulb,
  Shield,
  CreditCard,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Based Recommendations",
    description:
      "Get personalized travel suggestions powered by advanced AI that understands your preferences.",
  },
  {
    icon: Calendar,
    title: "Day-wise Itinerary Generation",
    description:
      "Automatically generate detailed day-by-day plans optimized for time and convenience.",
  },
  {
    icon: Wallet,
    title: "Budget Optimization",
    description:
      "Smart budget allocation across accommodation, food, transport, and activities.",
  },
  {
    icon: Lightbulb,
    title: "Smart Travel Suggestions",
    description:
      "Discover hidden gems and local favorites with our intelligent recommendation engine.",
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    description:
      "Your travel plans and personal data are protected with enterprise-grade security.",
  },
  {
    icon: CreditCard,
    title: "Mock Booking System",
    description:
      "Preview and plan your bookings before making any commitments.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
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
            Powerful Features
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#2f2417] mb-4 text-balance">
            Everything You Need for Smart Travel
          </h2>

          <p className="text-lg text-[#7a6a55] max-w-2xl mx-auto text-pretty">
            Our AI-powered platform provides all the tools you need to plan,
            optimize, and enjoy your perfect trip.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <div className="group h-full rounded-2xl bg-[#fffdf8] border border-[#eadfcb] p-6 shadow-sm hover:shadow-lg hover:border-[#c9921e]/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#c9921e]/10 flex items-center justify-center mb-4 group-hover:bg-[#c9921e]/15 transition-colors">
                  <feature.icon className="h-6 w-6 text-[#c9921e]" />
                </div>

                <h3 className="text-lg font-semibold text-[#2f2417] mb-2">
                  {feature.title}
                </h3>

                <p className="text-[#7a6a55] text-sm leading-6">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}