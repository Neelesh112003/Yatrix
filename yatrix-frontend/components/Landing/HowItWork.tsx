"use client";

import { motion } from "framer-motion";
import { UserPlus, MapPin, Settings, Sparkles } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Login / Create Account",
    description:
      "Sign up for free and create your travel profile with your preferences.",
  },
  {
    icon: MapPin,
    step: "02",
    title: "Select Supported City",
    description:
      "Choose from Chandigarh, Jabalpur, Jaipur, or Delhi for your next adventure.",
  },
  {
    icon: Settings,
    step: "03",
    title: "Enter Budget & Preferences",
    description:
      "Set your budget, travel dates, interests, and any special requirements.",
  },
  {
    icon: Sparkles,
    step: "04",
    title: "Get AI-generated Travel Plan",
    description:
      "Receive a personalized itinerary optimized for your budget and interests.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-[#fcfaf6]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9921e]/10 text-[#c9921e] text-sm font-medium mb-4">
            Simple Process
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#2f2417] mb-4 text-balance">
            How Yatrix Works
          </h2>

          <p className="text-lg text-[#7a6a55] max-w-2xl mx-auto text-pretty">
            Plan your perfect trip in just four simple steps with our AI-powered
            platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative h-full"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-gradient-to-r from-[#c9921e]/40 to-[#c9921e]/10" />
              )}

              <div className="text-center h-full">
                <div className="relative inline-flex mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-white border border-[#eadfcb] shadow-md flex items-center justify-center">
                    <item.icon className="h-10 w-10 text-[#c9921e]" />
                  </div>

                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#c9921e] text-white text-sm font-bold flex items-center justify-center shadow-sm">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[#2f2417] mb-2">
                  {item.title}
                </h3>

                <p className="text-sm leading-6 text-[#7a6a55] max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}