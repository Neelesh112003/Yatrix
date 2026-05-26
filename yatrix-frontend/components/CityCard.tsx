"use client";
// frontend/components/CityCard.tsx

const cityEmoji: Record<string, string> = {
  Delhi: "🏛️",
  Jaipur: "🏰",
  Chandigarh: "🌸",
  Jabalpur: "🌊",
};

const cityAccent: Record<string, { dot: string; tag: string; tagText: string; explore: string; bar: string }> = {
  Delhi:      { dot: "bg-orange-400",   tag: "bg-orange-50 border-orange-100 text-orange-700",   tagText: "text-orange-700",  explore: "text-orange-500",  bar: "bg-orange-400"  },
  Jaipur:     { dot: "bg-pink-400",     tag: "bg-pink-50 border-pink-100 text-pink-700",         tagText: "text-pink-700",    explore: "text-pink-500",    bar: "bg-pink-400"    },
  Chandigarh: { dot: "bg-emerald-400",  tag: "bg-emerald-50 border-emerald-100 text-emerald-700",tagText: "text-emerald-700", explore: "text-emerald-500", bar: "bg-emerald-400" },
  Jabalpur:   { dot: "bg-blue-400",     tag: "bg-blue-50 border-blue-100 text-blue-700",         tagText: "text-blue-700",    explore: "text-blue-500",    bar: "bg-blue-400"    },
};

const defaultAccent = {
  dot: "bg-[#d9342a]",
  tag: "bg-red-50 border-red-100 text-red-700",
  tagText: "text-red-700",
  explore: "text-[#d9342a]",
  bar: "bg-[#d9342a]",
};

interface CityProps {
  city: {
    city: string;
    state: string;
    description: string;
    avgCostPerDay: number;
    bestTimeToVisit: string;
    tags: string[];
  };
  onClick: () => void;
}

export default function CityCard({ city, onClick }: CityProps) {
  const accent = cityAccent[city.city] || defaultAccent;
  const emoji  = cityEmoji[city.city]  || "🗺️";

  return (
    <div
      onClick={onClick}
      className="group relative bg-white border border-[#ececec] rounded-3xl p-6 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:-translate-y-1"
    >
      {/* Subtle top accent bar */}
      <div className={`absolute top-0 left-6 right-6 h-[2px] ${accent.bar} rounded-b-full opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Top row — city info + cost */}
      <div className="flex items-start justify-between mb-4 mt-2">
        <div className="flex items-center gap-3.5">
          {/* Emoji bubble */}
          <div className="w-12 h-12 rounded-2xl bg-[#f5f5f5] flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
            {emoji}
          </div>
          <div>
            <h2 className="font-bold text-[#111] text-base leading-tight tracking-tight">
              {city.city}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${accent.dot}`} />
              <p className="text-[11px] text-[#aaa] font-medium">{city.state}</p>
            </div>
          </div>
        </div>

        {/* Cost badge */}
        <div className="text-right shrink-0">
          <p className="text-[10px] text-[#bbb] font-medium uppercase tracking-wider mb-0.5">from</p>
          <p className="text-lg font-bold text-[#111] leading-none">
            ₹{city.avgCostPerDay.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#bbb] mt-0.5">per day</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-[#888] leading-relaxed mb-4 line-clamp-2">
        {city.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {city.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${accent.tag} tracking-wide`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#f3f3f3]">
        <div className="flex items-center gap-1.5 text-[11px] text-[#bbb]">
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
          </svg>
          <span>Best: <span className="text-[#888] font-medium">{city.bestTimeToVisit}</span></span>
        </div>
        <span className={`text-[11px] font-bold ${accent.explore} flex items-center gap-1 group-hover:gap-2 transition-all duration-200`}>
          Explore
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
    </div>
  );
}