"use client";

import { motion } from "framer-motion";
import { Zap, Sparkles, Wallet, Heart, Layers } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Fast Trip Planning",
    description: "Generate complete travel itineraries in seconds, not hours.",
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    description: "Smart suggestions tailored to your interests and preferences.",
  },
  {
    icon: Wallet,
    title: "Budget-Friendly",
    description: "Optimize your spending without compromising on experiences.",
  },
  {
    icon: Heart,
    title: "Personalized Experience",
    description: "Every trip plan is unique, crafted just for you.",
  },
  {
    icon: Layers,
    title: "Simple Interface",
    description: "Easy-to-use platform that anyone can navigate effortlessly.",
  },
];

export function WhyChooseSection() {
  return (
    <section className="py-20 bg-[#fcfaf6]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9921e]/10 text-[#c9921e] text-sm font-medium mb-4">
              Why Yatrix?
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#2f2417] mb-6 text-balance">
              The Smarter Way to Plan Your Travels
            </h2>

            <p className="text-lg text-[#7a6a55] mb-8 text-pretty">
              Yatrix combines cutting-edge AI technology with deep knowledge of
              Indian cities to deliver travel experiences that are personalized,
              budget-conscious, and memorable.
            </p>

            <div className="space-y-4">
              {reasons.map((reason, index) => (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 rounded-2xl bg-white border border-[#eadfcb] p-4 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#c9921e]/10 flex items-center justify-center shrink-0">
                    <reason.icon className="h-5 w-5 text-[#c9921e]" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#2f2417] mb-1">
                      {reason.title}
                    </h3>
                    <p className="text-sm text-[#7a6a55] leading-6">
                      {reason.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-[#eadfcb] bg-gradient-to-br from-[#fffdf8] via-white to-[#f8f3e8] p-8 lg:p-10 shadow-xl overflow-hidden">
              <div className="grid grid-cols-2 gap-5">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 0 }}
                  className="rounded-2xl bg-white border border-[#eadfcb] shadow-sm p-5 text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-[#c9921e] mb-2">
                    95%
                  </div>
                  <div className="text-sm text-[#7a6a55]">Satisfaction Rate</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                  className="rounded-2xl bg-white border border-[#eadfcb] shadow-sm p-5 text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-[#c9921e] mb-2">
                    30%
                  </div>
                  <div className="text-sm text-[#7a6a55]">Budget Saved</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                  className="rounded-2xl bg-white border border-[#eadfcb] shadow-sm p-5 text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-[#c9921e] mb-2">
                    2min
                  </div>
                  <div className="text-sm text-[#7a6a55]">Avg. Plan Time</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1.5 }}
                  className="rounded-2xl bg-white border border-[#eadfcb] shadow-sm p-5 text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-[#c9921e] mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-[#7a6a55]">AI Availability</div>
                </motion.div>
              </div>

              <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#c9921e]/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#e8c77a]/20 rounded-full blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}