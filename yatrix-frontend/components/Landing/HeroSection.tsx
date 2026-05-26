"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui-1/button";
import { ArrowRight, Sparkles, MapPin, Calendar, Wallet } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-24 pb-16 overflow-hidden bg-white"
    >
      {/* Background accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fffdf8] via-white to-[#f8f3e8]" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#c9921e]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-[#e8c77a]/20 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9921e]/10 text-[#c9921e] text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4" />
              AI-Powered Travel Planning
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2f2417] leading-tight text-balance">
              Smart AI Travel Planning for Your{" "}
              <span className="text-[#c9921e]">Favorite Cities</span>
            </h1>

            <p className="mt-6 text-lg text-[#7a6a55] max-w-xl mx-auto lg:mx-0 text-pretty">
              Plan intelligent trips with AI-powered recommendations, itineraries,
              and budget optimization for Chandigarh, Jabalpur, Jaipur, and Delhi.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-[#c9921e] text-white hover:bg-[#b27f16] gap-2"
              >
                Start Planning
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-[#c9921e]/30 text-[#2f2417] hover:bg-[#c9921e]/5"
              >
                Explore Cities
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 grid grid-cols-3 gap-6"
            >
              {[
                { value: "4", label: "Cities" },
                { value: "1000+", label: "Trips Planned" },
                { value: "98%", label: "Happy Travelers" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-[#c9921e]">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#7a6a55]">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-2xl bg-white border border-[#eadfcb] shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-[#eadfcb] bg-[#fcfaf6]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-4 text-sm text-[#7a6a55]">Yatrix Dashboard</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Trip Card */}
                <div className="rounded-xl bg-gradient-to-r from-[#f8f3e8] to-[#fffaf0] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-[#2f2417]">Your Trip to Jaipur</h3>
                    <span className="text-xs bg-[#c9921e]/15 text-[#c9921e] px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-[#7a6a55]">
                      <Calendar className="h-4 w-4 text-[#c9921e]" />
                      <span>3 Days</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#7a6a55]">
                      <Wallet className="h-4 w-4 text-[#c9921e]" />
                      <span>₹15,000</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#7a6a55]">
                      <MapPin className="h-4 w-4 text-[#c9921e]" />
                      <span>8 Places</span>
                    </div>
                  </div>
                </div>

                {/* Mini Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[#fcfaf6] p-3 border border-[#f0e6d6]">
                    <div className="text-xs text-[#7a6a55] mb-1">Today</div>
                    <div className="text-sm font-medium text-[#2f2417]">
                      Hawa Mahal Visit
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#fcfaf6] p-3 border border-[#f0e6d6]">
                    <div className="text-xs text-[#7a6a55] mb-1">Budget Used</div>
                    <div className="text-sm font-medium text-[#c9921e]">
                      ₹4,500 / ₹15,000
                    </div>
                  </div>
                </div>

                {/* AI Suggestion */}
                <div className="rounded-lg border border-[#c9921e]/20 bg-[#c9921e]/5 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-[#c9921e]" />
                    <span className="text-xs font-medium text-[#c9921e]">
                      AI Suggestion
                    </span>
                  </div>
                  <p className="text-sm text-[#7a6a55]">
                    Visit Amber Fort early morning for cooler weather and fewer crowds.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating element */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-4 -right-4 rounded-xl bg-white border border-[#eadfcb] shadow-lg p-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#c9921e]/15 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-[#c9921e]" />
                </div>
                <div>
                  <div className="text-xs font-medium text-[#2f2417]">AI Ready</div>
                  <div className="text-xs text-[#7a6a55]">24/7 Planning</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}