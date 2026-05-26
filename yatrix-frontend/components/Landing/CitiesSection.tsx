"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui-1/button";
import { MapPin, ArrowRight } from "lucide-react";

const cities = [
  {
    name: "Chandigarh",
    image: "/images/chandigarh.jpg",
    description:
      "The City Beautiful - India's first planned city with stunning architecture and lush gardens.",
    attractions: ["Rock Garden", "Sukhna Lake", "Rose Garden", "Capitol Complex"],
  },
  {
    name: "Jabalpur",
    image: "/images/jabalpur.jpg",
    description:
      "Gateway to the Marble Rocks - A city of natural wonders and ancient temples.",
    attractions: ["Marble Rocks", "Dhuandhar Falls", "Chausath Yogini Temple", "Madan Mahal Fort"],
  },
  {
    name: "Jaipur",
    image: "/images/jaipur.jpg",
    description:
      "The Pink City - Royal heritage, vibrant bazaars, and majestic palaces.",
    attractions: ["Hawa Mahal", "Amber Fort", "City Palace", "Jantar Mantar"],
  },
  {
    name: "Delhi",
    image: "/images/delhi.jpg",
    description:
      "The Heart of India - A blend of ancient history and modern vibrancy.",
    attractions: ["India Gate", "Red Fort", "Qutub Minar", "Lotus Temple"],
  },
];

export function CitiesSection() {
  return (
    <section id="cities" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9921e]/10 text-[#c9921e] text-sm font-medium mb-4">
            <MapPin className="h-4 w-4" />
            Currently Supported
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#2f2417] mb-4 text-balance">
            Explore Our Supported Cities
          </h2>

          <p className="text-lg text-[#7a6a55] max-w-2xl mx-auto text-pretty">
            Start your AI-powered journey in these handpicked Indian destinations,
            each offering unique experiences and adventures.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group h-full"
            >
              <div className="h-full rounded-2xl bg-white border border-[#eadfcb] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="relative h-48 overflow-hidden shrink-0">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2f2417]/70 via-[#2f2417]/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">{city.name}</h3>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <p className="text-sm text-[#7a6a55] mb-4 line-clamp-3 min-h-[60px]">
                    {city.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-[#2f2417]/70 uppercase tracking-wide mb-2">
                      Popular Attractions
                    </h4>

                    <div className="flex flex-wrap gap-1.5 min-h-[64px] content-start">
                      {city.attractions.slice(0, 3).map((attraction) => (
                        <span
                          key={attraction}
                          className="text-xs bg-[#c9921e]/10 text-[#c9921e] px-2 py-1 rounded-full"
                        >
                          {attraction}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Button
                      variant="outline"
                      className="w-full border-[#c9921e]/30 text-[#c9921e] hover:bg-[#c9921e] hover:text-white gap-2"
                    >
                      Explore
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}