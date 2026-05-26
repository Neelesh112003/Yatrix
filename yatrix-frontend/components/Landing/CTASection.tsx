"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui-1/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden border border-[#eadfcb] bg-gradient-to-br from-[#fffdf8] via-white to-[#f8f3e8] shadow-xl"
        >
          {/* Soft background accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9921e]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#e8c77a]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9921e]/10 text-[#c9921e] text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Start Your Journey
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f2417] mb-6 text-balance">
                Start Planning Your Next Trip with AI
              </h2>

              <p className="text-lg text-[#7a6a55] max-w-2xl mx-auto mb-8 text-pretty">
                Join thousands of travelers who have discovered the smarter way to
                explore India&apos;s most beautiful cities.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
  <Button
    size="lg"
    className="bg-[#c9921e] text-white hover:bg-[#b27f16] gap-2 text-base px-8"
  >
    Plan My Trip
    <ArrowRight className="h-5 w-5" />
  </Button>

  <Button
    size="lg"
    variant="outline"
    className="border-[#c9921e]/30 text-[#2f2417] hover:bg-[#c9921e]/5 px-8"
  >
    Explore Cities
  </Button>
</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}